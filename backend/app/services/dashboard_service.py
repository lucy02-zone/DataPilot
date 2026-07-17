from app.services.preview_service import get_dataset_preview
from app.services.eda_service import generate_eda
from app.services.insights_service import generate_insights


def calculate_health_score(df):

    score = 100

    missing_percent = (
        df.isnull().sum().sum()
        /
        (df.shape[0] * df.shape[1])
    ) * 100

    duplicate_percent = (
        df.duplicated().sum()
        /
        len(df)
    ) * 100

    if missing_percent > 20:
        score -= 20

    if duplicate_percent > 10:
        score -= 10

    return max(score, 0)


def build_dashboard(
    dataset_id,
    file_path
):

    preview = get_dataset_preview(
        file_path
    )

    eda = generate_eda(
        file_path
    )

    insights = generate_insights(
        file_path
    )

    import pandas as pd

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

    health_score = calculate_health_score(df)

    return {

        "dataset_id": dataset_id,

        "overview": {

            "rows": df.shape[0],

            "columns": df.shape[1],

            "numeric_columns":
            len(
                df.select_dtypes(
                    include="number"
                ).columns
            ),

            "categorical_columns":
            len(
                df.select_dtypes(
                    include="object"
                ).columns
            ),

            "health_score":
            health_score

        },

        "preview":
        preview,

        "eda":
        eda,

        "insights":
        insights

    }