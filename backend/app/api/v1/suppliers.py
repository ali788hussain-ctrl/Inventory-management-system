from typing import Annotated

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.dependencies.auth import get_current_user
from app.schemas.supplier import (
    SupplierCreate,
    SupplierResponse,
    SupplierUpdate,
)
from app.services.supplier_service import (
    create_supplier,
    delete_supplier,
    get_supplier_by_id,
    get_suppliers,
    update_supplier,
)


router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"],
)


@router.post(
    "",
    response_model=SupplierResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_supplier(
    supplier_data: SupplierCreate,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
):
    try:
        return create_supplier(
            supplier_data=supplier_data,
            created_by=current_user["_id"],
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.get(
    "",
    response_model=list[SupplierResponse],
)
def list_suppliers(
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
):
    return get_suppliers(
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{supplier_id}",
    response_model=SupplierResponse,
)
def retrieve_supplier(
    supplier_id: str,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
):
    supplier = get_supplier_by_id(supplier_id)

    if supplier is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supplier not found.",
        )

    return supplier


@router.patch(
    "/{supplier_id}",
    response_model=SupplierResponse,
)
def edit_supplier(
    supplier_id: str,
    supplier_data: SupplierUpdate,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
):
    update_data = supplier_data.model_dump(
        exclude_unset=True
    )

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update fields were provided.",
        )

    try:
        supplier = update_supplier(
            supplier_id=supplier_id,
            update_data=update_data,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error

    if supplier is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supplier not found.",
        )

    return supplier


@router.delete(
    "/{supplier_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_supplier(
    supplier_id: str,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
):
    deleted = delete_supplier(supplier_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supplier not found.",
        )