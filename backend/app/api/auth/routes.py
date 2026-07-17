from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserRegister, UserLogin

from app.services.auth_service import (
    create_user,
    authenticate_user
)

from app.core.security import create_access_token

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


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = authenticate_user(
        db,
        user.email,
        user.password
    )

    if not db_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        {
            "sub": db_user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }