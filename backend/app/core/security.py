from datetime import datetime, timedelta, timezone
from typing import Optional
import secrets
from jose import JWTError, ExpiredSignatureError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request, Header
from fastapi.security import OAuth2PasswordBearer
from loguru import logger

from app.core.config import get_settings
from app.schemas.token import TokenPayload

settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def generate_csrf_token() -> str:
    """Generate a random CSRF token"""
    return secrets.token_urlsafe(32)


def validate_csrf(
    request: Request, x_csrf_token: str = Header(None, alias="X-CSRF-Token")
):
    """
    Validate CSRF token.

    - In DEBUG mode (development): Optional validation for easier testing
    - In production mode: Strict validation required
    """
    # Development mode: Allow requests without CSRF token for easier testing
    if settings.DEBUG:
        if x_csrf_token is None:
            logger.debug("CSRF token not provided in header - allowing (DEBUG mode)")
            return None
        # Still validate if token is provided
        session_token = request.session.get("csrf_token")
        if session_token and session_token != x_csrf_token:
            logger.warning(f"CSRF validation failed in DEBUG mode - allowing anyway")
        return x_csrf_token

    # Production mode: Strict validation required
    if x_csrf_token is None:
        logger.warning("CSRF token not provided in header - rejecting (production)")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CSRF token required"
        )

    session_token = request.session.get("csrf_token")
    if not session_token:
        logger.warning("No CSRF token in session - rejecting (production)")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No CSRF session - please refresh the page"
        )

    if session_token != x_csrf_token:
        logger.warning(
            f"CSRF validation failed. Session: {str(session_token)[:8]}..., Header: {str(x_csrf_token)[:8]}..."
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid CSRF token"
        )

    return x_csrf_token


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


async def verify_token(token: str = Depends(oauth2_scheme)) -> TokenPayload:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    expired_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token has expired",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except ExpiredSignatureError:
        raise expired_exception
    except JWTError:
        raise credentials_exception
    return token_data


def verify_refresh_token(token: str) -> TokenPayload:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid refresh token",
    )

    expired_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Refresh token has expired",
    )

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)

        if payload.get("type") != "refresh":
            raise credentials_exception

        return token_data
    except ExpiredSignatureError:
        raise expired_exception
    except JWTError:
        raise credentials_exception
