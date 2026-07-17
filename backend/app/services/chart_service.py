import pandas as pd
import plotly.express as px


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


def create_histogram(
    file_path,
    column
):

    df = load_dataset(file_path)

    fig = px.histogram(
        df,
        x=column,
        title=f"Histogram of {column}"
    )

    return fig.to_json()


def create_scatter(
    file_path,
    x_column,
    y_column
):

    df = load_dataset(file_path)

    fig = px.scatter(
        df,
        x=x_column,
        y=y_column,
        title=f"{x_column} vs {y_column}"
    )

    return fig.to_json()


def create_boxplot(
    file_path,
    column
):

    df = load_dataset(file_path)

    fig = px.box(
        df,
        y=column,
        title=f"Box Plot of {column}"
    )

    return fig.to_json()