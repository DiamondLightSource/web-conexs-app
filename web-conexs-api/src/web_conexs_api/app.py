from typing import List

from fastapi import Depends, FastAPI
from fastapi.responses import PlainTextResponse
from sqlmodel import Session

from .crud import (
    get_molecular_structure,
    get_molecular_structures,
    get_orca_jobfile,
    get_orca_simulation,
    get_simulation,
    get_simulations,
    submit_orca_simulation,
    upload_molecular_structure,
)
from .database import get_session
from .models.models import (
    MolecularStructure,
    MolecularStructureInput,
    OrcaSimulation,
    OrcaSimulationInput,
    OrcaSimulationResponse,
    SimulationResponse,
)

app = FastAPI()


# TODO paginated simulations endpoint
@app.get("/api/simulations")
async def get_simulations_endpoint(
    session: Session = Depends(get_session),
) -> List[SimulationResponse]:
    return get_simulations(session)


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


# TODO actually implement
@app.get("/api/orca/{id}/output")
async def get_orca_output_endpoint(
    id: int, session: Session = Depends(get_session)
) -> str:
    return get_orca_simulation(session, id)


# TODO actually implement
@app.get("/api/orca/{id}/jobfile")
async def get_orca_jobfile_endpoint(
    id: int, session: Session = Depends(get_session)
) -> str:
    return PlainTextResponse(get_orca_jobfile(session, id))


# @app.get("/api/orca/{id}/spectra")
# async def get_orca_spectra_endpoint(
#     id: int, session: Session = Depends(get_session)
# ) -> OrcaSimulationResponse:
#     return get_orca_simulation(session, id)


# @app.get("/api/orca/{id}/spectra/{spectrum_id}")
# async def get_orca_spectrum_endpoint(
#     id: int, session: Session = Depends(get_session)
# ) -> OrcaSimulationResponse:
#     return get_orca_simulation(session, id)


# @app.post("/api/orca/{id}/spectra/")
# async def submit_orca_spectrum_endpoint(
#     id: int, session: Session = Depends(get_session)
# ) -> OrcaSimulationResponse:
#     return get_orca_simulation(session, id)


@app.get("/api/molecules/{id}")
async def get_molecular_endpoint(
    id: int, session: Session = Depends(get_session)
) -> MolecularStructure:
    return get_molecular_structure(session, id)


@app.post("/api/molecules")
async def upload_molecular_endpoint(
    structure: MolecularStructureInput, session: Session = Depends(get_session)
) -> MolecularStructure:
    return upload_molecular_structure(structure, session)


@app.get("/api/molecules")
async def get_molecular_list_endpoint(
    session: Session = Depends(get_session),
) -> List[MolecularStructure]:
    return get_molecular_structures(session)
