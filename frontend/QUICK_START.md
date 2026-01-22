# 🚀 Quick Start Guide - Authentication E2E Testing

## Bước 1: Chuẩn Bị Môi Trường

```bash
# Mở Terminal #1 - Chạy Backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# Mở Terminal #2 - Chạy Frontend
cd frontend
npm run dev
# Frontend sẽ chạy tại http://localhost:3000
```

Chờ cho đến khi cả hai đều sẵn sàng. Bạn sẽ thấy:
- Backend: `Uvicorn running on http://127.0.0.1:8000`
- Frontend: `- ready started server on 0.0.0.0:3000`

## Bước 2: Chạy Tests

```bash
# Mở Terminal #3 - Chạy Tests
cd frontend
npm run test:auth
```

Hoặc với headless mode (không hiển thị trình duyệt):
```bash
npm run test:auth:headless
```

## Bước 3: Xem Kết Quả

Test sẽ tự động:
1. ✅ Kiểm tra UI login/register
2. ✅ Kiểm tra validation các field
3. ✅ Kiểm tra error handling
4. ✅ Kiểm tra điều hướng giữa các page
5. ✅ Kiểm tra flow đăng ký hoàn chỉnh

---

## 📊 Test Coverage

### 10 Test Cases Toàn Diện:

| # | Test Name | Mô Tả |
|---|-----------|-------|
| 1 | Login Page Load & UI | Kiểm tra tất cả UI elements |
| 2 | Email Validation | Kiểm tra email format |
| 3 | Password Validation | Kiểm tra password length |
| 4 | Password Visibility | Kiểm tra toggle mật khẩu |
| 5 | Invalid Credentials | Kiểm tra error khi sai credentials |
| 6 | Navigation to Register | Kiểm tra điều hướng sang trang đăng ký |
| 7 | Register Page UI | Kiểm tra UI trang đăng ký |
| 8 | Register Form Validation | Kiểm tra validation form |
| 9 | Password Confirmation | Kiểm tra password matching |
| 10 | Successful Registration | Kiểm tra flow đăng ký thành công |

---

## 🔧 Options & Commands

### Chạy với headless mode
```bash
npm run test:auth:headless
```

### Chạy với custom URL
```bash
BASE_URL=http://localhost:3000 BACKEND_URL=http://localhost:8000 npm run test:auth
```

### Chạy helper script
```bash
node run-auth-tests.js --help
```

### Chạy trực tiếp với ts-node
```bash
ts-node auth-e2e.test.ts
```

---

## 📁 File Tạo Ra

```
frontend/
├── auth-e2e.test.ts              # Main test file (TypeScript)
├── run-auth-tests.js              # Helper script
├── AUTH_E2E_TESTING.md            # Detailed documentation
├── QUICK_START.md                 # This file
└── package.json                   # Updated with test scripts
```

---

## ✅ Expected Output

Khi tất cả tests pass, bạn sẽ thấy:

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

[... 9 more tests ...]

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

---

## 🐛 Troubleshooting

### Frontend không kết nối
```
❌ Frontend is not running at http://localhost:3000
```
**Solution**: Chạy `npm run dev` ở terminal riêng

### Backend không kết nối
```
❌ Backend is not running at http://localhost:8000
```
**Solution**: Chạy `python -m uvicorn app.main:app --reload --port 8000` ở terminal riêng

### Lỗi "Cannot find module 'agent-browser'"
```bash
cd frontend
npm install agent-browser --save-dev
```

### Test timeout / quá chậm
- Kiểm tra network connection
- Kiểm tra CPU/Memory usage của backend
- Tăng timeout từ 5000ms thành 10000ms

### Screenshot error
- Nếu test fail, file `error-screenshot.png` sẽ được tạo
- Kiểm tra file này để debug issue

---

## 📝 Chế Độ Chạy

### Mode 1: Development (Recommend)
```bash
npm run test:auth
# - Hiển thị trình duyệt
# - Chậm hơn (slowMo: 100ms)
# - Dễ debug
# - Thời gian: ~60 giây
```

### Mode 2: CI/Headless
```bash
npm run test:auth:headless
# - Không hiển thị trình duyệt
# - Nhanh hơn
# - Dùng cho automation
# - Thời gian: ~30 giây
```

---

## 🎯 Test Data

Mỗi lần test chạy, nó sẽ:
- Tạo unique email: `test-{timestamp}@example.com`
- Tạo unique username: `testuser-{timestamp}`
- Tạo user thực trên database
- Có thể xóa manual sau hoặc chuẩn bị test database

---

## 📚 File Liên Quan

- **Source Code**:
  - `frontend/src/app/(auth)/login/page.tsx`
  - `frontend/src/app/(auth)/register/page.tsx`
  - `frontend/src/lib/auth.ts`
  - `frontend/src/hooks/useAuth.ts`

- **Documentation**:
  - `AUTH_E2E_TESTING.md` - Chi tiết đầy đủ
  - `QUICK_START.md` - Hướng dẫn nhanh (file này)

- **Test Files**:
  - `auth-e2e.test.ts` - Main test cases
  - `run-auth-tests.js` - Helper script

---

## 🔄 Workflow Khề Xuất

1. **Phát triển feature** → Viết code
2. **Chạy tests** → `npm run test:auth`
3. **Debug nếu fail** → Xem error-screenshot.png
4. **Fix & retest** → Lặp lại
5. **Commit** → Push code

---

## 💡 Tips & Best Practices

✅ **Do**:
- Chạy tests sau khi thay đổi auth code
- Chạy với headless mode trước khi commit
- Kiểm tra error-screenshot.png nếu fail
- Integrate vào CI/CD pipeline

❌ **Don't**:
- Không chạy tests khi backend tắt
- Không chạy khi frontend chưa sẵn sàng
- Không delete test file nếu tests fail
- Không modify test data ngẫu nhiên

---

## 🆘 Cần Giúp Đỡ?

1. **Xem chi tiết**: `AUTH_E2E_TESTING.md`
2. **Kiểm tra logs**: Xem console output
3. **Debug screenshot**: Mở `error-screenshot.png`
4. **Chạy helper**: `node run-auth-tests.js --help`

---

## ✨ Tiếp Theo

- ✅ Tests hoạt động → Ready for CI/CD integration
- 🔄 Thêm more tests → Extend `auth-e2e.test.ts`
- 🤖 Automate → Setup GitHub Actions
- 📊 Report → Add test reporting

Happy Testing! 🚀
