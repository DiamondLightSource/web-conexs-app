from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session

from ..auth import get_current_user
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
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> MolecularStructure:
    return get_molecular_structure(session, id, user_id)


@router.post("/api/molecules")
def upload_molecular_endpoint(
    structure: MolecularStructureInput,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> MolecularStructure:
    return upload_molecular_structure(structure, session, user_id)


@router.get("/api/molecules")
def get_molecular_list_endpoint(
    session: Session = Depends(get_session), user_id: str = Depends(get_current_user)
) -> List[MolecularStructure]:
    output = get_molecular_structures(session, user_id)
    print(output)
    return output
