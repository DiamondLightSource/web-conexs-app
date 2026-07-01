import datetime
import json
import logging
import os
from pathlib import Path
from pprint import pformat

import requests
from sqlmodel import Session

from web_conexs_api.models.models import Simulation, SimulationStatus

from .crud import (
    get_active_simulations,
    get_request_cancelled_simulations,
    update_simulation,
)
from .filetransfer import clean_up_directory, transfer_results

logger = logging.getLogger(__name__)

ROOT_DIR = os.environ.get("CONEXS_ROOT_DIR")
CLUSTER_ROOT_DIR = os.environ.get("CONEXS_CLUSTER_ROOT_DIR")
STORAGE_DIR = os.environ.get("CONEXS_STORAGE_DIR")

SLURM_TOKEN = os.environ.get("SLURM_TOKEN")
SLURM_TOKEN_FILE = os.environ.get("SLURM_TOKEN_FILE")


SLURM_RESPONSE_KEY = os.environ.get("SLURM_RESPONSE_KEY", "account")
SLURM_TIME_LIMIT = os.environ.get("SLURM_TIME_LIMIT", "30")

CONEXS_N_CORES = int(os.environ.get("CONEXS_N_CORES", "16"))

JOB_RUNNING = "RUNNING"
JOB_COMPLETED = "COMPLETED"
JOB_FAILED = "FAILED"
JOB_PENDING = "PENDING"
JOB_TIMEOUT = "TIMEOUT"


def get_token():
    if SLURM_TOKEN is not None:
        return SLURM_TOKEN

    with open(SLURM_TOKEN_FILE, "r") as fh:
        return fh.read()


def get_slurm_config():
    user = os.environ.get("SLURM_USER")
    api = os.environ.get("SLURM_API")
    partition = os.environ.get("SLURM_PARTITION")

    return user, api, partition


def build_job_and_run(script, job_name, cpus, memory, cluster_dir, as_tasks):
    user, api, partition = get_slurm_config()

    job_request = {
        "job": {
            "partition": partition,
            "name": job_name,
            "nodes": 1,
            "tasks": 1 if as_tasks else cpus,
            "memory_per_node": memory,
            "time_limit": int(SLURM_TIME_LIMIT),
            "current_working_directory": str(cluster_dir),
            "environment": {
                "PATH": "/bin:/usr/bin/:/usr/local/bin/",
                "USER": user,
                "LD_LIBRARY_PATH": "/lib/:/lib64/:/usr/local/lib",
            },
        },
        "script": script,
    }

    if as_tasks:
        job_request["job"]["ntasks_per_node"] = 1
        job_request["job"]["cpus_per_task"] = cpus
        job_request["job"]["environment"]["OMP_NUM_THREADS"] = cpus
    else:
        job_request["job"]["cpus_per_task"] = 1

    logger.debug(job_request)

    url_submit = api + "/job/submit"

    slurm_token = get_token()

    headers = {
        "X-SLURM-USER-NAME": user,
        "X-SLURM-USER-TOKEN": slurm_token,
        "Content-Type": "application/json",
    }

    logger.debug(job_request)

    r = requests.post(url_submit, data=json.dumps(job_request), headers=headers)

    if r.status_code != 200:
        raise Exception(f"Job submission response not successful {r.status_code}")

    response = r.json()

    if "job_id" not in response:
        logger.error(f"Error submitting {job_name}")
        logger.error(pformat(job_request))
        logger.error(pformat(response))
        raise Exception("Submission failed - no job id in response")

    job_id = response["job_id"]
    logger.info(f"Simulation job {job_name} has ID {job_id}")

    return job_id


def submit_simulation(script, job_name, sim, user, session, as_tasks):
    cluster_dir = Path(CLUSTER_ROOT_DIR) / Path(user) / Path(job_name)

    try:
        job_id = build_job_and_run(
            script, job_name, CONEXS_N_CORES, sim.memory, cluster_dir, as_tasks
        )
        sim.job_id = job_id
        sim.working_directory = job_name
        sim.submission_date = datetime.datetime.now()
        sim.status = SimulationStatus.submitted
        update_simulation(session, sim)
    except Exception:
        sim.status = SimulationStatus.failed
        sim.completion_date = datetime.datetime.now()
        update_simulation(session, sim)
        logger.exception("Error submitting " + job_name)


def clean_request_cancelled(session):
    user, api, partition = get_slurm_config()

    request_cancel = get_request_cancelled_simulations(session)

    for sim in request_cancel:
        if sim.job_id is None:
            # No job id, hasn't been submitted, so just flag as cancelled
            sim.status = SimulationStatus.cancelled
            sim.completion_date = datetime.datetime.now()
            update_simulation(session, sim)
        else:
            url = api + "/job/" + str(sim.job_id)
            slurm_token = get_token()

            headers = {
                "X-SLURM-USER-NAME": user,
                "X-SLURM-USER-TOKEN": slurm_token,
                "Content-Type": "application/json",
            }

            r = requests.delete(url, headers=headers)

            if r.status_code != 200:
                logger.error(f"Job delete response not successful {r.status_code}")
                continue

            sim.status = SimulationStatus.cancelled
            sim.completion_date = datetime.datetime.now()
            user = sim.person.identifier
            calc_dir = Path(user) / Path(sim.working_directory)
            iris_dir = Path(ROOT_DIR) / calc_dir
            storage_dir = Path(STORAGE_DIR) / calc_dir

            clean_up_on_job_end(sim, iris_dir, storage_dir, session)


def update_active_simulations(session):
    user, api, partition = get_slurm_config()

    active = get_active_simulations(session)

    slurm_token = get_token()

    url_jobs = api + "/jobs"
    headers = {
        "X-SLURM-USER-NAME": user,
        "X-SLURM-USER-TOKEN": slurm_token,
        "Content-Type": "application/json",
    }

    r = requests.get(url_jobs, headers=headers)

    if r.status_code != 200:
        raise Exception(f"Response not successful: Status code {r.status_code}")

    response = r.json()
    jobs = response["jobs"]

    job_map = {}

    for j in jobs:
        if j[SLURM_RESPONSE_KEY] == user:
            job_map[j["job_id"]] = {"state": j["job_state"][0]}

    if len(active) != 0:
        logger.info(f"Number of active jobs {len(active)}")

    for a in active:
        user = a.person.identifier
        calc_dir = Path(user) / Path(a.working_directory)
        iris_dir = Path(ROOT_DIR) / calc_dir
        storage_dir = Path(STORAGE_DIR) / calc_dir

        if a.job_id in job_map:
            state = job_map[a.job_id]["state"]
            logger.debug(f"Job {a.job_id} has state {state}")

            if state == JOB_RUNNING:
                transfer_results(a.simulation_type_id, str(iris_dir), storage_dir)
            if state == JOB_RUNNING and a.status != SimulationStatus.running:
                a.status = SimulationStatus.running
                update_simulation(session, a)
            elif state == JOB_PENDING and a.status != SimulationStatus.submitted:
                a.status = SimulationStatus.submitted
                update_simulation(session, a)
            elif state == JOB_COMPLETED and a.status != SimulationStatus.completed:
                a.status = SimulationStatus.completed
                a.completion_date = datetime.datetime.now()
                clean_up_on_job_end(a, iris_dir, storage_dir, session)
            elif state == JOB_FAILED and a.status != SimulationStatus.failed:
                a.status = SimulationStatus.failed
                a.completion_date = datetime.datetime.now()
                clean_up_on_job_end(a, iris_dir, storage_dir, session)
            elif state == JOB_TIMEOUT and a.status != SimulationStatus.failed:
                a.status = SimulationStatus.failed
                a.completion_date = datetime.datetime.now()
                clean_up_on_job_end(a, iris_dir, storage_dir, session)

        else:
            # TODO Slurm API query on job id?
            logger.error(f"Active job with id {a.job_id} not in job_map")
            a.status = SimulationStatus.failed
            a.completion_date = datetime.datetime.now()
            clean_up_on_job_end(a, iris_dir, storage_dir, session)


def clean_up_on_job_end(
    a: Simulation, iris_dir: Path, storage_dir: Path, session: Session
):
    success = transfer_results(a.simulation_type_id, str(iris_dir), storage_dir)
    update_simulation(session, a)
    clean_up_directory(str(iris_dir), success)
