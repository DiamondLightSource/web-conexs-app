import json
import logging
import os
from contextlib import contextmanager
from pprint import pformat

import requests

from web_conexs_api.crud import (
    get_orca_jobfile,
    get_submitted_simulations,
)
from web_conexs_api.database import get_session
from web_conexs_api.models.models import SimulationResponse

logger = logging.getLogger(__name__)

ROOT_DIR = "/scratch/conexs/"

slurm_token_file = os.environ.get("SLURM_TOKEN_FILE")
slurm_user = os.environ.get("USER")
slurm_api = os.environ.get("SLURM_API")
slurm_partition = os.environ.get("SLURM_PARTITION")


def get_token():
    with open(slurm_token_file, "r") as fh:
        return fh.read()


def build_job_and_run(
    script, user_id, working_dir, job_type, cpus, memory, animal, cluster_dir
):
    job_name = f"{user_id}-{job_type}-{animal}"

    job_request = {
        "job": {
            "partition": slurm_partition,
            "name": job_name,
            "nodes": 1,
            "tasks": cpus,
            "memory_per_node": int(memory * 1000),
            "time_limit": 30,
            "current_working_directory": str(cluster_dir),
            "environment": {
                "PATH": "/bin:/usr/bin/:/usr/local/bin/",
                "USER": user_id,
                "LD_LIBRARY_PATH": "/lib/:/lib64/:/usr/local/lib",
            },
        },
        "script": script,
    }

    url_submit = slurm_api + "/job/submit"

    slurm_token = get_token()

    headers = {
        "X-SLURM-USER-NAME": "conexs",
        "X-SLURM-USER-TOKEN": slurm_token,
        "Content-Type": "application/json",
    }

    r = requests.post(url_submit, data=json.dumps(job_request), headers=headers)

    response = r.json()

    if "job_id" not in response:
        logger.error(f"Error submitting {job_name}")
        logger.debug(pformat(job_request))
        logger.debug(pformat(response))
        raise Exception("Submission failed - no job id in response")

    job_id = response["job_id"]
    logger.info(f"Simulation job {job_name} has ID {job_id}")


def run_update():
    with contextmanager(get_session)() as session:
        # sessions = get_session()
        # session = next(sessions)
        sims = get_submitted_simulations(session)

        for sim in sims:
            sr = SimulationResponse.model_validate(sim)
            # val = update_simulation(session, sim)
            if sr.simulation_type_id == 1:
                application_name = "orca"
                user = sr.person.identifier

                print(ROOT_DIR + user + "/" + application_name)
                orca = get_orca_jobfile(session, sim.id)
                # determine workspace
                # write jobfile(s)
                # submit job to slurm (with appropriate resources)
                # update database with jobid, workspace path, status to submitted
                # - might want to add jobname to db
                print(orca)

    # try:
    #     next(sessions)
    # except StopIteration:
    #     pass

    # print(sims)


def main():
    # while True:
    run_update()
    # time.sleep(1)


if __name__ == "__main__":
    main()
