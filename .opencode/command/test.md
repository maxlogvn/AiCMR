---
description: Chạy pipeline test đầy đủ
---

# Pipeline Testing

Lệnh này chạy pipeline test đầy đủ cho dự án.

## Cách Sử Dụng

Để chạy pipeline test đầy đủ, chỉ cần gõ:

1. Chạy pnpm type:check
2. Chạy pnpm lint
3. Chạy pnpm test
4. Báo cáo các thất bại
5. Sửa các thất bại
6. Lặp lại cho đến khi tất cả tests pass
7. Báo cáo thành công

## Lệnh Này Làm Gì

1. Chạy `pnpm type:check` để kiểm tra lỗi type
2. Chạy `pnpm lint` để kiểm tra lỗi linting
3. Chạy `pnpm test` để chạy tests
4. Báo cáo các thất bại
