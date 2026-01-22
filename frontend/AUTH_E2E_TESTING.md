# 🧪 Authentication E2E Testing Guide

## Tổng Quan

Hướng dẫn này giải thích cách sử dụng **agent-browser** từ Vercel để kiểm tra kỹ lưỡng chức năng **Đăng nhập** và **Đăng ký** trong ứng dụng AiCMR.

## 📋 Danh Sách Kiểm Tra (Test Coverage)

### Login Page Tests
- ✅ **UI Elements** - Tất cả các phần tử giao diện được hiển thị đúng cách
  - Header "Đăng nhập"
  - Input email
  - Input mật khẩu
  - Nút "Đăng nhập"
  - Link "Tạo tài khoản mới"
  - Icon "Quên mật khẩu"

- ✅ **Email Validation** - Kiểm tra định dạng email
  - Từ chối email không hợp lệ
  - Hiển thị message lỗi

- ✅ **Password Validation** - Kiểm tra độ dài mật khẩu
  - Từ chối mật khẩu < 6 ký tự
  - Hiển thị message lỗi

- ✅ **Password Visibility** - Toggle hiển thị/ẩn mật khẩu
  - Icon mắt để toggle
  - Input type thay đổi giữa "password" và "text"

- ✅ **Invalid Credentials** - Xử lý thông tin đăng nhập sai
  - Hiển thị message lỗi
  - Không chuyển hướng
  - Vẫn ở trang login

- ✅ **Form Navigation** - Chuyển hướng sang trang khác
  - Click "Tạo tài khoản mới" → đến `/register`
  - Click "Quên mật khẩu" → đến `/forgot-password`

### Register Page Tests
- ✅ **UI Elements** - Tất cả các phần tử được hiển thị
  - Header "Đăng ký"
  - Input email
  - Input username
  - Input mật khẩu
  - Input xác nhận mật khẩu
  - Nút "Đăng ký"
  - Link "Đã có tài khoản? Đăng nhập"

- ✅ **Email Validation** - Kiểm tra format email
  - Từ chối email không hợp lệ
  - Message lỗi hiển thị

- ✅ **Username Validation** - Kiểm tra username
  - Tối thiểu 3 ký tự
  - Tối đa 50 ký tự
  - Hiển thị message lỗi

- ✅ **Password Validation** - Kiểm tra mật khẩu
  - Tối thiểu 6 ký tự
  - Message lỗi hiển thị

- ✅ **Password Confirmation** - Xác nhận mật khẩu khớp
  - Password và Confirm Password phải giống nhau
  - Message lỗi nếu không khớp

- ✅ **Successful Registration** - Đăng ký thành công
  - Form được submit
  - Success message hiển thị (nếu có)
  - Chuyển hướng sang trang login

## 🚀 Cách Chạy Tests

### Chuẩn Bị

1. **Đảm bảo backend chạy**:
```bash
# Terminal 1 - Chạy backend
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

2. **Đảm bảo frontend chạy**:
```bash
# Terminal 2 - Chạy frontend
cd frontend
npm run dev
# Frontend sẽ chạy tại http://localhost:3000
```

### Chạy Tests

**Option 1: Với giao diện (recommended cho debugging)**
```bash
cd frontend
npm run test:auth

# Hoặc chạy trực tiếp
ts-node auth-e2e.test.ts
```

**Option 2: Headless mode (cho CI/CD)**
```bash
cd frontend
npm run test:auth:headless

# Hoặc
HEADLESS=true ts-node auth-e2e.test.ts
```

**Option 3: Với URL custom**
```bash
BASE_URL=http://localhost:3000 BACKEND_URL=http://localhost:8000 npm run test:auth
```

## 📊 Output Mong Đợi

Khi test chạy thành công, bạn sẽ thấy:

```
🧪 Starting Authentication E2E Tests...

📋 TEST 1: Login Page Load & UI Elements
──────────────────────────────────────────────────
✅ Login header found
✅ Email input field found
✅ Password input field found
✅ Submit button found
✅ Register link found
✅ Login form is visible
✓ TEST 1 PASSED

📋 TEST 2: Email Validation
──────────────────────────────────────────────────
✅ Email validation error shown correctly
✓ TEST 2 PASSED

... (8 more tests)

==================================================
✨ ALL TESTS COMPLETED SUCCESSFULLY ✨
==================================================

📊 Test Summary:
✓ Login page UI and elements
✓ Email validation
✓ Password validation
✓ Password visibility toggle
✓ Invalid credentials handling
✓ Navigation to register
✓ Register page UI and elements
✓ Register form validation
✓ Password confirmation matching
✓ Complete registration flow
```

## 🔍 Các Kịch Bản Kiểm Tra Chi Tiết

### TEST 1: Login Page Load & UI
- Điều hướng đến `/login`
- Chờ trang tải
- Kiểm tra các phần tử: header, inputs, buttons, links
- Xác minh form hiển thị

### TEST 2: Email Validation
- Nhập email không hợp lệ: "invalid-email"
- Click submit
- Xác minh message lỗi hiển thị
- Kiểm tra text chứa từ "hợp lệ" hoặc "email"

### TEST 3: Password Validation
- Nhập password quá ngắn: "123"
- Click submit
- Xác minh message lỗi về độ dài
- Kiểm tra text chứa "ít nhất 6"

### TEST 4: Password Visibility Toggle
- Nhập password
- Click icon mắt
- Xác minh input type thay đổi
- Click lại để ẩn
- Xác minh input type quay lại "password"

### TEST 5: Invalid Credentials
- Nhập email sai: "wrong@example.com"
- Nhập password sai: "wrongpassword"
- Click submit
- Chờ 3 giây
- Xác minh error message hiển thị
- Xác minh không chuyển hướng

### TEST 6: Navigation to Register
- Click link "Tạo tài khoản mới"
- Chờ trang tải
- Xác minh URL chứa `/register`

### TEST 7: Register Page UI
- Kiểm tra title "Đăng ký"
- Kiểm tra email input
- Kiểm tra username input
- Kiểm tra password inputs (2)
- Kiểm tra submit button
- Kiểm tra login link

### TEST 8: Register Form Validation
- Click submit mà không điền thông tin
- Chờ 500ms
- Xác minh error messages hiển thị
- Kiểm tra tối thiểu lỗi validation

### TEST 9: Password Confirmation Match
- Nhập email hợp lệ
- Nhập password #1
- Nhập password #2 khác
- Click submit
- Xác minh error message "không khớp"

### TEST 10: Successful Registration
- Điều hướng đến `/register`
- Điền đầy đủ form:
  - Email: `test-{timestamp}@example.com`
  - Username: `testuser-{timestamp}`
  - Password: `Test@123456`
  - Confirm: `Test@123456`
- Click submit
- Chờ 5 giây
- Xác minh:
  - Success message hiển thị (nếu có)
  - Hoặc chuyển hướng đến `/login`

## 🐛 Troubleshooting

### Lỗi: "Cannot find module 'agent-browser'"
```bash
cd frontend
npm install agent-browser --save-dev
```

### Lỗi: Frontend/Backend không kết nối
- Kiểm tra backend chạy trên port 8000
- Kiểm tra frontend chạy trên port 3000
- Kiểm tra firewall không chặn

### Test timeout
- Tăng timeout trong code (hiện tại là 5000ms)
- Kiểm tra backend response time
- Kiểm tra network connection

### Screenshot bị lưu ở `error-screenshot.png`
- Nếu test fail, screenshot lỗi sẽ được lưu
- Kiểm tra file này để debug

## 📝 Ghi Chú

### Test Data
- Sử dụng timestamp trong email/username để tránh conflict
- Mỗi test chạy sẽ tạo user mới

### Backend Requirements
- Auth endpoints: `/auth/login`, `/auth/register`
- User endpoint: `/users/me`
- Hỗ trợ JWT tokens

### Performance
- Thời gian chạy: ~30-60 giây tùy vào network
- Mỗi test là independent
- Có thể chạy riêng lẻ

## 🎯 Best Practices

1. **Chạy ngoài giờ cao điểm** để tránh ảnh hưởng backend
2. **Giữ console log** để debug
3. **Kiểm tra error-screenshot.png** nếu test fail
4. **Chạy multiple times** để xác minh consistency
5. **Integrate với CI/CD** để chạy tự động

## 📚 Tài Liệu Thêm

- [Agent-browser Docs](https://github.com/vercel-labs/agent-browser)
- [Puppeteer API](https://github.com/puppeteer/puppeteer)
- [Jest Documentation](https://jestjs.io/)

## ❓ FAQ

**Q: Test có tạo data thực trên database không?**
A: Có, test sẽ tạo real user nếu backend chạy. Có thể xóa sau hoặc sử dụng test database.

**Q: Có thể chạy test trên CI không?**
A: Có, sử dụng `npm run test:auth:headless` trong GitHub Actions, etc.

**Q: Có thể custom test scenarios không?**
A: Có, sửa file `auth-e2e.test.ts` và thêm logic kiểm tra mới.

**Q: Test có xóa account sau khi chạy xong không?**
A: Hiện tại không, bạn cần xóa manual hoặc tạo cleanup script.
