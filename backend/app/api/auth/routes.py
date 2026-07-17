from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserRegister
from app.services.auth_service import create_user

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    created_user = create_user(
        db,
        user.username,
        user.email,
        user.password
    )

    return {
        "message": "User registered",
        "user_id": created_user.id
    }