import os
import uuid
from datetime import datetime

import aiofiles
import magic
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status
from fastapi.responses import FileResponse, StreamingResponse
from loguru import logger
from slugify import slugify
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_active_user
from app.core.config import get_settings
from app.core.database import get_db
from app.core.security import validate_csrf
from app.crud import crud_attachment, crud_settings
from app.models.user import User
from app.schemas.attachment import AttachmentCreate, AttachmentResponse

router = APIRouter()
settings = get_settings()

# Chunk size for streaming (1MB)
CHUNK_SIZE = 1024 * 1024


def sanitize_filename(filename: str) -> str:
    """Chuyển tên file sang dạng slug an toàn, giữ nguyên extension."""
    name, ext = os.path.splitext(filename)
    return f"{slugify(name)}{ext.lower()}"


@router.post("/", response_model=AttachmentResponse)
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    csrf_token: str = Depends(validate_csrf),
):
    """
    Tải file lên hệ thống (Streaming).
    Kiểm tra Magic Bytes, Sanitize tên file và tối ưu RAM.
    """
    # 1. Lấy cấu hình từ DB hoặc dùng mặc định
    allowed_ext_str = await crud_settings.get_setting(
        db, "upload_allowed_extensions", settings.ALLOWED_EXTENSIONS
    )
    max_size_mb_str = await crud_settings.get_setting(
        db, "upload_max_size_mb", str(settings.MAX_UPLOAD_SIZE // (1024 * 1024))
    )
    max_size_mb = int(max_size_mb_str)
    max_size_bytes = max_size_mb * 1024 * 1024

    # 2. Kiểm tra định dạng file (extension) sơ bộ
    file_ext = os.path.splitext(file.filename)[1].replace(".", "").lower()
    allowed_extensions = [ext.strip().lower() for ext in allowed_ext_str.split(",")]
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Định dạng file .{file_ext} không được phép. Cho phép: {allowed_ext_str}",
        )

    # 3. Kiểm tra dung lượng file từ Header (nếu có)
    if file.size and file.size > max_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File quá lớn ({file.size / (1024*1024):.2f}MB). Tối đa: {max_size_mb}MB",
        )

    # 4. Chuẩn bị đường dẫn lưu trữ theo thời gian
    now = datetime.now()
    date_path = os.path.join(str(now.year), f"{now.month:02d}", f"{now.day:02d}")
    upload_dir = os.path.join(os.getcwd(), settings.UPLOAD_DIR, date_path)
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir, exist_ok=True)

    # 5. Sanitize và tạo tên file duy nhất
    safe_name = sanitize_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{safe_name}"
    file_full_path = os.path.join(upload_dir, unique_filename)

    # 6. Ghi file theo chunk (Streaming) để tối ưu RAM
    actual_size = 0
    try:
        async with aiofiles.open(file_full_path, "wb") as f:
            while chunk := await file.read(CHUNK_SIZE):
                actual_size += len(chunk)
                if actual_size > max_size_bytes:
                    # Nếu file thực tế lớn hơn giới hạn, xóa file và báo lỗi
                    await f.close()
                    if os.path.exists(file_full_path):
                        os.remove(file_full_path)
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"File thực tế vượt quá giới hạn {max_size_mb}MB",
                    )
                await f.write(chunk)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Lỗi khi ghi file: {e}")
        if os.path.exists(file_full_path):
            os.remove(file_full_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể lưu file vào máy chủ",
        )

    # 7. Kiểm tra Magic Bytes (Nội dung thực sự của file)
    mime = magic.Magic(mime=True)
    detected_mime = mime.from_file(file_full_path)
    # Lưu ý: Một số file text/plain có thể là bất cứ thứ gì, 
    # nhưng ít nhất chúng ta biết nó không phải malware binary nếu mong đợi text.
    # Bước này có thể mở rộng tùy theo yêu cầu khắt khe về bảo mật.

    # 8. Lưu thông tin vào Database
    relative_path = os.path.join(settings.UPLOAD_DIR, date_path, unique_filename)
    attachment_in = AttachmentCreate(
        filename=file.filename,
        file_path=relative_path,
        content_type=detected_mime or file.content_type,
        file_size=actual_size,
        user_id=current_user.id,
    )

    db_obj = await crud_attachment.create(db, attachment_in)

    # 9. Trả về kết quả
    response_obj = AttachmentResponse.model_validate(db_obj)
    # URL proxy mới để bảo mật (bao gồm prefix /backend cho Nginx)
    response_obj.url = f"/backend/api/v1/uploads/file/{db_obj.id}"

    return response_obj


@router.get("/file/{id}")
async def get_file_content(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Proxy Download: Kiểm tra quyền và stream file trả về.
    Bảo vệ file khỏi việc truy cập trực tiếp qua URL tĩnh.
    """
    db_obj = await crud_attachment.get(db, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="File không tồn tại")

    # Phân quyền: Chủ sở hữu hoặc Rank >= 3 mới được xem
    if db_obj.user_id != current_user.id and current_user.rank < 3:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập file này")

    full_path = os.path.join(os.getcwd(), db_obj.file_path)
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="Tệp tin vật lý đã bị xóa")

    # Sử dụng FileResponse để FastAPI tự động handle streaming và headers (Etag, v.v.)
    return FileResponse(
        path=full_path,
        media_type=db_obj.content_type,
        filename=db_obj.filename
    )


@router.get("/{id}", response_model=AttachmentResponse)
async def get_attachment_info(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Lấy metadata của file theo ID"""
    db_obj = await crud_attachment.get(db, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="File không tồn tại")

    if db_obj.user_id != current_user.id and current_user.rank < 3:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập thông tin này")

    response_obj = AttachmentResponse.model_validate(db_obj)
    response_obj.url = f"/backend/api/v1/uploads/file/{db_obj.id}"
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
    full_path_to_delete = os.path.join(os.getcwd(), db_obj.file_path)
    if os.path.exists(full_path_to_delete):
        try:
            os.remove(full_path_to_delete)
        except Exception as e:
            logger.error(f"Lỗi khi xóa file vật lý: {e}")

    # Xóa khỏi DB
    await crud_attachment.remove(db, id)

    return {"message": "Xóa file thành công"}
