# AiCMR Context

Hệ thống context cho dự án AiCMR - Medical Records Management System tích hợp AI.

## 📖 Sử Dụng

**Quick Start**:
- `navigation.md` - Đi tới đây trước tiên! Map toàn bộ context

**Cần gì?**
- Xem Navigation → chọn category phù hợp → đọc file cần thiết
- Mỗi file < 200 dòng (MVI standard)

## 🗂 Cấu Trúc

```
.context/
├── README.md                           # File này
├── navigation.md                       # 📍 Bắt đầu từ đây
├── concepts/ (13 files)                # Khái niệm cốt lõi
│   ├── docker-workflow.md              # Docker commands
│   ├── code-style.md                  # Python/FastAPI style
│   ├── code-style-frontend.md          # TypeScript/Next.js style
│   ├── security.md                    # Bảo mật & guardrails
│   ├── architecture.md                # Kiến trúc hệ thống
│   ├── authentication-system.md        # JWT, Rank, CSRF, Rate Limiting
│   ├── database-schema.md             # Schema (User, Attachment, Settings)
│   ├── logging.md                     # Loguru logging
│   ├── upload-system.md               # Upload Private Storage + Streaming
│   ├── optimization.md                # Tối ưu hiệu năng frontend
│   ├── local-domain-setup.md          # Cấu hình aicmr.local (MỚI)
│   └── phpmyadmin.md                 # Quản lý MySQL qua web (MỚI)
├── examples/ (3 files)                 # Code hoạt động
│   ├── api-endpoint.md                # API endpoint mẫu
│   ├── api-call.md                    # Gọi API từ frontend
│   ├── docker-commands.md             # Lệnh Docker cụ thể
│   └── test-example.md                # Pytest mẫu
├── guides/ (3 files)                    # Hướng dẫn
│   ├── getting-started.md             # Setup môi trường
│   ├── debugging.md                   # Xử lý lỗi
│   └── ai-agent-workflow.md           # Quy trình AI Agents (MỚI)
├── lookup/ (6 files)                   # Tham chiếu nhanh
│   ├── test-accounts.md               # Tài khoản test
│   ├── env-variables.md               # Biến môi trường (.env)
│   ├── api-endpoints.md               # Map tất cả API endpoints
│   ├── frontend-libraries.md           # Thư viện frontend (shadcn, Zustand...)
│   ├── folder-structure.md            # Cấu trúc thư mục
│   └── commands-quickref.md           # Lệnh Docker nhanh
└── errors/ (1 file)                    # Lỗi phổ biến
    └── common-errors.md                # 401, 403, test failures
```

## 🎯 Nguyên Tắc MVI

- **Khái niệm cốt lõi**: 1-3 câu
- **Điểm chính**: 3-5 gạch đầu dòng
- **Ví dụ tối thiểu**: < 10 dòng code
- **Kích thước file**: < 200 dòng
- **Tham chiếu**: Liên kết đến docs đầy đủ

## 📌 Tài Liệu Chính

- `/AGENTS.md` - Hướng dẫn đầy đủ cho AI Agents
- `/README.md` - Tổng quan dự án
- `/backend/README.md` - Chi tiết backend
- `/frontend/README.md` - Chi tiết frontend

## 🔍 Tìm Kiếm Nhanh

**Setup mới?** → `guides/getting-started.md`

**Docker commands?** → `concepts/docker-workflow.md`

**Code backend?** → `concepts/code-style.md`

**Code frontend?** → `concepts/code-style-frontend.md`

**Authentication?** → `concepts/authentication-system.md`

**Database?** → `concepts/database-schema.md`

**Upload file?** → `concepts/upload-system.md`

**Có lỗi?** → `errors/common-errors.md`

**API endpoints?** → `lookup/api-endpoints.md`

**Gọi API frontend?** → `examples/api-call.md`

**Environment variables?** → `lookup/env-variables.md`

**Frontend libraries?** → `lookup/frontend-libraries.md`

**Test accounts?** → `lookup/test-accounts.md`

**Logging?** → `concepts/logging.md`

**Optimization?** → `concepts/optimization.md`

**Local domain?** → `concepts/local-domain-setup.md`

**phpMyAdmin?** → `concepts/phpmyadmin.md`

**AI Agent workflow?** → `guides/ai-agent-workflow.md`

**Lệnh Docker nhanh?** → `lookup/commands-quickref.md`

## ✅ Tiêu Chuẩn Thành Công

- [ ] Mọi file < 200 dòng? (28 files, ~5,200 lines)
- [ ] Cấu trúc dựa trên chức năng?
- [ ] Links tham chiếu hoạt động?
- [ ] Có thể tìm được thông tin trong < 30 giây?

---
*Cập nhật: 20/01/2026*
