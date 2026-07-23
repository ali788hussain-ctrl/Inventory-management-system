from datetime import datetime, timezone

from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from app.database.mongodb import db
from app.models.supplier import supplier_document


suppliers_collection = db["suppliers"]


def format_supplier_response(supplier: dict) -> dict:
    return {
        "id": str(supplier["_id"]),
        "name": supplier["name"],
        "email": supplier.get("email"),
        "phone": supplier.get("phone"),
        "address": supplier.get("address"),
        "created_by": str(supplier["created_by"]),
        "is_active": supplier.get("is_active", True),
        "created_at": supplier["created_at"],
        "updated_at": supplier["updated_at"],
    }


def create_supplier(supplier_data, created_by: ObjectId):
    supplier = supplier_document(
        supplier_data.name,
        supplier_data.email,
        supplier_data.phone,
        supplier_data.address,
        created_by,
    )

    try:
        result = suppliers_collection.insert_one(supplier)
    except DuplicateKeyError:
        raise ValueError(
            "Supplier name or email already exists."
        )

    return format_supplier_response(
        suppliers_collection.find_one(
            {"_id": result.inserted_id}
        )
    )


def get_suppliers(skip=0, limit=10):
    suppliers = suppliers_collection.find().skip(skip).limit(limit)

    return [
        format_supplier_response(supplier)
        for supplier in suppliers
    ]


def get_supplier_by_id(supplier_id: str):
    if not ObjectId.is_valid(supplier_id):
        return None

    supplier = suppliers_collection.find_one(
        {"_id": ObjectId(supplier_id)}
    )

    if supplier is None:
        return None

    return format_supplier_response(supplier)


def update_supplier(
    supplier_id: str,
    update_data: dict,
):
    if not ObjectId.is_valid(supplier_id):
        return None

    update_data["updated_at"] = datetime.now(
        timezone.utc
    )

    try:
        result = suppliers_collection.update_one(
            {"_id": ObjectId(supplier_id)},
            {"$set": update_data},
        )
    except DuplicateKeyError:
        raise ValueError(
            "Supplier name or email already exists."
        )

    if result.matched_count == 0:
        return None

    return format_supplier_response(
        suppliers_collection.find_one(
            {"_id": ObjectId(supplier_id)}
        )
    )


def delete_supplier(supplier_id: str):
    if not ObjectId.is_valid(supplier_id):
        return False

    result = suppliers_collection.delete_one(
        {"_id": ObjectId(supplier_id)}
    )

    return result.deleted_count == 1