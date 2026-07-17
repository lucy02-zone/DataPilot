import pandas as pd


def get_dataset_preview(file_path: str):

    try:
        df = pd.read_csv(file_path)

    except UnicodeDecodeError:

        try:
            df = pd.read_csv(
                file_path,
                encoding="latin1"
            )

        except Exception:

            df = pd.read_csv(
                file_path,
                encoding="cp1252"
            )

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