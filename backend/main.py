from fastapi import FastAPI

from app.api.auth.routes import router as auth_router

app = FastAPI(
    title="DataPilot"
)

app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to DataPilot"
    }