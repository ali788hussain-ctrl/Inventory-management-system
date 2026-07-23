from datetime import datetime, timezone

from bson import ObjectId


def supplier_document(
    name: str,
    email: str | None,
    phone: str | None,
    address: str | None,
    created_by: ObjectId,
) -> dict:
    now = datetime.now(timezone.utc)

    return {
        "name": name.strip(),
        "email": email.lower().strip() if email else None,
        "phone": phone.strip() if phone else None,
        "address": address.strip() if address else None,
        "created_by": created_by,
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }