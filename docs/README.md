# Tài liệu Dự án AiCMR

Chào mừng bạn đến với hệ thống tài liệu kỹ thuật của AiCMR. Tài liệu này được thiết kế để giúp các nhà phát triển hiểu rõ về kiến trúc, quy chuẩn và cách vận hành của hệ thống.

## Danh sách tài liệu

Để hiểu hệ thống một cách tốt nhất, chúng tôi khuyến nghị đọc theo trình tự sau:

1. [**01. Hướng dẫn bắt đầu (Getting Started)**](./01-getting-started.md)
   - Cài đặt môi trường, chạy Docker, cấu hình biến môi trường và thiết lập hệ thống ban đầu.

2. [**02. Kiến trúc hệ thống (Architecture)**](./02-architecture.md)
   - Cái nhìn tổng quan về kiến trúc phần mềm, hạ tầng Docker/Nginx và sơ đồ cơ sở dữ liệu.

3. [**03. Quy chuẩn Backend (Backend Guide)**](./03-backend-guide.md)
   - Các quy định về code style, cách sử dụng các thư viện tích hợp (Loguru, Caching, Phân trang) và pattern CRUD.

4. [**04. Quy chuẩn Frontend (Frontend Guide)**](./04-frontend-guide.md)
   - Cấu trúc thư mục Next.js, quản lý state, quy trình gọi API và các kỹ thuật tối ưu hiệu năng.

5. [**05. Xác thực và Phân quyền (Authentication & Authorization)**](./05-authentication.md)
   - Chi tiết về hệ thống Rank (0-5), cơ chế JWT & Refresh Token, bảo mật CSRF và giới hạn băng thông (Rate Limiting).

6. [**06. Tài liệu API (API Reference)**](./06-api-reference.md)
   - Danh sách đầy đủ các endpoint API, schemas yêu cầu/phản hồi và quy tắc phân trang.

7. [**07. Hướng dẫn Opencode CLI (CLI Guide)**](./07-opencode-cli-guide.md)
   - Cách tương tác với AI Agent, các công cụ hỗ trợ và quy trình làm việc hiệu quả.

---

## Liên hệ & Hỗ trợ
Nếu có bất kỳ thắc mắc nào trong quá trình phát triển, vui lòng tham khảo file `AGENTS.md` ở thư mục gốc hoặc liên hệ với đội ngũ quản trị.
