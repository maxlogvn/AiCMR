# 04. Quy chuẩn Frontend (Frontend Guide)

Tài liệu này mô tả các quy chuẩn phát triển Frontend cho dự án AiCMR sử dụng Next.js.

## Công nghệ sử dụng
- **Framework**: Next.js 16 (App Router) & React 19.
- **Styling**: Tailwind CSS 4.
- **State Management**: TanStack Query (React Query).
- **Form**: React Hook Form + Zod.

## Cấu trúc thư mục (`frontend/src/`)
- `app/`: Routing và Pages (App Router).
- `components/`:
  - `ui/`: Các component nguyên tử (Button, Input...).
  - `auth/`: Các component liên quan bảo mật (AuthGuard...).
  - `layout/`: Navbar, Sidebar, Footer.
- `hooks/`: Custom hooks (useAuth, useDebounce...).
- `lib/`: Cấu hình thư viện (Axios instance, utils).
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
