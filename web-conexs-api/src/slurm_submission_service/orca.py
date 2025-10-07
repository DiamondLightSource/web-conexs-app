import logging
import os
import uuid
from pathlib import Path

from web_conexs_api.models.models import OrcaCalculation, Simulation

from .crud import get_orca_jobfile_with_technique
from .filetransfer import copy_multiple_files, transfer_inputs
from .slurm_submit import submit_simulation

logger = logging.getLogger(__name__)

ROOT_DIR = os.environ.get("CONEXS_ROOT_DIR")

ORCA_IMAGE = os.environ.get("ORCA_IMAGE")
CONTAINER_IMAGE_DIR = os.environ.get("CONTAINER_IMAGE_DIR")


def submit_orca(session, sim: Simulation):
    job_string, keyword = get_orca_jobfile_with_technique(session, sim.id)
    application_name = "orca"
    user = sim.person.identifier
    uid = uuid.uuid4()

    job_name = application_name + "-" + str(uid)
    working_dir = str(Path(ROOT_DIR) / Path(user) / Path(job_name))

    file_map = {"job.inp": job_string}

    transfer_inputs(file_map, working_dir)

    orca_sif = os.path.join(CONTAINER_IMAGE_DIR, ORCA_IMAGE)

    if keyword == OrcaCalculation.opt or keyword == OrcaCalculation.scf:
        script = (
            "#!/bin/bash\n"
            + "set -e\n"
            + f"singularity exec {orca_sif}"
            + " /opt/orca/4.2.1/orca job.inp > orca_result.txt"
        )
    else:
        package_dir = Path(__file__).resolve().parent
        copy_multiple_files(
            [
                str(package_dir / Path("extract_energies.py")),
                str(package_dir / Path("extract_transitions.py")),
            ],
            working_dir,
        )

        spc_keyword = "ABSQ" if keyword == OrcaCalculation.xas else "XES"
        script = (
            "#!/bin/bash\n"
            + "set -e\n"
            + f"singularity exec {orca_sif} /opt/orca/4.2.1/orca job.inp "
            + "> orca_result.txt\n"
            + f"singularity exec {orca_sif} python3 extract_energies.py\n"
            + "mapfile energy_var < energy_range.out\n"
            + "lowDeltaEv=${energy_var[0]}\n"
            + "highDeltaEv=${energy_var[1]}\n"
            + f"singularity exec {orca_sif} /opt/orca/4.2.1/orca_mapspc"
            + f" orca_result.txt {spc_keyword} -eV -x0$lowDeltaEv -x1$highDeltaEv"
            + " -w1 -n1000\n"
            + f"singularity exec {orca_sif} python3 extract_transitions.py\n"
            + f"singularity exec {orca_sif} orca_plot job.gbw -i < plot_file.input\n"
            + f"singularity exec {orca_sif} gzip *.cube"
        )

    submit_simulation(script, job_name, sim, user, session, False)
