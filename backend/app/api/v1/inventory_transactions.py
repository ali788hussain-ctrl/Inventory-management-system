from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.dependencies.auth import get_current_user
from app.schemas.inventory_transaction import (
    InventoryTransactionCreate,
    InventoryTransactionResponse,
)
from app.services.inventory_transaction_service import (
    create_inventory_transaction,
    get_inventory_transaction_by_id,
    get_inventory_transactions,
)

router = APIRouter(
    prefix="/inventory-transactions",
    tags=["Inventory Transactions"],
)


@router.post(
    "",
    response_model=InventoryTransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_transaction(
    transaction_data: InventoryTransactionCreate,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
):
    try:
        return create_inventory_transaction(
            transaction_data=transaction_data,
            performed_by=current_user["_id"],
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    except LookupError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )


@router.get(
    "",
    response_model=list[InventoryTransactionResponse],
)
def list_transactions(
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    product_id: str | None = None,
    transaction_type: str | None = None,
):
    try:
        return get_inventory_transactions(
            skip=skip,
            limit=limit,
            product_id=product_id,
            transaction_type=transaction_type,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/{transaction_id}",
    response_model=InventoryTransactionResponse,
)
def get_transaction(
    transaction_id: str,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
):
    transaction = get_inventory_transaction_by_id(
        transaction_id
    )

    if transaction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found.",
        )

    return transaction