from pydantic import BaseModel


class DatasetResponse(BaseModel):
    id: int
    name: str
    rows_count: int
    columns_count: int

    class Config:
        from_attributes = True