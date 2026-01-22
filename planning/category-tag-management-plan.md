# Kế hoạch xây dựng chức năng Quản lý Chuyên mục & Thẻ

## Tổng quan
Xây dựng chức năng quản lý chuyên mục (Categories) và thẻ (Tags) với đầy đủ tính năng CRUD, quản lý phân cấp, màu sắc, icon và thống kê.

---

## Phase 1: Backend Updates ✅ (HOÀN THÀNH)

### 1.1 Update Models ✅
- [x] **File**: `backend/app/models/category.py`
  - Thêm: `icon`, `color`, `post_count`, `display_order`, `show_in_menu`
  - Thêm index: `idx_category_order`

- [x] **File**: `backend/app/models/tag.py`
  - Thêm: `description`, `post_count`
  - Thêm index: `idx_tag_post_count`

### 1.2 Create Migration ✅
- [x] **File**: `backend/scripts/migrate_category_tag_enhancements.py`
  - Script migration cho cả categories và tags
  - Backfill post_count cho existing data
  - Support rollback
  - **Lệnh chạy**: `python backend/scripts/migrate_category_tag_enhancements.py`
  - **Lệnh rollback**: `python backend/scripts/migrate_category_tag_enhancements.py --rollback`

### 1.3 Update Schemas ✅
- [x] **File**: `backend/app/schemas/category.py`
  - CategoryBase: Thêm `icon`, `color`, `display_order`, `show_in_menu`
  - CategoryUpdate: Thêm các fields trên
  - CategoryResponse: Thêm `post_count`, `children`

- [x] **File**: `backend/app/schemas/tag.py`
  - TagBase: Thêm `description`
  - TagUpdate: Thêm `description`
  - TagResponse: Thêm `post_count`

### 1.4 Update CRUD Functions ✅
- [x] **File**: `backend/app/crud/crud_category.py`
  - Cập nhật: `create_category` - thêm new fields
  - Cập nhật: `get_all_categories` - sort by display_order
  - Cập nhật: `get_tree_structure` - sort by display_order
  - Cập nhật: `get_with_post_count` - update post_count
  - **Mới**: `update_post_count()` - cache post_count update
  - **Mới**: `reorder_categories()` - reorder by display_order

- [x] **File**: `backend/app/crud/crud_tag.py`
  - Cập nhật: `create_tag` - thêm description, post_count
  - Cập nhật: `get_all_tags` - sort by post_count desc, name
  - **Mới**: `update_post_count()` - cache post_count update
  - **Mới**: `get_unused_tags()` - get tags with 0 posts
  - **Mới**: `merge_tags()` - merge source tag into target tag

### 1.5 Update API Endpoints ✅
- [x] **File**: `backend/app/api/v1/categories.py`
  - **Mới**: `POST /categories/reorder` - Reorder categories by display_order (Admin only)

- [x] **File**: `backend/app/api/v1/tags.py`
  - **Mới**: `POST /tags/merge` - Merge tags (Admin only)
  - **Mới**: `GET /tags/unused` - Get unused tags (Admin only)

---

## Phase 2: Frontend API Layer Update (PENDING)

### 2.1 Update Types
**File**: `frontend/src/types/post.ts`
- [ ] Update `Category` interface:
  - Thêm: `icon`, `color`, `post_count`, `display_order`, `show_in_menu`
  - Thêm: `children?: Category[]`
- [ ] Update `Tag` interface:
  - Thêm: `description`, `post_count`
- [ ] Update `CreateCategoryRequest`, `UpdateCategoryRequest`
- [ ] Update `CreateTagRequest`, `UpdateTagRequest`
- [ ] Thêm types mới:
  - `ReorderRequest`
  - `MergeRequest`

### 2.2 Update API Service
**File**: `frontend/src/lib/api-posts.ts`
- [ ] Thêm vào `postsApi`:
  - `getCategoryWithStats(id: number)`
  - `reorderCategories(items: ReorderRequest[])`
  - `mergeTags(sourceId: number, targetId: number)`
  - `getUnusedTags()`

### 2.3 Update React Query Hooks
**File**: `frontend/src/hooks/usePosts.ts`
- [ ] Thêm hooks mới:
  - `useReorderCategories()`
  - `useGetUnusedTags()`
  - `useMergeTags()`

---

## Phase 3: UI Components ✅ (HOÀN THÀNH)

### 3.1 Category Components ✅

#### `frontend/src/components/category/CategoryForm.tsx` ✅
- [x] Form tạo/sửa category
- [x] Fields: name, slug, description, parent, icon, color, display_order, show_in_menu
- [x] Validation với react-hook-form + zod
- [x] Color picker với presets
- [x] Parent category dropdown với hierarchy

#### `frontend/src/components/category/CategoryTree.tsx` ✅
- [x] Hiển thị tree view của categories
- [x] Expand/collapse functionality
- [x] Show post count, status (active/inactive), menu visibility
- [x] Edit/Delete actions inline
- [x] Drag & drop để reorder (optional)

#### `frontend/src/components/category/CategoryBadge.tsx` ✅
- [x] Badge component hiển thị category
- [x] Hỗ trợ icon và color

#### `frontend/src/components/category/CategorySelect.tsx` - ⏭ (Optional)
- [ ] Dropdown chọn category với hierarchy
- [ ] Search/filter functionality
- [ ] Used in Post Editor

**File đã tạo:**
- [x] `frontend/src/components/category/index.ts`

### 3.2 Tag Components ✅

**Files đã tạo:**

#### `frontend/src/components/tag/TagForm.tsx` ✅
- [x] Form tạo/sửa tag
- [x] Fields: name, slug, description, color
- [x] Validation với react-hook-form + zod
- [x] Color picker với 10 presets
- [x] Custom color input

#### `frontend/src/components/tag/TagList.tsx` ✅
- [x] List/Grid view toggle
- [x] Search by name
- [x] Filter: all/unused
- [x] Sort: name/post count/created date (asc/desc)
- [x] Show post count
- [x] Edit/Delete actions
- [x] Color chip display

#### `frontend/src/components/tag/MergeDialog.tsx` ✅
- [x] Dialog để merge tags
- [x] Select source tag và target tag
- [x] Show preview of affected posts
- [x] Confirm before merge

#### `frontend/src/components/tag/TagBadge.tsx` ✅
- [x] Badge component hiển thị tag
- [x] Hỗ trợ color

#### `frontend/src/components/tag/TagInput.tsx` - ⏭ (Optional)
- [ ] Multi-select input với autocomplete
- [ ] Used in Post Editor

**File đã tạo:**
- [x] `frontend/src/components/tag/index.ts` ✅

### 3.3 Shared Components ✅

**Files đã tạo:**

#### `frontend/src/components/ui/label.tsx` ✅
- [x] Label component cho forms

#### `frontend/src/components/ui/ColorPicker.tsx` ✅
- [x] Color picker component
- [x] Presets + custom color
- [x] Hex input

#### `frontend/src/components/ui/IconPicker.tsx` - ⏭ (Optional - không cấn thiết)
- [ ] Icon picker component
- [ ] Search/filter icons
- [ ] Preview icons

---

## Phase 4: Dashboard Pages ✅ (HOÀN THÀNH)

### 4.1 Categories Management Page ✅

**File**: `frontend/src/app/dashboard/categories/page.tsx` ✅
- [x] Header với title và "New Category" button
- [x] View toggle: Tree/List
- [x] Tree View: CategoryTree component
- [x] CategoryForm dialog for create/edit

### 4.2 Tags Management Page ✅

**File**: `frontend/src/app/dashboard/tags/page.tsx` ✅
- [x] Header với title và actions ("Merge Tags", "New Tag")
- [x] View toggle: Grid/List
- [x] TagList component
- [x] TagForm dialog for create/edit
- [x] MergeDialog for merging tags

### 4.3 Update Admin Sidebar ✅

**File**: `frontend/src/components/admin/AdminSidebar.tsx` ✅
- [x] Thêm menu item: "Chuyên mục" → `/dashboard/categories`
- [x] Thêm menu item: "Thẻ" → `/dashboard/tags`

### 4.3 Update Admin Sidebar

**File**: `frontend/src/components/admin/AdminSidebar.tsx`
- [ ] Thêm menu item: "Categories" → `/dashboard/categories`
- [ ] Thêm menu item: "Tags" → `/dashboard/tags`

---

## Phase 5: Testing & Polish (PENDING)

### 5.1 Backend Tests
- [ ] Test category CRUD operations
- [ ] Test tag CRUD operations
- [ ] Test reorder categories
- [ ] Test merge tags
- [ ] Test get unused tags
- [ ] Test post_count updates

### 5.2 Frontend Tests
- [ ] Component tests for CategoryForm
- [ ] Component tests for CategoryTree
- [ ] Component tests for TagForm
- [ ] Component tests for TagList
- [ ] Integration tests for categories page
- [ ] Integration tests for tags page

### 5.3 Manual Testing Checklist
- [ ] Run migration script
- [ ] Create category with all fields
- [ ] Update category
- [ ] Delete category with validation
- [ ] Reorder categories via API
- [ ] Create tag with all fields
- [ ] Update tag
- [ ] Delete tag
- [ ] Merge tags
- [ ] Get unused tags
- [ ] Verify post_count updates when creating/deleting posts
- [ ] Test frontend UI components
- [ ] Test dashboard pages

---

## Implementation Timeline

| Phase | Task | Est. Days | Status |
|-------|------|-----------|--------|
| 1.1 | Update Models | 0.5 | ✅ Done |
| 1.2 | Create Migration | 0.5 | ✅ Done |
| 1.3 | Update Schemas | 0.5 | ✅ Done |
| 1.4 | Update CRUD | 0.5 | ✅ Done |
| 1.5 | Update API Endpoints | 0.5 | ✅ Done |
| 2 | Frontend API Layer | 1 | ✅ Done |
| 3 | UI Components | 2-3 | ✅ Done |
| 4 | Dashboard Pages | 1-2 | ✅ Done |
| 5 | Testing & Polish | 1-2 | ⏳ Pending |
| **Total** | | **8-10 days** | **Phase 1-4 Done** |

---

## Files Summary

### Backend (Phase 1 - Done)
```
Updated:
✓ backend/app/models/category.py
✓ backend/app/models/tag.py
✓ backend/app/schemas/category.py
✓ backend/app/schemas/tag.py
✓ backend/app/crud/crud_category.py
✓ backend/app/crud/crud_tag.py
✓ backend/app/api/v1/categories.py
✓ backend/app/api/v1/tags.py

Created:
✓ backend/scripts/migrate_category_tag_enhancements.py
```

### Frontend (Phase 2-3 - Completed ✅)
```
Updated:
✅ frontend/src/types/post.ts - Thêm fields, ReorderRequest, MergeRequest
✅ frontend/src/lib/api-posts.ts - Thêm getCategoryWithStats, reorderCategories, mergeTags, getUnusedTags
✅ frontend/src/hooks/usePosts.ts - Thêm useReorderCategories, useGetUnusedTags, useMergeTags

Created:
✅ frontend/src/components/category/CategoryForm.tsx
✅ frontend/src/components/category/CategoryTree.tsx
✅ frontend/src/components/category/CategoryBadge.tsx
✅ frontend/src/components/category/index.ts
✅ frontend/src/components/tag/TagForm.tsx
✅ frontend/src/components/tag/TagList.tsx
✅ frontend/src/components/tag/MergeDialog.tsx
✅ frontend/src/components/tag/TagBadge.tsx
✅ frontend/src/components/tag/index.ts
✅ frontend/src/components/ui/label.tsx
✅ frontend/src/components/ui/ColorPicker.tsx
✅ frontend/src/app/dashboard/categories/page.tsx
✅ frontend/src/app/dashboard/tags/page.tsx
Updated:
✅ frontend/src/components/admin/AdminSidebar.tsx - Thêm Categories, Tags menu items
```

---

## Next Steps

### Completed ✅
1. ✅ Run migration script: `python backend/scripts/migrate_category_tag_enhancements.py`
2. ✅ Test backend API endpoints
3. ✅ Phase 1, 2, 3, 4: Backend, Frontend API, UI Components, Dashboard Pages

### Next (Phase 5) ⏳
5. ⏳ Phase 5: Testing & Polish
   - Write unit tests for components
   - Manual testing with system running
   - Performance optimization
   - Bug fixes

---

## Notes

### Backend LSP Errors (Type checking)
- Một số LSP errors hiện tại là do type hints của SQLAlchemy
- Đây là known issue với type checking cho SQLAlchemy async code
- Code sẽ chạy bình dù có LSP errors
- Có thể ignore hoặc fix sau với proper type hints

### Migration Rollback
- Để rollback: `python backend/scripts/migrate_category_tag_enhancements.py --rollback`
- Rollback sẽ xóa columns và indexes đã thêm

### Post Count Cache
- `post_count` được cache để tránh counting queries
- Cần update khi:
  - Tạo post với category/tag
  - Xóa post với category/tag
  - Update post's category/tags
  - Merge tags

### API Endpoints Reference

#### Categories
```
GET  /categories/                    - List all categories
GET  /categories/{slug}              - Get category by slug
GET  /categories/tree                - Get tree structure
POST /categories/                     - Create category (Admin)
POST /categories/reorder              - Reorder categories (Admin)
PATCH /categories/{id}                - Update category (Admin)
DELETE /categories/{id}               - Delete category (Admin)
```

#### Tags
```
GET  /tags/                          - List all tags
GET  /tags/{slug}                    - Get tag by slug
GET  /tags/trending                  - Get trending tags
GET  /tags/unused                    - Get unused tags (Admin)
POST /tags/                          - Create tag (Admin)
POST /tags/merge                     - Merge tags (Admin)
PATCH /tags/{id}                     - Update tag (Admin)
DELETE /tags/{id}                    - Delete tag (Admin)
```

---

**Last Updated**: 2025-01-22
**Status**: Phase 1, 2, 3, 4 (Backend, Frontend API, UI Components, Dashboard Pages) Completed ✅
