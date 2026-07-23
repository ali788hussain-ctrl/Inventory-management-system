from typing import Annotated, Literal

from bson import ObjectId
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Response,
    status,
)

from app.dependencies.auth import get_current_user
from app.schemas.product import (
    PaginatedProductResponse,
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


def get_user_object_id(current_user: dict) -> ObjectId:
    """
    Safely extract and convert the authenticated user's ID
    into a MongoDB ObjectId.
    """
    user_id = current_user.get("_id")

    if isinstance(user_id, ObjectId):
        return user_id

    if isinstance(user_id, str) and ObjectId.is_valid(user_id):
        return ObjectId(user_id)

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authenticated user ID.",
    )


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new product",
    description=(
        "Create a new product. The SKU must be unique."
    ),
)
def create_new_product(
    product_data: ProductCreate,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
):
    created_by = get_user_object_id(current_user)

    try:
        return create_product(
            product_data=product_data,
            created_by=created_by,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.get(
    "",
    response_model=PaginatedProductResponse,
    summary="List products",
    description=(
        "Retrieve products with pagination, search, filtering, "
        "and sorting."
    ),
)
def read_products(
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
    page: int = Query(
        default=1,
        ge=1,
        description="Page number starting from 1.",
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Maximum number of products per page.",
    ),
    search: str | None = Query(
        default=None,
        min_length=1,
        max_length=100,
        description=(
            "Search products by name, SKU, or description."
        ),
    ),
    category: str | None = Query(
        default=None,
        min_length=1,
        max_length=100,
        description="Filter products by exact category name.",
    ),
    min_price: float | None = Query(
        default=None,
        ge=0,
        description="Minimum product price.",
    ),
    max_price: float | None = Query(
        default=None,
        ge=0,
        description="Maximum product price.",
    ),
    is_active: bool | None = Query(
        default=None,
        description="Filter products by active status.",
    ),
    sort_by: Literal[
        "name",
        "sku",
        "category",
        "price",
        "quantity",
        "created_at",
        "updated_at",
    ] = Query(
        default="created_at",
        description="Product field used for sorting.",
    ),
    order: Literal[
        "asc",
        "desc",
    ] = Query(
        default="desc",
        description="Sorting direction.",
    ),
):
    if (
        min_price is not None
        and max_price is not None
        and min_price > max_price
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Minimum price cannot be greater "
                "than maximum price."
            ),
        )

    try:
        return get_products(
            page=page,
            limit=limit,
            search=search,
            category=category,
            min_price=min_price,
            max_price=max_price,
            is_active=is_active,
            sort_by=sort_by,
            order=order,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error


@router.get(
    "/{product_id}",
    response_model=ProductResponse,
    summary="Get a product",
    description="Retrieve a single product by its MongoDB ID.",
)
def read_product(
    product_id: str,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
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
    summary="Update a product",
    description=(
        "Update product information. Product quantity cannot be "
        "updated directly and must be changed through an inventory "
        "transaction."
    ),
)
def update_existing_product(
    product_id: str,
    product_data: ProductUpdate,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
):
    update_data = product_data.model_dump(
        exclude_unset=True,
    )

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update fields were provided.",
        )

    if "quantity" in update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Product quantity cannot be updated directly. "
                "Use an inventory transaction instead."
            ),
        )

    try:
        updated_product = update_product(
            product_id=product_id,
            update_data=update_data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error

    if updated_product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )

    return updated_product


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a product",
    description="Permanently delete a product by its ID.",
)
def remove_product(
    product_id: str,
    current_user: Annotated[
        dict,
        Depends(get_current_user),
    ],
) -> Response:
    deleted = delete_product(product_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found.",
        )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )