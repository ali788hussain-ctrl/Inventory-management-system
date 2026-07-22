from datetime import datetime

from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100,
    )
    description: str | None = Field(
        default=None,
        max_length=500,
    )


class CategoryUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )
    description: str | None = Field(
        default=None,
        max_length=500,
    )
    is_active: bool | None = None


class CategoryResponse(BaseModel):
    id: str
    name: str
    description: str | None
    created_by: str
    is_active: bool
    created_at: datetime
    updated_at: datetime