from datetime import datetime, timezone

from bson import ObjectId


def inventory_transaction_document(
    product_id: ObjectId,
    transaction_type: str,
    quantity: int,
    previous_quantity: int,
    new_quantity: int,
    performed_by: ObjectId,
    supplier_id: ObjectId | None = None,
    reference: str | None = None,
    notes: str | None = None,
) -> dict:
    now = datetime.now(timezone.utc)

    return {
        "product_id": product_id,
        "supplier_id": supplier_id,
        "transaction_type": transaction_type,
        "quantity": quantity,
        "previous_quantity": previous_quantity,
        "new_quantity": new_quantity,
        "reference": (
            reference.strip()
            if reference
            else None
        ),
        "notes": (
            notes.strip()
            if notes
            else None
        ),
        "performed_by": performed_by,
        "created_at": now,
    }