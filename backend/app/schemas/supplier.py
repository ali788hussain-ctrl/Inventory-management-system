from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class SupplierCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100,
    )
    email: EmailStr | None = None
    phone: str | None = Field(
        default=None,
        max_length=20,
    )
    address: str | None = Field(
        default=None,
        max_length=300,
    )


class SupplierUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )
    email: EmailStr | None = None
    phone: str | None = Field(
        default=None,
        max_length=20,
    )
    address: str | None = Field(
        default=None,
        max_length=300,
    )
    is_active: bool | None = None


class SupplierResponse(BaseModel):
    id: str
    name: str
    email: str | None
    phone: str | None
    address: str | None
    created_by: str
    is_active: bool
    created_at: datetime
    updated_at: datetime