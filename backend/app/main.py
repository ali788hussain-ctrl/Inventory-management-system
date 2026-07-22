from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import ConnectionFailure
from app.api.v1.categories import router as category_router
from app.api.v1.auth import router as auth_router
from app.api.v1.products import router as product_router
from app.core.config import settings
from app.database.mongodb import db


app = FastAPI(
    title=f"{settings.app_name} API",
    description="Backend API for the Advanced Inventory Management System.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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

@app.on_event("startup")
async def startup_event():
    try:
        db.command("ping")
        print("MongoDB connected successfully!")
    except ConnectionFailure:
        print("Failed to connect to MongoDB.")


@app.get("/")
async def home():
    return {
        "message": "Advanced Inventory Management System API is running.",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}