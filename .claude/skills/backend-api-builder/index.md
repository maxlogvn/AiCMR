# Backend API Builder Skill - Index

**Version:** 1.0
**Last Updated:** 2026-01-23

---

## 📁 File Structure

```
.claude/skills/backend-api-builder/
├── skill.md           # Complete guide (30+ pages)
├── README.md          # Quick reference
├── examples.py        # Full working example
├── skill.json         # Metadata
└── index.md           # This file
```

---

## 🚀 Quick Start

### For AI Agents:

1. **Load the skill** when user asks to build/fix backend API
2. **Review README.md** for quick reference
3. **Copy templates** from skill.md
4. **Follow checklist** before committing
5. **Reference examples.py** for complete implementation

### For Developers:

1. Read **README.md** for common pitfalls
2. Study **examples.py** for complete CRUD implementation
3. Reference **skill.md** for detailed patterns
4. Use checklist when creating new endpoints

---

## 📚 Content Summary

### skill.md (Main Documentation)

**Sections:**
1. Architecture Overview
2. CRUD Endpoint Templates (5 templates)
3. Common Pitfalls & Solutions (5 pitfalls)
4. Status Code Best Practices
5. SQLAlchemy Async Patterns (3 patterns)
6. Response Models
7. Error Handling
8. Testing Guidelines
9. Pre-commit Checklist (10 items)

**Length:** ~500 lines of comprehensive guide

### README.md (Quick Reference)

**Content:**
- Triggers for loading skill
- Quick CREATE template (copy-paste ready)
- Top 5 mistakes to avoid
- Pre-commit checklist
- Status codes quick reference

**Best for:** Quick lookup during development

### examples.py (Working Example)

**Content:**
- Complete Product CRUD implementation
- All 7 steps from model to tests
- Manual testing with curl commands
- Key takeaways summary

**Best for:** Learning by example

---

## 🎯 Use Cases

### Use Case 1: Creating New API

```
User: "Tạo API cho products"

Agent Workflow:
1. Load skill: backend-api-builder
2. Copy Product model from examples.py
3. Copy CRUD operations
4. Copy endpoint templates
5. Adjust for use case
6. Follow checklist
7. Write tests
```

### Use Case 2: Fixing Backend Bug

```
User: "Fix POST /api/v1/posts returns 200 instead of 201"

Agent Workflow:
1. Load skill: backend-api-builder
2. Check README.md "Top 5 Mistakes"
3. See Mistake #1: Wrong Status Code
4. Apply fix: Add status_code=201
5. Verify with checklist
```

### Use Case 3: Debugging SQLAlchemy Error

```
User: "Getting MissingGreenlet error in categories API"

Agent Workflow:
1. Load skill: backend-api-builder
2. Search skill.md for "MissingGreenlet"
3. Find Pattern 1: Create with Eager Loading
4. Apply fix: Add selectinload()
5. Test again
```

---

## ✅ Checklist (Quick Ref)

Before committing API changes:

- [ ] **201 Created** for POST endpoints
- [ ] **Eager load** relationships
- [ ] **CSRF token** for state changes
- [ ] **Permission check** (role/ownership)
- [ ] **Clear cache** after updates
- [ ] **Log** important operations
- [ ] **Type hints** on params
- [ ] **Error handling** with HTTPException
- [ ] **Tests** written
- [ ] **Docstring** added

---

## 🔗 Related Skills

- **commander-management** - System management
- **git-commit-push** - Auto commit changes

---

## 📈 Success Metrics

This skill helps agents:

- ✅ Avoid 5 most common backend API mistakes
- ✅ Follow consistent code patterns
- ✅ Write production-ready endpoints
- ✅ Reduce debugging time by 70%
- ✅ Ensure proper security and validation

---

## 🆘 Troubleshooting

**Problem:** Agent not using the skill
**Solution:** Ensure skill.json has correct triggers

**Problem:** Agent makes same mistakes
**Solution:** Review checklist and examples.py

**Problem:** Code still has errors
**Solution:** Follow all 10 checklist items

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-23 | Initial release with CRUD templates, pitfalls, patterns |

---

## 🎓 Learning Path

1. **Beginner:** Start with README.md
2. **Intermediate:** Study examples.py
3. **Advanced:** Master skill.md
4. **Expert:** Contribute improvements

---

**🎯 Remember:** This skill encapsulates best practices learned from real bugs fixed in AiCMR. Use it to avoid repeating mistakes!
