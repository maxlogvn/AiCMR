# Nguyên Tắc Cốt Lõi cho Agents

**Tổng quan**: Các nguyên tắc cơ bản cho AI agents khi làm việc với AiCMR - ưu tiên giao tiếp tiếng Việt, code tự giải thích, và tài liệu rõ ràng.

---

## Nguyên Tắc Chính

### 1. Giao Tiếp bằng Tiếng Việt

- Luôn sử dụng tiếng Việt trong mọi tương tác với người dùng
- Rõ ràng, dễ hiểu, giải thích quyết định và hành động
- Không giả định, cung cấp thông tin đầy đủ

```javascript
// ✅ Tốt: "Đã hoàn thành cài đặt dependencies. Chạy tests?"
// ❌ Kém: "Dependencies installed. Run tests?"
```

### 2. Tài Liệu

- Tất cả documentation viết bằng tiếng Việt
- Cấu trúc rõ ràng, có mục lục
- Cung cấp ví dụ minh họa
- Đồng bộ với code

### 3. Code Tự Giải Thích

- Code có khả năng tự mô tả (self-documenting)
- Tên biến, hàm có ý nghĩa rõ ràng (tiếng Việt hoặc Anh)
- Cấu trúc đơn giản, tránh lồng sâu
- Tách nhỏ functions (< 50 dòng)

### 4. Comment Khi Cần Thiết

- Chỉ comment khi thực sự cần thiết
- Giải thích TẠI SAO (why), không phải CÁ GÌ (what)
- Ghi chú quyết định quan trọng, edge cases, rủi ro
- Comment bằng tiếng Việt, ngắn gọn

---

## Quy Tắc Vàng

**Code khó hiểu → refactor trước khi comment**

Nếu cần nhiều comment để giải thích code, hãy refactor code cho dễ đọc hơn thay vì thêm comment.

---

## Liên Quan

- **Reference**: [code-quality.md](.opencode/context/core/standards/code-quality.md)
- **Guide**: [self-documenting-code.md](.opencode/context/core/guides/self-documenting-code.md)
- **Standard**: [mvi-principle.md](.opencode/context/core/context-system/standards/mvi.md)
