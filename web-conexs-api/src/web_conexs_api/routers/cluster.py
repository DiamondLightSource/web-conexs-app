from fastapi import APIRouter, Depends
from sqlmodel import Session

from ..auth import get_current_user
from ..crud import get_cluster
from ..database import get_session
from ..models.models import Cluster

router = APIRouter()


@router.get("/api/cluster/status")
def get_cluster_status_endpoint(
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> Cluster:
    return get_cluster(session)
