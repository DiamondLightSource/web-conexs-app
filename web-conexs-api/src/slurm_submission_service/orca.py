import logging
import os
import uuid
from pathlib import Path

from web_conexs_api.models.models import OrcaCalculation, Simulation

from .crud import get_orca_jobfile_with_technique
from .filetransfer import transfer_inputs
from .slurm_submit import submit_simulation

logger = logging.getLogger(__name__)

ROOT_DIR = os.environ.get("CONEXS_ROOT_DIR")
CLUSTER_ROOT_DIR = os.environ.get("CONEXS_CLUSTER_ROOT_DIR")

ORCA_IMAGE = os.environ.get("ORCA_IMAGE")
CONTAINER_IMAGE_DIR = os.environ.get("CONTAINER_IMAGE_DIR")


def submit_orca(session, sim: Simulation):
    job_string, keyword = get_orca_jobfile_with_technique(session, sim.id)
    application_name = "orca"
    user = sim.person.identifier
    uid = uuid.uuid4()

    job_name = application_name + "-" + str(uid)
    working_dir = str(Path(ROOT_DIR) / Path(user) / Path(job_name))

    # success = make_directory(working_dir)

    # if not success:
    #     return

    # Path(working_dir).mkdir(parents=True)

    file_map = {"job.inp", job_string}

    # input_file = working_dir + "/job.inp"

    # with open(input_file, "w+") as f:
    #     f.write(job_string)

    success = transfer_inputs(file_map, working_dir)

    if not success:
        logger.error(f"Could not transfer input files to {working_dir}")
        return

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

    submit_simulation(script, job_name, sim, user, session, False)
    # try:
    #     job_id = build_job_and_run(
    #         script, job_name, sim.n_cores, sim.memory, cluster_dir, False
    #     )
    #     sim.job_id = job_id
    #     sim.working_directory = working_dir
    #     sim.submission_date = datetime.datetime.now()
    #     sim.status = SimulationStatus.submitted
    #     update_simulation(session, sim)
    # except Exception:
    #     logger.exception("Error submitting orca job")
    #     sim.status = SimulationStatus.failed
    #     update_simulation(session, sim)
    #     logger.exception("Error submitting ORCA job")
