from datetime import datetime, timezone

from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from app.database.mongodb import db
from app.models.category import category_document


categories_collection = db["categories"]


def format_category_response(category: dict) -> dict:
    return {
        "id": str(category["_id"]),
        "name": category["name"],
        "description": category.get("description"),
        "created_by": str(category["created_by"]),
        "is_active": category.get("is_active", True),
        "created_at": category["created_at"],
        "updated_at": category["updated_at"],
    }


def create_category(category_data, created_by: ObjectId) -> dict:
    category = category_document(
        name=category_data.name,
        description=category_data.description,
        created_by=created_by,
    )

    try:
        result = categories_collection.insert_one(category)
    except DuplicateKeyError:
        raise ValueError("A category with this name already exists.")

    created_category = categories_collection.find_one(
        {"_id": result.inserted_id}
    )

    return format_category_response(created_category)


def get_categories(skip: int = 0, limit: int = 10) -> list[dict]:
    categories = categories_collection.find().skip(skip).limit(limit)

    return [
        format_category_response(category)
        for category in categories
    ]


def get_category_by_id(category_id: str) -> dict | None:
    if not ObjectId.is_valid(category_id):
        return None

    category = categories_collection.find_one(
        {"_id": ObjectId(category_id)}
    )

    if category is None:
        return None

    return format_category_response(category)


def update_category(
    category_id: str,
    update_data: dict,
) -> dict | None:
    if not ObjectId.is_valid(category_id):
        return None

    if "name" in update_data:
        update_data["name"] = update_data["name"].strip()

    update_data["updated_at"] = datetime.now(timezone.utc)

    try:
        result = categories_collection.update_one(
            {"_id": ObjectId(category_id)},
            {"$set": update_data},
        )
    except DuplicateKeyError:
        raise ValueError("A category with this name already exists.")

    if result.matched_count == 0:
        return None

    updated_category = categories_collection.find_one(
        {"_id": ObjectId(category_id)}
    )

    return format_category_response(updated_category)


def delete_category(category_id: str) -> bool:
    if not ObjectId.is_valid(category_id):
        return False

    result = categories_collection.delete_one(
        {"_id": ObjectId(category_id)}
    )

    return result.deleted_count == 1