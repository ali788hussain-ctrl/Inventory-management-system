from datetime import datetime

from pydantic import BaseModel, Field


class LowStockProductResponse(BaseModel):
    id: str
    name: str
    sku: str
    category: str
    quantity: int = Field(ge=0)
    price: float = Field(gt=0)
    is_active: bool


class OutOfStockProductResponse(BaseModel):
    id: str
    name: str
    sku: str
    category: str
    quantity: int = Field(ge=0)
    is_active: bool


class InventoryValueResponse(BaseModel):
    total_products: int = Field(ge=0)
    total_quantity: int = Field(ge=0)
    total_inventory_value: float = Field(ge=0)


class TransactionTypeSummary(BaseModel):
    transaction_type: str
    total_transactions: int = Field(ge=0)
    total_quantity: int = Field(ge=0)


class TransactionSummaryResponse(BaseModel):
    start_date: datetime
    end_date: datetime
    total_transactions: int = Field(ge=0)
    transaction_types: list[TransactionTypeSummary]