import pandas as pd


def generate_eda(file_path: str):

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

    numerical_df = df.select_dtypes(
        include=["number"]
    )

    correlation = {}

    if not numerical_df.empty:
        correlation = (
            numerical_df.corr()
            .fillna(0)
            .round(2)
            .to_dict()
        )

    return {

        "shape": {
            "rows": int(df.shape[0]),
            "columns": int(df.shape[1])
        },

        "columns": list(df.columns),

        "dtypes": {
            col: str(dtype)
            for col, dtype in df.dtypes.items()
        },

        "missing_values": {
            col: int(val)
            for col, val in df.isnull().sum().items()
        },

        "duplicates": int(
            df.duplicated().sum()
        ),

        "summary_statistics": (
            df.describe(include="all")
            .fillna("")
            .to_dict()
        ),

        "correlation_matrix": correlation
    }