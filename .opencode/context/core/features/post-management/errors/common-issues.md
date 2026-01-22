# Post Management Common Issues

## User Can't See "Bài Đăng Của Tôi" in Sidebar

**Issue**: Menu item missing from UserSidebar.

**Cause**: File not updated or sidebar component error.

**Solution**:
1. Verify `components/user/UserSidebar.tsx` exists
2. Check file contains: `📄 Bài đăng của tôi → /user/posts`
3. Hard refresh browser (Ctrl+Shift+R)
4. Clear localStorage: F12 → Application → Clear All
5. Re-login and check sidebar

---

## Admin Can't See "Quản Lý Bài Đăng" in Dashboard Sidebar

**Issue**: Post management option missing from AdminSidebar.

**Cause**: 
- AdminSidebar not updated
- Rank check failing
- Component import broken

**Solution**:
1. Verify rank >=3: Check JWT token in console:
   ```javascript
   const jwt = localStorage.getItem('access_token');
   const payload = JSON.parse(atob(jwt.split('.')[1]));
   console.log(payload.rank);  // Should be >=3
   ```
2. Check AdminSidebar has menu item: `📄 Quản lý bài đăng`
3. Try accessing directly: `/dashboard/posts`
4. If still missing, file may not be saved

---

## /dashboard/posts Shows Blank Page

**Issue**: Page loads but shows no content.

**Cause**:
- Component has import error
- API fetch failing
- Permission check blocking render

**Solution**:
1. Open DevTools Console (F12)
2. Look for red errors (module not found, etc)
3. Check Network tab for failed API calls
4. Verify rank: Must be >=3 for /dashboard/posts access
5. Hard reload: Ctrl+Shift+Delete, then F5

---

## Can't Create Post - Form Won't Submit

**Issue**: "Publish" or "Save Draft" button doesn't work.

**Cause**:
- Validation error (required field missing)
- API endpoint not responding
- Browser console error

**Solution**:
1. Check all required fields (title, content)
2. Verify title is not empty: Length > 0
3. Content length should be reasonable (>10 chars)
4. Open DevTools Console - look for validation errors
5. Check Network tab - is API call being made?
6. Try submitting empty: See which field is required

---

## Post List Shows No Posts

**Issue**: Page loads but post list is empty despite having posts.

**Cause**:
- API not returning data
- Filter set to wrong status
- Search query too specific

**Solution**:
1. Check filter: Set to "All" instead of "Draft"
2. Clear search box (might be filtering out results)
3. Open DevTools → Network → Check API response
4. Verify posts exist (ask another user or admin)
5. Try refreshing (F5) or re-login

---

## Bulk Actions Not Working

**Issue**: Select posts but bulk action buttons don't work.

**Cause**:
- No posts selected
- Button disabled because no selection
- API error on bulk endpoint

**Solution**:
1. Verify checkboxes are checked (marked)
2. Check count: X posts selected shown
3. Ensure action button is enabled (not grayed out)
4. Try selecting single post and single action
5. Check Network tab for failed API calls
6. Verify user rank >=3 for bulk operations

---

## Post Appears in Draft but Won't Publish

**Issue**: Post status stuck on Draft after clicking Publish.

**Cause**:
- API error not displayed
- Network timeout
- Permission issue

**Solution**:
1. Open DevTools Network tab
2. Try publish again, watch for failed requests
3. Check console for JavaScript errors
4. Verify user is author of post (rank check)
5. Try reloading page and publishing again
6. Check server logs (backend error)
