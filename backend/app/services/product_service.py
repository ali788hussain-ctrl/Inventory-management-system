from datetime import datetime, timezone

from bson import ObjectId
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
        raise ValueError("A product with this SKU already exists.")

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


def get_products(skip: int = 0, limit: int = 10) -> list[dict]:
    products = products_collection.find().skip(skip).limit(limit)

    return [
        format_product_response(product)
        for product in products
    ]


def update_product(product_id: str, update_data: dict) -> dict | None:
    if not ObjectId.is_valid(product_id):
        return None

    update_data["updated_at"] = datetime.now(timezone.utc)

    result = products_collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": update_data},
    )

    if result.matched_count == 0:
        return None

    updated_product = products_collection.find_one(
        {"_id": ObjectId(product_id)}
    )

    return format_product_response(updated_product)


def delete_product(product_id: str) -> bool:
    if not ObjectId.is_valid(product_id):
        return False

    result = products_collection.delete_one(
        {"_id": ObjectId(product_id)}
    )

    return result.deleted_count == 1