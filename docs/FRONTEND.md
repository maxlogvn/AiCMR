# Frontend Architecture

Tài liệu này mô tả cấu trúc và các quy chuẩn phát triển Frontend cho dự án AiCMR.

## Công nghệ sử dụng
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **State Management**: TanStack Query (React Query)
- **Form**: React Hook Form + Zod
- **HTTP Client**: Axios

## Cấu trúc thư mục (`frontend/src/`)
- `app/`: Các trang (Pages) và Layouts theo App Router.
  - `auth/`: Nhóm các trang xác thực (Login, Register, Install, Forgot Password).
  - `dashboard/`: Nhóm các trang yêu cầu đăng nhập (Profile, Settings).
  - `admin/`: Các trang quản trị (User Management).
- `components/`: Các React Components tái sử dụng.
  - `ui/`: Các component cơ bản (Button, Input, Card, etc.).
  - `auth/`: Các component liên quan đến xác thực (AuthGuard).
  - `layout/`: Các component bố cục (Navbar, Sidebar).
- `hooks/`: Các Custom Hooks (useAuth, useUser, useToast).
- `lib/`: Các thư viện cấu hình (Axios instance, Auth utility).
- `types/`: Định nghĩa các TypeScript interfaces và types.

## Quy trình gọi API
1. Định nghĩa Type trong `src/types/index.ts`.
2. Tạo/Sử dụng hook trong `src/hooks/` (ví dụ: `useUser.ts`).
3. Sử dụng `TanStack Query` để quản lý loading, error và cache.
4. Sử dụng `authService` từ `src/lib/auth.ts` cho các tác vụ login/logout.

## Authentication Guard
Sử dụng component `AuthGuard` để bảo vệ các route yêu cầu đăng nhập:
```tsx
// Trong layout hoặc page
<AuthGuard>
  <YourProtectedComponent />
</AuthGuard>
```

## Installation Guard
Sử dụng component `InstallGuard` để bảo vệ route `/install` và kiểm tra trạng thái cài đặt hệ thống:
```tsx
// Trong RootLayout (đã tích hợp sẵn)
<InstallGuard>
  <YourComponents />
</InstallGuard>
```

## Styling Guidelines
- Sử dụng utility classes của Tailwind CSS 4.
- Luôn hỗ trợ Dark mode bằng prefix `dark:`.
- Tuân thủ hệ thống màu sắc của Zinc (mặc định trong codebase).

## Form Validation
Sử dụng Zod để định nghĩa schema và React Hook Form để quản lý form:
```tsx
const schema = z.object({ ... });
const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
```
