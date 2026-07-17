import os
import pandas as pd
from pathlib import Path

from sqlalchemy.orm import Session

from app.models.dataset import Dataset


UPLOAD_DIR = "uploads"


def save_dataset(
    db: Session,
    file,
    filename: str,
    user_id: int
):
    """Save uploaded dataset file and store metadata in database."""
    
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    try:
        with open(file_path, "wb") as buffer:
            content = file.file.read()
            if not content:
                raise ValueError("File is empty")
            buffer.write(content)
    except Exception as e:
        raise Exception(f"Failed to save file: {str(e)}")
    
    try:
        if filename.lower().endswith('.csv'):
            df = read_csv_with_encoding(file_path)
        elif filename.lower().endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file_path)
        else:
            raise ValueError("Unsupported file format")
        
        if df.empty:
            raise ValueError("Dataset is empty")
    
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise Exception(f"Failed to parse file: {str(e)}")
    
    try:
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
    
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise Exception(f"Failed to save dataset to database: {str(e)}")


def read_csv_with_encoding(file_path: str) -> pd.DataFrame:
    """Try reading CSV with multiple encodings."""
    encodings = ['utf-8', 'latin1', 'cp1252', 'iso-8859-1']
    
    for encoding in encodings:
        try:
            return pd.read_csv(file_path, encoding=encoding)
        except UnicodeDecodeError:
            continue
    
    raise ValueError("Could not decode file with any supported encoding")