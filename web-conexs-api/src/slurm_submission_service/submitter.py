import datetime
import json
import logging
import os
import shutil
import sys
import time
import uuid
from contextlib import contextmanager
from pathlib import Path
from pprint import pformat

import requests

from web_conexs_api.database import get_session
from web_conexs_api.jobfilebuilders import build_qe_xspectra_inputs
from web_conexs_api.models.models import OrcaCalculation, Simulation, SimulationStatus

from .crud import (
    get_active_simulations,
    get_fdmnes_jobfile,
    get_orca_jobfile_with_technique,
    get_qe_jobfile,
    get_request_cancelled_simulations,
    get_submitted_simulations,
    update_simulation,
)

logger = logging.getLogger(__name__)

ROOT_DIR = os.environ.get("CONEXS_ROOT_DIR")
CLUSTER_ROOT_DIR = os.environ.get("CONEXS_CLUSTER_ROOT_DIR")

SLURM_TOKEN = os.environ.get("SLURM_TOKEN")
SLURM_TOKEN_FILE = os.environ.get("SLURM_TOKEN_FILE")
SLURM_USER = os.environ.get("SLURM_USER")
SLURM_API = os.environ.get("SLURM_API")
SLURM_PARTITION = os.environ.get("SLURM_PARTITION")
SLURM_RESPONSE_KEY = os.environ.get("SLURM_RESPONSE_KEY", "account")
SLURM_TIME_LIMIT = os.environ.get("SLURM_TIME_LIMIT", "30")

ORCA_IMAGE = os.environ.get("ORCA_IMAGE")
FDMNES_IMAGE = os.environ.get("FDMNES_IMAGE")
QE_IMAGE = os.environ.get("QE_IMAGE")
CONTAINER_IMAGE_DIR = os.environ.get("CONTAINER_IMAGE_DIR")
PP_DIR = os.environ.get("PP_DIR")
WFC_DIR = os.environ.get("WFC_DIR")

JOB_RUNNING = "RUNNING"
JOB_COMPLETED = "COMPLETED"
JOB_FAILED = "FAILED"
JOB_PENDING = "PENDING"
JOB_TIMEOUT = "TIMEOUT"


def get_token():
    if SLURM_TOKEN is None and SLURM_TOKEN_FILE is None:
        raise Exception("No slurm token available")

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
            "memory_per_node": int(memory * 1000),
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


def submit_orca(session, sim: Simulation):
    job_string, keyword = get_orca_jobfile_with_technique(session, sim.id)
    application_name = "orca"
    user = sim.person.identifier
    uid = uuid.uuid4()

    job_name = application_name + "-" + str(uid)
    working_dir = ROOT_DIR + user + "/" + job_name
    cluster_dir = CLUSTER_ROOT_DIR + user + "/" + job_name

    Path(working_dir).mkdir(parents=True)

    input_file = working_dir + "/job.inp"

    with open(input_file, "w+") as f:
        f.write(job_string)

    orca_sif = os.path.join(CONTAINER_IMAGE_DIR, ORCA_IMAGE)

    if keyword == OrcaCalculation.opt:
        script = (
            "#!/bin/bash\n"
            + "set -e\n"
            + f"singularity exec {orca_sif}"
            + " /opt/orca/4.2.1/orca job.inp > orca_result.txt"
        )
    else:
        spc_keyword = "ABSQ" if keyword == OrcaCalculation.xas else "XES"
        script = (
            "#!/bin/bash\n"
            + "set -e\n"
            + f"singularity exec {orca_sif} /opt/orca/4.2.1/orca job.inp "
            + "> orca_result.txt\n"
            + "myarr=($(grep -A 24 -m 1 'COMBINED ELECTRIC DIPOLE' orca_result.txt "
            + "| tail -n +6 | awk '{print $2}'))\n"
            + 'lowEv=$(echo "${myarr[0]}/8065.544" | bc -l)\n'
            + 'highEv=$(echo "${myarr[-1]}/8065.544" | bc -l)\n'
            + 'difEv=$(echo "$highEv - $lowEv" | bc -l)\n'
            + 'deltaEv=$(echo "$difEv * 0.1" | bc -l)\n'
            + 'lowDeltaEv=$(echo "$lowEv - $deltaEv" | bc -l)\n'
            + 'highDeltaEv=$(echo "$highEv + $deltaEv" | bc -l)\n'
            + f"singularity exec {orca_sif} /opt/orca/4.2.1/orca_mapspc"
            + f" orca_result.txt {spc_keyword} -eV -x0$lowDeltaEv -x1$highDeltaEv"
            + " -w1 -n1000"
        )

    try:
        job_id = build_job_and_run(
            script, job_name, sim.n_cores, sim.memory, cluster_dir, False
        )
        sim.job_id = job_id
        sim.working_directory = working_dir
        sim.submission_date = datetime.datetime.now()
        sim.status = SimulationStatus.submitted
        update_simulation(session, sim)
    except Exception:
        logger.exception("Error submitting orca job")
        sim.status = SimulationStatus.failed
        update_simulation(session, sim)
        logger.exception("Error submitting ORCA job")


def submit_fdmnes(session, sim: Simulation):
    job_string = get_fdmnes_jobfile(session, sim.id)
    application_name = "fdmnes"
    user = sim.person.identifier
    uid = uuid.uuid4()

    job_name = application_name + "-" + str(uid)
    working_dir = ROOT_DIR + user + "/" + job_name
    cluster_dir = CLUSTER_ROOT_DIR + user + "/" + job_name

    Path(working_dir).mkdir(parents=True)

    with open(working_dir / Path("job.txt"), "w+") as f:
        f.write(job_string)

    with open(working_dir / Path("fdmfile.txt"), "w+") as ff:
        ff.write(
            "! number of files to process\n"
            + "1\n\n"
            + "! name of file to process\n"
            + "job.txt"
        )

    fdmnes_sif = os.path.join(CONTAINER_IMAGE_DIR, FDMNES_IMAGE)

    script = (
        "#!/bin/bash\n"
        + f"singularity exec {fdmnes_sif} mpirun -np 1 fdmnes_mpi > fdmnes_result.txt"
    )

    try:
        job_id = build_job_and_run(
            script, job_name, sim.n_cores, sim.memory, cluster_dir, True
        )
        sim.job_id = job_id
        sim.working_directory = working_dir
        sim.submission_date = datetime.datetime.now()
        sim.status = SimulationStatus.submitted
        update_simulation(session, sim)
    except Exception:
        sim.status = SimulationStatus.failed
        update_simulation(session, sim)
        logger.exception("Error submitting FDMNES job")


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


def run_update():
    with contextmanager(get_session)() as session:
        clean_request_cancelled(session)

        # sessions = get_session()
        # session = next(sessions)
        sims = get_submitted_simulations(session)

        for sim in sims:
            # if slurm_token_file is None:
            #     print(slurm_token)
            # sr = SimulationResponse.model_validate(sim)
            # val = update_simulation(session, sim)
            if sim.simulation_type_id == 1:
                submit_orca(session, sim)
            if sim.simulation_type_id == 2:
                submit_fdmnes(session, sim)
            if sim.simulation_type_id == 3:
                submit_qe(session, sim)

                # orca = get_orca_jobfile(session, sim.id)
                # determine workspace
                # write jobfile(s)
                # submit job to slurm (with appropriate resources)
                # update database with jobid, workspace path, status to submitted
                # - might want to add jobname to db
                # print(orca)

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
            # NEED TO CHANGE TO USER
            if j[SLURM_RESPONSE_KEY] == SLURM_USER:
                job_map[j["job_id"]] = {"state": j["job_state"][0]}

        if len(active) != 0:
            logger.info(f"Number of active jobs {len(active)}")

        for a in active:
            if a.job_id in job_map:
                state = job_map[a.job_id]["state"]
                logger.debug(f"Job {a.job_id} has state {state}")

                if state == JOB_RUNNING and a.status != SimulationStatus.running:
                    a.status = SimulationStatus.running
                    update_simulation(session, a)
                elif state == JOB_PENDING and a.status != SimulationStatus.submitted:
                    a.status = SimulationStatus.completed
                    update_simulation(session, a)
                elif state == JOB_COMPLETED and a.status != SimulationStatus.completed:
                    a.status = SimulationStatus.completed
                    update_simulation(session, a)
                elif state == JOB_FAILED and a.status != SimulationStatus.failed:
                    a.status = SimulationStatus.failed
                    update_simulation(session, a)
                elif state == JOB_TIMEOUT and a.status != SimulationStatus.failed:
                    a.status = SimulationStatus.failed
                    update_simulation(session, a)

            else:
                # TODO better state for whatever slurm might return
                logger.error(f"Active job with id {a.job_id} not in job_map")
                a.status = SimulationStatus.failed
                update_simulation(session, a)


def submit_qe(session, sim: Simulation):
    jobfile, absorbing_atom, abs_edge, pp, pp_abs = get_qe_jobfile(session, sim.id)
    application_name = "qe"
    user = sim.person.identifier
    uid = uuid.uuid4()

    job_name = application_name + "-" + str(uid)
    working_dir = ROOT_DIR + user + "/" + job_name
    cluster_dir = CLUSTER_ROOT_DIR + user + "/" + job_name

    Path(working_dir).mkdir(parents=True)

    with open(working_dir / Path("job.inp"), "w+") as f:
        f.write(jobfile)

    for pp_filename in pp:
        shutil.copy(os.path.join(PP_DIR, pp_filename), working_dir)

    # 3 xspectra calculations for different axes
    xspectra_input_files = []

    for i in range(3):
        xspectra_input_files.append(working_dir / Path(f"{i}.xspectra_input.inp"))

    core_file = Path(pp_abs).with_suffix(".wfc")

    wffile = WFC_DIR / core_file
    shutil.copy(wffile, working_dir)

    xspectra_jobfiles = build_qe_xspectra_inputs(abs_edge, str(core_file))

    for i in range(3):
        with open(xspectra_input_files[i], "w+") as ff:
            ff.write(xspectra_jobfiles[i])

    qe_sif = os.path.join(CONTAINER_IMAGE_DIR, QE_IMAGE)

    script = (
        "#!/bin/bash\n"
        + f"singularity exec {qe_sif} mpirun"
        + f" -np {sim.n_cores} pw.x -in job.inp > result.pwo \n"
        + f"singularity exec {qe_sif} mpirun"
        + f" -np {sim.n_cores} xspectra.x -in 0.xspectra_input.inp > xspectra.out\n"
        + f"singularity exec {qe_sif} mpirun"
        + f" -np {sim.n_cores} xspectra.x -in 1.xspectra_input.inp >> xspectra.out\n"
        + f"singularity exec {qe_sif} mpirun"
        + f" -np {sim.n_cores} xspectra.x -in 2.xspectra_input.inp >> xspectra.out\n"
        + "paste 100xanes.dat 010xanes.dat 001xanes.dat | tail -n +5 |"
        + " awk '{print $1, $2+$4+$6}' > xanes.dat"
    )

    try:
        job_id = build_job_and_run(
            script, job_name, sim.n_cores, sim.memory, cluster_dir, False
        )
        sim.job_id = job_id
        sim.working_directory = working_dir
        sim.submission_date = datetime.datetime.now()
        sim.status = SimulationStatus.submitted
        update_simulation(session, sim)
    except Exception:
        sim.status = SimulationStatus.failed
        update_simulation(session, sim)
        logger.exception("Error submitting QE job")


# def test_read():
#     with contextmanager(get_session)() as session:
#         sims = get_submitted_simulations(session)
#         for sim in sims:
#             if sim.simulation_type_id == 1:
#                 jf, calc = get_orca_jobfile_with_technique(session, sim.id)
#             elif sim.simulation_type_id == 2:
#                 jobfile = get_fdmnes_jobfile(session, sim.id)
#                 logger.error(jobfile)


def main():
    rootlogger = logging.getLogger()
    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(name)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    sh = logging.StreamHandler(sys.stdout)
    sh.setFormatter(formatter)
    rootlogger.addHandler(sh)
    rootlogger.setLevel(logging.DEBUG)
    rootlogger.debug("Logging Configured")

    logger.info("Running main loop")

    # test_read()

    while True:
        try:
            run_update()
        except KeyboardInterrupt:
            logger.info("Stopped with keyboard")
        except Exception:
            logger.exception("Error in update loop")
        time.sleep(10)
        logger.info("Loop iteration complete")
