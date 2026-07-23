from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, model_validator


class TransactionType(str, Enum):
    STOCK_IN = "STOCK_IN"
    STOCK_OUT = "STOCK_OUT"
    ADJUSTMENT_IN = "ADJUSTMENT_IN"
    ADJUSTMENT_OUT = "ADJUSTMENT_OUT"
    RETURN_IN = "RETURN_IN"
    RETURN_OUT = "RETURN_OUT"


class InventoryTransactionCreate(BaseModel):
    product_id: str
    supplier_id: str | None = None
    transaction_type: TransactionType

    quantity: int = Field(
        gt=0,
        description="Quantity must be greater than zero.",
    )

    reference: str | None = Field(
        default=None,
        max_length=100,
    )

    notes: str | None = Field(
        default=None,
        max_length=500,
    )

    @model_validator(mode="after")
    def validate_supplier_requirement(self):
        if (
            self.transaction_type == TransactionType.STOCK_IN
            and self.supplier_id is None
        ):
            raise ValueError(
                "Supplier is required for STOCK_IN transactions."
            )

        return self


class InventoryTransactionResponse(BaseModel):
    id: str
    product_id: str
    supplier_id: str | None
    transaction_type: TransactionType
    quantity: int
    previous_quantity: int
    new_quantity: int
    reference: str | None
    notes: str | None
    performed_by: str
    created_at: datetime