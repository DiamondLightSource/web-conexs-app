import logging
import os
import uuid
from pathlib import Path

from web_conexs_api.jobfilebuilders import build_qe_xspectra_inputs
from web_conexs_api.models.models import Simulation

from .crud import get_qe_jobfile
from .filetransfer import copy_multiple_files, transfer_inputs
from .slurm_submit import submit_simulation

logger = logging.getLogger(__name__)

ROOT_DIR = os.environ.get("CONEXS_ROOT_DIR")

PP_DIR = os.environ.get("PP_DIR")
WFC_DIR = os.environ.get("WFC_DIR")

QE_IMAGE = os.environ.get("QE_IMAGE")
CONTAINER_IMAGE_DIR = os.environ.get("CONTAINER_IMAGE_DIR")


def submit_qe(session, sim: Simulation):
    jobfile, absorbing_atom, abs_edge, pp, pp_abs = get_qe_jobfile(session, sim.id)
    application_name = "qe"
    user = sim.person.identifier
    uid = uuid.uuid4()

    job_name = str(sim.id) + "-" + application_name + "-" + str(uid)
    working_dir = str(Path(ROOT_DIR) / Path(user) / Path(job_name))

    core_file = Path(pp_abs).with_suffix(".wfc")

    file_map = {}

    file_map["job.inp"] = jobfile

    # 3 xspectra calculations for different axes
    xspectra_input_files = []

    for i in range(3):
        xspectra_input_files.append(f"{i}.xspectra_input.inp")

    xspectra_jobfiles = build_qe_xspectra_inputs(abs_edge, str(core_file))

    for i in range(3):
        file_map[xspectra_input_files[i]] = xspectra_jobfiles[i]

    transfer_inputs(file_map, str(working_dir))

    to_copy = []

    for pp_filename in pp:
        to_copy.append(os.path.join(PP_DIR, pp_filename))

    to_copy.append(os.path.join(WFC_DIR, core_file))

    copy_multiple_files(to_copy, working_dir)

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

    submit_simulation(script, job_name, sim, user, session, False)
