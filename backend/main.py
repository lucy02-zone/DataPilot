from fastapi import FastAPI

from app.api.auth.routes import router as auth_router
from app.api.datasets.routes import router as dataset_router

from app.core.database import Base
from app.core.database import engine

from app.models.user import User
from app.models.dataset import Dataset

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DataPilot"
)

app.include_router(auth_router)
app.include_router(dataset_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to DataPilot"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }