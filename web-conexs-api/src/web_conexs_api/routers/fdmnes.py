from fastapi import APIRouter, Depends
from fastapi.responses import PlainTextResponse
from sqlmodel import Session

from ..auth import get_current_user
from ..crud import (
    get_fdmnes_jobfile,
    get_fdmnes_output,
    get_fdmnes_simulation,
    get_fdmnes_xas,
    submit_fdmnes_simulation,
)
from ..database import get_session
from ..models.models import (
    FdmnesSimulation,
    FdmnesSimulationInput,
    FdmnesSimulationResponse,
)

router = APIRouter()


@router.get("/api/fdmnes/{id}")
def get_fdmnes_simulation_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> FdmnesSimulationResponse:
    return get_fdmnes_simulation(session, id, user_id)


@router.get("/api/fdmnes/{id}/jobfile")
def get_fdmnes_jobfile_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> str:
    return PlainTextResponse(get_fdmnes_jobfile(session, id, user_id))


@router.get("/api/fdmnes/{id}/output")
def get_fdmnes_output_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> str:
    return PlainTextResponse(get_fdmnes_output(session, id, user_id))


@router.get("/api/fdmnes/{id}/xas")
def get_fdmnes_xas_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
):
    return get_fdmnes_xas(session, id, user_id)


@router.post("/api/fdmnes")
def submit_fdmnes(
    fdmnes_input: FdmnesSimulationInput,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> FdmnesSimulation:
    return submit_fdmnes_simulation(fdmnes_input, session, user_id)
