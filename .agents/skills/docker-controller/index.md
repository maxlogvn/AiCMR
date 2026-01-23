# Commander Management Skill - Index

**Version:** 2.0 (Optimized)
**Last Updated:** 2026-01-23

---

## 📁 File Structure

```
.claude/skills/commander-management/
├── skill.md           # Complete guide (1000+ lines)
├── README.md          # Quick reference
├── examples.py        # Working examples
├── skill.json         # Metadata
└── index.md           # This file
```

---

## 🚀 Quick Start

### For AI Agents:

1. **ALWAYS load this skill first** for ANY system task
2. Use decision tree to map user request → commander command
3. Follow standard workflow
4. Execute commander
5. Analyze output
6. Report results clearly

### For Developers:

1. **Use commander CLI** for all system operations
2. **Check health** before major changes
3. **View logs** when debugging
4. **Follow best practices** to avoid issues

---

## 📚 Content Summary

### skill.md (Main Documentation)

**Sections:**
1. Mission Statement & Why This Skill Exists
2. Quick Decision Tree (visual flowchart)
3. Command Reference (5 categories with tables)
4. Standard Workflow (5 detailed workflows)
5. Advanced Scenarios (6 real-world scenarios)
6. Troubleshooting Guide (4 problem categories)
7. Emergency Procedures (4 emergency scenarios)
8. Best Practices (DO's and DON'Ts)
9. Checklists (5 categories)
10. Quick Reference Card

**Length:** ~1000 lines of comprehensive guide

**Key Improvements in v2.0:**
- ✅ Visual decision tree
- ✅ Categorized command reference
- ✅ Step-by-step workflows
- ✅ Advanced troubleshooting scenarios
- ✅ Emergency recovery procedures
- ✅ Performance monitoring
- ✅ Maintenance workflows

### README.md (Quick Reference)

**Content:**
- Quick triggers for loading skill
- Quick commands reference
- Decision tree (simplified)
- Common workflows (4 examples)
- Service reference table
- Quick troubleshooting
- Quick checklist
- Emergency commands
- Tips

**Best for:** Quick lookup during operations

### examples.py (Working Examples)

**Content:**
- 10 complete working examples
- Example 1: System startup
- Example 2: Health monitoring
- Example 3: Viewing logs
- Example 4: Shell access
- Example 5: Troubleshooting
- Example 6: Development workflow
- Example 7: Database operations
- Example 8: Emergency procedures
- Example 9: Performance monitoring
- Example 10: Maintenance tasks

**Best for:** Learning by doing, copy-paste ready

---

## 🎯 Use Cases

### Use Case 1: Daily Development

```
Morning:
1. ./commander up (start system)
2. ./commander health (verify)
3. Code changes...

Afternoon:
4. git commit
5. ./commander rebuild (apply changes)
6. ./commander health (verify)

End of day:
7. ./commander down (stop system)
```

### Use Case 2: Debugging Issue

```
User: "Backend không hoạt động"

Agent:
1. Load commander-management skill
2. ./commander status (check backend)
3. ./commander logs backend (view errors)
4. Identify issue from logs
5. Suggest or apply fix
6. ./commander rebuild (if needed)
```

### Use Case 3: Deploy Changes

```
1. git pull (get latest code)
2. ./commander down (stop system)
3. ./commander rebuild (rebuild with new code)
4. ./commander health (verify)
5. Test functionality
```

### Use Case 4: Emergency Recovery

```
System completely down:

1. ./commander down (force stop)
2. docker system prune -a (clean up)
3. Check Docker daemon
4. ./commander up (fresh start)
5. ./commander health (verify)
```

---

## 🔗 Related Skills

### backend-api-builder
- **Purpose:** Build/create backend APIs
- **Relationship:** Build APIs → Test with commander-management
- **Workflow:**
  1. backend-api-builder: Create API
  2. commander-management: Rebuild system
  3. backend-api-tester: Test API

### backend-api-tester
- **Purpose:** Test backend APIs
- **Relationship:** Test APIs running on commander-managed system
- **Workflow:**
  1. commander-management: Start system
  2. backend-api-tester: Test APIs
  3. commander-management: Check logs if fail

### git-commit-push
- **Purpose:** Commit and push changes
- **Relationship:** Commit → commander rebuild → Push
- **Workflow:**
  1. git-commit-push: Commit changes
  2. commander-management: Rebuild system
  3. commander-management: Health check

---

## ✅ Version 2.0 Improvements

### Structure
- ✅ Better organization with clear sections
- ✅ Visual decision tree for quick navigation
- ✅ Categorized command reference (5 categories)
- ✅ Step-by-step workflows
- ✅ Comprehensive troubleshooting guide

### Content
- ✅ **Advanced scenarios** - 6 real-world scenarios
- ✅ **Emergency procedures** - 4 emergency scenarios
- ✅ **Performance monitoring** - System monitoring guide
- ✅ **Maintenance workflows** - Routine tasks
- ✅ **Working examples** - 10 complete examples
- ✅ **Checklists** - 5 different checklists

### Usability
- ✅ **Quick reference card** - One-page command summary
- ✅ **Better decision tree** - Visual flowchart
- ✅ **Clear workflows** - Step-by-step instructions
- ✅ **Practical examples** - Copy-paste ready

---

## 🎯 Quick Reference Card

```
╔═══════════════════════════════════════════════════════════════════════════╗
║              COMMANDER MANAGEMENT - QUICK REFERENCE                       ║
╚═════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│ LIFECYCLE                                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ./commander up          Build + start all containers                     │
│ ./commander down        Stop + remove all containers                     │
│ ./commander rebuild     Rebuild + restart (after code changes)          │
│ ./commander restart     Restart all containers                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ STATUS & HEALTH                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ ./commander health      Quick health check (5s)                            │
│ ./commander status      Detailed container status (CPU/MEM)               │
│ ./commander diagnose    Full system diagnostics                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ LOGS                                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ ./commander logs        All service logs                                  │
│ ./commander logs backend Backend logs only                              │
│ ./commander logs mysql   Database logs only                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ ACCESS                                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ ./commander shell backend     Backend Python shell                       │
│ ./commander shell mysql       MySQL database shell                        │
│ ./commander shell frontend    Frontend Node.js shell                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TROUBLESHOOTING                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. ./commander status      - Check what's running                    │
│ 2. ./commander diagnose    - Find issues                             │
│ 3. ./commander logs [svc]  - View errors                             │
│ 4. ./commander rebuild     - Fix most issues                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ EMERGENCY                                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ ./commander down                                                                 │
│ docker system prune -a                                                         │
│ ./commander up                                                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ SERVICES                                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ backend    - FastAPI backend (port 8000)                                 │
│ frontend   - Next.js frontend (port 3000)                                │
│ mysql      - MySQL database (port 3306)                                 │
│ redis      - Redis cache (port 6379)                                    │
│ nginx      - Reverse proxy                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-21 | Initial version |
| **2.0** | **2026-01-23** | **OPTIMIZED** - Better structure, advanced scenarios, emergency procedures, examples |

---

## 🎓 Key Improvements in v2.0

### 1. Better Organization
- Clear mission statement
- Visual decision tree
- Categorized commands
- Logical section flow

### 2. More Comprehensive Content
- Advanced scenarios (6 scenarios)
- Emergency procedures (4 procedures)
- Performance monitoring
- Maintenance workflows
- Working examples (10 examples)

### 3. Better Usability
- Quick reference card
- Step-by-step workflows
- Troubleshooting decision trees
- Copy-paste ready examples

### 4. Production Ready
- Emergency recovery procedures
- Performance monitoring
- Maintenance checklists
- Best practices

---

## 🎯 Success Metrics

This skill helps agents and developers:

- ✅ **Standardize** all system operations
- ✅ **Reduce errors** through proper workflows
- ✅ **Speed up** troubleshooting with guides
- ✅ **Prevent issues** with best practices
- ✅ **Handle emergencies** with procedures

---

**Status:** Production Ready ✅
**Maintained by:** Claude Code AI
**Last Updated:** 2026-01-23

---

**🎯 Remember: This skill is the GATEKEEPER for all system operations. Always load it first!**
