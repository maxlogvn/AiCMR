# Validate Repository

Lệnh validate toàn diện kiểm tra toàn bộ repository OpenAgents Control để đảm bảo tính nhất quán giữa CLI, tài liệu, registry, và components.

## Cách Sử Dụng

```bash
/validate-repo
```

## Những Gì Nó Kiểm Tra

Lệnh này thực hiện validate toàn diện của:

1. **Tính Toàn Vẹn Registry**
   - Validate cú pháp JSON
   - Tính đầy đủ định nghĩa components
   - Tham chiếu đường dẫn files
   - Khai báo dependencies

2. **Sự Tồn Tại Của Components**
   - Tất cả agents tồn tại tại các đường dẫn được chỉ định
   - Tất cả subagents tồn tại tại các đường dẫn được chỉ định
   - Tất cả commands tồn tại tại các đường dẫn được chỉ định
   - Tất cả tools tồn tại tại các đường dẫn được chỉ định
   - Tất cả plugins tồn tại tại các đường dẫn được chỉ định
   - Tất cả context files tồn tại tại các đường dẫn được chỉ định
   - Tất cả config files tồn tại tại các đường dẫn được chỉ định

3. **Tính Nhất Quán Profiles**
   - Số lượng components khớp với tài liệu
   - Mô tả profiles chính xác
   - Dependencies được thỏa mãn
   - Không có components trùng lặp

4. **Độ Chính Xác Tài Liệu**
   - Số lượng components README khớp với registry
   - Các tham chiếu tài liệu OpenAgent hợp lệ
   - Các tham chiếu context files đúng
   - Hướng dẫn cài đặt cập nhật

5. **Cấu Trúc Context Files**
   - Tất cả context files được tham chiếu tồn tại
   - Tổ chức context files đúng
   - Không có context files mồ côi

6. **Cross-References**
   - Agent dependencies tồn tại
   - Tham chiếu subagents hợp lệ
   - Tham chiếu commands hợp lệ
   - Tool dependencies được thỏa mãn

## Đầu Ra

Lệnh tạo báo cáo chi tiết hiển thị:
- ✅ Điều gì đúng và đã được validate
- ⚠️ Cảnh báo cho các vấn đề tiềm ẩn
- ❌ Lỗi cần sửa
- 📊 Thống kê tóm tắt

## Hướng Dẫn

Bạn là chuyên gia validation. Nhiệm vụ của bạn là validate toàn diện repository OpenAgents Control để đảm bảo tính nhất quán và đúng đắn.

### Bước 1: Validate Registry JSON

1. Đọc và phân tích cú pháp `registry.json`
2. Validate cú pháp JSON
3. Kiểm tra cấu trúc schema:
   - Trường `version` tồn tại
   - Trường `repository` tồn tại
   - Object `categories` tồn tại
   - Object `components` tồn tại với tất cả types
   - Object `profiles` tồn tại
   - Object `metadata` tồn tại

### Bước 2: Validate Định Nghĩa Components

Đối với mỗi loại component (agents, subagents, commands, tools, plugins, contexts, config):

1. Kiểm tra các trường bắt buộc:
   - `id` (duy nhất)
   - `name`
   - `type`
   - `path`
   - `description`
   - `tags` (array)
   - `dependencies` (array)
   - `category`

2. Verify file tồn tại tại `path`
3. Kiểm tra các IDs trùng lặp
4. Validate category nằm trong các categories được định nghĩa

### Bước 3: Validate Profiles

Đối với mỗi profile (essential, developer, business, full, advanced):

1. Đếm components trong profile
2. Verify tất cả tham chiếu components tồn tại trong section components
3. Kiểm tra dependencies được thỏa mãn
4. Validate không có components trùng lặp

### Bước 4: Cross-Reference với Tài Liệu

1. **navigation.md**:
   - Trích xuất số lượng components từ mô tả profiles
   - So sánh với số lượng registry thực tế
   - Kiểm tra mô tả profiles khớp với mô tả registry

2. **docs/agents/openagent.md**:
   - Verify tiêu chí delegation được đề cập
   - Kiểm tra tham chiếu context files
   - Validate mô tả workflows

3. **docs/getting-started/installation.md**:
   - Kiểm tra mô tả profiles
   - Verify lệnh cài đặt

### Bước 5: Validate Cấu Trúc Context Files

1. Liệt kê tất cả files trong `.opencode/context/`
2. Kiểm tra với các entries context trong registry
3. Xác định files mồ côi (tồn tại nhưng không trong registry)
4. Xác định files thiếu (trong registry nhưng không tồn tại)
5. Validate cấu trúc:
   - Files `core/standards/`
   - Files `core/workflows/`
   - Files `core/system/`
   - Files `project/`

### Bước 6: Validate Dependencies

Đối với mỗi component có dependencies:

1. Phân tích chuỗi dependency (format: `type:id`)
2. Verify component được tham chiếu tồn tại
3. Kiểm tra các dependencies vòng tròn
4. Validate tính đầy đủ chuỗi dependencies

### Bước 7: Tạo Báo Cáo

Tạo báo cáo toàn diện với các section:

#### ✅ Validated Thành Công
- Cú pháp Registry JSON
- Sự tồn tại file components
- Tính toàn vẹn profiles
- Độ chính xác tài liệu
- Cấu trúc context files
- Chuỗi dependencies

#### ⚠️ Cảnh Báo
- Files mồ côi (tồn tại nhưng không được tham chiếu)
- Components không dùng (được định nghĩa nhưng không trong bất kỳ profile nào)
- Thiếu mô tả hoặc tags
- Dữ liệu metadata lỗi thời

#### ❌ Lỗi
- Files thiếu
- Dependencies bị hỏng
- JSON không hợp lệ
- Mismatch số lượng components
- Tham chiếu tài liệu bị hỏng
- IDs components trùng lặp

#### 📊 Thống Kê
- Tổng components: X
- Tổng profiles: X
- Tổng context files: X
- Breakdown components per profile
- Tỷ lệ bao phủ file

### Bước 8: Cung Cấp Khuyến Nghị

Dựa trên phát hiện, đề xuất:
- Files để tạo
- Entries registry để thêm/xóa
- Tài liệu để cập nhật
- Dependencies để sửa

## Định Dạng Báo Cáo Ví Dụ

```markdown
# Báo Cáo Validate Repository OpenAgents Control

Được tạo: 2025-11-19 14:30:00

## Tóm Tắt

✅ 95% validate đã qua
⚠️ 3 cảnh báo tìm thấy
❌ 2 lỗi tìm thấy

---

## ✅ Validated Thành Công

### Tính Toàn Vẹn Registry
✅ Cú pháp JSON hợp lệ
✅ Tất cả các trường bắt buộc có mặt
✅ Cấu trúc schema đúng

### Sự Tồn Tại Components (45/47 files tìm thấy)
✅ Agents: 3/3 files tồn tại
✅ Subagents: 15/15 files tồn tại
✅ Commands: 8/8 files tồn tại
✅ Tools: 2/2 files tồn tại
✅ Plugins: 2/2 files tồn tại
✅ Contexts: 13/15 files tồn tại
✅ Config: 2/2 files tồn tại

### Tính Nhất Quán Profiles
✅ Essential: 9 components (khớp với README)
✅ Developer: 29 components (khớp với README)
✅ Business: 15 components (khớp với README)
✅ Full: 35 components (khớp với README)
✅ Advanced: 42 components (khớp với README)

### Độ Chính Xác Tài Liệu
✅ Số lượng components README khớp với registry
✅ Tài liệu OpenAgent cập nhật
✅ Hướng dẫn cài đặt chính xác

---

## ⚠️ Cảnh Báo (3)

1. **Context File Mồ Côi**
   - File: `.opencode/context/legacy/old-patterns.md`
   - Vấn đề: Tồn tại nhưng không được tham chiếu trong registry
   - Khuyến nghị: Thêm vào registry hoặc xóa file

2. **Component Không Dùng**
   - Component: `workflow-orchestrator` (agent)
   - Vấn đề: Được định nghĩa trong registry nhưng không trong bất kỳ profile nào
   - Khuyến nghị: Thêm vào một profile hoặc đánh dấu là deprecated

3. **Metadata Lỗi Thời**
   - Trường: `metadata.lastUpdated`
   - Hiện tại: 2025-11-15
   - Khuyến nghị: Cập nhật đến ngày hiện tại

---

## ❌ Lỗi (2)

1. **Context File Thiếu**
   - Component: `context:advanced-patterns`
   - Đường dẫn mong đợi: `.opencode/context/core/advanced-patterns.md`
   - Được tham chiếu trong: developer, full, advanced profiles
   - Hành động: Tạo file hoặc xóa khỏi registry

2. **Dependency Bị Hỏng**
   - Component: `agent:opencoder`
   - Dependency: `subagent:pattern-matcher`
   - Vấn đề: Dependency không tìm thấy trong registry
   - Hành động: Thêm subagent còn thiếu hoặc sửa tham chiếu dependency

---

## 📊 Thống Kê

### Phân Phối Component
- Agents: 3
- Subagents: 15
- Commands: 8
- Tools: 2
- Plugins: 2
- Contexts: 15
- Config: 2
- **Tổng: 47 components**

### Breakdown Profile
- Essential: 9 components (19%)
- Developer: 29 components (62%)
- Business: 15 components (32%)
- Full: 35 components (74%)
- Advanced: 42 components (89%)

### Bao Phủ File
- Tổng files được định nghĩa: 47
- Files tìm thấy: 45 (96%)
- Files thiếu: 2 (4%)
- Files mồ côi: 1

### Sức Khỏe Dependency
- Tổng dependencies: 23
- Dependencies hợp lệ: 22 (96%)
- Dependencies bị hỏng: 1 (4%)
- Dependencies vòng tròn: 0

---

## 🔧 Các Hành Động Khuyến Nghị

### Ưu Tiên Cao (Lỗi)
1. Tạo file thiếu: `.opencode/context/core/advanced-patterns.md`
2. Sửa dependency bị hỏng trong `opencoder`

### Ưu Tiên Vừa (Cảnh Báo)
1. Xóa file mồ côi hoặc thêm vào registry
2. Thêm `workflow-orchestrator` vào một profile hoặc deprecate
3. Cập nhật metadata.lastUpdated đến 2025-11-19

### Ưu Tiên Thấp (Cải Thiện)
1. Thêm nhiều tags cho components để dễ tìm kiếm hơn
2. Cân nhắc thêm mô tả cho tất cả context files
3. Tài liệu các categories components trong README

---

## Các Bước Tiếp Theo

1. Xem lại và sửa tất cả ❌ lỗi
2. Giải quyết ⚠️ cảnh báo khi cần thiết
3. Chạy lại validate để xác nhận sửa chữa
4. Cập nhật tài liệu nếu cần

---

**Validate Hoàn Thành** ✓
```

## Ghi Chú Triển Khai

Lệnh nên:
- Sử dụng bash/python cho các operations file system
- Phân tích JSON với xử lý lỗi phù hợp
- Tạo báo cáo markdown
- Không phá hủy (validate chỉ đọc)
- Cung cấp các khuyến nghị có thể thực hiện được
- Hỗ trợ chế độ verbose cho output chi tiết

## Xử Lý Lỗi

- Xử lý khéo léo các files thiếu
- Tiếp tục validate ngay cả khi tìm thấy lỗi
- Thu thập tất cả các vấn đề trước khi báo cáo
- Cung cấp thông báo lỗi rõ ràng với context

## Hiệu Suất

- Nên hoàn thành trong < 30 giây
- Cache các lần đọc file khi có thể
- Validate song song khi an toàn
- Các chỉ báo tiến trình cho các operations dài
