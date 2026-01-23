# UI/UX Pro Max Skill - Quick Reference

**🎨 Use this skill when:** Thiết kế, build, review, hoặc improve UI/UX cho web applications

---

## 🎯 Triggers

Load this skill khi user nói:
- "thiết kế ui", "tạo ui", "design ui", "build ui"
- "landing page", "dashboard design"
- "fix ui", "review ui", "cải thiện ui"
- "color palette", "font pairing", "design system"
- "responsive", "accessibility", "component design"
- "button", "card", "form", "modal", "navbar"

---

## ⚡ Quick Workflow

### Step 1: Phân Tích Yêu Cầu

```
USER REQUEST: "[Copy request]"

ANALYSIS:
├── Product Type: SaaS, e-commerce, portfolio, dashboard
├── Industry: healthcare, fintech, education, etc.
├── Style: minimal, playful, elegant, professional
├── Stack: React, Next.js, Vue (default: html-tailwind)
└── Platform: web, mobile (React Native/Flutter)
```

### Step 2: Multi-Domain Search

```bash
# Thứ tự tìm kiếm được khuyến nghị:
python3 .shared/scripts/search.py "product_type" --domain product
python3 .shared/scripts/search.py "style_keywords" --domain style
python3 .shared/scripts/search.py "industry" --domain color
python3 .shared/scripts/search.py "style_personality" --domain typography
python3 .shared/scripts/search.py "landing_features" --domain landing
python3 .shared/scripts/search.py "accessibility" --domain ux
python3 .shared/scripts/search.py "feature_name" --stack html-tailwind
```

### Step 3: Generate Code

Synthesize results → Design System → Implementation

---

## 🔴 Top 5 Mistakes to Avoid

### 1. ❌ Using Emojis as Icons
```html
<!-- WRONG -->
<button>🎨 🚀 ⚙️</button>

<!-- CORRECT -->
<button>
  <svg><!-- SVG icon from Heroicons/Lucide --></svg>
</button>
```

### 2. ❌ No Hover Feedback
```html
<!-- WRONG -->
<div class="card">No hover state</div>

<!-- CORRECT -->
<div class="card hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
  Clear hover feedback
</div>
```

### 3. ❌ Glass Too Transparent in Light Mode
```html
<!-- WRONG -->
<div class="bg-white/10 backdrop-blur-md border border-white/10">
  Can't read content in light mode
</div>

<!-- CORRECT -->
<div class="bg-white/80 dark:bg-black/50 backdrop-blur-md border border-gray-200 dark:border-white/10">
  Visible in both light and dark modes
</div>
```

### 4. ❌ Missing Cursor Pointer
```html
<!-- WRONG -->
<div class="card cursor-default" onclick="...">Clickable card</div>

<!-- CORRECT -->
<div class="card cursor-pointer" onclick="...">Clickable card</div>
```

### 5. ❌ Layout Shift on Hover
```html
<!-- WRONG -->
<div class="hover:scale-105">Causes layout shift</div>

<!-- CORRECT -->
<div class="hover:bg-slate-100 transition-colors duration-200">
  Smooth color change, no shift
</div>
```

---

## ✅ Pre-Delivery Checklist

### Visual Quality
- [ ] **No emoji icons** - Only SVG from icon libraries
- [ ] **Icon sizing consistent** - All icons use w-6 h-6
- [ ] **Brand logos accurate** - Verified from Simple Icons
- [ ] **No layout shift** - Use color/opacity transitions
- [ ] **Design tokens** - No hardcoded colors

### Interaction
- [ ] **Cursor pointer** - All clickable elements
- [ ] **Hover feedback** - Visible hover states
- [ ] **Focus visible** - Clear focus rings
- [ ] **Smooth transitions** - 150-300ms
- [ ] **Disabled state** - opacity-50 + cursor-not-allowed

### Light/Dark Mode
- [ ] **Contrast ratios** - Minimum 4.5:1 for body text
- [ ] **Glass visibility** - bg-white/80+ in light mode
- [ ] **Border visibility** - Visible in both modes
- [ ] **Both modes tested** - Manual test required

### Layout
- [ ] **Floating spacing** - top-4 left-4 right-4 for floating navbars
- [ ] **Content padding** - Account for fixed elements
- [ ] **Container max-width** - Consistent (max-w-7xl)
- [ ] **Responsive test** - Test at 320px, 768px, 1024px, 1440px

### Accessibility
- [ ] **Alt text** - All images have meaningful alt
- [ ] **Form labels** - All inputs have labels
- [ ] **Keyboard navigation** - Logical tab order
- [ ] **Semantic HTML** - Proper heading hierarchy
- [ ] **Reduced motion** - Respect prefers-reduced-motion

---

## 📦 Quick Reference Tables

### Supported Stacks

| Stack | Use For |
|-------|---------|
| **html-tailwind** | Static pages, prototypes (DEFAULT) |
| **react** | React apps với hooks |
| **nextjs** | Next.js với SSR, routing |
| **vue** | Vue 3 với Composition API |
| **svelte** | Svelte 5 với runes |
| **swiftui** | iOS native apps |
| **react-native** | Cross-platform mobile |
| **flutter** | Flutter apps |
| **shadcn** | shadcn/ui components |

### Search Domains

| Domain | Purpose | Examples |
|--------|---------|----------|
| **product** | Product recommendations | saas, ecommerce, portfolio |
| **style** | UI styles, effects | glassmorphism, minimalism |
| **color** | Color palettes | healthcare, fintech, beauty |
| **typography** | Font pairings | elegant, professional, playful |
| **landing** | Page structure | hero, testimonial, pricing |
| **chart** | Chart types | trend, comparison, funnel |
| **ux** | Best practices | accessibility, animation |
| **prompt** | AI keywords | (style name) |

---

## 🎨 Quick Design System Template

```yaml
project: "Project Name"

colors:
  primary: "#3B82F6"
  secondary: "#8B5CF6"
  cta: "#10B981"
  background: "#FFFFFF"
  text_primary: "#0F172A"
  text_secondary: "#475569"

typography:
  heading: "Inter"
  body: "Inter"
  weights: [400, 500, 600, 700]

spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"

components:
  - Hero section
  - Feature grid
  - CTA sections
  - Social proof
```

---

## 🔗 Common Patterns

### Button Component

```html
<!-- Primary Button -->
<button class="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
  Button Text
</button>

<!-- Secondary Button -->
<button class="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-900 rounded-lg font-medium border border-slate-200 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
  Button Text
</button>

<!-- Ghost Button -->
<button class="px-6 py-2.5 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
  Button Text
</button>
```

### Card Component

```html
<div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-pointer">
  <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Card Title</h3>
  <p class="text-slate-600 dark:text-slate-400">Card description goes here.</p>
</div>
```

### Input Component

```html
<div class="space-y-2">
  <label for="input" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
    Label Text
  </label>
  <input
    type="text"
    id="input"
    class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-slate-100 transition-colors"
    placeholder="Placeholder text"
  />
</div>
```

---

## 📚 Resources

### Icon Libraries
- **Heroicons:** https://heroicons.com/
- **Lucide:** https://lucide.dev/
- **Phosphor:** https://phosphoricons.com/
- **Simple Icons:** https://simpleicons.org/ (brand logos)

### Tools
- **Color Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Tailwind Docs:** https://tailwindcss.com/docs
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

---

## 🔗 Full Documentation

See [SKILL.md](./SKILL.md) for complete guide with:
- 14 comprehensive sections
- Architecture & data schemas
- 3 detailed real-world examples
- Contributing guidelines
- Troubleshooting section
- FAQ with 8 common questions

---

## 🎯 Remember

1. **Search multi-domain** - Don't rely on single search
2. **Follow checklist** - Pre-delivery quality check
3. **Test both modes** - Light and dark mode
4. **Accessibility first** - WCAG AA compliant
5. **Use SVG icons** - No emojis

**When in doubt, copy the template and follow the checklist!** 🚀
