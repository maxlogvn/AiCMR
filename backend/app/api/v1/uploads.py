import os
import uuid
from datetime import datetime

import aiofiles
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger

from app.core.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.crud import crud_attachment, crud_settings
from app.schemas.attachment import AttachmentResponse, AttachmentCreate
from app.core.config import get_settings
from app.core.security import validate_csrf

router = APIRouter()
settings = get_settings()


@router.post("/", response_model=AttachmentResponse)
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Tải file lên hệ thống.
    Kiểm tra định dạng và dung lượng từ cấu hình trong Database hoặc mặc định từ Config.
    """
    # 1. Lấy cấu hình từ DB hoặc dùng mặc định
    allowed_ext_str = await crud_settings.get_setting(
        db, "upload_allowed_extensions", settings.ALLOWED_EXTENSIONS
    )
    max_size_mb_str = await crud_settings.get_setting(
        db, "upload_max_size_mb", str(settings.MAX_UPLOAD_SIZE // (1024 * 1024))
    )
    max_size_mb = int(max_size_mb_str)

    allowed_extensions = [ext.strip().lower() for ext in allowed_ext_str.split(",")]
    max_size_bytes = max_size_mb * 1024 * 1024

    # 2. Kiểm tra định dạng file
    file_ext = os.path.splitext(file.filename)[1].replace(".", "").lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Định dạng file .{file_ext} không được phép. Cho phép: {allowed_ext_str}",
        )

    # 3. Kiểm tra dung lượng file (từ header trước khi đọc)
    if file.size and file.size > max_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File quá lớn ({file.size / (1024*1024):.2f}MB). Tối đa: {max_size_mb}MB",
        )

    content = await file.read()
    file_size = len(content)

    if file_size > max_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File quá lớn ({file_size / (1024*1024):.2f}MB). Tối đa: {max_size_mb}MB",
        )

    # 4. Tạo thư mục lưu trữ theo thời gian
    now = datetime.now()
    date_path = os.path.join(str(now.year), f"{now.month:02d}", f"{now.day:02d}")
    # Đảm bảo UPLOAD_DIR là đường dẫn tuyệt đối hoặc tương đối ổn định
    user_upload_dir = os.path.join(os.getcwd(), settings.UPLOAD_DIR, date_path)

    if not os.path.exists(user_upload_dir):
        os.makedirs(user_upload_dir, exist_ok=True)

    # 5. Lưu file với tên duy nhất
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_full_path = os.path.join(user_upload_dir, unique_filename)

    try:
        async with aiofiles.open(file_full_path, "wb") as f:
            await f.write(content)
    except Exception as e:
        logger.error(f"Lỗi khi ghi file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể lưu file vào máy chủ",
        )

    # 6. Lưu thông tin vào Database
    # Lưu đường dẫn tương đối so với root để FE/BE đều dùng được
    # Ví dụ: static/uploads/2026/01/18/...
    relative_path = os.path.join(settings.UPLOAD_DIR, date_path, unique_filename)

    attachment_in = AttachmentCreate(
        filename=file.filename,
        file_path=relative_path,
        content_type=file.content_type,
        file_size=file_size,
        user_id=current_user.id,
    )

    db_obj = await crud_attachment.create(db, attachment_in)

    # 7. Trả về thông tin kèm URL
    # URL này FE sẽ dùng để hiển thị hoặc tải về (truy cập qua frontend/public/uploads)
    response_obj = AttachmentResponse.model_validate(db_obj)

    # Chuyển đổi static/uploads/... thành /uploads/... để FE truy cập trực tiếp qua domain chính
    fe_url = f"/{relative_path.replace('static/', '', 1)}"
    response_obj.url = fe_url

    return response_obj


@router.get("/{id}", response_model=AttachmentResponse)
async def get_attachment_info(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Lấy thông tin file theo ID"""
    db_obj = await crud_attachment.get(db, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="File không tồn tại")

    if db_obj.user_id != current_user.id and current_user.rank < 3:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập file này")

    response_obj = AttachmentResponse.model_validate(db_obj)
    response_obj.url = f"/{db_obj.file_path.replace('static/', '', 1)}"
    return response_obj


@router.delete("/{id}")
async def delete_attachment(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    csrf_token: str = Depends(validate_csrf),
):
    """Xóa file khỏi hệ thống"""
    db_obj = await crud_attachment.get(db, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="File không tồn tại")

    if db_obj.user_id != current_user.id and current_user.rank < 5:
        raise HTTPException(status_code=403, detail="Không có quyền xóa file này")

    # Xóa file vật lý
    # Đảm bảo dùng đường dẫn tuyệt đối để xóa
    full_path_to_delete = os.path.join(os.getcwd(), db_obj.file_path)
    if os.path.exists(full_path_to_delete):
        try:
            os.remove(full_path_to_delete)
        except Exception as e:
            logger.error(f"Lỗi khi xóa file vật lý: {e}")

    # Xóa khỏi DB
    await crud_attachment.remove(db, id)

    return {"message": "Xóa file thành công"}
