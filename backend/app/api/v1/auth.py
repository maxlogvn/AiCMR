# type: ignore
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import create_access_token, verify_password, get_password_hash
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

# Simple schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class RegisterRequest(BaseModel):
    email: str
    username: str
    password: str

class MessageResponse(BaseModel):
    message: str

@router.post("/login", response_model=LoginResponse)
async def login(
    credentials: LoginRequest, 
    db: AsyncSession = Depends(get_db)
):
    """Simple login - email + password only"""
    
    # Find user by email
    result = await db.execute(
        select(User).where(User.email == credentials.email.lower())
    )
    user = result.scalar_one_or_none()
    
    # Check if user exists and password is correct
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Get string values from SQLAlchemy object
    stored_password = getattr(user, 'hashed_password')
    is_active = getattr(user, 'is_active') 
    
    if not verify_password(credentials.password, stored_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active  
    if not is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Create access token
    access_token = create_access_token(
        data={
            "sub": str(user.id), 
            "email": getattr(user, 'email'), 
            "rank": getattr(user, 'rank')
        }
    )
    
    return LoginResponse(access_token=access_token)

@router.post("/register", response_model=MessageResponse)
async def register(
    user_data: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """Simple registration"""
    
    # Check if email already exists
    result = await db.execute(
        select(User).where(User.email == user_data.email.lower())
    )
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = User(
        email=user_data.email.lower(),
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
        is_active=True,
        rank=1  # Regular user
    )
    
    db.add(new_user)
    await db.commit()
    
    return MessageResponse(message="Registration successful")

@router.post("/logout", response_model=MessageResponse)
async def logout():
    """Simple logout - just return success (client handles token removal)"""
    return MessageResponse(message="Logout successful")