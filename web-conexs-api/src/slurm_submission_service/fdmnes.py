import logging
import os
import uuid
from pathlib import Path

from web_conexs_api.models.models import Simulation

from .crud import get_fdmnes_jobfile
from .filetransfer import transfer_inputs
from .slurm_submit import submit_simulation

logger = logging.getLogger(__name__)

ROOT_DIR = os.environ.get("CONEXS_ROOT_DIR")
FDMNES_IMAGE = os.environ.get("FDMNES_IMAGE")
CONTAINER_IMAGE_DIR = os.environ.get("CONTAINER_IMAGE_DIR")


def submit_fdmnes(session, sim: Simulation):
    job_string = get_fdmnes_jobfile(session, sim.id)
    application_name = "fdmnes"
    user = sim.person.identifier
    uid = uuid.uuid4()

    job_name = sim.id + "-" + application_name + "-" + str(uid)

    file_map = {}
    file_map["job.txt"] = job_string
    file_map["fdmfile.txt"] = (
        "! number of files to process\n"
        + "1\n\n"
        + "! name of file to process\n"
        + "job.txt"
    )

    run_location = Path(ROOT_DIR) / Path(user) / Path(job_name)

    transfer_inputs(file_map, str(run_location))

    fdmnes_sif = os.path.join(CONTAINER_IMAGE_DIR, FDMNES_IMAGE)

    script = (
        "#!/bin/bash\n"
        + f"singularity exec {fdmnes_sif} mpirun -np 1 fdmnes_mpi > fdmnes_result.txt"
    )

    submit_simulation(script, job_name, sim, user, session, True)
