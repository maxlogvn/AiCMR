# Design System AiCMR - Nguyên tắc Cốt lõi (v1)

**Phiên bản:** 1.0
**Đọc trong:** 10 phút
**Dành cho:** Frontend Team (3-5 developers)
**Cập nhật:** 2026-01-26

---

## 🎯 Design System là gì?

**Định nghĩa AiCMR:**

> "Design system = **Operating System** cho Frontend Team"

Design system của AiCMR **KHÔNG PHẢI**:
- ❌ Bộ sưu tập component (component library)
- ❌ Framework lý thuyết (theoretical framework)
- ❌ Tài liệu UI tĩnh (static UI documentation)

Design system của AiCMR **LÀ**:
- ✅ **Cách thức làm việc** (how we work)
- ✅ **Bàn đảng phát triển** (development platform)
- ✅ **Máy sản xuất page** (page production machine)

**Mục tiêu cuối cùng:**
- Sản xuất page **nhanh** (fast)
- Đúng chuẩn **ngay từ đầu** (correct from day 1)
- Team **không ngại** làm UI features (no UI fear)

---

## 💡 5 Nguyên tắc Cốt lõi

### 1️⃣ Build Pages First, Extract Later

**Nguyên tắc:**
> "Xây dựng trang thật trước → Rút ra design system sau"

**Cách làm:**
1. Build 3-5 trang **thực tế** đầu tiên (User Profile, Post Listing, Post Edit, etc.)
2. Xác định **pattern** lặp lại giữa các trang
3. **Extract** pattern thành component có tái sử dụng
4. **Refine** component đó cho các trang sau

**Tại sao:**
- ✅ Trang thật → Nhu cầu **thực tế** (not theoretical)
- ✅ Pattern **emerge** từ usage (not assumed)
- ✅ Tránh **over-engineering** (không build thứ không cần)
- ✅ "You don't know what you need until you build it"

**Sai lầm thường gặp:**
- ❌ Design system đầu → Build page sau (top-down, theoretical)
- ❌ Component 100+ cái → Dùng 5 cái (waste)

---

### 2️⃣ Eliminate Choices

**Nguyên tắc:**
> "Chỉ **MỘT CÁCH** làm đúng - Không có lựa chọn"

**Cách làm:**
- ❌ **KHÔNG** có variants: `size="sm|md|lg"`
- ❌ **KHÔNG** có color options: `variant="primary|secondary|ghost|outline"`
- ❌ **KHÓNG** có spacing choices: `gap={2|4|8|16}`

**Thay vào đó:**
- ✅ Chỉ có **một kích thước** mặc định
- ✅ Chỉ có **primary, secondary, destructive** colors
- ✅ Chỉ có **spacing scale** (`4`, `8`, `12`, `16`, `24`, `32`)

**Tại sao:**
- ✅ Ít lựa chọn → Ra quyết định **nhanh hơn**
- ✅ **Opinionated** → Team không phải suy nghĩ
- ✅ Consistency → Tự động đồng nhất

**Ví dụ:**
```tsx
// ❌ KHÔNG - Quá nhiều lựa chọn
<Button size="sm" variant="ghost" color="blue">
  Save
</Button>

// ✅ ĐÚNG - Chỉ một cách
<Button>
  Save
</Button>
```

---

### 3️⃣ Documentation = Code + Examples

**Nguyên tắc:**
> "Documentation là **Template page** + **Inline comments**"

**Cách làm:**
- Documentation = **Không** file markdown riêng
- Documentation = **Template pages** trong codebase
- Documentation = **Code comments** tại component definition

**Cấu trúc:**
```
frontend/
├── app/
│   ├── (dashboard)/
│   │   ├── users/          # ← Template page (copy & modify)
│   │   ├── posts/          # ← Template page (copy & modify)
│   │   └── settings/       # ← Template page (copy & modify)
└── components/
    ├── ui/
    │   ├── form-field.tsx   # ← Inline docs (how to use)
    │   ├── table.tsx        # ← Inline docs (how to use)
    │   └── layout-shell.tsx # ← Inline docs (how to use)
```

**Tại sao:**
- ✅ **Single source of truth** - Code là truth
- ✅ **Không maintenance burden** - Không sync docs vs code
- ✅ **Copy-paste examples** - Dev copy template, modify
- ✅ **Always up-to-date** - Docs = Code

**Ví dụ:**
```tsx
// components/ui/form-field.tsx

/**
 * Form Field Component
 *
 * Cách dùng:
 * 1. Copy template bên dưới
 * 2. Thay label, name, placeholder
 * 3. Thêm validation nếu cần
 *
 * @example
 * <FormField label="Email" name="email" placeholder="user@example.com" />
 */
export function FormField({ label, name, placeholder }: FormFieldProps) {
  // ... implementation
}
```

---

### 4️⃣ Optimize for 90%

**Nguyên tắc:**
> "Tối ưu cho **90% use cases** - Ignore 10% edge cases"

**Cách làm:**
- Focus vào **90% CMS scenarios**:
  - ✅ Form (CRUD operations)
  - ✅ Table (listing, filtering)
  - ✅ Layout (sidebar, content)
- **KHÔNG** build cho 10% edge cases:
  - ❌ Complex wizard flows
  - ❌ Advanced drag-drop
  - ❌ Custom visualization

**Component Strategy:**
- **Chỉ 10-15 components** cho 90% use cases:
  1. Form Field + Form Layout
  2. Table + Table Pagination
  3. Layout Shell (Sidebar + Topbar + Content)
  4. Button (Primary/Secondary/Destructive)
  5. Modal/Dialog
  6. Alert/Toast (Success/Error/Warning)
  7. Card (Content wrapper)

**Tại sao:**
- ✅ **Less to learn** - Team học nhanh
- ✅ **Less to maintain** - Ít bugs
- ✅ **Good enough for most** - 90% = production ready
- ✅ **Handle edge cases** later - When needed

---

### 5️⃣ Ownership Over Abstraction

**Nguyên tắc:**
> "Sở hữu component - Đừng trừu tượng hóa quá mức"

**Cách làm:**
- Component **lives in your codebase**
- Copy từ shadcn → **Modify** theo nhu cầu
- **Không** create abstraction layers

**Ví dụ:**
```tsx
// ❌ KHÔNG - Quá trừu tượng
interface ButtonProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'link';
  color?: 'blue' | 'red' | 'green' | 'yellow';
  // ... 10+ props khác
}

// ✅ ĐÚNG - Đơn giản, owned
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
}
```

**Tại sao:**
- ✅ **Full control** - Team modify khi cần
- ✅ **No black box** - Hiểu clearly code chạy thế nào
- ✅ **Easy to debug** - Code right there
- ✅ **Tailored to needs** - Not over-engineered

---

## 🚀 Triển khai như thế nào?

### Step 1: Build 3-5 Trang Thật
- Page 1: User Profile Page
- Page 2: Post Listing Page
- Page 3: Post Edit Page
- Page 4: Category Management
- Page 5: Settings Page

### Step 2: Extract Patterns
- Pattern 1: Form Field + Form Layout
- Pattern 2: Table + Pagination
- Pattern 3: Layout Shell (Sidebar + Content)

### Step 3: Create Components
- Component 1: `FormField` (Form Field + Label + Error)
- Component 2: `DataTable` (Table + Sort + Filter)
- Component 3: `LayoutShell` (Sidebar + Topbar + Content container)

### Step 4: Document as Templates
- Template: User Profile Page (có thể copy)
- Template: Post Listing Page (có thể copy)
- Template: Post Edit Page (có thể copy)

### Step 5: Team Adoption
- Share templates với team
- Hướng dẫn copy + modify
- Collect feedback
- Refine components

---

## 📋 Golden Rules (Nhớ bằng heart)

**5 Quy tắc vàng để dev nhớ:**

1. **Build pages first** - Không build design system trước
2. **Always use existing components** - Không tạo mới nếu component đã tồn tại
3. **Don't hard-code colors** - Luôn dùng design tokens
4. **Copy template before creating new** - Template = Starting point
5. **Eliminate choices** - Chỉ một cách đúng

---

## 🎓 Các khái niệm KHÔNG cần học

Design system AiCMR **đơn giản hóa TẦNG TƯ DUY**, không phải TẦNG KỸ THUẬT:

**KHÔNG cần học:**
- ❌ Design tokens (concept trừu tượng)
- ❌ Semantic spacing (term phức tạp)
- ❌ Color roles (lý thuyết màu)
- ❌ Component hierarchy (kiến trúc component)
- ❌ Atomic design (methodology)

**Cần biết:**
- ✅ "Khoảng cách giữa field trong form = 8px" (concrete)
- ✅ "Dùng màu `primary` cho action chính" (simple rule)
- ✅ "Copy template user profile để tạo page mới" (practical)
- ✅ "Luôn dùng component từ `/components/ui/`" (clear)

---

## 🤝 Câu hỏi thường gặp

### Q: Design system có phải là component library không?

**A:** Không. Component library là **phần** của design system. Design system bao gồm:
- Components (UI building blocks)
- Patterns (how to use components together)
- Templates (complete page examples)
- Rules (how to think about UI)

### Q: Tại sao không build design system trước?

**A:** Vì design system nên **emerge** từ nhu cầu thực tế:
- Build page thật → Pattern emerge → Extract component
- Không assume team cần gì → Build dựa trên actual usage
- Tránh over-engineering → Chỉ build gì thực sự cần

### Q: Nếu edge case không handle được?

**A:** Khi edge case **thực sự** xảy ra:
- Analyze: Edge case này có common không?
- Nếu common → Add component mới vào system
- Nếu rare → Custom implementation, không ép vào system
- "Make it work" → "Make it right" → "Make it fast"

### Q: Documentation ở đâu?

**A:** Documentation = Code:
- Template pages trong `app/` directory
- Inline comments tại component definition
- Getting Started guide cho dev mới

### Q: Shadcn có cần không?

**A:** Có, nhưng:
- shadcn = Foundation (accessibility, behavior)
- Custom styling = Visual layer (complete control)
- Copy → Modify → Own it

---

## 📊 Success Metrics

Design system thành công khi:

1. **Dev confidence ↑**
   - Team không ngại UI features
   - Volunteer cho UI work (not avoid)

2. **Development speed ↑**
   - Less time trên style decisions
   - Faster page production

3. **Consistency ↑**
   - All pages look consistent
   - No "amateur UI" feeling

4. **Onboarding time ↓**
   - New dev productive in days (not weeks)
   - Clear patterns to follow

---

## 🔄 Phiên bản tiếp theo

**v1 (Hiện tại):**
- 5 nguyên tắc cốt lõi
- 10-15 components
- Focus: 90% CMS use cases

**v2 (Tương lai):**
- Animation guidelines
- Responsive patterns
- Accessibility standards
- Advanced components (khi cần)

---

## 📞 Support & Feedback

**Questions?**
- Ask trong team chat
- Check template pages
- Read inline comments

**Feedback?**
- What works?
- What doesn't?
- What's missing?

Design system = **Living system** - Evolves với team needs.

---

**Document version:** 1.0
**Last updated:** 2026-01-26
**Maintained by:** Frontend Team AiCMR

---

*"Design system = Máy sản xuất page nhanh và đúng"*
