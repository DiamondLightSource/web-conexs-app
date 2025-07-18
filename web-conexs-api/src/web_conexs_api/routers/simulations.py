from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from fastapi_pagination.cursor import CursorPage
from sqlmodel import Session

from ..auth import get_current_user
from ..crud import (
    get_simulation,
    get_simulation_zipped,
    get_simulations_page,
    request_cancel_simulation,
)
from ..database import get_session
from ..models.models import SimulationResponse

router = APIRouter()


@router.get("/")
def get_simulations_pagination_endpoint(
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> CursorPage[SimulationResponse]:
    return get_simulations_page(session, user_id)


@router.get("/{id}")
def get_simulation_endpoint(
    id: int,
    format: str | None = None,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> SimulationResponse:
    if format == "zip":
        zip_buffer = get_simulation_zipped(session, id, user_id)

        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={
                "Content-Disposition": f"attachment; filename=simulation_{id}.zip"
            },
        )

    return get_simulation(session, id, user_id)


@router.patch("/{id}/status")
def cancel_simulation_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> SimulationResponse:
    return request_cancel_simulation(session, id, user_id)
