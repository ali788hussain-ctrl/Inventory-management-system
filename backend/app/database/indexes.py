from app.database.mongodb import db


def create_indexes():

    db["products"].create_index(
        "sku",
        unique=True,
    )

    db["products"].create_index("category")
    db["products"].create_index("name")
    db["products"].create_index("is_active")

    db["suppliers"].create_index(
        "email",
        unique=True,
        sparse=True,
    )

    db["categories"].create_index(
        "name",
        unique=True,
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