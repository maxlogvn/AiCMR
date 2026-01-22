from pathlib import Path
from typing import Optional
import aiofiles
from app.core.config import get_settings
from loguru import logger


class PostStorageService:
    """Service quản lý file storage cho bài viết"""

    def __init__(self):
        self.settings = get_settings()
        # Tạo thư mục storage/posts
        self.storage_dir = Path(self.settings.UPLOAD_DIR) / "posts"
        self.storage_dir.mkdir(parents=True, exist_ok=True)

    def _get_file_path(self, post_id: int, slug: str) -> Path:
        """Tạo đường dẫn file cho bài viết

        File naming convention: {post_id}_{slug}.md
        Ví dụ: 1_gioi-thieu-ve-ai-va-machine-learning.md
        """
        return self.storage_dir / f"{post_id}_{slug}.md"

    async def save_post_content(
        self,
        post_id: int,
        slug: str,
        content: str
    ) -> Path:
        """Lưu nội dung markdown vào file

        Args:
            post_id: ID của bài viết
            slug: Slug của bài viết
            content: Nội dung markdown

        Returns:
            Path: Đường dẫn đến file đã lưu

        Raises:
            IOError: Nếu không thể lưu file
        """
        try:
            file_path = self._get_file_path(post_id, slug)
            async with aiofiles.open(file_path, mode='w', encoding='utf-8') as f:
                await f.write(content)
            logger.info(f"Đã lưu nội dung bài viết: {file_path}")
            return file_path
        except Exception as e:
            logger.error(f"Lỗi khi lưu bài viết {post_id}: {e}")
            raise

    async def read_post_content(
        self,
        post_id: int,
        slug: str
    ) -> Optional[str]:
        """Đọc nội dung markdown từ file

        Args:
            post_id: ID của bài viết
            slug: Slug của bài viết

        Returns:
            Optional[str]: Nội dung markdown hoặc None nếu file không tồn tại
        """
        try:
            file_path = self._get_file_path(post_id, slug)
            if not file_path.exists():
                logger.warning(f"File bài viết không tồn tại: {file_path}")
                return None

            async with aiofiles.open(file_path, mode='r', encoding='utf-8') as f:
                content = await f.read()
            return content
        except Exception as e:
            logger.error(f"Lỗi khi đọc bài viết {post_id}: {e}")
            raise

    async def update_post_content(
        self,
        post_id: int,
        slug: str,
        content: str
    ) -> Path:
        """Cập nhật nội dung markdown

        Args:
            post_id: ID của bài viết
            slug: Slug của bài viết
            content: Nội dung markdown mới

        Returns:
            Path: Đường dẫn đến file đã cập nhật
        """
        return await self.save_post_content(post_id, slug, content)

    async def delete_post_content(
        self,
        post_id: int,
        slug: str
    ) -> bool:
        """Xóa file markdown

        Args:
            post_id: ID của bài viết
            slug: Slug của bài viết

        Returns:
            bool: True nếu xóa thành công, False nếu file không tồn tại
        """
        try:
            file_path = self._get_file_path(post_id, slug)
            if file_path.exists():
                file_path.unlink()
                logger.info(f"Đã xóa nội dung bài viết: {file_path}")
                return True
            logger.warning(f"File bài viết không tồn tại: {file_path}")
            return False
        except Exception as e:
            logger.error(f"Lỗi khi xóa bài viết {post_id}: {e}")
            raise
