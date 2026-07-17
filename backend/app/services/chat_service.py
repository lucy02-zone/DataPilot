import pandas as pd
from openai import OpenAI

from app.core.config import settings

client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)


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


def ask_dataset_question(
    file_path,
    question
):

    df = load_dataset(file_path)

    context = f"""
Dataset Columns:
{list(df.columns)}

Dataset Shape:
{df.shape}

Sample Data:
{df.head(10).to_string()}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content":
                "You are an expert data analyst."
            },
            {
                "role": "user",
                "content":
                f"{context}\n\nQuestion: {question}"
            }
        ]
    )

    return {
        "question": question,
        "answer": response.choices[0].message.content
    }