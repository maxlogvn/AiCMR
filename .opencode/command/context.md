---
description: Hệ thống quản lý context - harvest summaries, extract knowledge, organize context
tags:
  - context
  - knowledge-management
  - harvest
dependencies:
  - subagent:context-organizer
  - subagent:contextscout
---

# Context Manager

<critical_rules priority="absolute" enforcement="strict">
  <rule id="mvi_strict">
    Files PHẢI <200 dòng. Chỉ extract core concepts (1-3 câu), 3-5 key points, ví dụ tối thiểu, link tham khảo.
  </rule>

  <rule id="approval_gate">
    LUÔN hiển thị UI xác nhận trước khi xóa/lưu trữ files. Chọn dựa trên chữ cái (A B C hoặc 'all'). KHÔNG BAO GIờ tự động xóa.
  </rule>

  <rule id="function_structure">
    LUÔN tổ chức theo chức năng: concepts/, examples/, guides/, lookup/, errors/ (không phải file phẳng).
  </rule>

  <rule id="lazy_load">
    LUÔN đọc các file context cần thiết từ .opencode/context/core/context-system/ TRƯỚC khi thực hiện operations.
  </rule>
</critical_rules>

<execution_priority>
  <tier level="1" desc="Safety & MVI">
    - Files <200 dòng (@critical_rules.mvi_strict)
    - Hiển thị xác nhận trước khi cleanup (@critical_rules.approval_gate)
    - Cấu trúc theo chức năng (@critical_rules.function_structure)
    - Load context trước khi operations (@critical_rules.lazy_load)
  </tier>
  <tier level="2" desc="Core Operations">
    - Harvest (default), Extract, Organize, Update workflows
  </tier>
  <tier level="3" desc="Enhancements">
    - Cross-references, validation, navigation
  </tier>
  <conflict_resolution>
    Tier 1 luôn ghi đè Tier 2/3.
  </conflict_resolution>
</execution_priority>

**Arguments**: `$ARGUMENTS`

---

## Hành Vi Mặc Định (Không Có Arguments)

Khi gọi mà không có arguments: `/context`

<workflow id="default_scan_harvest">
  <stage id="1" name="QuickScan">
    Quét workspace tìm các file summary:
    - *OVERVIEW.md, *SUMMARY.md, SESSION-*.md, CONTEXT-*.md
    - Files trong thư mục .tmp/
    - Files >2KB trong thư mục root
  </stage>

  <stage id="2" name="Report">
    Hiển thị những gì đã tìm thấy:
    ```
    Kết quả quét nhanh:

    Tìm thấy 3 file summary:
      📄 CONTEXT-SYSTEM-OVERVIEW.md (4.2 KB)
      📄 SESSION-auth-work.md (1.8 KB)
      📄 .tmp/NOTES.md (800 bytes)

    Hành động đề xuất:
      /context harvest  - Dọn dẹp summaries → permanent context

    Các tùy chọn khác:
      /context extract {source}  - Extract từ docs/code
      /context organize {category}  - Tái cấu trúc files hiện có
      /context help  - Hiển thị tất cả operations
    ```
  </stage>
</workflow>

**Mục đích**: Dọn dẹp nhanh. Mặc định giả định bạn muốn harvest summaries và gọn workspace.

---

## Operations

### Chính: Harvest & Compact (Focus Mặc Định)

**`/context harvest [path]`** ⭐ Phổ Biến Nhất
- Extract kiến thức từ AI summaries → permanent context
- Dọn workspace (lưu trữ/xóa summaries)
- **Đọc**: `operations/harvest.md` + `standards/mvi.md`

**`/context compact {file}`**
- Rút gọn file dài xuống format MVI
- **Đọc**: `guides/compact.md` + `standards/mvi.md`

---

### Phụ: Tạo Context Tùy Chỉnh

**`/context extract from {source}`**
- Extract context từ docs/code/URLs
- **Đọc**: `operations/extract.md` + `standards/mvi.md` + `guides/compact.md`

**`/context organize {category}`**
- Tái cấu trúc files phẳng → folders theo chức năng
- **Đọc**: `operations/organize.md` + `standards/structure.md`

**`/context update for {topic}`**
- Cập nhật context khi APIs/frameworks thay đổi
- **Đọc**: `operations/update.md` + `guides/workflows.md`

**`/context error for {error}`**
- Thêm lỗi lặp lại vào knowledge base
- **Đọc**: `operations/error.md` + `standards/templates.md`

**`/context create {category}`**
- Tạo category context mới với cấu trúc
- **Đọc**: `guides/creation.md` + `standards/structure.md` + `standards/templates.md`

---

### Utility Operations

**`/context map [category]`**
- Xem cấu trúc context hiện tại, số lượng files

**`/context validate`**
- Kiểm tra tính toàn vẹn, references, kích thước files

**`/context help`**
- Hiển thị tất cả operations với ví dụ

---

## Chiến Lược Lazy Loading

<lazy_load_map>
  <operation name="default">
    Đọc: operations/harvest.md, standards/mvi.md
  </operation>

  <operation name="harvest">
    Đọc: operations/harvest.md, standards/mvi.md, guides/workflows.md
  </operation>

  <operation name="compact">
    Đọc: guides/compact.md, standards/mvi.md
  </operation>

  <operation name="extract">
    Đọc: operations/extract.md, standards/mvi.md, guides/compact.md, guides/workflows.md
  </operation>

  <operation name="organize">
    Đọc: operations/organize.md, standards/structure.md, guides/workflows.md
  </operation>

  <operation name="update">
    Đọc: operations/update.md, guides/workflows.md, standards/mvi.md
  </operation>

  <operation name="error">
    Đọc: operations/error.md, standards/templates.md, guides/workflows.md
  </operation>

  <operation name="create">
    Đọc: guides/creation.md, standards/structure.md, standards/templates.md
  </operation>
</lazy_load_map>

**Tất cả files nằm trong**: `.opencode/context/core/context-system/`

---

## Routing Subagent

<subagent_routing>
  <!-- Giao operations cho các subagent chuyên biệt -->
  <route operations="harvest|extract|organize|update|error|create" to="ContextOrganizer">
    Truyền: tên operation, arguments, lazy load map
    Subagent loads: Các file context cần thiết từ .opencode/context/core/context-system/
    Subagent executes: Quy trình đa giai đoạn theo operation
  </route>

  <route operations="map|validate" to="ContextScout">
    Truyền: tên operation, arguments
    Subagent executes: Phân tích và báo cáo chỉ đọc
  </route>
</subagent_routing>

---

## Tham Khảo Nhanh

### Cấu Trúc
```
.opencode/context/core/context-system/
├── operations/     # Cách làm việc (harvest, extract, organize, update)
├── standards/      # Cái cần tuân theo (mvi, structure, templates)
└── guides/         # Hướng dẫn từng bước (workflows, compact, creation)
```

### Nguyên Tắc MVI (Nhanh)
- Core concept: 1-3 câu
- Key points: 3-5 bullets
- Minimal example: <10 dòng
- Reference link: đến docs đầy đủ
- File size: <200 dòng

### Cấu Trúc Theo Chức Năng (Nhanh)
```
{category}/
├── navigation.md       # Điều hướng
├── concepts/       # Là gì
├── examples/       # Code hoạt động
├── guides/         # Cách làm
├── lookup/         # Tham khảo nhanh
└── errors/         # Các vấn đề phổ biến
```

---

## Ví Dụ

### Mặc Định (Quick Scan)
```bash
/context
# Quét workspace, đề xuất harvest nếu tìm thấy summaries
```

### Harvest Summaries
```bash
/context harvest
/context harvest .tmp/
/context harvest OVERVIEW.md
```

### Extract từ Docs
```bash
/context extract from docs/api.md
/context extract from https://react.dev/hooks
```

### Organize Existing
```bash
/context organize development/
/context organize development/ --dry-run
```

### Update cho Thay Đổi
```bash
/context update for Next.js 15
/context update for React 19 breaking changes
```

---

## Tiêu Chuẩn Thành Công

Sau bất kỳ operation nào:
- [ ] Tất cả files <200 dòng? (@critical_rules.mvi_strict)
- [ ] Cấu trúc theo chức năng đã dùng? (@critical_rules.function_structure)
- [ ] UI xác nhận đã hiển thị cho các ops phá hủy? (@critical_rules.approval_gate)
- [ ] Context cần thiết đã load? (@critical_rules.lazy_load)
- [ ] navigation.md đã cập nhật?
- [ ] Files có thể quét trong <30 giây?

---

## Tài Liệu Đầy Đủ

**Vị Trí Context System**: `.opencode/context/core/context-system/`

**Cấu trúc**:
- `operations/` - Workflows operation chi tiết
- `standards/` - MVI, structure, templates
- `guides/` - Ví dụ tương tác, tiêu chuẩn creation

**Đọc trước khi dùng**: `standards/mvi.md` (hiểu nguyên tắc Minimal Viable Information)
