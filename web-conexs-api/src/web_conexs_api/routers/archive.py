from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse

from ..auth import get_current_user
from ..crud import (
    get_tmp_dir,
    get_user_folder,
    write_archive,
)

router = APIRouter()


@router.get("/")
def get_simulations_zipped_endpoint(
    tmpdir: str = Depends(get_tmp_dir),
    user_id: str = Depends(get_current_user),
) -> FileResponse:
    dir = get_user_folder(user_id)
    zip_path = f"{tmpdir}/{user_id}.zip"
    write_archive(dir, zip_path)

    return FileResponse(
        zip_path,
        media_type="application/zip",
        headers={
            "Content-Disposition": f"attachment; filename=simulation_{user_id}.zip"
        },
    )
