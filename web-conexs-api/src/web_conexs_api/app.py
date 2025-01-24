from fastapi import Depends, FastAPI
from sqlmodel import Session

from .crud import get_orca_simulation, get_simulation, submit_orca_simulation
from .database import get_session
from .models.models import (
    OrcaSimulation,
    OrcaSimulationInput,
    OrcaSimulationResponse,
    SimulationResponse,
)

app = FastAPI()


@app.get("/api/simulations/{id}")
async def get_simulation_endpoint(
    id: int, session: Session = Depends(get_session)
) -> SimulationResponse:
    return get_simulation(session, id)


@app.post("/api/submit/orca")
async def submit_orca(
    orca_input: OrcaSimulationInput,
    session: Session = Depends(get_session),
) -> OrcaSimulation:
    return submit_orca_simulation(orca_input, session)


@app.get("/api/orca/{id}")
async def get_orca_simulation_endpoint(
    id: int, session: Session = Depends(get_session)
) -> OrcaSimulationResponse:
    return get_orca_simulation(session, id)
