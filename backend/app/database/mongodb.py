from pymongo import MongoClient

from app.core.config import settings

client = MongoClient(settings.mongodb_url)

db = client[settings.database_name]

db["products"].create_index(
    "sku",
    unique=True,
)

db["categories"].create_index(
    "name",
    unique=True,
)

db["suppliers"].create_index(
    "name",
    unique=True,
)

db["suppliers"].create_index(
    "email",
    unique=True,
    sparse=True,
)

db["inventory_transactions"].create_index(
    "product_id"
)

db["inventory_transactions"].create_index(
    "created_at"
)

db["inventory_transactions"].create_index(
    [
        ("product_id", 1),
        ("created_at", -1),
    ]
)