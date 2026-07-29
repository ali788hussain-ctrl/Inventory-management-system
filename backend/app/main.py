from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import PyMongoError

from app.api.v1.auth import router as auth_router
from app.api.v1.categories import router as categories_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.inventory_transactions import router as inventory_router
from app.api.v1.products import router as products_router
from app.api.v1.reports import router as reports_router
from app.api.v1.suppliers import router as suppliers_router

from app.core.exceptions import register_exception_handlers
from app.database.mongodb import db


app = FastAPI(
    title="Advanced Inventory Management System API",
    description="Backend API for the Advanced Inventory Management System.",
    version="1.0.0",
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://inventory-management-system-ali-f345.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handlers
register_exception_handlers(app)


@app.on_event("startup")
async def startup_event():
    try:
        db.command("ping")
        print("MongoDB connected successfully!")
    except PyMongoError as error:
        print(f"MongoDB startup error: {error}")


@app.get("/")
async def root():
    return {
        "message": "Advanced Inventory Management System API is running.",
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

    except PyMongoError:
        return {
            "status": "unhealthy",
            "database": "disconnected",
        }


# API routes
# Each router already contains its own prefix, such as /auth or /dashboard.
app.include_router(
    auth_router,
    prefix="/api/v1",
)

app.include_router(
    products_router,
    prefix="/api/v1",
)

app.include_router(
    categories_router,
    prefix="/api/v1",
)

app.include_router(
    suppliers_router,
    prefix="/api/v1",
)

app.include_router(
    inventory_router,
    prefix="/api/v1",
)

app.include_router(
    dashboard_router,
    prefix="/api/v1",
)

app.include_router(
    reports_router,
    prefix="/api/v1",
)