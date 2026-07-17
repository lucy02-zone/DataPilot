from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.dataset import Dataset

from app.services.dataset_service import save_dataset
from app.services.preview_service import get_dataset_preview
from app.services.eda_service import generate_eda

router = APIRouter(
    prefix="/api/datasets",
    tags=["Datasets"]
)


@router.post("/upload")
def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    if not file.filename.endswith(".csv"):
        return {
            "error": "Only CSV files allowed"
        }

    dataset = save_dataset(
        db=db,
        file=file,
        filename=file.filename,
        user_id=1
    )

    return {
        "message": "Dataset uploaded successfully",
        "dataset_id": dataset.id,
        "rows": dataset.rows_count,
        "columns": dataset.columns_count
    }


@router.get("/preview/{dataset_id}")
def preview_dataset(
    dataset_id: int,
    db: Session = Depends(get_db)
):

    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id)
        .first()
    )

    if not dataset:
        return {
            "error": "Dataset not found"
        }

    return get_dataset_preview(
        dataset.file_path
    )


@router.get("/eda/{dataset_id}")
def dataset_eda(
    dataset_id: int,
    db: Session = Depends(get_db)
):

    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id)
        .first()
    )

    if not dataset:
        return {
            "error": "Dataset not found"
        }

    return generate_eda(
        dataset.file_path
    )