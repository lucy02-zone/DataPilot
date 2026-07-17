from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.dataset_service import save_dataset

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
        "dataset_id": dataset.id,
        "rows": dataset.rows_count,
        "columns": dataset.columns_count
    }