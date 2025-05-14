from fastapi import APIRouter, Depends
from fastapi.responses import PlainTextResponse
from sqlmodel import Session

from ..crud import (
    get_orca_jobfile,
    get_orca_output,
    get_orca_simulation,
    get_orca_xas,
    submit_orca_simulation,
)
from ..database import get_session
from ..models.models import OrcaSimulation, OrcaSimulationInput, OrcaSimulationResponse

router = APIRouter()


@router.get("/api/orca/{id}")
def get_orca_simulation_endpoint(
    id: int, session: Session = Depends(get_session)
) -> OrcaSimulationResponse:
    return get_orca_simulation(session, id)


@router.get("/api/orca/{id}/output")
def get_orca_output_endpoint(id: int, session: Session = Depends(get_session)) -> str:
    return PlainTextResponse(get_orca_output(session, id))


@router.get("/api/orca/{id}/jobfile")
def get_orca_jobfile_endpoint(id: int, session: Session = Depends(get_session)) -> str:
    return PlainTextResponse(get_orca_jobfile(session, id))


@router.get("/api/orca/{id}/xas")
def get_orca_xas_endpoint(id: int, session: Session = Depends(get_session)):
    return get_orca_xas(session, id)


@router.post("/api/orca")
def submit_orca(
    orca_input: OrcaSimulationInput,
    session: Session = Depends(get_session),
) -> OrcaSimulation:
    return submit_orca_simulation(orca_input, session)


# TODO further orca endpoints
# mapspc
# @app.get("/api/orca/{id}/spectra")
# @app.get("/api/orca/{id}/spectra/{spectrum_id}")
# request new mapspc call
# @app.post("/api/orca/{id}/spectra/")
# orbital cube files
# @app.get("/api/orca/{id}/orbitals")
# @app.get("/api/orca/{id}/orbitals/{orbital_calculation_id}")
# request new mapspc call
# @app.post("/api/orca/{id}/orbitals/")
