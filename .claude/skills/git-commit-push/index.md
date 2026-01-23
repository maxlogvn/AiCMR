# Git Push Skill - Index

**Version:** 2.0 | **Status:** Production Ready | **Category:** Development

---

## 🎯 Overview

Git Push Skill provides comprehensive guidelines and workflows for pushing code to remote repositories safely in the AiCMR project.

### Purpose

- Ensure every push to remote is performed safely
- Handle merge conflicts correctly
- Troubleshoot remote issues
- Prevent data loss from force pushes

### Key Features

- ✅ Standardized push workflow with safety checks
- ✅ Merge conflict resolution (step-by-step)
- ✅ Remote troubleshooting guides
- ✅ Force push guidelines (when to use/not use)
- ✅ Branch management best practices
- ✅ Pull-push integration

---

## 📚 Documentation Index

### Core Documentation

| File | Description | Audience |
|------|-------------|----------|
| [SKILL.md](SKILL.md) | Main skill documentation with complete push guidelines | AI Agents, Developers |
| [README.md](README.md) | Quick reference and usage guide | Quick Start |
| [examples.py](examples.py) | Working examples demonstrating push workflows | Learning, Reference |

### Documentation Sections

#### SKILL.md Contents

1. **Quick Decision Tree** - Choose the right action
2. **Standard Push Workflow** - 4 workflows (basic, uncommitted, pull-merge, different branch)
3. **Merge Conflict Resolution** - Single, multiple, and complex conflicts
4. **Remote Troubleshooting** - 6 common problems and solutions
5. **Advanced Scenarios** - Force push, revert, cherry-pick, rebase, large files
6. **Best Practices** - DO's & DON'Ts for AI agents and developers
7. **Checklist** - Pre-push and post-push verification

#### README.md Contents

1. **Quick Start** - How to use the skill
2. **Push Workflow** - Standard workflow reference
3. **Common Issues** - 4 common problems and solutions
4. **Push Commands** - Command reference table
5. **Pre-Push Checklist** - Verification before push
6. **Related Skills** - Integration points

#### examples.py Contents

1. **Example 1** - Basic push workflow
2. **Example 2** - Push with uncommitted changes
3. **Example 3** - Push after pull with merge
4. **Example 4** - Resolve merge conflict
5. **Example 5** - Push to different branch
6. **Example 6** - Handle rejected push
7. **Example 7** - Force push (CAUTION!)
8. **Example 8** - Permission denied
9. **Example 9** - Push large files
10. **Example 10** - Complete push workflow

---

## 🚀 Quick Start Guide

### For AI Agents

```
When user asks to push code:

1. LOAD this skill
2. RUN: git status
3. CHECK: Working tree clean?
   ├─ NO → Load git-commit skill → Commit first
   └─ YES → Continue
4. RUN: git pull --rebase
5. RESOLVE conflicts if any
6. RUN: git push
7. VERIFY: git log -1
8. REPORT: Results to user
```

### For Developers

```
Daily push workflow:

1. Make code changes
2. Commit changes (git-commit skill)
3. Test thoroughly
4. git pull --rebase (sync with remote)
5. Resolve conflicts if any
6. git push (push to remote)
7. Verify on GitHub/GitLab
8. Monitor CI/CD
```

---

## 📋 Quick Reference Tables

### Push Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `git push` | Push to current branch | Standard push |
| `git push -u origin <branch>` | Push & set upstream | First push to new branch |
| `git pull --rebase` | Pull & rebase | Before pushing (PREFERRED) |
| `git pull` | Pull & merge | Alternative approach |
| `git push --force-with-lease` | Safe force push | When necessary (SAFER) |
| `git push --force` | Force push | DANGEROUS! Avoid |

### Common Problems & Solutions

| Problem | Solution | Link |
|---------|----------|------|
| Rejected (non-fast-forward) | `git pull --rebase` then push | [SKILL.md#problem-1](SKILL.md#problem-1-rejected---non-fast-forward) |
| Merge conflict | Resolve manually, then push | [SKILL.md#scenario-1](SKILL.md#scenario-1-conflict-khi-git-pull) |
| Permission denied | Check credentials, re-auth | [SKILL.md#problem-4](SKILL.md#problem-4-permission-denied) |
| Already up to date | Nothing to push | [SKILL.md#problem-3](SKILL.md#problem-3-already-up-to-date) |
| Connection timeout | Check network, try again | [SKILL.md#problem-5](SKILL.md#problem-5-connection-timed-out) |
| Large files | Increase buffer or use LFS | [SKILL.md#scenario-5](SKILL.md#scenario-5-push-large-files) |

### Force Push Guidelines

| Situation | Safe to Force Push? | Command |
|-----------|---------------------|---------|
| Local commits corrupted | ✅ Yes | `git push --force-with-lease` |
| After interactive rebase | ✅ Yes | `git push --force-with-lease` |
| Rollback pushed commit | ✅ Yes | `git push --force-with-lease` |
| On shared branch (master) | ❌ NO | Don't do it! |
| Others based on commits | ❌ NO | Breaks their work |
| Just to "fix something" | ❌ NO | Use revert instead |

---

## 🔗 Related Skills

### git-commit
- **Purpose:** Commit code locally
- **Relationship:** Must commit before push
- **Workflow:**
  1. git-commit: Commit changes
  2. git-push: Push to remote

### commander-management
- **Purpose:** System management
- **Relationship:** Rebuild after push
- **Workflow:**
  1. git-push: Push to remote
  2. commander-management: `./commander rebuild`
  3. commander-management: `./commander health`

### backend-api-builder
- **Purpose:** Build backend APIs
- **Relationship:** Create before commit
- **Workflow:**
  1. backend-api-builder: Create/update API
  2. git-commit: Commit code
  3. git-push: Push to remote

### backend-api-tester
- **Purpose:** Test backend APIs
- **Relationship:** Test after push
- **Workflow:**
  1. git-push: Push code
  2. commander-management: Rebuild
  3. backend-api-tester: Test APIs

---

## 📊 Skill Metadata

| Property | Value |
|----------|-------|
| **Name** | git-commit-push |
| **Version** | 2.0 |
| **Status** | Production Ready ✅ |
| **Category** | Development |
| **Author** | Claude Code AI |
| **Last Updated** | 2026-01-23 |
| **Tags** | git, push, remote, version-control, merge-conflict |
| **Triggers** | push, đẩy code, push code, git push, lên github |
| **Icon** | 📤 |

---

## 🛠️ Troubleshooting Quick Links

### By Error Type

| Error Type | Most Likely Cause | Solution |
|------------|-------------------|----------|
| **Rejected** | Remote has new commits | `git pull --rebase` |
| **Conflict** | Both sides changed same lines | Manual resolution |
| **Permission** | Wrong credentials | Re-authenticate |
| **Timeout** | Network issues | Check connection |
| **Large file** | File too big for HTTP | Use SSH or Git LFS |

### By Scenario

| Scenario | Solution | Link |
|----------|----------|------|
| First push to new branch | `git push -u origin <branch>` | [Example 5](examples.py#example-5) |
| Conflict in single file | Manual resolution | [Example 4](examples.py#example-4) |
| Conflict in multiple files | Resolve one by one | [SKILL.md#scenario-2](SKILL.md#scenario-2-conflict-trong-multiple-files) |
| Need to undo pushed commit | Use revert | [SKILL.md#scenario-2](SKILL.md#scenario-2-revert-pushed-commit) |
| After interactive rebase | Force push needed | [SKILL.md#scenario-4](SKILL.md#scenario-4-push-sau-rebase-interactive) |

---

## 📈 Version History

### Version 2.0 (2026-01-23)

**Optimized Release**

- Focused skill on PUSH operations only
- Separated from git-commit skill
- Added comprehensive merge conflict resolution
- Enhanced remote troubleshooting guide
- Added 10 working examples
- Created quick reference README
- Added skill index

**Changes:**
- Skill renamed from "git-commit-push" to focus on push
- git-commit is now a separate skill
- Better workflow integration between skills

### Version 1.0 (2026-01-21)

**Initial Release**

- Combined commit + push workflow
- Basic remote operations
- Simple conflict resolution

---

## 🎓 Learning Path

### For New AI Agents

1. **Start Here:** [README.md](README.md) - Quick overview
2. **Learn Workflow:** [SKILL.md#standard-push-workflow](SKILL.md#standard-push-workflow)
3. **Understand Conflicts:** [SKILL.md#merge-conflict-resolution](SKILL.md#merge-conflict-resolution)
4. **Study Examples:** [examples.py](examples.py)
5. **Reference:** Keep this index handy

### For Developers

1. **Quick Start:** [README.md](README.md)
2. **Best Practices:** [SKILL.md#best-practices](SKILL.md#best-practices)
3. **Troubleshooting:** [SKILL.md#remote-troubleshooting](SKILL.md#remote-troubleshooting)
4. **Reference:** Command tables above

---

## 📞 Support

### Getting Help

- **Documentation:** See [SKILL.md](SKILL.md) for complete guide
- **Examples:** See [examples.py](examples.py) for working examples
- **Quick Ref:** See [README.md](README.md) for quick reference

### Common Issues Quick Fix

```bash
# Issue: Push rejected
git pull --rebase
git push

# Issue: Merge conflict
git status
# Resolve conflicts
git add <resolved-files>
git rebase --continue
git push

# Issue: Permission denied
git config --global credential.helper store
git push
# Enter credentials
```

---

## 🎯 Key Takeaways

### For AI Agents

1. **ALWAYS pull before push** - `git pull --rebase`
2. **Check status first** - `git status`
3. **Handle conflicts properly** - Manual resolution
4. **Use safe force push** - `--force-with-lease` only
5. **Verify after push** - Check git log and remote

### For Developers

1. **Pull frequently** - Keep local updated
2. **Push often** - Small, frequent pushes
3. **Resolve conflicts promptly** - Don't let them linger
4. **Use feature branches** - Not master directly
5. **Keep history clean** - Meaningful commits

---

**Maintained by:** Claude Code AI
**Last Updated:** 2026-01-23
**Status:** Production Ready ✅

---

**🎯 Remember: Push is permanent. Push wisely!**

For complete documentation, see [SKILL.md](SKILL.md)
For quick reference, see [README.md](README.md)
For working examples, see [examples.py](examples.py)
