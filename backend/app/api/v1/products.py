from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.dependencies.auth import get_current_user
from app.schemas.product import (
    ProductCreate,
    ProductResponse,
    ProductUpdate,
)
from app.services.product_service import (
    create_product,
    delete_product,
    get_product_by_id,
    get_products,
    update_product,
)

router = APIRouter(
    prefix="/products",
    tags=["Products"],
)

@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_product(
    product: ProductCreate,
    current_user: dict = Depends(get_current_user),
):
    try:
        return create_product(
            product,
            ObjectId(current_user["_id"]),
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )

@router.get(
    "",
    response_model=list[ProductResponse],
)
def read_products(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    return get_products(skip=skip, limit=limit)

@router.get(
    "/{product_id}",
    response_model=ProductResponse,
)
def read_product(
    product_id: str,
    current_user: dict = Depends(get_current_user),
):
    product = get_product_by_id(product_id)

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )

    return product

@router.patch(
    "/{product_id}",
    response_model=ProductResponse,
)
def update_existing_product(
    product_id: str,
    product: ProductUpdate,
    current_user: dict = Depends(get_current_user),
):
    update_data = product.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update data provided.",
        )

    updated_product = update_product(
        product_id=product_id,
        update_data=update_data,
    )

    if updated_product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )

    return updated_product

@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_product(
    product_id: str,
    current_user: dict = Depends(get_current_user),
):
    deleted = delete_product(product_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )