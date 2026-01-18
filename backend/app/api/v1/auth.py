from datetime import timedelta, datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from jose import jwt, JWTError

from app.core.database import get_db
from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
    validate_csrf,
)
from app.core.config import get_settings
from app.core.constants import (
    RATE_LIMIT_REGISTER,
    RATE_LIMIT_LOGIN,
    RATE_LIMIT_PASSWORD_RESET,
    PASSWORD_RESET_EXPIRE_MINUTES,
    ERROR_EMAIL_EXISTS,
    ERROR_USERNAME_TAKEN,
    ERROR_INVALID_CREDENTIALS,
    ERROR_INACTIVE_USER,
)
from app.core.exceptions import InvalidCredentials, InactiveUser
from app.core.rate_limit import limiter
from app.schemas.user import (
    UserCreate,
    UserRegister,
    UserLogin,
    UserResponse,
    ForgotPassword,
    ResetPassword,
)
from app.schemas.token import Token, RefreshTokenRequest
from app.crud import (
    get_by_email,
    get_by_username,
    create,
    authenticate,
    get_by_id,
    update_password,
)
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.api.deps import get_current_active_user
from app.core.security import generate_csrf_token
from loguru import logger

settings = get_settings()
router = APIRouter()


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
@limiter.limit(RATE_LIMIT_REGISTER)
async def register(
    request: Request,
    user_in: UserRegister,
    db: AsyncSession = Depends(get_db),
    csrf_token: str = Depends(validate_csrf),
):
    # Normalize email to lowercase
    user_in.email = user_in.email.lower()

    try:
        user_data = UserCreate(
            email=user_in.email, username=user_in.username, password=user_in.password
        )
        user = await create(db, user_data)
        logger.info(f"New user registered: {user.email}")
        return user
    except IntegrityError as e:
        logger.warning(f"Race condition in registration: {e}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email or username already exists",
        )


@router.post("/login", response_model=Token)
@limiter.limit(RATE_LIMIT_LOGIN)
async def login(
    request: Request,
    user_credentials: UserLogin,
    db: AsyncSession = Depends(get_db),
    csrf_token: str = Depends(validate_csrf),
):
    # Normalize email to lowercase
    email = user_credentials.email.lower()
    logger.debug(f"Attempting login for email: {email}")

    try:
        user = await authenticate(db, email, user_credentials.password)
        if not user:
            logger.warning(f"Authentication failed for: {email}")
            raise InvalidCredentials()

        if not user.is_active:
            logger.warning(f"Inactive user attempt: {email}")
            raise InactiveUser()

        access_token = create_access_token(
            data={"sub": str(user.id), "rank": user.rank}
        )
        refresh_token = create_refresh_token(data={"sub": str(user.id)})

        # Save refresh token to database
        token_record = RefreshToken(
            user_id=user.id,
            token=refresh_token,
            expires_at=datetime.utcnow()
            + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )
        db.add(token_record)
        await db.commit()

        logger.info(f"User logged in successfully: {user.email}")
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }
    except Exception as e:
        logger.error(f"Login error for {email}: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500, detail=f"Internal server error during login: {str(e)}"
        )


@router.post("/forgot-password")
@limiter.limit(RATE_LIMIT_PASSWORD_RESET)
async def forgot_password(
    request: Request, data: ForgotPassword, db: AsyncSession = Depends(get_db)
):
    user = await get_by_email(db, data.email)
    if not user:
        # Always return same message to prevent user enumeration
        return {"message": "If the email exists, a password reset link has been sent"}

    # Tạo token reset (hết hạn sau 15 phút)
    reset_token = create_access_token(
        data={"sub": str(user.id), "scope": "reset_password"},
        expires_delta=timedelta(minutes=PASSWORD_RESET_EXPIRE_MINUTES),
    )

    logger.info(f"Password reset token generated for {user.email}")

    return {"message": "If the email exists, a password reset link has been sent"}


@router.post("/reset-password")
@limiter.limit(RATE_LIMIT_PASSWORD_RESET)
async def reset_password(
    request: Request,
    data: ResetPassword,
    db: AsyncSession = Depends(get_db),
    csrf_token: str = Depends(validate_csrf),
):
    try:
        payload = jwt.decode(
            data.token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        if payload.get("scope") != "reset_password":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mã khôi phục không hợp lệ.",
            )
        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mã khôi phục không hợp lệ.",
            )
        user_id = int(sub)
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã khôi phục không hợp lệ hoặc đã hết hạn.",
        )

    user = await get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Người dùng không tồn tại."
        )

    await update_password(db, user, data.new_password)
    logger.info(f"User {user.email} reset password successfully")
    return {"message": "Mật khẩu đã được cập nhật thành công."}


@router.post("/refresh", response_model=Token)
async def refresh_token(
    request_data: RefreshTokenRequest, db: AsyncSession = Depends(get_db)
):
    try:
        payload = verify_refresh_token(request_data.refresh_token)
        user_id = int(payload.sub) if payload.sub else None

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
            )

        user = await get_by_id(db, user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
            )

        result = await db.execute(
            select(RefreshToken).where(
                RefreshToken.token == request_data.refresh_token,
                RefreshToken.revoked == False,
                RefreshToken.expires_at > datetime.now(timezone.utc),
            )
        )
        token_record = result.scalar_one_or_none()

        if not token_record:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
            )

        token_record.revoked = True
        access_token = create_access_token(
            data={"sub": str(user.id), "rank": user.rank}
        )
        new_refresh_token = create_refresh_token(data={"sub": str(user.id)})

        new_token_record = RefreshToken(
            user_id=user.id,
            token=new_refresh_token,
            expires_at=datetime.utcnow()
            + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )
        db.add(new_token_record)
        await db.commit()

        logger.info(f"User {user.email} refreshed token")
        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
        }

    except HTTPException:
        await db.rollback()
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"Refresh token error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to refresh token",
        )


@router.post("/logout")
async def logout(
    request: Request,
    request_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    csrf_token: str = Depends(validate_csrf),
):
    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token == request_data.refresh_token,
            RefreshToken.user_id == current_user.id,
        )
    )
    token_record = result.scalar_one_or_none()

    if token_record:
        token_record.revoked = True
        await db.commit()
        logger.info(f"User {current_user.email} logged out")

    return {"message": "Logged out successfully"}
