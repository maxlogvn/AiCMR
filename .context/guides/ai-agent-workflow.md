# AI Agent Workflow

Quy trình làm việc của AI Agents trong dự án AiCMR.

## 🎯 Quy Trình Chính

1. **Phân tích Yêu cầu**
   - Đọc `.context/` trước
   - Rà soát docs/ và code hiện tại
   - Hiểu rõ mục tiêu

2. **Kế Hoách**
   - Đề xuất plan
   - Chia nhỏ tasks
   - Xác định dependencies

3. **Thực Thi** (với Approval)
   - Load context cần thiết
   - Thực thi từng task
   - Run tests/validate
   - Request phê duyệt thay đổi

4. **Kết Quả**
   - Tổng kết kết quả
   - Cập nhật context (nếu cần)
   - Gợi ý next steps

---

## 🚦 Approval Gates

**QUAN TRỌNG**: Mọi thao tác xóa/deploy yêu cầu approval

**Examples**:
- ❌ **KHÔNG tự động**:
  - Xóa file
  - Drop database tables
  - Deploy code

- ✅ **Luôn yêu cầu**:
  - "Xóa file X? [A] Đồng ý [B] Lưu backup [C] Hủy bỏ"
  - "Deploy code? [A] Đồng ý [B] Review trước"

---

## 📚 Context Loading Rules

**Mandatory** trước khi code:
1. `.context/concepts/docker-workflow.md` - nếu làm với Docker
2. `.context/concepts/code-style.md` - nếu code backend
3. `.context/concepts/code-style-frontend.md` - nếu code frontend
4. `.context/concepts/security.md` - nếu làm với bảo mật/auth

**Lazy Loading**: Chỉ đọc khi cần để tối ưu performance.

---

## 🛠 Common Operations

### Code Changes
1. Kiểm tra code style từ context
2. Implement theo standards
3. Run tests
4. Lint code
5. Request approval

### Bug Fixes
1. Đọc error logs
2. Tham khảo `.context/errors/common-errors.md`
3. Trace code
4. Implement fix
5. Validate fix
6. Request approval

### Database Changes
1. Tham khảo `.context/concepts/database-schema.md`
2. Tạo migration: `alembic revision --autogenerate`
3. Test migration
4. Request approval để `alembic upgrade head`

---

## 📋 Best Practices

1. **Context first**: Luôn đọc context trước
2. **Test locally**: Chỉ test trong Docker
3. **Incremental**: Code nhỏ, commit nhỏ
4. **Review**: Self-review trước khi hoàn thành
5. **Backup**: Quan trọng khi làm với database

---

## 🔗 Related Context

- Docker commands: `.context/concepts/docker-workflow.md`
- Backend code: `.context/concepts/code-style.md`
- Frontend code: `.context/concepts/code-style-frontend.md`
- Security: `.context/concepts/security.md`
- Errors: `.context/errors/common-errors.md`

---

*Chi tiết: [AGENTS.md](../../AGENTS.md)*
