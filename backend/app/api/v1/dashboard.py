from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import get_dashboard_statistics


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "",
    response_model=DashboardResponse,
)
def read_dashboard_statistics(
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
) -> DashboardResponse:
    return get_dashboard_statistics()