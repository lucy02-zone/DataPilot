from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str

    MYSQL_HOST: str
    MYSQL_PORT: int

    MYSQL_USER: str
    MYSQL_PASSWORD: str

    MYSQL_DB: str

    SECRET_KEY: str
    ALGORITHM: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int

    OPENAI_API_KEY: str

    class Config:
        env_file = ".env"


settings = Settings()