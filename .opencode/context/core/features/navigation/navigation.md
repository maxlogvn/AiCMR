# Navigation Feature Context Navigation

## 📚 Context Files

### Concepts (Domain Knowledge)
- **frontend-architecture.md** - Layout structure, components, routing
- **components.md** - Navbar, Footer, Breadcrumb, QuickNavigation details

### Guides (How-to Processes)
- **implementing-navigation.md** - Add breadcrumbs, quick nav, create layouts

### Errors (Issues & Solutions)
- **common-issues.md** - Navbar not showing, breadcrumb missing, blank pages

### Lookup (Reference)
- **routes-reference.md** - All routes, navbar links, sidebar links, breadcrumbs

---

## Quick Reference

**Layout Stack**:
- Public: Navbar + Footer
- Auth: Navbar + centered form + Footer
- User: Navbar + UserSidebar + Footer
- Dashboard: Navbar + AdminSidebar + Footer

**Key Components**:
- Navbar: Smart auth-based menu
- Footer: Company info + links
- Breadcrumb: Auto-generated trails
- QuickNavigation: Card-based actions

**Permissions**:
- Rank 0-2: /user/* only
- Rank 3-4: /user/* + /dashboard/stats + /dashboard/users-manager
- Rank 5: All routes

**Status**: ✅ Complete & Production Ready
**Last Updated**: 2026-01-22
**Version**: 1.0
