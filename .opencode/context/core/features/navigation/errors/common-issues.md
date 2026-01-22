# Common Navigation Issues & Solutions

## Navbar Not Showing Correct Links

**Issue**: Navbar shows wrong menu based on auth state.

**Causes**:
- Token not in localStorage
- User rank not fetched correctly
- useRouter not working

**Solutions**:
1. Check DevTools → Application → localStorage (access_token present?)
2. Verify JWT contains rank field
3. Hard refresh browser (Ctrl+Shift+R)
4. Check network tab for auth API calls

---

## Breadcrumb Not Displaying

**Issue**: Page shows no breadcrumb navigation.

**Causes**:
- Route not in breadcrumbMap
- Breadcrumb component not imported
- pathname undefined

**Solutions**:
1. Open `components/layout/Breadcrumb.tsx`
2. Add route to breadcrumbMap object:
   ```typescript
   const breadcrumbMap = {
     "/your/new/route": "Your Route Title",
     ...
   };
   ```
3. Re-import component in page
4. Verify pathname is correct: `usePathname()` hook

---

## QuickNavigation Links Not Working

**Issue**: Cards don't navigate or links broken.

**Causes**:
- Incorrect href path
- Icon import missing
- Component not rendered

**Solutions**:
1. Verify href matches actual route: `"/user/profile"` not `"/user-profile"`
2. Import icons from lucide-react: `import { Lock } from "lucide-react"`
3. Verify links array structure (needs label/href/icon/description)
4. Check no TypeScript errors in build

---

## Blank Page / 500 Error

**Issue**: Dashboard or user pages show completely blank.

**Causes**:
- Layout import error (ModeratorGuard, AdminSidebar missing)
- Component export incorrect (default vs named)
- Module not found error

**Solutions**:
1. Open DevTools Console (F12) - look for red errors
2. Check terminal output running `npm run dev`
3. Verify imports: `import { Component }` vs `import Component`
4. Check files exist: `src/components/admin/AdminSidebar.tsx`
5. Hard reload: Ctrl+Shift+Delete (clear cache), then reload

---

## Mobile Navigation Not Working

**Issue**: Hamburger menu doesn't open or sidebar too small.

**Causes**:
- Responsive classes missing
- JavaScript for menu toggle broken
- Z-index issues

**Solutions**:
1. Verify Tailwind classes: `md:flex`, `hidden md:block`
2. Check menu toggle button click handler
3. Inspect elements (F12) for z-index/display issues
4. Test on actual mobile device or DevTools mobile view
