from datetime import datetime, timezone
from math import ceil
from re import escape

from bson import ObjectId
from pymongo import ASCENDING, DESCENDING
from pymongo.errors import DuplicateKeyError

from app.database.mongodb import db
from app.models.product import product_document


products_collection = db["products"]


def format_product_response(product: dict) -> dict:
    return {
        "id": str(product["_id"]),
        "name": product["name"],
        "description": product.get("description"),
        "sku": product["sku"],
        "category": product["category"],
        "price": product["price"],
        "quantity": product["quantity"],
        "created_by": str(product["created_by"]),
        "is_active": product.get("is_active", True),
        "created_at": product["created_at"],
        "updated_at": product["updated_at"],
    }


def get_product_by_sku(sku: str) -> dict | None:
    return products_collection.find_one(
        {"sku": sku.upper()}
    )


def create_product(product_data, created_by: ObjectId) -> dict:
    product = product_document(
        name=product_data.name,
        description=product_data.description,
        sku=product_data.sku,
        category=product_data.category,
        price=product_data.price,
        quantity=product_data.quantity,
        created_by=created_by,
    )

    try:
        result = products_collection.insert_one(product)

    except DuplicateKeyError:
        raise ValueError(
            "A product with this SKU already exists."
        )

    created_product = products_collection.find_one(
        {"_id": result.inserted_id}
    )

    return format_product_response(created_product)


def get_product_by_id(product_id: str) -> dict | None:
    if not ObjectId.is_valid(product_id):
        return None

    product = products_collection.find_one(
        {"_id": ObjectId(product_id)}
    )

    if product is None:
        return None

    return format_product_response(product)


def get_products(
    page: int = 1,
    limit: int = 10,
    search: str | None = None,
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    is_active: bool | None = None,
    sort_by: str = "created_at",
    order: str = "desc",
) -> dict:
    filters: dict = {}

    if search:
        safe_search = escape(search)

        filters["$or"] = [
            {
                "name": {
                    "$regex": safe_search,
                    "$options": "i",
                }
            },
            {
                "sku": {
                    "$regex": safe_search,
                    "$options": "i",
                }
            },
            {
                "description": {
                    "$regex": safe_search,
                    "$options": "i",
                }
            },
        ]

    if category:
        filters["category"] = {
            "$regex": f"^{escape(category)}$",
            "$options": "i",
        }

    if min_price is not None or max_price is not None:
        filters["price"] = {}

        if min_price is not None:
            filters["price"]["$gte"] = min_price

        if max_price is not None:
            filters["price"]["$lte"] = max_price

    if is_active is not None:
        filters["is_active"] = is_active

    allowed_sort_fields = {
        "name",
        "sku",
        "category",
        "price",
        "quantity",
        "created_at",
        "updated_at",
    }

    if sort_by not in allowed_sort_fields:
        raise ValueError(
            "Invalid sort field. Allowed fields: "
            f"{', '.join(sorted(allowed_sort_fields))}."
        )

    normalized_order = order.lower()

    if normalized_order not in {"asc", "desc"}:
        raise ValueError(
            "Invalid sort order. Use 'asc' or 'desc'."
        )

    sort_direction = (
        ASCENDING
        if normalized_order == "asc"
        else DESCENDING
    )

    skip = (page - 1) * limit

    total = products_collection.count_documents(filters)

    products = list(
        products_collection.find(filters)
        .sort(sort_by, sort_direction)
        .skip(skip)
        .limit(limit)
    )

    formatted_products = [
        format_product_response(product)
        for product in products
    ]

    pages = ceil(total / limit) if total > 0 else 0

    return {
        "items": formatted_products,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages,
    }


def update_product(
    product_id: str,
    update_data: dict,
) -> dict | None:
    if not ObjectId.is_valid(product_id):
        return None

    if "quantity" in update_data:
        raise ValueError(
            "Product quantity cannot be updated directly."
        )

    if "sku" in update_data:
        update_data["sku"] = update_data["sku"].upper()

    update_data["updated_at"] = datetime.now(timezone.utc)

    try:
        result = products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": update_data},
        )

    except DuplicateKeyError:
        raise ValueError(
            "A product with this SKU already exists."
        )

    if result.matched_count == 0:
        return None

    updated_product = products_collection.find_one(
        {"_id": ObjectId(product_id)}
    )

    return format_product_response(updated_product)


def deactivate_product(product_id: str) -> bool:
    if not ObjectId.is_valid(product_id):
        return False

    result = products_collection.update_one(
        {
            "_id": ObjectId(product_id),
            "is_active": True,
        },
        {
            "$set": {
                "is_active": False,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )

    return result.modified_count == 1


def restore_product(product_id: str) -> bool:
    if not ObjectId.is_valid(product_id):
        return False

    result = products_collection.update_one(
        {
            "_id": ObjectId(product_id),
            "is_active": False,
        },
        {
            "$set": {
                "is_active": True,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )

    return result.modified_count == 1