from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pymongo.errors import DuplicateKeyError


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(DuplicateKeyError)
    async def duplicate_key_handler(
        request: Request,
        exc: DuplicateKeyError,
    ):
        return JSONResponse(
            status_code=409,
            content={
                "detail": "Duplicate record."
            },
        )

    @app.exception_handler(ValueError)
    async def value_error_handler(
        request: Request,
        exc: ValueError,
    ):
        return JSONResponse(
            status_code=400,
            content={
                "detail": str(exc)
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(
        request: Request,
        exc: Exception,
    ):
        return JSONResponse(
            status_code=500,
            content={
                "detail": "Internal Server Error"
            },
        )