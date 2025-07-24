import datetime
import json
import logging
import os
from pathlib import Path
from pprint import pformat

import requests

from web_conexs_api.models.models import SimulationStatus

from .crud import (
    get_active_simulations,
    get_request_cancelled_simulations,
    update_simulation,
)
from .filetransfer import transfer_results

logger = logging.getLogger(__name__)

ROOT_DIR = os.environ.get("CONEXS_ROOT_DIR")
CLUSTER_ROOT_DIR = os.environ.get("CONEXS_CLUSTER_ROOT_DIR")
STORAGE_DIR = os.environ.get("CONEXS_STORAGE_DIR")

SLURM_TOKEN = os.environ.get("SLURM_TOKEN")
SLURM_TOKEN_FILE = os.environ.get("SLURM_TOKEN_FILE")
SLURM_USER = os.environ.get("SLURM_USER")
SLURM_API = os.environ.get("SLURM_API")
SLURM_PARTITION = os.environ.get("SLURM_PARTITION")
SLURM_RESPONSE_KEY = os.environ.get("SLURM_RESPONSE_KEY", "account")
SLURM_TIME_LIMIT = os.environ.get("SLURM_TIME_LIMIT", "30")

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


def build_job_and_run(script, job_name, cpus, memory, cluster_dir, as_tasks):
    job_request = {
        "job": {
            "partition": SLURM_PARTITION,
            "name": job_name,
            "nodes": 1,
            "tasks": 1 if as_tasks else cpus,
            "memory_per_node": memory,
            "time_limit": int(SLURM_TIME_LIMIT),
            "current_working_directory": str(cluster_dir),
            "environment": {
                "PATH": "/bin:/usr/bin/:/usr/local/bin/",
                "USER": SLURM_USER,
                "LD_LIBRARY_PATH": "/lib/:/lib64/:/usr/local/lib",
            },
        },
        "script": script,
    }

    if as_tasks:
        job_request["job"]["ntasks_per_node"] = 1
        job_request["job"]["cpus_per_task"] = cpus
        job_request["job"]["environment"]["OMP_NUM_THREADS"] = cpus

    logger.debug(job_request)

    url_submit = SLURM_API + "/job/submit"

    slurm_token = get_token()

    headers = {
        "X-SLURM-USER-NAME": SLURM_USER,
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
            script, job_name, sim.n_cores, sim.memory, cluster_dir, as_tasks
        )
        sim.job_id = job_id
        sim.working_directory = job_name
        sim.submission_date = datetime.datetime.now()
        sim.status = SimulationStatus.submitted
        update_simulation(session, sim)
    except Exception:
        sim.status = SimulationStatus.failed
        update_simulation(session, sim)
        logger.exception("Error submitting " + job_name)


def clean_request_cancelled(session):
    request_cancel = get_request_cancelled_simulations(session)

    for sim in request_cancel:
        if sim.job_id is None:
            # No job id, hasn't been submitted, so just flag as cancelled
            sim.status = SimulationStatus.cancelled
            update_simulation(session, sim)
        else:
            url = SLURM_API + "/job/" + str(sim.job_id)
            slurm_token = get_token()

            headers = {
                "X-SLURM-USER-NAME": SLURM_USER,
                "X-SLURM-USER-TOKEN": slurm_token,
                "Content-Type": "application/json",
            }

            r = requests.delete(url, headers=headers)

            if r.status_code != 200:
                logger.error(f"Job delete response not successful {r.status_code}")
                continue

            sim.status = SimulationStatus.cancelled
            update_simulation(session, sim)
            user = sim.person.identifier
            calc_dir = Path(user) / Path(sim.working_directory)
            iris_dir = Path(ROOT_DIR) / calc_dir
            storage_dir = Path(STORAGE_DIR) / calc_dir
            transfer_results(sim.simulation_type_id, str(iris_dir), storage_dir)


def update_active_simulations(session):
    active = get_active_simulations(session)

    slurm_token = get_token()

    url_jobs = SLURM_API + "/jobs"
    headers = {
        "X-SLURM-USER-NAME": SLURM_USER,
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
        if j[SLURM_RESPONSE_KEY] == SLURM_USER:
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
                transfer_results(a.simulation_type_id, str(iris_dir), storage_dir)
                update_simulation(session, a)
            elif state == JOB_FAILED and a.status != SimulationStatus.failed:
                a.status = SimulationStatus.failed
                transfer_results(a.simulation_type_id, str(iris_dir), storage_dir)
                update_simulation(session, a)
            elif state == JOB_TIMEOUT and a.status != SimulationStatus.failed:
                a.status = SimulationStatus.failed
                transfer_results(a.simulation_type_id, str(iris_dir), storage_dir)
                update_simulation(session, a)

        else:
            # TODO Slurm API query on job id?
            logger.error(f"Active job with id {a.job_id} not in job_map")
            transfer_results(a.simulation_type_id, str(iris_dir), storage_dir)
            a.status = SimulationStatus.failed
            update_simulation(session, a)
