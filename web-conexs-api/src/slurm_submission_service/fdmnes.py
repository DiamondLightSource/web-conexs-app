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
CLUSTER_ROOT_DIR = os.environ.get("CONEXS_CLUSTER_ROOT_DIR")

FDMNES_IMAGE = os.environ.get("FDMNES_IMAGE")
CONTAINER_IMAGE_DIR = os.environ.get("CONTAINER_IMAGE_DIR")


def submit_fdmnes(session, sim: Simulation):
    job_string = get_fdmnes_jobfile(session, sim.id)
    application_name = "fdmnes"
    user = sim.person.identifier
    uid = uuid.uuid4()

    job_name = application_name + "-" + str(uid)
    # working_dir = ROOT_DIR + user + "/" + job_name
    # cluster_dir = CLUSTER_ROOT_DIR + user + "/" + job_name

    # success = make_directory(working_dir)

    # if not success:
    #     return

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

    # with open(working_dir / Path("job.txt"), "w+") as f:
    #     f.write(job_string)

    # with open(working_dir / Path("fdmfile.txt"), "w+") as ff:
    #     ff.write(
    #         "! number of files to process\n"
    #         + "1\n\n"
    #         + "! name of file to process\n"
    #         + "job.txt"
    #     )

    fdmnes_sif = os.path.join(CONTAINER_IMAGE_DIR, FDMNES_IMAGE)

    script = (
        "#!/bin/bash\n"
        + f"singularity exec {fdmnes_sif} mpirun -np 1 fdmnes_mpi > fdmnes_result.txt"
    )

    submit_simulation(script, job_name, sim, user, session, True)
    # try:
    #     job_id = build_job_and_run(
    #         script, job_name, sim.n_cores, sim.memory, cluster_dir, True
    #     )
    #     sim.job_id = job_id
    #     sim.working_directory = working_dir
    #     sim.submission_date = datetime.datetime.now()
    #     sim.status = SimulationStatus.submitted
    #     update_simulation(session, sim)
    # except Exception:
    #     sim.status = SimulationStatus.failed
    #     update_simulation(session, sim)
    #     logger.exception("Error submitting FDMNES job")
