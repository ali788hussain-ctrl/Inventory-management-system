from datetime import datetime, timezone

from bson import ObjectId


def category_document(
    name: str,
    description: str | None,
    created_by: ObjectId,
) -> dict:
    now = datetime.now(timezone.utc)

    return {
        "name": name.strip(),
        "description": description,
        "created_by": created_by,
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }