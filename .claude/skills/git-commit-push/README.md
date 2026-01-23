# Git Push Skill - Quick Reference

[![Version](https://img.shields.io/badge/version-2.0-blue.svg)](https://github.com/your-org/AiCMR)
[![Status](https://img.shields.io/badge/status-production--ready-brightgreen.svg)](https://github.com/your-org/AiCMR)
[![Skill](https://img.shields.io/badge/skill-git__push-orange.svg)](https://github.com/your-org/AiCMR)

**Hướng dẫn nhanh cho AI agents push code lên remote repository an toàn.**

---

## 🚀 Quick Start

### Cách sử dụng skill này

```
Khi người dùng yêu cầu push code:
    ↓
1. Load skill: git-push (or git-commit-push)
    ↓
2. Check commit status (git status)
    ↓
3. Pull latest (git pull --rebase)
    ↓
4. Resolve conflicts if any
    ↓
5. Push to remote (git push)
    ↓
6. Verify push succeeded
```

---

## 📋 Push Workflow Quick Reference

### Standard Workflow

```bash
# Step 1: Check status
git status

# Step 2: Pull latest
git pull --rebase

# Step 3: Resolve conflicts if any
# (See conflict resolution section)

# Step 4: Push
git push

# Step 5: Verify
git log -1
```

### Quick Decision Tree

```
Uncommitted changes?
  ├─ YES → Load git-commit skill → Commit first
  └─ NO → Continue

Remote has new commits?
  ├─ YES → git pull --rebase
  │        ├─ Conflicts? → Resolve → Push
  │        └─ No conflicts? → Push
  └─ NO → git push

Push rejected?
  ├─ Diverged? → git pull --rebase → Push
  ├─ Permission? → Check credentials
  └─ Other? → See troubleshooting
```

---

## ⚔️ Common Issues & Solutions

### Issue 1: Push Rejected (Non-Fast Forward)

**Symptoms:**
```
! [rejected] master -> master (fetch first)
```

**Solution:**
```bash
git pull --rebase
# Resolve conflicts if any
git push
```

### Issue 2: Merge Conflict

**Symptoms:**
```
CONFLICT (content): Merge conflict in file.py
```

**Solution:**
```bash
# 1. Check status
git status

# 2. Open file, resolve conflict
# Remove: <<<<<<< HEAD, ======, >>>>>>> origin/master

# 3. Mark resolved
git add file.py

# 4. Continue
git rebase --continue

# 5. Push
git push
```

### Issue 3: Permission Denied

**Symptoms:**
```
fatal: Authentication failed
```

**Solution:**
```bash
# Option 1: Re-authenticate
git config --global credential.helper store
git push

# Option 2: Use SSH
git remote set-url origin git@github.com:user/repo.git
git push
```

### Issue 4: Already Up to Date

**Symptoms:**
```
Everything up-to-date
```

**Solution:**
```bash
# Verify status
git status

# If you meant to commit something
# Use git-commit skill first
```

---

## 🔧 Push Commands Reference

### Basic Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `git push` | Push to current branch | Standard push |
| `git push -u origin <branch>` | Push & set upstream | First time pushing branch |
| `git pull --rebase` | Pull & rebase | Before pushing (PREFERRED) |
| `git pull` | Pull & merge | Alternative to rebase |

### Force Push Commands

| Command | Safety | When to Use |
|---------|--------|-------------|
| `git push --force-with-lease` | ✅ Safer | Most force push scenarios |
| `git push --force` | ❌ Dangerous | Avoid unless absolutely necessary |

⚠️ **WARNING:** Force push overwrites remote history!

### Remote Management

| Command | Description |
|---------|-------------|
| `git remote -v` | Show remotes |
| `git branch -vv` | Show tracking branches |
| `git branch --set-upstream-to=origin/<branch>` | Set upstream |

---

## 📝 Pre-Push Checklist

- [ ] **Working tree clean**
  - `git status` shows clean
  - No uncommitted changes

- [ ] **Commits reviewed**
  - `git log --oneline -5` reviewed
  - Commit messages correct
  - No sensitive commits

- [ ] **Branch correct**
  - `git branch` checked
  - On intended branch
  - Not on detached HEAD

- [ ] **Pulled latest**
  - `git pull --rebase` executed
  - No conflicts
  - Up to date with remote

- [ ] **Tested locally**
  - Code runs without errors
  - Tests pass
  - No obvious issues

---

## 🔗 Related Skills

### git-commit
- **Purpose:** Commit code locally
- **Relationship:** Must commit before push
- **Use case:** When you have uncommitted changes

### commander-management
- **Purpose:** System management
- **Relationship:** Rebuild after push
- **Use case:** After pushing code changes

---

## 💡 Best Practices

### DO's ✅

1. **ALWAYS pull before push**
   - `git pull --rebase`
   - Get latest changes first

2. **Check before pushing**
   - Verify commits
   - Check branch
   - Review changes

3. **Handle conflicts properly**
   - Don't force push unless necessary
   - Resolve manually
   - Test after resolution

4. **Use safe force push**
   - `git push --force-with-lease`
   - NOT: `git push --force`

### DON'Ts ❌

1. **Don't push uncommitted changes**
   - Commit first
   - Use git-commit skill

2. **Don't skip pull before push**
   - Will cause conflicts
   - Or rejection

3. **Don't use force push carelessly**
   - Overwrites remote history
   - Breaks others' work

4. **Don't ignore conflicts**
   - Must resolve
   - Or abort rebase

---

## 📁 File Structure

```
.claude/skills/git-commit-push/
├── SKILL.md          # Main documentation
├── skill.json        # Skill metadata
├── examples.py       # Working examples
├── README.md         # This file (quick reference)
└── index.md          # Skill index
```

---

## 📖 Documentation

- **Full Documentation:** See [SKILL.md](SKILL.md)
- **Working Examples:** See [examples.py](examples.py)
- **Skill Index:** See [index.md](index.md)

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-01-23 | Focused on push operations, conflict resolution, troubleshooting |
| 1.0 | 2026-01-21 | Initial version (combined commit + push) |

---

**Maintained by:** Claude Code AI
**Last Updated:** 2026-01-23
**Status:** Production Ready ✅

---

**🎯 Remember: Push is permanent. Push wisely!**

For detailed workflows and advanced scenarios, see [SKILL.md](SKILL.md)
