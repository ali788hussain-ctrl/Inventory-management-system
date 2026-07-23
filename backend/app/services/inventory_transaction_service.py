from bson import ObjectId
from pymongo import ReturnDocument

from app.database.mongodb import db
from app.models.inventory_transaction import (
    inventory_transaction_document,
)
from app.schemas.inventory_transaction import TransactionType


products_collection = db["products"]
suppliers_collection = db["suppliers"]
transactions_collection = db["inventory_transactions"]


def format_inventory_transaction_response(
    transaction: dict,
) -> dict:
    return {
        "id": str(transaction["_id"]),
        "product_id": str(transaction["product_id"]),
        "supplier_id": (
            str(transaction["supplier_id"])
            if transaction.get("supplier_id")
            else None
        ),
        "transaction_type": transaction["transaction_type"],
        "quantity": transaction["quantity"],
        "previous_quantity": transaction["previous_quantity"],
        "new_quantity": transaction["new_quantity"],
        "reference": transaction.get("reference"),
        "notes": transaction.get("notes"),
        "performed_by": str(transaction["performed_by"]),
        "created_at": transaction["created_at"],
    }


def get_quantity_change(
    transaction_type: TransactionType,
    quantity: int,
) -> int:
    if transaction_type in {
        TransactionType.STOCK_IN,
        TransactionType.RETURN_IN,
        TransactionType.ADJUSTMENT_IN,
    }:
        return quantity

    if transaction_type in {
        TransactionType.STOCK_OUT,
        TransactionType.RETURN_OUT,
        TransactionType.ADJUSTMENT_OUT,
    }:
        return -quantity

    raise ValueError("Unsupported transaction type.")


def create_inventory_transaction(
    transaction_data,
    performed_by: ObjectId,
):
    if not ObjectId.is_valid(transaction_data.product_id):
        raise ValueError("Invalid product ID.")

    product_id = ObjectId(transaction_data.product_id)

    product = products_collection.find_one(
        {
            "_id": product_id,
            "is_active": True,
        }
    )

    if product is None:
        raise LookupError("Product not found or inactive.")

    supplier_id = None

    if transaction_data.supplier_id:
        if not ObjectId.is_valid(transaction_data.supplier_id):
            raise ValueError("Invalid supplier ID.")

        supplier_id = ObjectId(transaction_data.supplier_id)

        supplier = suppliers_collection.find_one(
            {
                "_id": supplier_id,
                "is_active": True,
            }
        )

        if supplier is None:
            raise LookupError("Supplier not found or inactive.")

    previous_quantity = product.get("quantity", 0)

    quantity_change = get_quantity_change(
        transaction_type=transaction_data.transaction_type,
        quantity=transaction_data.quantity,
    )

    new_quantity = previous_quantity + quantity_change

    if new_quantity < 0:
        raise ValueError(
            f"Insufficient stock. Available quantity is "
            f"{previous_quantity}."
        )

    updated_product = products_collection.find_one_and_update(
        {
            "_id": product_id,
            "quantity": previous_quantity,
        },
        {
            "$set": {
                "quantity": new_quantity,
            }
        },
        return_document=ReturnDocument.AFTER,
    )

    if updated_product is None:
        raise RuntimeError(
            "Product stock changed during the transaction. "
            "Please try again."
        )

    transaction = inventory_transaction_document(
        product_id=product_id,
        supplier_id=supplier_id,
        transaction_type=transaction_data.transaction_type.value,
        quantity=transaction_data.quantity,
        previous_quantity=previous_quantity,
        new_quantity=new_quantity,
        reference=transaction_data.reference,
        notes=transaction_data.notes,
        performed_by=performed_by,
    )

    try:
        result = transactions_collection.insert_one(
            transaction
        )
    except Exception:
        products_collection.update_one(
            {
                "_id": product_id,
                "quantity": new_quantity,
            },
            {
                "$set": {
                    "quantity": previous_quantity,
                }
            },
        )

        raise

    created_transaction = transactions_collection.find_one(
        {
            "_id": result.inserted_id,
        }
    )

    return format_inventory_transaction_response(
        created_transaction
    )


def get_inventory_transactions(
    skip: int = 0,
    limit: int = 20,
    product_id: str | None = None,
    transaction_type: str | None = None,
):
    filters = {}

    if product_id:
        if not ObjectId.is_valid(product_id):
            raise ValueError("Invalid product ID.")

        filters["product_id"] = ObjectId(product_id)

    if transaction_type:
        try:
            valid_transaction_type = TransactionType(
                transaction_type
            )
        except ValueError as error:
            raise ValueError(
                "Invalid transaction type."
            ) from error

        filters["transaction_type"] = (
            valid_transaction_type.value
        )

    transactions = (
        transactions_collection
        .find(filters)
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )

    return [
        format_inventory_transaction_response(transaction)
        for transaction in transactions
    ]


def get_inventory_transaction_by_id(
    transaction_id: str,
):
    if not ObjectId.is_valid(transaction_id):
        return None

    transaction = transactions_collection.find_one(
        {
            "_id": ObjectId(transaction_id),
        }
    )

    if transaction is None:
        return None

    return format_inventory_transaction_response(
        transaction
    )