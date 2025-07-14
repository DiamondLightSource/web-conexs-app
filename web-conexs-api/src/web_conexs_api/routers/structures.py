from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session

from ..auth import get_current_user
from ..crud import (
    get_structure,
    get_structures,
    upload_structure,
)
from ..database import get_session
from ..models.models import (
    CrystalStructure,
    CrystalStructureInput,
    MolecularStructure,
    MolecularStructureInput,
    StructureType,
    StructureWithMetadata,
)

router = APIRouter()


@router.get("/api/structures/{id}")
def get_structures_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> CrystalStructure | MolecularStructure:
    return get_structure(session, id, user_id)


# Must be Crystal then Molecule or the lattice gets dropped
@router.post("/api/structures")
def upload_structures_endpoint(
    structure: CrystalStructureInput | MolecularStructureInput,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> MolecularStructure | CrystalStructure:
    return upload_structure(structure, session, user_id)


@router.get("/api/structures")
def get_structure_list_endpoint(
    type: StructureType | None = None,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> List[StructureWithMetadata]:
    output = get_structures(session, user_id, type)
    return output
