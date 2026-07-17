import pandas as pd
from prophet import Prophet


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


def generate_forecast(
    file_path,
    date_column,
    target_column,
    periods=30
):

    df = load_dataset(file_path)

    forecast_df = df[[date_column, target_column]].copy()

    forecast_df.columns = ["ds", "y"]

    forecast_df["ds"] = pd.to_datetime(
        forecast_df["ds"]
    )

    model = Prophet()

    model.fit(forecast_df)

    future = model.make_future_dataframe(
        periods=periods
    )

    forecast = model.predict(future)

    return {
        "forecast": forecast[
            ["ds", "yhat", "yhat_lower", "yhat_upper"]
        ]
        .tail(periods)
        .to_dict(orient="records")
    }