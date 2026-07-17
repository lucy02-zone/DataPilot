import os
import pandas as pd

from sqlalchemy.orm import Session

from app.models.dataset import Dataset


UPLOAD_DIR = "uploads"


def save_dataset(
    db: Session,
    file,
    filename: str,
    user_id: int
):

    os.makedirs(
        UPLOAD_DIR,
        exist_ok=True
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    df = pd.read_csv(file_path)

    dataset = Dataset(
        user_id=user_id,
        name=filename,
        file_path=file_path,
        rows_count=len(df),
        columns_count=len(df.columns)
    )

    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    return dataset