# Code Tự Giải Thích (Self-Documenting Code)

**Tổng quan**: Code nên dễ đọc hiểu mà không cần nhiều comment. Tên rõ ràng, cấu trúc đơn giản, functions nhỏ giúp code tự mô tả.

---

## Nguyên Tắc Viết Code

### 1. Tên Có Ý Nghĩa Rõ Ràng

- Sử dụng tên biến/hàm mô tả chức năng
- Có thể dùng tiếng Việt hoặc tiếng Anh
- Trừu tượng ở mức phù hợp

```javascript
// ✅ Tốt - Tên rõ ràng, đơn giản
const danhSachNguoiDung = users.filter(u => u.isActive);
const tinhTong = (a, b) => a + b;

// ❌ Kém - Tên mơ hồ, phức tạp
const data = users.filter(function(user) { return user.isActive === true; });
```

### 2. Cấu Trúc Đơn Giản

- Tránh lồng sâu (nesting > 3 levels)
- Tách nhỏ logic thành functions riêng
- Sử dụng early return để giảm nesting

```javascript
// ✅ Tốt - Đơn giản, dễ đọc
function processUser(user) {
  if (!user) return null;
  if (!user.isActive) return null;
  return user.data;
}

// ❌ Kém - Lồng sâu, khó đọc
function processUser(user) {
  if (user) {
    if (user.isActive) {
      if (user.data) {
        return user.data;
      }
    }
  }
  return null;
}
```

### 3. Functions Nhỏ (< 50 dòng)

- Mỗi function chỉ làm 1 việc rõ ràng
- Dễ test, dễ debug, dễ tái sử dụng
- Tách complex logic thành các helper functions

### 4. Modular & Functional

- Ưu tiên pure functions (không side effects)
- Tách logic business khỏi UI/framework code
- Sử dụng composition thay vì inheritance

---

## Khi Nên Comment

### ✅ Nên Comment

- Giải thích **TẠI SAO** (why), không phải **CÁ GÌ** (what)
- Ghi chú quyết định quan trọng, trade-offs
- Cảnh báo edge cases, rủi ro
- Giải thích thuật toán phức tạp

```javascript
// ✅ Tốt - Giải thích tại sao
// Sử dụng Set để loại bỏ trùng lặp nhanh hơn O(1) lookup
const uniqueUsers = [...new Set(userIds)];

// ✅ Tốt - Cảnh báo rủi ro
// CẢNH BÁO: Hàm này không validate input
const processUser = (user) => { /* ... */ };
```

### ❌ Không Nên Comment

- Code đã tự giải thích
- Lặp lại những gì code đang làm
- Code xấu → thay vì comment thì refactor

```javascript
// ❌ Kém - Lặp lại code
// Filter các users đang active
const activeUsers = users.filter(u => u.isActive);
```

---

## Checklist Trước Khi Commit

- [ ] Tên biến/hàm có ý nghĩa?
- [ ] Function < 50 dòng?
- [ ] Nesting < 3 levels?
- [ ] Không có comment thừa?
- [ ] Comment giải thích "why" không phải "what"?

---

## Liên Quan

- **Concept**: [agent-guidelines.md](.opencode/context/core/concepts/agent-guidelines.md)
- **Standard**: [code-quality.md](.opencode/context/core/standards/code-quality.md)
