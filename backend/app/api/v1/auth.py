from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from jose import jwt, JWTError

from app.core.database import get_db
from app.core.security import create_access_token
from app.core.config import get_settings
from app.schemas.user import UserCreate, UserLogin, UserResponse, ForgotPassword, ResetPassword
from app.schemas.token import Token
from app.crud import get_by_email, get_by_username, create, authenticate, get_by_id, update_password
from loguru import logger

settings = get_settings()
router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    existing_email = await get_by_email(db, user_in.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    existing_username = await get_by_username(db, user_in.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    user = await create(db, user_in)
    logger.info(f"New user registered: {user.email}")
    return user


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await authenticate(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    access_token = create_access_token(data={"sub": str(user.id), "rank": user.rank})
    logger.info(f"User logged in: {user.email}")
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/forgot-password")
async def forgot_password(data: ForgotPassword, db: AsyncSession = Depends(get_db)):
    user = await get_by_email(db, data.email)
    if not user:
        # Để bảo mật, không xác nhận email có tồn tại hay không
        return {"message": "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được mã khôi phục."}
    
    # Tạo token reset (hết hạn sau 15 phút)
    reset_token = create_access_token(
        data={"sub": str(user.id), "scope": "reset_password"},
        expires_delta=timedelta(minutes=15)
    )
    
    # TODO: Gửi email thực tế ở đây
    logger.info(f"Password reset token for {user.email}: {reset_token}")
    
    return {
        "message": "Mã khôi phục đã được gửi vào email của bạn."
    }


@router.post("/reset-password")
async def reset_password(data: ResetPassword, db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(data.token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("scope") != "reset_password":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mã khôi phục không hợp lệ.")
        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mã khôi phục không hợp lệ.")
        user_id = int(sub)
    except (JWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mã khôi phục không hợp lệ hoặc đã hết hạn.")
    
    user = await get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Người dùng không tồn tại.")
    
    await update_password(db, user, data.new_password)
    logger.info(f"User {user.email} reset password successfully")
    return {"message": "Mật khẩu đã được cập nhật thành công."}
