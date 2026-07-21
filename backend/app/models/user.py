from datetime import datetime, timezone
from typing import Any


def create_user_document(
    full_name: str,
    email: str,
    hashed_password: str,
    role: str = "employee",
) -> dict[str, Any]:
    now = datetime.now(timezone.utc)

    return {
        "full_name": full_name,
        "email": email.lower().strip(),
        "hashed_password": hashed_password,
        "role": role,
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }