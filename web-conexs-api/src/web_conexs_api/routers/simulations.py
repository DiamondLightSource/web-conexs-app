from fastapi import APIRouter, Depends
from fastapi_pagination.cursor import CursorPage
from sqlmodel import Session

from ..auth import get_current_user
from ..crud import get_simulation, get_simulations_page
from ..database import get_session
from ..models.models import SimulationResponse

router = APIRouter()


@router.get("/api/simulations")
def get_simulations_pagination_endpoint(
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> CursorPage[SimulationResponse]:
    print(user_id)
    return get_simulations_page(session, user_id)


@router.get("/api/simulations/{id}")
def get_simulation_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> SimulationResponse:
    print(user_id)
    return get_simulation(session, id, user_id)
