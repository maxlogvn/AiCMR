# Navigation - AiCMR Context

Map nhanh các phần của context AiCMR.

## Cấu Trúc
```
.context/
├── navigation.md      # File này
├── concepts/          # Khái niệm cốt lõi
├── examples/          # Code hoạt động
├── guides/            # Hướng dẫn
├── lookup/            # Tham chiếu nhanh
└── errors/            # Lỗi phổ biến
```

## Quick Links

**Khái niệm**:
- `concepts/docker-workflow.md` - Docker commands (backend/frontend)
- `concepts/code-style.md` - Quy chuẩn code (Python)
- `concepts/code-style-frontend.md` - Quy chuẩn code (TypeScript/Next.js)
- `concepts/security.md` - Bảo mật & Guardrails
- `concepts/architecture.md` - Kiến trúc FastAPI + Next.js
- `concepts/authentication-system.md` - Hệ thống JWT, Rank, CSRF
- `concepts/database-schema.md` - Sơ đồ cơ sở dữ liệu (User, Attachment, Settings)
- `concepts/logging.md` - Loguru logging
- `concepts/upload-system.md` - Upload với Private Storage + Streaming
- `concepts/optimization.md` - Tối ưu hiệu năng frontend
- `concepts/local-domain-setup.md` - Cấu hình aicmr.local (MỚI)
- `concepts/phpmyadmin.md` - Quản lý MySQL qua web (MỚI)

**Ví dụ**:
- `examples/api-endpoint.md` - API endpoint mẫu
- `examples/api-call.md` - Gọi API từ frontend (useQuery, useMutation)
- `examples/docker-commands.md` - Lệnh Docker cụ thể
- `examples/test-example.md` - Pytest mẫu

**Hướng dẫn**:
- `guides/getting-started.md` - Setup môi trường & cài đặt ban đầu
- `guides/debugging.md` - Xử lý lỗi
- `guides/ai-agent-workflow.md` - Quy trình AI Agents (MỚI)

**Tham chiếu**:
- `lookup/test-accounts.md` - Tài khoản test (admin, mod, member, guest)
- `lookup/env-variables.md` - Biến môi trường (.env)
- `lookup/api-endpoints.md` - Map tất cả API endpoints
- `lookup/folder-structure.md` - Cấu trúc thư mục quan trọng
- `lookup/frontend-libraries.md` - Thư viện frontend (shadcn, Zustand, Sonner...)
- `lookup/commands-quickref.md` - Lệnh Docker nhanh

**Lỗi**:
- `errors/common-errors.md` - 401, 403, hydration failed, test failures

## Tài Liệu Chính
- `/AGENTS.md` - Hướng dẫn đầy đủ cho AI Agents
- `/README.md` - Tổng quan dự án
- `/backend/README.md` - Chi tiết backend
- `/frontend/README.md` - Chi tiết frontend
