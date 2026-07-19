from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import ConnectionFailure

from app.core.config import settings
from app.database.mongodb import db

app = FastAPI(
    title=f"{settings.app_name} API",
    version="1.0.0",
    description="Backend API for the Advanced Inventory Management System",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": f"{settings.app_name} API is running.",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
    }

app.on_event("startup")
async def startup_event():
    try:
        db.command("ping")
        print("MongoDB connected successfully!")
    except ConnectionFailure:
        print("Failed to connect to MongoDB.")