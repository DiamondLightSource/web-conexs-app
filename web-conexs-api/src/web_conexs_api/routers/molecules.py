from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session

from ..crud import (
    get_molecular_structure,
    get_molecular_structures,
    upload_molecular_structure,
)
from ..database import get_session
from ..models.models import MolecularStructure, MolecularStructureInput

router = APIRouter()


@router.get("/api/molecules/{id}")
def get_molecular_endpoint(
    id: int, session: Session = Depends(get_session)
) -> MolecularStructure:
    return get_molecular_structure(session, id)


@router.post("/api/molecules")
def upload_molecular_endpoint(
    structure: MolecularStructureInput, session: Session = Depends(get_session)
) -> MolecularStructure:
    return upload_molecular_structure(structure, session)


@router.get("/api/molecules")
def get_molecular_list_endpoint(
    session: Session = Depends(get_session),
) -> List[MolecularStructure]:
    return get_molecular_structures(session)
