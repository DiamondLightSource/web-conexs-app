from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session

from ..crud import (
    get_crystal_structure,
    get_crystal_structures,
    upload_crystal_structure,
)
from ..database import get_session
from ..models.models import CrystalStructure, CrystalStructureInput

router = APIRouter()


@router.get("/api/crystals/{id}")
def get_crystal_endpoint(
    id: int, session: Session = Depends(get_session)
) -> CrystalStructure:
    return get_crystal_structure(session, id)


@router.post("/api/crystals")
def upload_crystal_endpoint(
    structure: CrystalStructureInput, session: Session = Depends(get_session)
) -> CrystalStructure:
    return upload_crystal_structure(structure, session)


@router.get("/api/crystals")
def get_crystal_list_endpoint(
    session: Session = Depends(get_session),
) -> List[CrystalStructure]:
    return get_crystal_structures(session)
