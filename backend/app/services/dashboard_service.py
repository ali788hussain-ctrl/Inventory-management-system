from datetime import datetime, timedelta, timezone

from app.database.mongodb import db

products_collection = db["products"]
categories_collection = db["categories"]
suppliers_collection = db["suppliers"]
transactions_collection = db["inventory_transactions"]


def get_dashboard_statistics():
    now = datetime.now(timezone.utc)
    last_30_days = now - timedelta(days=30)

    total_products = products_collection.count_documents({})
    active_products = products_collection.count_documents(
        {"is_active": True}
    )

    total_categories = categories_collection.count_documents({})
    total_suppliers = suppliers_collection.count_documents(
        {"is_active": True}
    )

    pipeline = [
        {
            "$group": {
                "_id": None,
                "total_stock": {
                    "$sum": "$quantity"
                }
            }
        }
    ]

    stock_result = list(
        products_collection.aggregate(pipeline)
    )

    total_stock = (
        stock_result[0]["total_stock"]
        if stock_result
        else 0
    )

    low_stock_products = products_collection.count_documents(
        {
            "quantity": {"$lte": 10},
            "is_active": True,
        }
    )

    recent_transactions = (
        transactions_collection.count_documents(
            {
                "created_at": {
                    "$gte": last_30_days
                }
            }
        )
    )

    return {
        "total_products": total_products,
        "active_products": active_products,
        "total_categories": total_categories,
        "total_suppliers": total_suppliers,
        "total_stock": total_stock,
        "low_stock_products": low_stock_products,
        "recent_transactions": recent_transactions,
    }