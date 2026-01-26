import logging
from pathlib import Path

from sqlmodel import select

from web_conexs_api.models.models import (
    Simulation,
    SimulationStatus,
)

logger = logging.getLogger(__name__)


def set_simulation_deleted(session, working_directory: Path):
    wd = str(working_directory.name)

    statement = select(Simulation).where(Simulation.working_directory == wd)
    sims = session.exec(statement).all()

    if sims is None or len(sims) == 0:
        logger.error(f"Simulation for {wd} not found!")

    elif len(sims) > 1:
        logger.error(f"Multiple simulations found for {wd}")

    else:
        s = sims[0]
        s.working_directory = None
        s.status = SimulationStatus.deleted
        session.add(s)
        session.commit()

        return s
