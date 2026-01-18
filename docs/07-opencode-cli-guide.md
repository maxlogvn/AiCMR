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

## 2. Hệ thống Lệnh Slash (/) Chi tiết

### 2.1 Trình Quản lý Ngữ cảnh (`/context`)

Đây là trung tâm điều khiển tri thức của AI. Opencode ưu tiên sự đầy đủ và chính xác của thông tin thay vì sự ngắn gọn cứng nhắc.

*   **`/context` (không đối số)**:
    - **Hành động**: Quét nhanh (Fast Scan) toàn bộ không gian làm việc.
    - **Mục tiêu**: Nhận diện các file tóm tắt phiên làm việc (`SESSION-*.md`), các ghi chú tạm thời, hoặc các file log cần được chuyển hóa thành tri thức dự án.
*   **`/context harvest [path]`**:
    - **Mục đích**: Thu hoạch kiến thức từ các file tạm thành ngữ cảnh chính thức.
    - **Quy trình**: AI phân tích nội dung -> Tổ chức lại thành các tài liệu chuyên sâu -> Lưu vào hệ thống ngữ cảnh vĩnh viễn (`.opencode/context/`) -> Thực hiện lưu trữ hoặc dọn dẹp file nguồn (sau khi người dùng duyệt).
*   **`/context extract from {source}`**:
    - **Mục đích**: Trích xuất tri thức chuyên sâu từ các nguồn bên ngoài hoặc mã nguồn phức tạp.
    - **Khả năng**: Có thể đọc URL, file PDF (nếu hỗ trợ) hoặc các module code lớn để xây dựng bộ quy tắc cho AI.
*   **`/context organize {category}`**:
    - **Mục đích**: Tự động hóa việc cấu trúc lại hệ thống tri thức.
    - **Hành động**: Di chuyển các file vào các thư mục chức năng:
        - `concepts/`: Những bài viết chuyên sâu về kiến trúc và lý thuyết.
        - `examples/`: Kho mẫu code chất lượng cao, bao phủ nhiều kịch bản (không giới hạn độ dài).
        - `guides/`: Hướng dẫn triển khai chi tiết từng bước.
        - `lookup/`: Các bảng tra cứu đầy đủ về API, cấu hình và hằng số.
        - `errors/`: Phân tích chi tiết các lỗi và giải pháp triệt để.
*   **`/context update for {topic}`**:
    - **Mục đích**: Cập nhật đồng bộ tri thức khi dự án thay đổi công nghệ hoặc logic nghiệp vụ.
*   **`/context map` & `/context validate`**:
    - **Map**: Hiển thị bản đồ liên kết tri thức.
    - **Validate**: Đảm bảo tính chính xác của các liên kết và tính đầy đủ của tài liệu.

### 2.2 Tối ưu hóa Nội dung (`/compact`)

*   **`/compact {file}`**:
    - **Mục đích**: Tái cấu trúc lại một tài liệu dài hoặc log hội thoại thành một tài liệu kỹ thuật có hệ thống.
    - **Lưu ý**: Lệnh này ưu tiên việc giữ lại toàn bộ các quyết định logic, mã nguồn quan trọng và giải thích sâu thay vì chỉ tóm tắt sơ sài.

### 2.3 Quy trình Phát triển & Git

Lưu ý: Các lệnh dưới đây có thể được sử dụng bằng cách gõ trực tiếp `/lệnh` vào ô chat. AI sẽ tự động kích hoạt các Agent chuyên biệt để xử lý.

*   **`/review [target]`**: Rà soát mã nguồn chuyên sâu dựa trên các tiêu chuẩn tại `docs/03-backend-guide.md` và `docs/04-frontend-guide.md`.
*   **`/commit`**: Phân tích sự thay đổi trong code để viết commit message chuẩn và thực hiện commit sau khi người dùng phê duyệt.
*   **`/pr [base_branch]`**: Tự động hóa quy trình đẩy code và tạo Pull Request chuyên nghiệp trên GitHub.
*   **`/fix {mô tả lỗi hoặc log}`**: 
    - **Cơ chế**: Đây là một lệnh xử lý tác vụ thông minh. AI sẽ đọc log lỗi bạn cung cấp, truy vết trong mã nguồn, đối chiếu với cơ sở dữ liệu lỗi trong `context/errors/` và thực hiện sửa lỗi tự động.
    - **Ví dụ**: `/fix lỗi 404 khi gọi api login` hoặc `/fix [paste log lỗi ở đây]`.
*   **`/test {module}`**: Tự động chạy và báo cáo kết quả các bộ test liên quan.

---

## 3. Tại sao một số lệnh không hiển thị trong gợi ý (Autocomplete)?

Một số lệnh Slash (như `/fix`, `/test`, `/review`) là các **Task-based Commands**. Chúng không phải là các tính năng tĩnh của giao diện, mà là các "tín hiệu" để kích hoạt tư duy lập trình của AI:
- Khi bạn gõ `/fix`, AI sẽ hiểu bạn đang cần một quy trình: *Phân tích log -> Tìm file -> Sửa code -> Chạy lại test*.
- Bạn có thể tùy biến lệnh: `/fix và sau đó chạy test cho tôi`.

Hệ thống Opencode áp dụng quy chuẩn mới, tập trung vào **Tính Toàn diện (Comprehensive Knowledge)**:

1.  **Không giới hạn độ dài**: Tài liệu được phép dài và chi tiết để bao phủ toàn bộ các khía cạnh của vấn đề, bao gồm cả các trường hợp đặc biệt (edge cases).
2.  **Cấu trúc Đa tầng**: Sử dụng các tiêu đề logic (H1-H4) để phân tách rõ ràng các phần: Tổng quan, Đặc tả, Triển khai, và Xử lý sự cố.
3.  **Ví dụ Đầy đủ**: Code mẫu phải là các đoạn mã chức năng hoàn chỉnh, mô tả đúng các pattern đang sử dụng trong dự án, không bị giới hạn số dòng.
4.  **Liên kết Chặt chẽ**: Luôn bao gồm các link tham chiếu đến mã nguồn thực tế hoặc tài liệu gốc để đảm bảo tính kiểm chứng.

---

## 4. Cơ chế Phê duyệt (Approval Gate)

Để đảm bảo an toàn tuyệt đối, mọi thao tác có tính chất thay đổi hoặc xóa bỏ đều phải đi qua cổng phê duyệt:
- AI hiển thị danh sách các file/hành động.
- Người dùng xác nhận bằng cách chọn mã định danh (A, B, C...) hoặc dùng `all` để đồng ý tất cả.
- **KHÔNG BAO GIỜ** AI tự ý xóa code hoặc dữ liệu của người dùng.

---

## 6. Hệ thống Agent Đa tầng (Multi-tier Agent System)

Hệ thống Opencode vận hành dựa trên cơ chế cộng tác giữa các Agent chính (Main Agents) và các Agent chuyên biệt (Subagents).

### 6.1 Agent Chính (Main Agents)
Đây là các thực thể AI mà bạn chọn trực tiếp từ giao diện Opencode CLI để bắt đầu phiên làm việc:

*   **Opencode (Antigravity)**: 
    - **Bản chất**: AI chuyên gia thiết kế và lập trình hệ thống.
    - **Đặc điểm**: Tuân thủ nghiêm ngặt quy trình "Plan-and-Approve", sử dụng các công cụ như `TodoWrite` để quản lý tác vụ và luôn ưu tiên loading context trước khi thực hiện.
*   **OpenAgent**:
    - **Bản chất**: Trợ lý AI linh hoạt, tối ưu cho việc giải quyết vấn đề nhanh và đa năng.
    - **Đặc điểm**: Khả năng ứng biến cao, phù hợp cho các tác vụ mang tính nghiên cứu, thảo luận hoặc thực hiện nhanh các thay đổi nhỏ mà không cần quy trình thiết kế phức tạp.

### 6.2 Agent Chuyên biệt (Subagents)
Các Agent này được Agent chính triệu hồi thông qua công cụ `task` để giải quyết các phần việc đặc thù. Bạn cũng có thể yêu cầu đích danh qua `@AgentName`:

| Subagent | Vai trò & Nhiệm vụ cụ thể |
| :--- | :--- |
| **ContextScout** | Chuyên gia khám phá. Tự động quét và tìm kiếm các file tiêu chuẩn (`code-quality.md`, `standards/`, v.v.) trước khi code. |
| **CoderAgent** | Chuyên gia thực thi. Chuyên trách việc viết mã nguồn và thực hiện các thay đổi logic trong file. |
| **TestEngineer** | Kỹ sư kiểm thử. Chuyên biên soạn Unit Test, Integration Test và chạy các lệnh kiểm thử hệ thống. |
| **DocWriter** | Chuyên gia tài liệu. Tự động hóa việc viết, cập nhật tài liệu kỹ thuật và hướng dẫn sử dụng. |
| **CodeReviewer** | Chuyên gia rà soát. Đảm bảo chất lượng code, tính bảo mật và tuân thủ các chuẩn mực SOLID/Clean Code. |
| **TaskManager** | Quản lý tác vụ. Phân rã các tính năng phức tạp thành các subtasks có thể theo dõi và kiểm soát. |
| **Explore** | Khám phá mã nguồn. Tìm kiếm file theo pattern, phân tích kiến trúc và giải đáp các thắc mắc về codebase. |
| **PatternAnalyst** | Phân tích mẫu. Tìm kiếm các cách triển khai tương đồng trong project để đảm bảo tính nhất quán. |
| **BuildAgent** | Kiểm soát build. Thực hiện các bước kiểm tra kiểu (type check) và xác thực quá trình build hệ thống. |
| **ContextOrganizer**| Tổ chức tri thức. Sắp xếp, phân loại và cấu trúc lại các file trong thư mục `.opencode/context/`. |
| **general** | Agent tổng quát. Sử dụng cho các nhiệm vụ nghiên cứu đa bước và thực hiện nhiều đơn vị công việc song song. |

---

## 7. Mẹo thực chiến (Pro Tips)

1.  **Chỉ định Chuyên gia**: Sử dụng cú pháp `@AgentName` (ví dụ: `@TestEngineer`) để kích hoạt các mode xử lý chuyên sâu.
2.  **Xây dựng "Trí nhớ" Dự án**: Thường xuyên sử dụng `/context harvest` sau mỗi tính năng lớn để AI luôn nắm bắt được các thay đổi mới nhất của dự án.
3.  **Mô tả Lỗi Chi tiết**: Khi dùng `/fix`, hãy cung cấp cả thông báo lỗi (stack trace) và hành vi mong muốn để AI xử lý chính xác nhất.

---
*Tài liệu này được bảo trì bởi Opencode DocWriter và luôn được cập nhật theo các tiêu chuẩn mới nhất của dự án.*
