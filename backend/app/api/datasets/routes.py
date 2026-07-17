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
from app.services.chart_service import (
    create_histogram,
    create_scatter,
    create_boxplot
)
from app.schemas.chat import ChatRequest

from app.services.chat_service import (
    ask_dataset_question
)
from app.services.insights_service import generate_insights
from app.services.report_service import create_report
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
@router.get("/chart/histogram/{dataset_id}/{column}")
def histogram_chart(
    dataset_id: int,
    column: str,
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

    return create_histogram(
        dataset.file_path,
        column
    )
@router.get(
    "/chart/scatter/{dataset_id}/{x_column}/{y_column}"
)
def scatter_chart(
    dataset_id: int,
    x_column: str,
    y_column: str,
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

    return create_scatter(
        dataset.file_path,
        x_column,
        y_column
    )
@router.get(
    "/chart/boxplot/{dataset_id}/{column}"
)
def boxplot_chart(
    dataset_id: int,
    column: str,
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

    return create_boxplot(
        dataset.file_path,
        column
    )
@router.post("/chat/{dataset_id}")
def dataset_chat(
    dataset_id: int,
    payload: ChatRequest,
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

    return ask_dataset_question(
        dataset.file_path,
        payload.question
    )
@router.get("/insights/{dataset_id}")
def dataset_insights(
    dataset_id: int,
    db: Session = Depends(get_db)
):

    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    return generate_insights(
        dataset.file_path
    )
@router.get("/report/{dataset_id}")
def generate_report(
    dataset_id: int,
    db: Session = Depends(get_db)
):

    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id)
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    return create_report(
        dataset_id,
        dataset.file_path
    )