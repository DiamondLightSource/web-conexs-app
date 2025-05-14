import datetime
import json
import logging
import os
import time
import uuid
from contextlib import contextmanager
from pathlib import Path
from pprint import pformat

import requests

from web_conexs_api.crud import (
    get_active_simulations,
    get_fdmnes_jobfile,
    get_orca_jobfile_with_technique,
    get_submitted_simulations,
    update_simulation,
)
from web_conexs_api.database import get_session
from web_conexs_api.models.models import OrcaCalculation, Simulation, SimulationStatus

logger = logging.getLogger(__name__)

ROOT_DIR = os.environ.get("CONEXS_ROOT_DIR")
CLUSTER_ROOT_DIR = os.environ.get("CONEXS_CLUSTER_ROOT_DIR")

SLURM_TOKEN = os.environ.get("SLURM_TOKEN")
SLURM_TOKEN_FILE = os.environ.get("SLURM_TOKEN_FILE")
SLURM_USER = os.environ.get("SLURM_USER")
SLURM_API = os.environ.get("SLURM_API")
SLURM_PARTITION = os.environ.get("SLURM_PARTITION")

ORCA_IMAGE = os.environ.get("ORCA_IMAGE")
FDMNES_IMAGE = os.environ.get("FDMNES_IMAGE")
CONTAINER_IMAGE_DIR = os.environ.get("CONTAINER_IMAGE_DIR")

JOB_RUNNING = "RUNNING"
JOB_COMPLETED = "COMPLETED"
JOB_FAILED = "FAILED"
JOB_PENDING = "PENDING"


def get_token():
    if SLURM_TOKEN is None and SLURM_TOKEN_FILE is None:
        raise Exception("No slurm token available")

    if SLURM_TOKEN is not None:
        return SLURM_TOKEN

    with open(SLURM_TOKEN_FILE, "r") as fh:
        return fh.read()


def build_job_and_run(
    script, user_id, working_dir, job_name, cpus, memory, cluster_dir
):
    job_request = {
        "job": {
            "partition": SLURM_PARTITION,
            "name": job_name,
            "nodes": 1,
            "tasks": cpus,
            "memory_per_node": int(memory * 1000),
            "time_limit": 30,
            "current_working_directory": str(cluster_dir),
            "environment": {
                "PATH": "/bin:/usr/bin/:/usr/local/bin/",
                "USER": SLURM_USER,
                "LD_LIBRARY_PATH": "/lib/:/lib64/:/usr/local/lib",
            },
        },
        "script": script,
    }

    url_submit = SLURM_API + "/job/submit"

    slurm_token = get_token()

    headers = {
        "X-SLURM-USER-NAME": SLURM_USER,
        "X-SLURM-USER-TOKEN": slurm_token,
        "Content-Type": "application/json",
    }

    r = requests.post(url_submit, data=json.dumps(job_request), headers=headers)

    if r.status_code != 200:
        print(r.status_code)
        raise Exception("Job submission response not successful")

    response = r.json()

    if "job_id" not in response:
        print(f"Error submitting {job_name}")
        print(pformat(job_request))
        print(pformat(response))
        raise Exception("Submission failed - no job id in response")

    job_id = response["job_id"]
    print(f"Simulation job {job_name} has ID {job_id}")

    return job_id


def submit_orca(session, sim: Simulation):
    job_string, keyword = get_orca_jobfile_with_technique(session, sim.id)
    application_name = "orca"
    user = sim.person.identifier
    uid = uuid.uuid4()

    print(f"{ROOT_DIR} {user}")

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
            script, user, working_dir, job_name, sim.n_cores, sim.memory, cluster_dir
        )
        sim.job_id = job_id
        sim.working_directory = working_dir
        sim.submission_date = datetime.datetime.now()
        sim.status = SimulationStatus.submitted
        update_simulation(session, sim)
    except Exception:
        sim.status = SimulationStatus.failed
        update_simulation(session, sim)


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
        + f"singularity exec {fdmnes_sif} mpirun -np 4 fdmnes_mpi > fdmnes_result.txt"
    )

    try:
        job_id = build_job_and_run(
            script, user, working_dir, job_name, sim.n_cores, sim.memory, cluster_dir
        )
        sim.job_id = job_id
        sim.working_directory = working_dir
        sim.submission_date = datetime.datetime.now()
        sim.status = SimulationStatus.submitted
        update_simulation(session, sim)
    except Exception:
        sim.status = SimulationStatus.failed
        update_simulation(session, sim)


def run_update():
    with contextmanager(get_session)() as session:
        # sessions = get_session()
        # session = next(sessions)
        sims = get_submitted_simulations(session)

        for sim in sims:
            print(sim)
            # if slurm_token_file is None:
            #     print(slurm_token)
            # sr = SimulationResponse.model_validate(sim)
            # val = update_simulation(session, sim)
            if sim.simulation_type_id == 1:
                submit_orca(session, sim)
            if sim.simulation_type_id == 2:
                submit_fdmnes(session, sim)

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
            print(r.status_code)
            raise Exception("Response not successful")

        response = r.json()
        jobs = response["jobs"]

        job_map = {}

        # print(SLURM_USER)

        # for j in jobs:
        #     print(j["account"])

        for j in jobs:
            if j["account"] == SLURM_USER:
                job_map[j["job_id"]] = {"state": j["job_state"][0]}

        print(f"Number of active jobs {len(active)}")

        for a in active:
            if a.job_id in job_map:
                state = job_map[a.job_id]["state"]
                print(state)

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

            else:
                # TODO better state for whatever slurm might return
                a.status = SimulationStatus.failed
                update_simulation(session, a)

    # try:
    #     next(sessions)
    # except StopIteration:
    #     pass

    # print(sims)


def test_read():
    with contextmanager(get_session)() as session:
        # sessions = get_session()
        # session = next(sessions)
        sims = get_submitted_simulations(session)
        for sim in sims:
            if sim.simulation_type_id == 1:
                jf, calc = get_orca_jobfile_with_technique(session, sim.id)
                print(jf)


def main():
    # test_read()
    print("Running main loop")
    while True:
        run_update()
        time.sleep(10)
        print("Loop iteration complete")
