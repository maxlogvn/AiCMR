# Security & Guardrails

Quy tắc bảo mật và bảo vệ cho dự án AiCMR.

## Storage Strategy (Ưu tiên Public)

**Mặc định: Public (Ưu tiên tuyệt đối)** → Tối ưu SEO
- Logo, Favicon, ảnh bài viết, tài liệu hướng dẫn
- URL: `/media/{id}/{slug}` (thân thiện SEO)
- Không cần Token, Bot có thể index
- **Bắt buộc**: Set `is_public=true` khi upload

**Private (Chỉ khi nhạy cảm)**:
- Hồ sơ bệnh án chi tiết, kết quả xét nghiệm cá nhân
- URL: `/backend/api/v1/uploads/file/{id}` (kỹ thuật)
- Bắt buộc có Token, chặn Bot
- Chỉ set `is_public=false` khi thực sự cần bảo mật

## Common Rules

**Secrets**:
- ❌ KHÔNG commit file `.env`
- ❌ KHÔNG hardcode keys/tokens/passwords

**Rank System**:
- Kiểm tra quyền truy cập: `0: Guest`, `1: Member`, `3: Moderator`, `5: Admin`

**CSRF Protection**:
- POST/PUT/PATCH/DELETE yêu cầu header: `X-CSRF-Token`

**Logic Tách biệt**:
- AI Agent chỉ handle Logic
- Giao Visual/UI cho `frontend-ui-ux-engineer`

**Git Commits**:
- Sử dụng Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`

## Xử lý Lỗi Bảo Mật

**401 Unauthorized**:
- Tự động refresh token qua Axios interceptor

**403 Forbidden**:
- Thường do thiếu CSRF Token hoặc Rank thấp

## Test Accounts (Password: `User@123456`)
- Admin: `admin_test@aicmr.com` (Rank 5)
- Moderator: `mod@aicmr.com` (Rank 3)
- Member: `member@aicmr.com` (Rank 1)
- Guest: `guest@aicmr.com` (Rank 0)

Tham chiếu nhanh: `lookup/test-accounts.md`

## Tham khảo
- Lỗi phổ biến: `errors/common-errors.md`
- Docker workflow: `concepts/docker-workflow.md`
