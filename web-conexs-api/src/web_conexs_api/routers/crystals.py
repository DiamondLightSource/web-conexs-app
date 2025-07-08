from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session

from ..auth import get_current_user
from ..crud import (
    get_crystal_structure,
    get_crystal_structures,
    upload_crystal_structure,
)
from ..database import get_session
from ..models.models import (
    CrystalStructure,
    CrystalStructureInput,
    StructureWithMetadata,
)

router = APIRouter()


@router.get("/api/crystals/{id}")
def get_crystal_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> CrystalStructure:
    return get_crystal_structure(session, id, user_id)


@router.post("/api/crystals")
def upload_crystal_endpoint(
    structure: CrystalStructureInput,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> CrystalStructure:
    return upload_crystal_structure(structure, session, user_id)


@router.get("/api/crystals")
def get_crystal_list_endpoint(
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> List[StructureWithMetadata]:
    return get_crystal_structures(session, user_id)
