from pymongo.database import Database

from app.models.user import create_user_document
from app.schemas.user import UserRegister
from app.utils.security import hash_password, verify_password


def get_user_by_email(db: Database, email: str) -> dict | None:
    return db["users"].find_one(
        {"email": email.lower().strip()}
    )


def register_user(
    db: Database,
    user_data: UserRegister,
) -> dict:
    existing_user = get_user_by_email(db, user_data.email)

    if existing_user:
        raise ValueError("A user with this email already exists.")

    user_document = create_user_document(
        full_name=user_data.full_name.strip(),
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
    )

    result = db["users"].insert_one(user_document)

    user_document["_id"] = result.inserted_id

    return user_document


def authenticate_user(
    db: Database,
    email: str,
    password: str,
) -> dict | None:
    user = get_user_by_email(db, email)

    if user is None:
        return None

    if not user.get("is_active", False):
        return None

    if not verify_password(
        password,
        user["hashed_password"],
    ):
        return None

    return user