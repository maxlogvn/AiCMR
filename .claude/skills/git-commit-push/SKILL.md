---
name: git-commit-push
description: |
  TỰ ĐỘNG COMMIT VÀ PUSH CODE - AUTO COMMIT MESSAGE GENERATION

  ✅ LUÔN SỬ DỤNG SKILL NÀY KHI:
  - Người dùng yêu cầu commit code
  - Người dùng yêu cầu push code
  - Người dùng nói "lưu code lên git", "đẩy code lên git"
  - Sau khi hoàn thành tính năng cần commit

  Keywords: commit, push, git, save, upload, github

  triggers:
    - "commit code"
    - "push code"
    - "lưu code"
    - "đẩy code"
    - "up git"

  priority: MEDIUM
  category: git-automation
---

# 🚀 Git Commit & Push Skill

**Skill này tự động tạo commit message và push code lên GitHub.**

---

## 📝 Format Commit Message

```
<emoji> <type>: <description>

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### Types và Emoji tương ứng:

| Type | Emoji | Mô tả | Ví dụ |
|------|-------|-------|-------|
| feat | ✨ | Tính năng mới | ✨ feat: add user login |
| fix | 🐛 | Sửa bug | 🐛 fix: resolve timeout issue |
| refactor | ♻️ | Refactor code | ♻️ refactor: reorganize folder |
| style | 💄 | Đổi format/style | 💄 style: format with prettier |
| docs | 📝 | Thêm/sửa docs | 📝 docs: update README |
| test | ✅ | Thêm/sửa tests | ✅ test: add unit tests |
| chore | 🔧 | Config, dependencies | 🔧 chore: update dependencies |
| perf | ⚡ | Performance | ⚡ perf: optimize queries |
| delete | 🗑️ | Xóa code/file | 🗑️ delete: remove unused utils |

---

## 🤖 AI Agent Workflow

### Step 1: Kiểm tra trạng thái git
```bash
git status
```

### Step 2: Xem các thay đổi
```bash
git diff
git diff --staged
```

### Step 3: Phân tích và tạo commit message
Dựa trên các thay đổi, xác định:
- **Type**: feat, fix, refactor, docs, etc.
- **Description**: Mô tả ngắn gọn những gì thay đổi

### Step 4: Stage và Commit
```bash
# Stage các file cần thiết (KHÔNG git add -A để tránh commit secrets)
git add <file1> <file2> ...

# Commit với message
git commit -m "<commit message>"
```

### Step 5: Push lên remote
```bash
git push
```

---

## 🚨 Security Rules - KHÔNG BAO GIỜ commit:

❌ `.env` - Environment variables
❌ `*.key`, `*.pem` - Private keys
❌ `credentials.json`, `secrets.yaml` - Credentials
❌ `node_modules/.cache` - Cache files
❌ `.DS_Store`, `Thumbs.db` - System files
❌ `__pycache__`, `.pyc` - Python cache
❌ `*.log` - Log files (nếu chứa sensitive data)

---

## 📊 Decision Tree - Xác định Type

```
Thay đổi code
    |
    ├─ Thêm tính năng mới? → ✨ feat
    ├─ Sửa bug? → 🐛 fix
    ├─ Viết lại code (giữ nguyên chức năng)? → ♻️ refactor
    ├─ Thay đổi format/style? → 💄 style
    ├─ Thêm/sửa tài liệu? → 📝 docs
    ├─ Thêm/sửa test? → ✅ test
    ├─ Cấu hình, dependency? → 🔧 chore
    ├─ Tối ưu hiệu năng? → ⚡ perf
    ├─ CI/CD, build? → 👷 ci / 📦 build
    ├─ Hoàn tác thay đổi? → ⏪ revert
    └─ Xóa code/file không dùng? → 🗑️ delete
```

---

## 🎯 Ví dụ thực tế

### Ví dụ 1: Thêm tính năng mới
```
User: "Commit code giùm"

Agent:
→ git status: M frontend/src/components/auth/Login.tsx
→ git diff: [Thêm login function]
→ Phân tích: Thêm tính năng login → Type: feat
→ git add frontend/src/components/auth/Login.tsx
→ git commit -m "✨ feat: add user login functionality"
→ git push
```

### Ví dụ 2: Sửa bug
```
User: "Push code lên git"

Agent:
→ git status: M frontend/src/hooks/usePosts.ts
→ git diff: [Sửa lỗi load posts]
→ Phân tích: Sửa bug → Type: fix
→ git add frontend/src/hooks/usePosts.ts
→ git commit -m "🐛 fix: resolve posts loading issue"
→ git push
```

---

## 🔄 Commit Message Template

### Template cơ bản:
```
<emoji> <type>: <description>
```

### Template với body:
```
<emoji> <type>: <description>

- Chi tiết 1
- Chi tiết 2

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

---

## ✅ Checklist trước khi Commit

- [ ] Review `git diff` để đảm bảo không commit sensitive data
- [ ] Chỉ commit những file cần thiết (KHÔNG `git add -A`)
- [ ] Commit message đúng format
- [ ] Pull latest changes trước khi push (nếu cần)

---

**Version**: 1.0
**Updated**: 2026-01-23
