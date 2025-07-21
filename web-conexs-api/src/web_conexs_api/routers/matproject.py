import logging
import os

from fastapi import APIRouter, Depends, HTTPException
from pymatgen.ext.matproj import MPRester

from web_conexs_api.auth import get_current_user
from web_conexs_api.jobfilebuilders import pymatstruct_to_crystal
from web_conexs_api.models.models import CrystalStructureInput

logger = logging.getLogger(__name__)

# only import to get nicer error if envar is absent
PMG_MAPI_KEY = os.environ.get("PMG_MAPI_KEY")

router = APIRouter()


@router.get("/{id}")
def get_fdmnes_simulation_endpoint(
    id: str,
    user_id: str = Depends(get_current_user),
) -> CrystalStructureInput:
    logger.info(f"User {user_id} requested structure {id}")

    if PMG_MAPI_KEY is None:
        raise HTTPException(
            status_code=500, detail="Server not configured for Materials Project"
        )

    print("Key present")

    with MPRester(None) as m:
        try:
            structure = m.get_structure_by_material_id(id, conventional_unit_cell=False)
            print("Got structure")
            return pymatstruct_to_crystal(structure, id)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail="Error retrieving structure")
