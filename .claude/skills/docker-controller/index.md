# Docker Controller Skill - Index

**Version:** 3.0 (Platform-Agnostic)
**Last Updated:** 2026-01-25

---

## 📁 File Structure

```
.claude/skills/docker-controller/
├── skill.md           # Complete guide
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
4. Standard Workflow (4 detailed workflows)
5. Advanced Scenarios (3 real-world scenarios)
6. Troubleshooting Guide (2 problem categories)
7. Emergency Procedures (2 emergency scenarios)
8. Best Practices (DO's and DON'Ts)
9. Checklists (2 categories)
10. Quick Reference Card

**Length:** ~580 lines of comprehensive guide

**Key Changes in v3.0:**
- ✅ Platform-agnostic configuration
- ✅ Single docker-compose.yml
- ✅ Unified container names
- ✅ No platform-specific detection

---

## 🎯 Quick Reference

### Container Names (Unified)

| Service | Container Name | All Platforms |
|---------|----------------|---------------|
| MySQL | `aicmr-mysql` | ✅ |
| Backend | `aicmr-backend` | ✅ |
| Frontend | `aicmr-frontend` | ✅ |
| Redis | `aicmr-redis` | ✅ |
| Nginx | `aicmr-nginx` | ✅ |
| phpMyAdmin | `aicmr-phpmyadmin` | ✅ |

### Commander Commands

```
Lifecycle:
  up          - Start all containers
  down        - Stop all containers
  rebuild     - Rebuild & restart
  restart     - Restart containers

Status:
  health      - Quick health check
  status      - Detailed container status
  diagnose    - Full system diagnostics
  version     - Show CLI version

Logs:
  logs        - View all service logs
  logs [svc]  - View specific service logs

Access:
  shell [svc] - Open shell in service
```

---

## 🔄 Cross-Platform Workflow

### Windows Development
```bash
# Source on Windows
./commander up        # Uses same docker-compose.yml
./commander health
```

### Linux Production
```bash
# Same commands!
./commander up        # Uses same docker-compose.yml
./commander health
```

### macOS Development
```bash
# Same commands!
./commander up        # Uses same docker-compose.yml
./commander health
```

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-21 | Initial version |
| 2.0 | 2026-01-23 | Advanced scenarios, emergency procedures |
| **3.0** | **2026-01-25** | **Platform-agnostic - single docker-compose.yml** |

---

## 🎓 Key Improvements in v3.0

### 1. Platform Parity
- Single docker-compose.yml for all platforms
- No more platform-specific overrides
- Consistent container names

### 2. Simplified Management
- No platform detection in commander CLI
- Unified command reference
- Cross-platform troubleshooting

### 3. Enhanced Configuration
- Environment variable overrides
- extra_hosts for host.docker.internal
- Health checks for all services

---

## 🎯 Success Metrics

This skill helps agents and developers:

- ✅ **Standardize** operations across platforms
- ✅ **Reduce errors** through proper workflows
- ✅ **Speed up** troubleshooting with guides
- ✅ **Prevent issues** with best practices
- ✅ **Deploy anywhere** - Windows, Linux, macOS

---

**Status:** Production Ready ✅
**Maintained by:** Claude Code AI
**Last Updated:** 2026-01-25

---

**🎯 Remember: This skill is the GATEKEEPER for all system operations. Always load it first!**
