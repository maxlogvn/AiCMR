---
description: Dọn dẹp codebase hoặc task hiện đang làm việc thông qua Prettier, Import Sorter, ESLint và TypeScript Compiler
---

# Dọn Dẹp Chất Lượng Code

Bạn là chuyên gia về chất lượng code. Khi được cung cấp $ARGUMENTS (đường dẫn file hoặc thư mục), hãy dọn dẹp và tối ưu hóa code một cách có hệ thống để sẵn sàng cho production. Nếu không có tham số nào, hãy tập trung vào các file đang mở hoặc gần đây được sửa đổi.

## Quy Trình Dọn Dẹp Của Bạn:

**Bước 1: Xác Định Phạm Vi**
- Nếu có $ARGUMENTS: Tập trung vào các file/thư mục được chỉ định
- Nếu không có tham số: Kiểm tra git status để tìm các file đã sửa đổi và các file đang mở
- Xác định loại file và công cụ dọn dẹp phù hợp

**Bước 2: Thực Hiện Quy Trình Dọn Dẹp**
Thực hiện các hành động theo thứ tự sau:

1. **Xóa Code Debug**
   - Loại bỏ console.log, debugger statements, và code debug tạm thời
   - Xóa các khối code đã comment
   - Dọn dẹp các import chỉ dùng cho development

2. **Định Dạng Cấu Trúc Code**
   - Chạy Prettier (nếu có) hoặc áp dụng định dạng nhất quán
   - Đảm bảo thụt lề và khoảng trắng phù hợp
   - Chuẩn hóa việc sử dụng quote và dấu phẩy cuối

3. **Tối Ưu hóa Imports**
   - Sắp xếp imports theo thứ tự bảng chữ cái
   - Xóa các imports không dùng
   - Nhóm imports theo loại (thư viện, file local)
   - Sử dụng absolute imports khi được cấu hình

4. **Khắc Phục Linting Issues**
   - Giải quyết các lỗi và cảnh báo của ESLint/TSLint
   - Áp dụng các quy tắc có thể tự động sửa
   - Báo cáo các lỗi cần sửa thủ công

5. **Kiểm Tra An toàn Loại Dữ Liệu**
   - Chạy kiểm tra TypeScript compiler
   - Sửa các vấn đề kiểu dữ liệu rõ ràng
   - Thêm các chú thích kiểu dữ liệu còn thiếu khi có lợi

6. **Tối Ưu hóa Comments**
   - Xóa các comments dư thừa hoặc rõ ràng
   - Cải thiện các comments không rõ ràng
   - Đảm bảo tính đầy đủ của JSDoc/docstring cho các API công khai

**Bước 3: Báo Cáo Kết Quả Dọn Dẹp**

## 📋 Kết Quả Dọn Dẹp

### 🎯 Files Đã Xử Lý
- [Danh sách các file đã được dọn dẹp]

### 🔧 Các Hành Động Đã Thực Hiện
- **Code Debug Đã Xóa**: [Số lượng console.log, debugger đã xóa]
- **Định Dạng Đã Áp Dụng**: [Số file đã định dạng]
- **Imports Đã Tối Ưu**: [Imports không dùng đã xóa, sắp xếp đã áp dụng]
- **Linting Issues Đã Sửa**: [Số vấn đề tự động sửa]
- **Vấn Đề Loại Dữ Liệu Đã Khắc Phục**: [Số lỗi TypeScript đã sửa]
- **Comments Đã Cải Thiện**: [Số comments dư thừa đã xóa, comments không rõ ràng đã cải thiện]

### 🚨 Các Hành Động Cần Thực Hiện Thủ Công
- [Danh sách các vấn đề cần can thiệp thủ công]

### ✅ Cải Thiện Chất Lượng
- [Tóm tắt các cải thiện chất lượng code tổng thể đã thực hiện]

## Các Tiêu Chuẩn Chất Lượng Đã Áp Dụng:
- **Sẵn Sàng Production**: Xóa tất cả các artifact debug và development
- **Phong Cách Nhất Quán**: Áp dụng tiêu chuẩn định dạng dự án
- **An toàn Loại Dữ Liệu**: Đảm bảo typing mạnh khi có thể áp dụng
- **Imports Sạch Sẽ**: Tối ưu hóa quản lý dependencies
- **Tài Liệu Rõ Ràng**: Cải thiện khả năng đọc code thông qua comments tốt hơn
