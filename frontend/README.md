# AiCMR Frontend

Dự án Frontend cho hệ thống AiCMR, được xây dựng bằng **Next.js 16** (App Router) và **Tailwind CSS**.

## Công nghệ sử dụng

- **Framework:** [Next.js 16](https://nextjs.org/) (Turbopack)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Components:** Được tổ chức theo cấu trúc Atomic Design hoặc theo tính năng.

## Cấu trúc thư mục

- `src/app`: Chứa các route, layout và page (App Router).
- `src/components`: Các component dùng chung.
- `src/hooks`: Các custom hooks.
- `src/services`: Các file gọi API tới Backend.
- `src/types`: Định nghĩa kiểu dữ liệu TypeScript.
- `public`: Các tài nguyên tĩnh (hình ảnh, fonts).

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
