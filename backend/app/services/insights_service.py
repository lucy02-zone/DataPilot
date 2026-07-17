import pandas as pd
import ollama


def load_dataset(file_path):

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

    return df


def generate_insights(file_path):

    df = load_dataset(file_path)

    total_rows = df.shape[0]
    total_columns = df.shape[1]

    numeric_columns = list(
        df.select_dtypes(include=["number"]).columns
    )

    categorical_columns = list(
        df.select_dtypes(include=["object"]).columns
    )

    missing_values = (
        df.isnull()
        .sum()
        .sort_values(ascending=False)
        .head(5)
        .to_dict()
    )

    dataset_summary = f"""
Dataset Information

Rows: {total_rows}
Columns: {total_columns}

Numeric Columns:
{numeric_columns}

Categorical Columns:
{categorical_columns}

Missing Values:
{missing_values}

Sample Data:
{df.head(5).to_string()}
"""

    response = ollama.chat(
        model="gemma3:4b",
        messages=[
            {
                "role": "system",
                "content": """
You are a senior data analyst.

Generate 5 meaningful business insights.

Return concise insights.
"""
            },
            {
                "role": "user",
                "content": dataset_summary
            }
        ]
    )

    ai_insights = response["message"]["content"]

    return {
        "rows": total_rows,
        "columns": total_columns,
        "numeric_columns": numeric_columns,
        "categorical_columns": categorical_columns,
        "missing_values": missing_values,
        "ai_insights": ai_insights
    }