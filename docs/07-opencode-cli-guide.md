# Tài liệu Hướng dẫn Toàn diện Opencode CLI

Tài liệu này cung cấp hướng dẫn đầy đủ nhất về cách vận hành, các lệnh slash và các công cụ của Opencode - Hệ thống AI lập trình Agentic chuyên sâu trong dự án AiCMR.

---

## 1. Triết lý Vận hành: "Chuyên gia Lập trình Toàn diện"

Opencode không chỉ là một trợ lý chat, mà là một **Autonomous Agent** (Agent tự hành) với khả năng tư duy và thực thi chuyên sâu. Khi nhận yêu cầu, AI sẽ:
1.  **Phân tích Đa chiều**: Đọc các file liên quan, rà soát tài liệu kiến trúc và hiểu sâu ý định của người dùng.
2.  **Lập kế hoạch Chi tiết**: Tạo Todo list với các bước logic, có kiểm tra và dự phòng.
3.  **Thực thi Toàn diện**: Sử dụng bộ công cụ hệ thống để sửa đổi mã nguồn, cấu hình hạ tầng hoặc viết tài liệu.
4.  **Kiểm soát Chất lượng**: Chạy các bộ test, kiểm tra linting và tự rà soát mã nguồn (Self-review).

---

## 2. Các công cụ cốt lõi (Core Tools)

### Hệ thống & Terminal
- **`bash`**: Thực hiện các lệnh Linux bên trong container. Dự án đã được khởi chạy sẵn với cơ chế tự động cập nhật thay đổi (Hot-reload).
  - *Lưu ý Quan trọng*: **KHÔNG** chạy các lệnh `npm run dev` hoặc `npm run build` vì sẽ gây gián đoạn hệ thống đang vận hành.
  - *Ví dụ lệnh an toàn*:
    - `docker compose exec backend pytest` (Chạy test)
    - `docker compose exec frontend npm install lucide-react` (Cài thư viện mới)
    - `docker compose exec backend alembic upgrade head` (Cập nhật DB)

---

## 3. Hệ thống Lệnh Slash (/) Chi tiết

### 3.1 Trình Quản lý Ngữ cảnh (`/context`)

Đây là trung tâm điều khiển tri thức của AI. Opencode ưu tiên sự đầy đủ và chính xác của thông tin thay vì sự ngắn gọn cứng nhắc.

*   **`/context` (không đối số)**:
    - **Hành động**: Quét nhanh (Fast Scan) toàn bộ không gian làm việc.
    - **Mục tiêu**: Nhận diện các file tóm tắt phiên làm việc (`SESSION-*.md`), các ghi chú tạm thời, hoặc các file log cần được chuyển hóa thành tri thức dự án.
*   **`/context harvest [path]`**:
    - **Mục đích**: Thu hoạch kiến thức từ các file tạm thành ngữ cảnh chính thức.
    - **Quy trình**: AI phân tích nội dung -> Tổ chức lại thành các tài liệu chuyên sâu -> Lưu vào hệ thống ngữ cảnh vĩnh viễn (`.opencode/context/`) -> Thực hiện lưu trữ hoặc dọn dẹp file nguồn (sau khi người dùng duyệt).
*   **`/context extract from {source}`**:
    - **Mục đích**: Trích xuất tri thức chuyên sâu từ các nguồn bên ngoài hoặc mã nguồn phức tạp.
    - **Khả năng**: Có thể đọc URL (Ví dụ: `http://aicmr.local/docs`), file PDF (nếu hỗ trợ) hoặc các module code lớn để xây dựng bộ quy tắc cho AI.
*   **`/context organize {category}`**:
    - **Mục đích**: Tự động hóa việc cấu trúc lại hệ thống tri thức.
*   **`/context update for {topic}`**:
    - **Mục đích**: Cập nhật đồng bộ tri thức khi dự án thay đổi công nghệ hoặc logic nghiệp vụ.
*   **`/context map` & `/context validate`**:
    - **Map**: Hiển thị bản đồ liên kết tri thức.
    - **Validate**: Đảm bảo tính xác thực của tri thức và sự nhất quán của hệ thống.

### 3.2 Tối ưu hóa Nội dung (`/compact`)

*   **`/compact {file}`**:
    - **Mục đích**: Tái cấu trúc lại một tài liệu dài hoặc log hội thoại thành một tài liệu kỹ thuật có hệ thống.

### 3.3 Quy trình Phát triển & Git

Lưu ý: Các lệnh dưới đây có thể được sử dụng bằng cách gõ trực tiếp `/lệnh` vào ô chat. AI sẽ tự động kích hoạt các Agent chuyên biệt để xử lý.

*   **`/review [target]`**: Rà soát mã nguồn chuyên sâu dựa trên các tiêu chuẩn tại `docs/03-backend-guide.md` và `docs/04-frontend-guide.md`.
*   **`/commit`**: Phân tích sự thay đổi trong code để viết commit message chuẩn và thực hiện commit sau khi người dùng phê duyệt.
*   **`/pr [base_branch]`**: Tự động hóa quy trình đẩy code và tạo Pull Request chuyên nghiệp trên GitHub.
*   **`/fix {mô tả lỗi hoặc log}`**: 
    - **Cơ chế**: AI sẽ đọc log lỗi, truy vết mã nguồn, đối chiếu với `context/errors/` và sửa lỗi tự động.
    - **Ví dụ**: `/fix lỗi 404 khi gọi api login tại http://aicmr.local/backend/api/v1/auth/login`.
*   **`/test {module}`**: Tự động chạy các bộ test liên quan **bên trong Docker**. Khi kiểm thử Web/UI, AI bắt buộc sử dụng `http://aicmr.local`.

---

## 4. Tại sao một số lệnh không hiển thị trong gợi ý (Autocomplete)?

Một số lệnh Slash (như `/fix`, `/test`, `/review`) là các **Task-based Commands**. Chúng không phải là các tính năng tĩnh của giao diện, mà là các "tín hiệu" để kích hoạt tư duy lập trình của AI:
- Khi bạn gõ `/fix`, AI sẽ hiểu bạn đang cần một quy trình: *Phân tích log -> Tìm file -> Sửa code -> Chạy lại test tại http://aicmr.local*.

---

## 5. Quy chuẩn Tài liệu Ngữ cảnh (Context Standards)

Hệ thống Opencode áp dụng quy chuẩn mới, tập trung vào **Tính Toàn diện (Comprehensive Knowledge)**:

1.  **Không giới hạn độ dài**: File tài liệu được phép dài và chi tiết để bao phủ toàn bộ các khía cạnh của vấn đề.
2.  **Cấu trúc Đa tầng**: Sử dụng các tiêu đề logic (H1-H4).
3.  **Ví dụ Đầy đủ**: Code mẫu phải là các đoạn mã chức năng hoàn chỉnh. **Sử dụng `aicmr.local` làm URL mẫu.**
4.  **Liên kết Chặt chẽ**: Luôn bao gồm các link tham chiếu đến mã nguồn thực tế.

---

## 6. Cơ chế Phê duyệt (Approval Gate)

Để đảm bảo an toàn tuyệt đối, mọi thao tác có tính chất thay đổi hoặc xóa bỏ đều phải đi qua cổng phê duyệt:
- AI hiển thị danh sách các file/hành động.
- Người dùng xác nhận (A, B, C...) hoặc dùng `all`.
- **KHÔNG BAO GIỜ** AI tự ý xóa code hoặc dữ liệu của người dùng.

---

## 7. Mẹo thực chiến (Pro Tips)

1.  **Chỉ định Chuyên gia**: Sử dụng cú pháp `@AgentName` (ví dụ: `@TestEngineer`) để kích hoạt các mode xử lý chuyên sâu.
2.  **Xây dựng "Trí nhớ" Dự án**: Thường xuyên sử dụng `/context harvest`.
3.  **Mô tả Lỗi Chi tiết**: Cung cấp URL lỗi cụ thể tại `http://aicmr.local`.

---
*Tài liệu này được bảo trì bởi Opencode DocWriter và luôn được cập nhật theo các tiêu chuẩn mới nhất của dự án.*
