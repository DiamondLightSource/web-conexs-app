from fastapi import HTTPException
from sqlmodel import Session

from .models.models import OrcaSimulation, OrcaSimulationInput, Simulation


def get_simulation(session, id):
    simulation = session.get(Simulation, id)

    if simulation:
        print(simulation)
        print(simulation.simulation_type)
        return simulation
    else:
        raise HTTPException(status_code=404, detail=f"No simulation with id={id}")


def get_orca_simulation(session, id):
    simulation = session.get(OrcaSimulation, id)

    if simulation:
        return simulation
    else:
        raise HTTPException(status_code=404, detail=f"No simulation with id={id}")


def submit_orca_simulation(orca_input: OrcaSimulationInput, session: Session):
    smodel = {
        "person_id": 1,
        "working_directory": "/working_directory_orca",
        "simulation_type_id": 1,
        "status_id": 1,
    }

    simulation = Simulation.model_validate(smodel)
    orca = OrcaSimulation.model_validate(orca_input)
    orca.simulation = simulation

    session.add(orca)
    session.commit()
    session.refresh(orca)

    return orca
