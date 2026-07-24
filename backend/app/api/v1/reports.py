from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.dependencies.auth import get_current_user
from app.schemas.reports import (
    InventoryValueResponse,
    LowStockProductResponse,
    OutOfStockProductResponse,
    TransactionSummaryResponse,
)
from app.services.reports_service import (
    get_inventory_value,
    get_low_stock_products,
    get_out_of_stock_products,
    get_transaction_summary,
)

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get(
    "/low-stock",
    response_model=list[LowStockProductResponse],
    summary="Low Stock Report",
)
def low_stock_report(
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    threshold: int = Query(
        default=10,
        ge=0,
        description="Low stock threshold",
    ),
):
    return get_low_stock_products(threshold)


@router.get(
    "/out-of-stock",
    response_model=list[OutOfStockProductResponse],
    summary="Out of Stock Report",
)
def out_of_stock_report(
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
):
    return get_out_of_stock_products()


@router.get(
    "/inventory-value",
    response_model=InventoryValueResponse,
    summary="Inventory Value Report",
)
def inventory_value_report(
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
):
    return get_inventory_value()


@router.get(
    "/transaction-summary",
    response_model=TransactionSummaryResponse,
    summary="Transaction Summary Report",
)
def transaction_summary_report(
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    days: int = Query(
        default=30,
        ge=1,
        le=365,
        description="Number of days to summarize",
    ),
):
    return get_transaction_summary(days)