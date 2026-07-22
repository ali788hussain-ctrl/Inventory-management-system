from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies.auth import get_current_user
from app.database.mongodb import db
from app.schemas.user import (
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)
from app.services.auth_service import authenticate_user, register_user
from app.utils.jwt import create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


def format_user_response(user: dict) -> UserResponse:
    return UserResponse(
        id=str(user["_id"]),
        full_name=user["full_name"],
        email=user["email"],
        role=user["role"],
        is_active=user["is_active"],
    )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(user_data: UserRegister) -> UserResponse:
    try:
        user = register_user(db, user_data)

        return format_user_response(user)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(user_data: UserLogin) -> TokenResponse:
    user = authenticate_user(
        db=db,
        email=user_data.email,
        password=user_data.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        subject=str(user["_id"])
    )

    return TokenResponse(
        access_token=access_token,
    )

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_my_profile(
    current_user: dict = Depends(get_current_user),
) -> UserResponse:
    return format_user_response(current_user)