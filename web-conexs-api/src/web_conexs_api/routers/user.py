from fastapi import APIRouter, Depends
from sqlmodel import Session

from ..auth import get_current_user
from ..crud import accept_orca_eula, get_user
from ..database import get_session

router = APIRouter()


@router.get("/")
async def check(
    session: Session = Depends(get_session), user_id: str = Depends(get_current_user)
):
    return get_user(session, user_id)


@router.patch("/")
async def accept_orca_eula_patch(
    session: Session = Depends(get_session), user_id: str = Depends(get_current_user)
):
    return accept_orca_eula(session, user_id)
