from datetime import datetime

from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100,
    )
    description: str | None = Field(
        default=None,
        max_length=500,
    )
    sku: str = Field(
        min_length=2,
        max_length=50,
    )
    category: str = Field(
        min_length=2,
        max_length=100,
    )
    price: float = Field(
        gt=0,
    )
    quantity: int = Field(
        ge=0,
    )


class ProductUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )
    description: str | None = Field(
        default=None,
        max_length=500,
    )
    sku: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )
    category: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )
    price: float | None = Field(
        default=None,
        gt=0,
    )
    is_active: bool | None = None


class ProductResponse(BaseModel):
    id: str
    name: str
    description: str | None
    sku: str
    category: str
    price: float
    quantity: int
    created_by: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


class PaginatedProductResponse(BaseModel):
    items: list[ProductResponse]
    total: int = Field(
        ge=0,
    )
    page: int = Field(
        ge=1,
    )
    limit: int = Field(
        ge=1,
    )
    pages: int = Field(
        ge=0,
    )