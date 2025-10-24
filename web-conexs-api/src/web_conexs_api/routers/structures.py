from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session

from ..auth import get_current_user
from ..crud import (
    get_structure,
    get_structures,
    upload_structure,
)
from ..database import get_session
from ..jobfilebuilders import cif_string_to_crystal, cif_string_to_molecule
from ..models.models import (
    CrystalStructure,
    CrystalStructureInput,
    MolecularStructure,
    MolecularStructureInput,
    StructureType,
    StructureWithMetadata,
)

router = APIRouter()


@router.get("/{id}")
def get_structures_endpoint(
    id: int,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> CrystalStructure | MolecularStructure:
    return get_structure(session, id, user_id)


# Must be Crystal then Molecule or the lattice gets dropped
@router.post("/")
def upload_structures_endpoint(
    structure: CrystalStructureInput | MolecularStructureInput,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> MolecularStructure | CrystalStructure:
    return upload_structure(structure, session, user_id)


@router.get("/")
def get_structure_list_endpoint(
    type: StructureType | None = None,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> List[StructureWithMetadata]:
    output = get_structures(session, user_id, type)
    return output


@router.post("/convert/molecule")
async def convert_to_molecule(
    request: Request,
    user_id: str = Depends(get_current_user),
) -> MolecularStructureInput:
    body = await request.body()
    molecule = cif_string_to_molecule(body.decode())

    if molecule is None:
        raise HTTPException(
            status_code=422, detail="Could not extract structure from file"
        )

    return molecule


@router.post("/convert/crystal")
async def convert_to_crystal(
    request: Request,
    user_id: str = Depends(get_current_user),
) -> CrystalStructureInput:
    body = await request.body()
    crystal = cif_string_to_crystal(body.decode())

    if not crystal:
        raise HTTPException(
            status_code=422, detail="Could not extract structure from file"
        )

    return crystal
