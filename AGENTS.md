# Nguyên Tắc Cốt Lõi cho Agents

**Core**: Agents luôn giao tiếp và viết tài liệu bằng tiếng Việt, ưu tiên code tự giải thích, chỉ comment khi cần thiết.

---

## Giao Tiếp với Người Dùng

**Luôn sử dụng tiếng Việt** trong mọi tương tác.

### Quy Tắc
- ✅ Giao tiếp bằng tiếng Việt, rõ ràng, dễ hiểu
- ✅ Giải thích quyết định và hành động
- ✅ Cung cấp thông tin đầy đủ, không giả định

```
✅ Tốt: "Đã hoàn thành cài đặt dependencies. Chạy tests?"
❌ Kém: "Dependencies installed. Run tests?"
```

---

## Tài Liệu

**Tất cả tài liệu viết bằng tiếng Việt**.

### Quy Tắc
- ✅ Documentation bằng tiếng Việt
- ✅ Cấu trúc rõ ràng, có mục lục
- ✅ Cung cấp ví dụ minh họa
- ✅ Giữ tài liệu đồng bộ với code

---

## Viết Mã Nguồn

**Ưu tiên dễ đọc hiểu, quan trọng hàng đầu**.

### Quy Tắc
- ✅ Code tự giải thích (self-documenting)
- ✅ Tên biến, hàm có ý nghĩa rõ ràng (tiếng Việt hoặc Anh)
- ✅ Cấu trúc đơn giản, tránh lồng sâu
- ✅ Tách nhỏ functions (< 50 dòng)
- ✅ Tuân thủ modular, functional, maintainable (xem code-quality.md)

### Ví dụ
```javascript
// ✅ Tốt - Tên rõ ràng, đơn giản
const danhSachNguoiDung = users.filter(u => u.isActive);
const tinhTong = (a, b) => a + b;

// ❌ Kém - Tên mơ hồ, phức tạp
const data = users.filter(function(user) { return user.isActive === true; });
```

---

## Comment

**Chỉ comment khi thực sự cần thiết**.

### Khi Nên Comment
- ✅ Giải thích TẠI SAO (why), không phải CÁ GÌ (what)
- ✅ Ghi chú quyết định quan trọng, edge cases, rủi ro
- ✅ Giải thích thuật toán phức tạp

### Khi KHÔNG Nên Comment
- ❌ Code đã tự giải thích
- ❌ Lặp lại những gì code đang làm
- ❌ Code xấu → thay vì comment thì refactor

### Quy Tắc
- ✅ Comment bằng **tiếng Việt**, ngắn gọn
- ✅ Cập nhật khi code thay đổi

### Ví dụ
```javascript
// ✅ Tốt - Giải thích tại sao
// Sử dụng Set để loại bỏ trùng lặp nhanh hơn O(1) lookup
const uniqueUsers = [...new Set(userIds)];

// ✅ Tốt - Cảnh báo rủi ro
// CẢNH BÁO: Hàm này không validate input
const processUser = (user) => { /* ... */ };

// ❌ Kém - Lặp lại code
// Filter các users đang active
const activeUsers = users.filter(u => u.isActive);
```

---

## Tổng Kết

1. **Giao tiếp**: Luôn dùng tiếng Việt
2. **Tài liệu**: Bằng tiếng Việt, cấu trúc rõ ràng
3. **Code**: Đọc hiểu là quan trọng nhất, code tự giải thích
4. **Comment**: Chỉ khi cần thiết, giải thích tại sao

**Quy tắc vàng**: Code khó hiểu → refactor trước khi comment.

**Reference**: [code-quality.md](.opencode/context/core/standards/code-quality.md)
