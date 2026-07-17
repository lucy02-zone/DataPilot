import pandas as pd


def get_dataset_preview(file_path: str):
    df = pd.read_csv(file_path)

    return {
        "columns": list(df.columns),
        "rows": len(df),
        "dtypes": {
            col: str(dtype)
            for col, dtype in df.dtypes.items()
        },
        "preview": (
            df.head(10)
            .fillna("")
            .to_dict(orient="records")
        )
    }