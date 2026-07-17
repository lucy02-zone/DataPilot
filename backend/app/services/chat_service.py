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

Summary Statistics:
{df.describe(include='all').fillna('').to_string()}
"""

    response = ollama.chat(
        model="gemma3:4b",
        messages=[
            {
                "role": "system",
                "content": """
You are an expert data analyst.
Analyze the dataset and answer the user's question clearly.
"""
            },
            {
                "role": "user",
                "content": f"{context}\n\nQuestion: {question}"
            }
        ]
    )

    return {
        "question": question,
        "answer": response["message"]["content"]
    }