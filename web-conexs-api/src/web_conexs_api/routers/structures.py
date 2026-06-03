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


async def get_body(request: Request):
    return await request.body()


@router.post("/convert/molecule")
def convert_to_molecule(
    body: str = Depends(get_body),
    user_id: str = Depends(get_current_user),
) -> MolecularStructureInput:
    molecule = cif_string_to_molecule(body.decode(), False)

    if molecule is None:
        raise HTTPException(
            status_code=422, detail="Could not extract structure from file"
        )

    return molecule


@router.post("/convert/moleculeextract")
def convert_to_molecule_extract(
    body: str = Depends(get_body),
    user_id: str = Depends(get_current_user),
) -> MolecularStructureInput:

    try:
        molecule = cif_string_to_molecule(body.decode(), True)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

    if molecule is None:
        raise HTTPException(
            status_code=422, detail="Could not extract structure from file"
        )

    return molecule


@router.post("/convert/crystal")
def convert_to_crystal(
    body: str = Depends(get_body),
    user_id: str = Depends(get_current_user),
) -> CrystalStructureInput:
    crystal = cif_string_to_crystal(body.decode())

    if not crystal:
        raise HTTPException(
            status_code=422, detail="Could not extract structure from file"
        )

    return crystal
