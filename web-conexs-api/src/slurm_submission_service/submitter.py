import logging
import os
import sys
import time
from contextlib import contextmanager

from web_conexs_api.database import get_session

from .crud import get_submitted_simulations, update_cluster
from .fdmnes import submit_fdmnes
from .filetransfer import check_filesystem
from .orca import submit_orca
from .qe import submit_qe
from .slurm_submit import clean_request_cancelled, update_active_simulations

logger = logging.getLogger(__name__)

ROOT_DIR = os.environ.get("CONEXS_ROOT_DIR")


def submit_new_simulations(session):
    sims = get_submitted_simulations(session)

    for sim in sims:
        # TODO put in try catch in case generation of job file fails
        # we don't want to keep retrying poisoned entries
        if sim.simulation_type_id == 1:
            submit_orca(session, sim)
        if sim.simulation_type_id == 2:
            submit_fdmnes(session, sim)
        if sim.simulation_type_id == 3:
            submit_qe(session, sim)


def run_update():
    check_filesystem(ROOT_DIR)

    with contextmanager(get_session)() as session:
        clean_request_cancelled(session)

        submit_new_simulations(session)

        update_active_simulations(session)

        update_cluster(session)


def main():
    os.umask(0o007)

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

    while True:
        try:
            run_update()
        except KeyboardInterrupt:
            logger.info("Stopped with keyboard")
        except Exception:
            logger.exception("Error in update loop")
        time.sleep(10)
        logger.info("Loop iteration complete")
