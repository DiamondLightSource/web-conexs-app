from fastapi import APIRouter, Depends
from fastapi.responses import PlainTextResponse
from sqlmodel import Session

from ..auth import get_current_user
from ..crud import (
    get_qe_jobfile,
    get_qe_output,
    get_qe_simulation,
    get_qe_xas,
    submit_qe_simulation,
)
from ..database import get_session
from ..models.models import (
    QESimulation,
    QESimulationInput,
    QESimulationResponse,
)

router = APIRouter()


@router.get("/api/qe/{id}")
def get_qe_simulation_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> QESimulationResponse:
    return get_qe_simulation(session, id, user_id)


@router.get("/api/qe/{id}/jobfile")
def get_qe_jobfile_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> str:
    return PlainTextResponse(get_qe_jobfile(session, id, user_id)[0])


@router.get("/api/qe/{id}/output")
def get_qe_output_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> str:
    return PlainTextResponse(get_qe_output(session, id, user_id))


@router.get("/api/qe/{id}/xas")
def get_fdmnes_xas_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
):
    return get_qe_xas(session, id, user_id)


@router.post("/api/qe")
def submit_qe(
    qe_input: QESimulationInput,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> QESimulation:
    return submit_qe_simulation(qe_input, session, user_id)
