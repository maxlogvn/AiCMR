---
description: Validate context file dependencies trên agents và registry
tags:
  - registry
  - validation
  - context
  - dependencies
  - openagents
dependencies:
  - subagent:codebase-pattern-analyst
---

# Kiểm Tra Context Dependencies

**Mục đích**: Đảm bảo agents khai báo đúng dependencies của context files trong frontmatter và registry.

**Arguments**: `$ARGUMENTS`

---

## Những Gì Nó Làm

Validate tính nhất quán giữa:
1. **Sử dụng thực tế** - Context files được tham chiếu trong agent prompts
2. **Khai báo dependencies** - Dependencies trong frontmatter của agent
3. **Registry entries** - Dependencies trong registry.json

**Xác định**:
- ✅ Thiếu khai báo dependencies (agents dùng context nhưng không khai báo)
- ✅ Context files không dùng (tồn tại nhưng không agent nào tham chiếu)
- ✅ Các tham chiếu bị hỏng (được tham chiếu nhưng không tồn tại)
- ✅ Các không nhất quán về format (sai format dependency)

---

## Cách Sử Dụng

```bash
# Phân tích tất cả agents
/check-context-deps

# Phân tích agent cụ thể
/check-context-deps contextscout

# Tự động sửa dependencies thiếu
/check-context-deps --fix

# Output chi tiết (hiển thị tất cả các vị trí tham chiếu)
/check-context-deps --verbose

# Kết hợp flags
/check-context-deps contextscout --verbose
```

---

## Workflow

<workflow id="analyze_context_dependencies">
  <stage id="1" name="ScanAgents" required="true">
    Quét agent files để tìm các tham chiếu context:

    **Các pattern tìm kiếm**:
    - `.opencode/context/` (tham chiếu đường dẫn trực tiếp)
    - `@.opencode/context/` (tham chiếu với ký hiệu @)
    - `context:` (khai báo dependencies trong frontmatter)

    **Vị trí**:
    - `.opencode/agent/**/*.md` (tất cả agents và subagents)
    - `.opencode/command/**/*.md` (commands dùng context)

    **Trích xuất**:
    - ID của agent/command
    - Đường dẫn context file
    - Số dòng
    - Loại tham chiếu (đường dẫn, tham chiếu @-, dependency)
  </stage>

  <stage id="2" name="CheckRegistry" required="true">
    Đối với mỗi agent tìm thấy, kiểm tra registry.json:

    ```bash
    jq '.components.agents[] | select(.id == "AGENT_ID") | .dependencies' registry.json
    jq '.components.subagents[] | select(.id == "AGENT_ID") | .dependencies' registry.json
    ```

    **Verify**:
    - Agent có mảng dependencies không?
    - Các tham chiếu context files được khai báo là `context:core/standards/code` không?
    - Các format dependencies có đúng không (`context:path/to/file`)?
  </stage>

  <stage id="3" name="ValidateContextFiles" required="true">
    Đối với mỗi context file được tham chiếu:

    **Kiểm tra tồn tại**:
    ```bash
    test -f .opencode/context/core/standards/code-quality.md
    ```

    **Kiểm tra registry**:
    ```bash
    jq '.components.contexts[] | select(.id == "core/standards/code")' registry.json
    ```

    **Xác định các vấn đề**:
    - Context file được tham chiếu nhưng không tồn tại
    - Context file tồn tại nhưng không trong registry
    - Context file trong registry nhưng không bao giờ được dùng
  </stage>

  <stage id="4" name="Report" required="true">
    Tạo báo cáo toàn diện:

    ```markdown
    # Báo Cáo Phân Tích Context Dependencies

    ## Tóm Tắt
    - Agents được quét: 25
    - Context files được tham chiếu: 12
    - Dependencies thiếu: 8
    - Context files không dùng: 2
    - Context files thiếu: 0

    ## Dependencies Thiếu (agents dùng context nhưng không khai báo)

    ### opencoder
    **Dùng nhưng không khai báo**:
    - context:core/standards/code (được tham chiếu 3 lần)
      - Dòng 64: "Code tasks → .opencode/context/core/standards/code-quality.md (MANDATORY)"
      - Dòng 170: "Read .opencode/context/core/standards/code-quality.md NOW"
      - Dòng 229: "NEVER execute write/edit without loading required context first"

    **Dependencies hiện tại**: subagent:task-manager, subagent:coder-agent
    **Sửa khuyến nghị**: Thêm vào frontmatter:
    ```yaml
    dependencies:
      - subagent:task-manager
      - subagent:coder-agent
      - context:core/standards/code  # ADD THIS
    ```

    ### openagent
    **Dùng nhưng không khai báo**:
    - context:core/standards/code (được tham chiếu 5 lần)
    - context:core/standards/docs (được tham chiếu 3 lần)
    - context:core/standards/tests (được tham chiếu 3 lần)
    - context:core/workflows/review (được tham chiếu 2 lần)
    - context:core/workflows/delegation (được tham chiếu 4 lần)

    **Sửa khuyến nghị**: Thêm vào frontmatter:
    ```yaml
    dependencies:
      - subagent:task-manager
      - subagent:documentation
      - context:core/standards/code
      - context:core/standards/docs
      - context:core/standards/tests
      - context:core/workflows/review
      - context:core/workflows/delegation
    ```

    ## Context Files Không Dùng (tồn tại nhưng không agent nào tham chiếu)

    - context:core/standards/analysis (0 tham chiếu)
    - context:core/workflows/sessions (0 tham chiếu)

    **Khuyến nghị**: Cân nhắc xóa hoặc tài liệu hóa cách dùng định

    ## Context Files Thiếu (được tham chiếu nhưng không tồn tại)

    Không tìm thấy nào ✅

    ## Context File Usage Map

    | Context File | Dùng Bởi | Số Lượng Tham Chiếu |
    |--------------|---------|-----------------|
    | core/standards/code | opencoder, openagent, frontend-specialist, reviewer | 15 |
    | core/standards/docs | openagent, documentation, technical-writer | 8 |
    | core/standards/tests | openagent, tester | 6 |
    | core/workflows/delegation | openagent, task-manager | 5 |
    | core/workflows/review | openagent, reviewer | 4 |

    ---

    ## Các Bước Tiếp Theo

    1. Xem lại các dependencies thiếu ở trên
    2. Chạy `/check-context-deps --fix` để tự động cập nhật frontmatter
    3. Chạy `./scripts/registry/auto-detect-components.sh` để cập nhật registry
    4. Verify với `./scripts/registry/validate-registry.sh`
    ```
  </stage>

  <stage id="5" name="Fix" when="--fix flag được cung cấp">
    Đối với mỗi agent có thiếu context dependencies:

    1. Đọc file agent
    2. Phân tích cú pháp frontmatter YAML
    3. Thêm context dependencies còn thiếu vào mảng dependencies
    4. Giữ nguyên dependencies hiện có
    5. Ghi file đã cập nhật
    6. Báo cáo những gì đã thay đổi

    **Ví dụ**:
    ```diff
    ---
    id: opencoder
    dependencies:
      - subagent:task-manager
      - subagent:coder-agent
    + - context:core/standards/code
    ---
    ```

    **An toàn**:
    - Chỉ thêm các dependencies thực sự được tham chiếu trong file
    - Không xóa dependencies hiện có
    - Giữ nguyên định dạng frontmatter
    - Hiển thị diff trước khi áp dụng (nếu tương tác)
  </stage>
</workflow>

---

## Chi Tiết Triển Khai

### Các Pattern Tìm Kiếm

**Tìm tham chiếu đường dẫn trực tiếp**:
```bash
grep -rn "\.opencode/context/" .opencode/agent/ .opencode/command/
```

**Tìm tham chiếu @**:
```bash
grep -rn "@\.opencode/context/" .opencode/agent/ .opencode/command/
```

**Tìm khai báo dependencies**:
```bash
grep -rn "^\s*-\s*context:" .opencode/agent/ .opencode/command/
```

### Chuẩn Hóa Đường Dẫn

**Chuyển sang format dependency**:
- `.opencode/context/core/standards/code-quality.md` → `context:core/standards/code`
- `@.opencode/context/openagents-repo/quick-start.md` → `context:openagents-repo/quick-start`
- `context/core/standards/code` → `context:core/standards/code`

**Quy tắc**:
1. Loại bỏ tiền tố `.opencode/`
2. Loại bỏ phần mở rộng `.md`
3. Thêm tiền tố `context:` cho dependencies

### Registry Lookup

**Kiểm tra nếu context file có trong registry**:
```bash
jq '.components.contexts[] | select(.id == "core/standards/code")' registry.json
```

**Lấy agent dependencies**:
```bash
jq '.components.agents[] | select(.id == "opencoder") | .dependencies[]?' registry.json
```

---

## Delegation

Lệnh này ủy quyền cho một agent phân tích để thực hiện công việc:

```javascript
task(
  subagent_type="PatternAnalyst",
  description="Phân tích context dependencies",
  prompt=`
    Phân tích sử dụng context files trên tất cả agents trong repository này.

    TASK:
    1. Sử dụng grep để tìm tất cả tham chiếu đến context files trong:
       - .opencode/agent/**/*.md
       - .opencode/prompts/**/*.md

    2. Tìm kiếm các pattern này:
       - ".opencode/context/core/" (đường dẫn trực tiếp)
       - "@.opencode/context/" (tham chiếu @)
       - "context:" trong frontmatter (khai báo dependencies)

    3. Đối với mỗi file agent tìm thấy:
       - Trích xuất ID agent từ frontmatter
       - Liệt kê tất cả context files nó tham chiếu
       - Kiểm tra registry.json để tìm các dependencies được khai báo
       - Xác định các khai báo dependencies còn thiếu

    4. Đối với mỗi context file trong .opencode/context/core/:
       - Đếm bao nhiêu agents tham chiếu nó
       - Kiểm tra nếu nó tồn tại trong registry.json
       - Xác định các context files không dùng

    5. Tạo một báo cáo toàn diện hiển thị:
       - Agents có thiếu context dependencies
       - Context files không dùng
       - Context files thiếu (được tham chiếu nhưng không tồn tại)
       - Context file usage map (agents nào dùng files nào)

    ${ARGUMENTS.includes('--fix') ? `
    6. CHẾ ĐỘ TỰ ĐỘNG SỬA:
       - Cập nhật frontmatter agent để thêm context dependencies còn thiếu
       - Sử dụng format: context:core/standards/code
       - Giữ nguyên dependencies hiện có
       - Hiển thị những gì đã thay đổi
    ` : ''}

    ${ARGUMENTS.includes('--verbose') ? `
    CHẾ ĐỘ VERBOS: Bao gồm tất cả các vị trí tham chiếu (file:dòng) trong báo cáo
    ` : ''}

    ${ARGUMENTS.length > 0 && !ARGUMENTS.includes('--') ? `
    BỘ LỌC: Chỉ phân tích agent: ${ARGUMENTS[0]}
    ` : ''}

    ĐỊNH DẠNG BÁO CÁO:
    - Thống kê tóm tắt
    - Dependencies còn thiếu theo agent (với sửa khuyến nghị)
    - Context files không dùng
    - Context file usage map
    - Các bước tiếp theo

    KHÔNG thực hiện thay đổi mà không có flag --fix.
    LUÔN hiển thị những gì sẽ thay đổi trước khi áp dụng sửa.
  `
)
```

---

## Ví Dụ

### Ví Dụ 1: Phân Tích Cơ Bản

```bash
/check-context-deps
```

**Đầu ra**:
```
Đang phân tích sử dụng context files trên 25 agents...

Tìm thấy 8 agents có thiếu context dependencies:
- opencoder: thiếu context:core/standards/code
- openagent: thiếu 5 context dependencies
- frontend-specialist: thiếu context:core/standards/code
...

Chạy /check-context-deps --fix để tự động cập nhật frontmatter
```

### Ví Dụ 2: Phân Tích Agent Cụ Thể

```bash
/check-context-deps contextscout
```

**Đầu ra**:
```
Đang phân tích agent: contextscout

Context files được tham chiếu:
✓ .opencode/context/core/context-system.md (1 tham chiếu)
  - Dòng 15: "Load: context:core/context-system"
✓ .opencode/context/core/context-system/standards/mvi.md (2 tham chiếu)
  - Dòng 16: "Load: context:core/context-system/standards/mvi"
  - Dòng 89: "MVI-aware prioritization"

Registry dependencies:
✓ context:core/context-system ĐÃ KHAI BÁO
✓ context:core/context-system/standards/mvi ĐÃ KHAI BÁO

Tất cả dependencies được khai báo đúng ✅
```

### Ví Dụ 3: Tự Động Sửa

```bash
/check-context-deps --fix
```

**Đầu ra**:
```
Đang phân tích và sửa context dependencies...

Đã cập nhật opencoder:
+ Đã thêm: context:core/standards/code

Đã cập nhật openagent:
+ Đã thêm: context:core/standards/code
+ Đã thêm: context:core/standards/docs
+ Đã thêm: context:core/standards/tests
+ Đã thêm: context:core/workflows/review
+ Đã thêm: context:core/workflows/delegation

Tổng: 2 agents được cập nhật, 6 dependencies được thêm

Tiếp theo: Chạy ./scripts/registry/auto-detect-components.sh để cập nhật registry
```

---

## Tiêu Chuẩn Thành Công

✅ Tất cả agents tham chiếu context files có chúng được khai báo trong dependencies
✅ Tất cả context files trong registry thực sự được dùng bởi ít nhất một agent
✅ Không có tham chiếu bị hỏng (context files được tham chiếu nhưng không tồn tại)
✅ Format dependency nhất quán (`context:path/to/file`)

---

## Ghi Chú

- **Chỉ đọc theo mặc định** - Chỉ báo cáo phát hiện, không sửa đổi files
- **Sử dụng `--fix` để cập nhật** - Tự động thêm dependencies còn thiếu vào frontmatter
- **Sau khi sửa** - Chạy `./scripts/registry/auto-detect-components.sh --auto-add` để đồng bộ registry
- **Format dependency** - `context:path/to/file` (không có tiền tố `.opencode/`, không có phần mở rộng `.md`)
- **Quét cả hai** - Tham chiếu đường dẫn trực tiếp và tham chiếu @

## Liên Quan

- **Registry validation**: `./scripts/registry/validate-registry.sh`
- **Auto-detect components**: `./scripts/registry/auto-detect-components.sh`
- **Context guide**: `.opencode/context/openagents-repo/quality/registry-dependencies.md`
