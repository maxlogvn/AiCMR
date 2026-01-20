# 04. Quy chuẩn Frontend (Frontend Guide)

Tài liệu này mô tả các quy chuẩn phát triển Frontend cho dự án AiCMR sử dụng Next.js.

## Công nghệ sử dụng
- **Framework**: Next.js 16 (App Router) & React 19.
- **Styling**: Tailwind CSS 4 & **shadcn/ui**.
- **State Management**: TanStack Query (Server State) & **Zustand** (Client State).
- **Animation**: **Framer Motion**.
- **Form**: React Hook Form + Zod.
- **Notification**: **Sonner**.

## Thư viện & Công cụ bổ sung
- **shadcn/ui**: Hệ thống component UI cơ bản. Cài đặt thêm bằng `npx shadcn@latest add [component]`.
- **Zustand**: Quản lý client state (ví dụ: theme, trạng thái sidebar). Lưu trữ tại `src/store/`.
- **sonner**: Hiển thị thông báo (toast). Sử dụng qua hàm `toast.success()` hoặc `toast.error()`.
- **framer-motion**: Xử lý các hiệu ứng chuyển động mượt mà.
- **cn() utility**: Sử dụng hàm `cn` trong `src/lib/utils.ts` để kết hợp Tailwind classes động.

## Cấu trúc thư mục (`frontend/src/`)
- `app/`: Routing và Pages (App Router).
- `components/`:
  - `ui/`: Các component nguyên tử từ shadcn/ui.
  - `auth/`: Các component liên quan bảo mật (AuthGuard...).
  - `layout/`: Navbar, Sidebar, Footer.
- `hooks/`: Custom hooks (useAuth, useDebounce...).
- `lib/`: Cấu hình thư viện (Axios instance, utils, shadcn config).
- `store/`: Quản lý client state với Zustand.
- `types/`: Định nghĩa TypeScript interfaces.

## Quy trình gọi API
1. Định nghĩa Interface trong `src/types/`.
2. Sử dụng Axios instance trong `src/lib/api.ts` (đã tích hợp CSRF và Refresh Token).
3. Sử dụng `useQuery` hoặc `useMutation` từ TanStack Query để gọi API trong components/hooks.

## Quản lý Form và Validation
Sử dụng **Zod** để định nghĩa schema và **React Hook Form** để quản lý trạng thái form.
- Password: Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
- Email: Luôn được tự động chuyển về chữ thường (lowercase) trước khi gửi đi.

## Các kỹ thuật tối ưu
- **Code Splitting**: Sử dụng `next/dynamic` cho các component lớn hoặc không cần thiết lúc tải trang đầu.
- **Debouncing**: Sử dụng hook `useDebounce` cho các ô tìm kiếm để giảm số lượng API calls.
- **Memoization**: Sử dụng `React.memo` cho các component hiển thị danh sách lớn (ví dụ: `UserRow`).

## Bảo mật (Guards)
- **AuthGuard**: Bao bọc các trang yêu cầu đăng nhập. Tự động kiểm tra token và redirect nếu cần.
- **InstallGuard**: Kiểm tra trạng thái hệ thống. Nếu chưa cài đặt, tự động dẫn người dùng về trang `/install`.
