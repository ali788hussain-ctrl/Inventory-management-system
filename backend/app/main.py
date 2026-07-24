from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import ConnectionFailure

from app.api.v1.auth import router as auth_router
from app.api.v1.categories import router as category_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.inventory_transactions import (
    router as inventory_transaction_router,
)
from app.api.v1.products import router as product_router
from app.api.v1.reports import router as reports_router
from app.api.v1.suppliers import router as supplier_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.database.indexes import create_indexes
from app.database.mongodb import db


app = FastAPI(
    title=f"{settings.app_name} API",
    description=(
        "Backend API for the Advanced Inventory Management System."
    ),
    version="1.0.0",
)

register_exception_handlers(app)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    auth_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    product_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    category_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    supplier_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    inventory_transaction_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    dashboard_router,
    prefix=settings.api_v1_prefix,
)

app.include_router(
    reports_router,
    prefix=settings.api_v1_prefix,
)


@app.on_event("startup")
async def startup_event():
    try:
        db.command("ping")
        create_indexes()
        print("MongoDB connected successfully!")
        print("Database indexes created successfully!")

    except ConnectionFailure:
        print("Failed to connect to MongoDB.")

    except Exception as error:
        print(f"Application startup error: {error}")


@app.get("/")
async def home():
    return {
        "message": (
            "Advanced Inventory Management System API is running."
        ),
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    try:
        db.command("ping")

        return {
            "status": "healthy",
            "database": "connected",
        }

    except ConnectionFailure:
        return {
            "status": "unhealthy",
            "database": "disconnected",
        }