# AiCMR Frontend

Dự án Frontend cho hệ thống AiCMR, được xây dựng bằng **Next.js 16** (App Router) và **Tailwind CSS 4**.

> **Xem tài liệu chi tiết tại:** [**04. Frontend Guide**](../../docs/04-frontend-guide.md)

## Công nghệ sử dụng

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) & React 19
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** [TanStack Query](https://tanstack.com/query/latest)
- **Form:** React Hook Form + Zod
- **Icons:** [Lucide React](https://lucide.dev/)

## Cấu trúc thư mục (`src/`)

- `app/`: Routing và Pages (App Router).
- `components/`: Các component UI, layout và logic theo domain.
- `hooks/`: Các custom hooks dùng chung.
- `lib/`: Cấu hình thư viện (Axios instance, utils, constants).
- `types/`: Định nghĩa kiểu dữ liệu TypeScript.
- `public/`: Tài nguyên tĩnh.

## Phát triển

Dự án này được chạy trong Docker cùng với toàn bộ hệ thống AiCMR.

### Truy cập
- **Tên miền cục bộ:** [http://aicmr.local](http://aicmr.local)
- **Container Name:** `aicmr-frontend-dev`

### Các lệnh thông dụng (trong container)
```bash
# Cài đặt thư viện mới
npm install <package-name>

# Chạy ở chế độ development
npm run dev

# Build cho production
npm run build
```

## Cấu hình Biến môi trường

Các biến môi trường được cấu hình thông qua file `.env` ở thư mục gốc của dự án hoặc trong `docker-compose.yml`:

- `NEXT_PUBLIC_API_URL`: URL của Backend API (mặc định: `http://aicmr.local/backend`)
- `NEXT_PUBLIC_APP_URL`: URL của Frontend (mặc định: `http://aicmr.local`)

## Quy tắc đóng góp

1. Sử dụng **Conventional Commits** cho các message commit.
2. Đảm bảo mã nguồn đã được format bằng Prettier và không có lỗi ESLint trước khi push.
3. Viết mã nguồn sạch, dễ hiểu và có comment đầy đủ cho các logic phức tạp.
