from sqlmodel import select

from web_conexs_api.models.models import (
    Simulation,
    SimulationStatus,
)


def set_simulation_deleted(session, working_directory: str) -> Simulation:
    statement = select(Simulation).where(
        Simulation.working_directory == working_directory
    )
    sims = session.exec(statement).all()

    if sims is not None:
        if len(sims) != 1:
            print("Multiple sims found with same working dir!")

        for s in sims:
            s.working_directory = None
            s.status = SimulationStatus.deleted
            session.add(s)
        session.commit()
