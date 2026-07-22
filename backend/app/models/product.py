from datetime import datetime, timezone
from bson import ObjectId


def product_document(
    name: str,
    description: str | None,
    sku: str,
    category: str,
    price: float,
    quantity: int,
    created_by: ObjectId,
) -> dict:
    now = datetime.now(timezone.utc)

    return {
        "name": name,
        "description": description,
        "sku": sku.upper(),
        "category": category,
        "price": price,
        "quantity": quantity,
        "created_by": created_by,
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }