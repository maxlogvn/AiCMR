---
description: Tạo commits đúng định dạng với conventional commit messages và emoji
---

# Lệnh Commit

Bạn là AI agent giúp tạo commits git đúng định dạng với conventional commit messages và emoji icons. Hãy làm theo hướng dẫn chính xác này. Luôn chạy và push commit, bạn không cần yêu cầu xác nhận trừ khi có vấn đề lớn hoặc lỗi.

## Hướng Dẫn Cho Agent

Khi người dùng chạy lệnh này, thực hiện quy trình sau:

1. **Kiểm tra chế độ lệnh**:
   - Nếu người dùng cung cấp $ARGUMENTS (thông điệp đơn giản), bỏ qua bước 3

2. **Chạy kiểm tra trước commit**:
   - Chạy `pnpm lint` và báo cáo các vấn đề
   - Chạy `pnpm build` và đảm bảo nó thành công
   - Nếu cái nào thất bại, hỏi người dùng có muốn tiếp tục hay sửa vấn đề trước

3. **Phân tích git status**:
   - Chạy `git status --porcelain` để kiểm tra các thay đổi
   - Nếu không có file nào được staged, chạy `git add .` để stage tất cả file đã sửa đổi
   - Nếu file đã được staged, tiếp tục chỉ với những file đó

4. **Phân tích các thay đổi**:
   - Chạy `git diff --cached` để xem những gì sẽ được commit
   - Phân tích diff để xác định loại thay đổi chính (feat, fix, docs, v.v.)
   - Xác định phạm vi và mục đích chính của các thay đổi

5. **Tạo thông điệp commit**:
   - Chọn emoji và loại phù hợp từ tham chiếu dưới đây
   - Tạo thông điệp theo định dạng: `<emoji> <type>: <description>`
   - Giữ description ngắn gọn, rõ ràng và ở thì mệnh lệnh
   - Hiển thị thông điệp đề xuất cho người dùng xác nhận

6. **Thực hiện commit**:
   - Chạy `git commit -m "<thông điệp đã tạo>"`
   - Hiển thị hash commit và xác nhận thành công
   - Cung cấp tóm tắt ngắn về những gì đã được commit

## Hướng Dẫn Thông Điệp Commit

Khi tạo thông điệp commit, hãy làm theo các quy tắc sau:

- **Commits nguyên tử**: Mỗi commit nên chứa các thay đổi liên quan phục vụ một mục đích duy nhất
- **Thì mệnh lệnh**: Viết dưới dạng lệnh (ví dụ: "add feature" không phải "added feature")
- **Dòng đầu tiên ngắn gọn**: Giữ dưới 72 ký tự
- **Định dạng conventional**: Sử dụng `<emoji> <type>: <description>` trong đó type là một trong:
  - `feat`: Một tính năng mới
  - `fix`: Một sửa lỗi
  - `docs`: Thay đổi tài liệu
  - `style`: Thay đổi style code (định dạng, v.v.)
  - `refactor`: Thay đổi code không sửa bug và không thêm tính năng
  - `perf`: Cải thiện hiệu suất
  - `test`: Thêm hoặc sửa tests
  - `chore`: Thay đổi tiến trình build, công cụ, v.v.
- **Thì hiện tại, thì mệnh lệnh**: Viết thông điệp commit dưới dạng lệnh (ví dụ: "add feature" không phải "added feature")
- **Dòng đầu tiên ngắn gọn**: Giữ dòng đầu tiên dưới 72 ký tự
- **Emoji**: Mỗi loại commit đi kèm với một emoji phù hợp:
  - ✨ `feat`: Tính năng mới
  - 🐛 `fix`: Sửa lỗi
  - 📝 `docs`: Tài liệu
  - 💄 `style`: Định dạng/style
  - ♻️ `refactor`: Refactoring code
  - ⚡️ `perf`: Cải thiện hiệu suất
  - ✅ `test`: Tests
  - 🔧 `chore`: Công cụ, cấu hình
  - 🚀 `ci`: Cải thiện CI/CD
  - 🗑️ `revert`: Hoàn tác thay đổi
  - 🧪 `test`: Thêm test thất bại
  - 🚨 `fix`: Sửa cảnh báo compiler/linter
  - 🔒️ `fix`: Sửa vấn đề bảo mật
  - 👥 `chore`: Thêm hoặc cập nhật contributors
  - 🚚 `refactor`: Di chuyển hoặc đổi tên tài nguyên
  - 🏗️ `refactor`: Thay đổi kiến trúc
  - 🔀 `chore`: Gộp branches
  - 📦️ `chore`: Thêm hoặc cập nhật file đã biên dịch hoặc packages
  - ➕ `chore`: Thêm dependency
  - ➖ `chore`: Xóa dependency
  - 🌱 `chore`: Thêm hoặc cập nhật seed files
  - 🧑‍💻 `chore`: Cải thiện trải nghiệm developer
  - 🧵 `feat`: Thêm hoặc cập nhật code liên quan đến multithreading hoặc concurrency
  - 🔍️ `feat`: Cải thiện SEO
  - 🏷️ `feat`: Thêm hoặc cập nhật types
  - 💬 `feat`: Thêm hoặc cập nhật text và literals
  - 🌐 `feat`: Quốc tế hóa và địa phương hóa
  - 👔 `feat`: Thêm hoặc cập nhật business logic
  - 📱 `feat`: Làm việc trên responsive design
  - 🚸 `feat`: Cải thiện trải nghiệm người dùng / tính khả dụng
  - 🩹 `fix`: Sửa đơn giản cho vấn đề không quan trọng
  - 🥅 `fix`: Bắt lỗi
  - 👽️ `fix`: Cập nhật code do thay đổi API bên ngoài
  - 🔥 `fix`: Xóa code hoặc file
  - 🎨 `style`: Cải thiện cấu trúc/định dạng của code
  - 🚑️ `fix`: Sửa nóng quan trọng
  - 🎉 `chore`: Bắt đầu dự án
  - 🔖 `chore`: Thẻ Release/Version
  - 🚧 `wip`: Đang làm việc
  - 💚 `fix`: Sửa build CI
  - 📌 `chore`: Ghim dependencies vào phiên bản cụ thể
  - 👷 `ci`: Thêm hoặc cập nhật hệ thống build CI
  - 📈 `feat`: Thêm hoặc cập nhật code analytics hoặc tracking
  - ✏️ `fix`: Sửa lỗi chính tả
  - ⏪️ `revert`: Hoàn tác thay đổi
  - 📄 `chore`: Thêm hoặc cập nhật license
  - 💥 `feat`: Giới thiệu breaking changes
  - 🍱 `assets`: Thêm hoặc cập nhật assets
  - ♿️ `feat`: Cải thiện khả năng truy cập
  - 💡 `docs`: Thêm hoặc cập nhật comments trong source code
  - 🗃️ `db`: Thực hiện các thay đổi liên quan đến database
  - 🔊 `feat`: Thêm hoặc cập nhật logs
  - 🔇 `fix`: Xóa logs
  - 🤡 `test`: Mock things
  - 🥚 `feat`: Thêm hoặc cập nhật easter egg
  - 🙈 `chore`: Thêm hoặc cập nhật file .gitignore
  - 📸 `test`: Thêm hoặc cập nhật snapshots
  - ⚗️ `experiment`: Thực hiện experiments
  - 🚩 `feat`: Thêm, cập nhật, hoặc xóa feature flags
  - 💫 `ui`: Thêm hoặc cập nhật animations và transitions
  - ⚰️ `refactor`: Xóa dead code
  - 🦺 `feat`: Thêm hoặc cập nhật code liên quan đến validation
  - ✈️ `feat`: Cải thiện hỗ trợ offline

## Tham Khảo: Ví Dề Commit Tốt

Sử dụng các ví dụ này khi tạo thông điệp commit:
- ✨ feat: thêm hệ thống xác thực người dùng
- 🐛 fix: khắc phục rò rỉ bộ nhớ trong quá trình render
- 📝 docs: cập nhật tài liệu API với các endpoint mới
- ♻️ refactor: đơn giản hóa logic xử lý lỗi trong parser
- 🚨 fix: giải quyết cảnh báo linter trong các file component
- 🧑‍💻 chore: cải thiện tiến trình thiết lập công cụ developer
- 👔 feat: implement business logic cho xác thực giao dịch
- 🩹 fix: giải quyết sự không nhất quán style nhỏ trong header
- 🚑️ fix: vá lỗ hổng bảo mật quan trọng trong luồng xác thực
- 🎨 style: tổ chức lại cấu trúc component để dễ đọc hơn
- 🔥 fix: xóa code legacy đã deprecated
- 🦺 feat: thêm input validation cho form đăng ký người dùng
- 💚 fix: giải quyết tests pipeline CI thất bại
- 📈 feat: implement analytics tracking cho sự tương tác người dùng
- 🔒️ `fix`: tăng cường yêu cầu mật khẩu xác thực
- ♿️ `feat`: cải thiện khả năng truy cập form cho screen readers

Ví dụ chuỗi commit:
- ✨ feat: thêm hệ thống xác thực người dùng
- 🐛 fix: khắc phục rò rỉ bộ nhớ trong quá trình render
- 📝 docs: cập nhật tài liệu API với các endpoint mới
- ♻️ refactor: đơn giản hóa logic xử lý lỗi trong parser
- 🚨 fix: giải quyết cảnh báo linter trong các file component
- ✅ test: thêm unit tests cho luồng xác thực

## Ghi Chú Hành Vi Agent

- **Xử lý lỗi**: Nếu kiểm tra thất bại, đưa cho người dùng tùy chọn tiếp tục hoặc sửa vấn đề trước
- **Tự động staging**: Nếu không có file nào được staged, tự động stage tất cả thay đổi với `git add .`
- **Ưu tiên file**: Nếu file đã được staged, chỉ commit những file cụ thể đó
- **Luôn chạy và push commit**: Bạn không cần yêu cầu xác nhận trừ khi có vấn đề lớn hoặc lỗi `git push`.
- **Chất lượng thông điệp**: Đảm bảo thông điệp commit rõ ràng, ngắn gọn và tuân thủ định dạng conventional
- **Phản hồi thành công**: Sau khi commit thành công, hiển thị hash commit và tóm tắt ngắn
