from datetime import datetime, timedelta, timezone

from app.database.mongodb import db


products_collection = db["products"]
transactions_collection = db["inventory_transactions"]


def get_low_stock_products(threshold: int = 10):
    products = products_collection.find(
        {
            "quantity": {"$lte": threshold},
            "is_active": True,
        }
    )

    return [
        {
            "id": str(product["_id"]),
            "name": product["name"],
            "sku": product["sku"],
            "category": product["category"],
            "quantity": product["quantity"],
            "price": product["price"],
            "is_active": product.get("is_active", True),
        }
        for product in products
    ]


def get_out_of_stock_products():
    products = products_collection.find(
        {
            "quantity": 0,
            "is_active": True,
        }
    )

    return [
        {
            "id": str(product["_id"]),
            "name": product["name"],
            "sku": product["sku"],
            "category": product["category"],
            "quantity": product["quantity"],
            "is_active": product.get("is_active", True),
        }
        for product in products
    ]


def get_inventory_value():
    pipeline = [
        {
            "$match": {
                "is_active": True,
            }
        },
        {
            "$group": {
                "_id": None,
                "total_products": {"$sum": 1},
                "total_quantity": {"$sum": "$quantity"},
                "total_inventory_value": {
                    "$sum": {
                        "$multiply": [
                            "$quantity",
                            "$price",
                        ]
                    }
                },
            }
        },
    ]

    result = list(
        products_collection.aggregate(pipeline)
    )

    if not result:
        return {
            "total_products": 0,
            "total_quantity": 0,
            "total_inventory_value": 0.0,
        }

    inventory_summary = result[0]

    return {
        "total_products": inventory_summary["total_products"],
        "total_quantity": inventory_summary["total_quantity"],
        "total_inventory_value": round(
            inventory_summary["total_inventory_value"],
            2,
        ),
    }


def get_transaction_summary(days: int = 30):
    end_date = datetime.now(timezone.utc)
    start_date = end_date - timedelta(days=days)

    pipeline = [
        {
            "$match": {
                "created_at": {
                    "$gte": start_date,
                    "$lte": end_date,
                }
            }
        },
        {
            "$group": {
                "_id": "$transaction_type",
                "total_transactions": {"$sum": 1},
                "total_quantity": {"$sum": "$quantity"},
            }
        },
        {
            "$sort": {
                "_id": 1,
            }
        },
    ]

    summary = list(
        transactions_collection.aggregate(pipeline)
    )

    return {
        "start_date": start_date,
        "end_date": end_date,
        "total_transactions": sum(
            item["total_transactions"]
            for item in summary
        ),
        "transaction_types": [
            {
                "transaction_type": item["_id"],
                "total_transactions": item["total_transactions"],
                "total_quantity": item["total_quantity"],
            }
            for item in summary
        ],
    }