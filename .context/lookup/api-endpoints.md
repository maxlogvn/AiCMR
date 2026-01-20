# API Endpoints - Quick Reference

Tất cả API endpoints có tiền tố: `/backend/api/v1`

## Authentication (`/auth`)

| Method | Endpoint | Auth | Rate Limit |
|--------|----------|------|------------|
| POST | `/register` | No | 3/min |
| POST | `/login` | No | 5/min |
| POST | `/refresh` | No | 10/min |
| POST | `/logout` | Bearer | 10/min |
| GET | `/csrf-token` | No | 30/min |
| POST | `/forgot-password` | No | 3/min |
| POST | `/reset-password` | No | 3/min |

## User Management (`/users`)

| Method | Endpoint | Rank |
|--------|----------|------|
| GET | `/me` | 0+ |
| PATCH | `/me` | 0+ |
| PATCH | `/me/password` | 0+ |
| GET | `/` | 5 (Admin) |
| GET | `/{id}` | 3+ |
| PATCH | `/{id}` | 5 |
| DELETE | `/{id}` | 5 |

## Installation (`/install`)

| Method | Endpoint | Ghi chú |
|--------|----------|---------|
| GET | `/status` | Trả `installed: bool` |
| POST | `/setup` | Cần `INSTALL_SECRET` |

## Upload Management (`/uploads`)

| Method | Endpoint | Rank | Query |
|--------|----------|------|-------|
| POST | `/` | 1+ | `is_public=true/false` |
| GET | `/file/{id}` | 1+ | `?token=...` |
| GET | `/p/{id}/{slug}` | No | SEO Friendly |
| GET | `/{id}` | 1+ | Metadata |
| DELETE | `/{id}` | 1+ | Owner or Admin |

## System

| Method | Endpoint | Ghi chú |
|--------|----------|---------|
| GET | `/metrics` | Prometheus (nội bộ) |
| GET | `/health` | Health check |

## Response Format

**Thành công**: JSON hoặc `{ items: [], total, page, size }`

**Lỗi**: `{"detail": "Thông báo lỗi"}`

**Caching**: GET endpoints cache 300s ( `/users/me`, `/install/status`)

## Tham Chiếu
- Authentication: `concepts/authentication-system.md`
- Upload module: `concepts/upload-system.md`
- Docker commands: `lookup/commands-quickref.md`
