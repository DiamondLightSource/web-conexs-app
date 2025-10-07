from typing import List

from fastapi import APIRouter, Depends
from fastapi.responses import PlainTextResponse
from sqlmodel import Session

from ..auth import get_current_user
from ..crud import (
    get_orca_cube_file,
    get_orca_cube_info,
    get_orca_jobfile,
    get_orca_output,
    get_orca_simulation,
    get_orca_xas,
    get_orca_xyz,
    submit_orca_simulation,
)
from ..database import get_session
from ..models.models import (
    OrcaCubeInfo,
    OrcaSimulation,
    OrcaSimulationResponse,
    OrcaSimulationSubmission,
)

router = APIRouter()


@router.get("/{id}")
def get_orca_simulation_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> OrcaSimulationResponse:
    return get_orca_simulation(session, id, user_id)


@router.get("/{id}/output")
def get_orca_output_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> str:
    return PlainTextResponse(get_orca_output(session, id, user_id))


@router.get("/{id}/xyz")
def get_orca_xyz_output(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> str:
    return PlainTextResponse(get_orca_xyz(session, id, user_id))


@router.get("/{id}/jobfile")
def get_orca_jobfile_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> str:
    return PlainTextResponse(get_orca_jobfile(session, id, user_id))


@router.get("/{id}/xas")
def get_orca_xas_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
):
    return get_orca_xas(session, id, user_id)


@router.get("/{id}/cube")
def get_orca_cube_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> List[OrcaCubeInfo]:
    return get_orca_cube_info(session, id, user_id)


@router.get("/{id}/cube/{cube_id}")
def get_orca_cube_file_endpoint(
    id: int,
    cube_id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
):
    cube_file = get_orca_cube_file(session, id, cube_id, user_id)
    response = PlainTextResponse(cube_file)
    response.headers.append(key="Content-Encoding", value="gzip")
    return response


@router.post("/")
def submit_orca(
    orca_input: OrcaSimulationSubmission,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> OrcaSimulation:
    print(orca_input)
    return submit_orca_simulation(orca_input, session, user_id)


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
