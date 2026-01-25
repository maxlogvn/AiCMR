# Git Push Skill - AiCMR

**Version:** 2.0 (Optimized)
**Purpose:** Hướng dẫn AI agents push code lên remote repository một cách an toàn và xử lý các vấn đề thường gặp.

---

## 🎯 Mission Statement

**Skill này đảm bảo EVERY push lên remote được thực hiện an toàn và xử lý đúng cách các conflict.**

⚠️ **GOLDEN RULES:**
1. **LUÔN commit trước khi push** - Không push code chưa commit
2. **PULL trước khi push** - Đảm bảo code mới nhất từ remote
3. **XỬ LÝ CONFLICT đúng cách** - Không dùng force push除非 cần thiết
4. **KIỂM TRA TRƯỚC KHI PUSH** - Verify changes are correct

---

## 🚨 Why This Skill Exists

### Problem
AI agents thường:
- ❌ Push code chưa commit
- ❌ Không pull trước khi push → gây conflict
- ❌ Dùng force push bừa bãi → mất code
- ❌ Không biết xử lý merge conflicts
- ❌ Push nhầm branch
- ❌ Không hiểu remote workflow

### Solution
Skill này cung cấp:
- ✅ **Standardized push workflow** với checks
- ✅ **Merge conflict resolution** step-by-step
- ✅ **Remote troubleshooting** guides
- ✅ **Force push guidelines** khi nào dùng/không dùng
- ✅ **Branch management** best practices
- ✅ **Pull-push workflow** chuẩn

---

## 📋 Table of Contents

1. [Quick Decision Tree](#quick-decision-tree)
2. [Standard Push Workflow](#standard-push-workflow)
3. [Merge Conflict Resolution](#merge-conflict-resolution)
4. [Remote Troubleshooting](#remote-troubleshooting)
5. [Advanced Scenarios](#advanced-scenarios)
6. [Best Practices](#best-practices)
7. [Checklist](#checklist)

---

## 🌳 Quick Decision Tree

```
User Request: Push code
    │
    ├─ Step 1: Check commit status
    │   ├─ Uncommitted changes?
    │   │   ├─ YES → Load git-commit skill
    │   │   │         → Commit first
    │   │   └─ NO → Continue
    │   │
    │   ├─ Step 2: Check current branch
    │   │   └─ git branch
    │   │
    │   ├─ Step 3: Pull latest from remote
    │   │   ├─ git pull --rebase
    │   │   ├─ Conflicts?
    │   │   │   ├─ YES → Resolve conflicts
    │   │   │   └─ NO → Continue
    │   │
    │   ├─ Step 4: Push to remote
    │   │   ├─ Success? → Done ✅
    │   │   ├─ Rejected? → Check reason
    │   │   │   ├─ Diverged? → git pull --rebase
    │   │   │   ├─ Not ahead? → Already up to date
    │   │   │   └─ Permission? → Check credentials
    │   │
    │   └─ Step 5: Verify push
    │       └─ git log -1
```

---

## 🔄 Standard Push Workflow

### Workflow 1: Basic Push (Đơn giản)

**Scenario:** Code đã commit sẵn, chỉ cần push lên remote

```
USER: "Push code lên"

AGENT:
1. Load skill: git-push (or git-commit-push)

2. Check commit status
   → git status
   → "nothing to commit, working tree clean" ✅

3. Check current branch
   → git branch
   → "* master"

4. Check remote status
   → git remote -v
   → "origin  https://github.com/user/repo.git"

5. Pull latest from remote
   → git pull --rebase
   → "Already up to date" ✅

6. Push to remote
   → git push

7. Verify push
   → git log -1 --oneline
   → Check GitHub/GitLab to verify

8. Report results
   → ✅ Pushed successfully
   → Commit: abc123 ✨ feat: add user authentication
```

### Workflow 2: Push với Uncommitted Changes

**Scenario:** Có thay đổi chưa được commit

```
USER: "Push code"

AGENT:
1. Load skill: git-push

2. Check status
   → git status
   → "Changes not staged for commit"

3. Inform user
   → "Bạn có thay đổi chưa commit.
       Cần commit trước khi push."

4. Load git-commit skill
   → Review changes
   → Commit code

5. Return to git-push workflow
   → Continue from Step 3 of Workflow 1
```

### Workflow 3: Push sau Pull với Merge

**Scenario:** Remote có commits mới hơn local

```
USER: "Push code"

AGENT:
1. Check status
   → git status
   → "Your branch is behind 'origin/master' by 2 commits"

2. Pull first
   → git pull --rebase
   → Auto-merge successful
   → "Fast-forwarding to origin/master"

3. Check for conflicts
   → No conflicts ✅

4. Push now
   → git push
   → "Everything up-to-date"

5. Report
   → ✅ Pulled 2 commits from remote
   → ✅ Pushed your commits
   → Remote is now up to date
```

### Workflow 4: Push sang Different Branch

**Scenario:** Push lên branch khác (không phải master)

```
USER: "Push lên branch feature/auth"

AGENT:
1. Check current branch
   → git branch
   → "* master"

2. Switch to target branch
   → git checkout feature/auth
   → "Switched to branch 'feature/auth'"
   → Or: git checkout -b feature/auth (if not exists)

3. Verify branch
   → git branch
   → "* feature/auth"

4. Pull latest from that branch
   → git pull --rebase origin feature/auth

5. Push to that branch
   → git push -u origin feature/auth

6. Report
   → ✅ Pushed to feature/auth
   → Branch tracking established
```

---

## ⚔️ Merge Conflict Resolution

### Scenario 1: Conflict khi git pull

**Symptoms:**
```
git pull --rebase
Auto-merging backend/app/api/v1/posts.py
CONFLICT (content): Merge conflict in backend/app/api/v1/posts.py
```

**Resolution Workflow:**

```
AGENT:
1. Identify conflict
   → git status
   → "both modified: backend/app/api/v1/posts.py"

2. Show conflict details
   → git diff

3. Open conflicted file
   → Look for conflict markers:
     <<<<<<< HEAD
     Your changes
     =======
     Their changes
     >>>>>>> origin/master

4. Manual resolution
   → Read both versions
   → Decide what to keep
   → Remove conflict markers
   → Keep wanted code
   → Remove unwanted code

5. Mark as resolved
   → git add backend/app/api/v1/posts.py

6. Continue rebase
   → git rebase --continue
   → Or if complete: git commit

7. Verify resolution
   → git status
   → "rebase finished successfully"

8. Push
   → git push
```

### Scenario 2: Conflict trong Multiple Files

**Symptoms:**
```
CONFLICT (content): Merge conflict in backend/app/api/v1/posts.py
CONFLICT (content): Merge conflict in backend/app/api/v1/users.py
CONFLICT (content): Merge conflict in frontend/src/components/Header.tsx
```

**Resolution Workflow:**

```
AGENT:
1. List all conflicts
   → git status
   → Count: 3 conflicted files

2. Resolve one by one
   → For each file:
     a. Open file
     b. Find conflict markers
     c. Resolve conflict
     d. git add <file>

3. After all resolved
   → git rebase --continue

4. If needed, write merge commit
   → git commit -m "🔧 merge: resolve conflicts in multiple files"

5. Push
   → git push
```

### Scenario 3: Complex Conflict Resolution

**Situation:** Conflict phức tạp, cần người dùng quyết định

```
AGENT:
1. Detect complex conflict
   → Multiple sections conflicted
   → Hard to auto-resolve

2. Present options to user
   → Option 1: Keep your changes
   → Option 2: Keep their changes
   → Option 3: Manual merge
   → Option 4: Ask user to review

3. If manual merge needed
   → Show diff of both sides
   → Explain what changed
   → Ask user which to keep

4. After user decides
   → Apply resolution
   → Mark as resolved
   → Continue rebase

5. Push
   → git push
```

---

## 🔧 Remote Troubleshooting

### Problem 1: "Rejected" - Non-Fast Forward

**Symptoms:**
```
! [rejected]        master -> master (fetch first)
error: failed to push some refs to 'https://github.com/user/repo.git'
hint: Updates were rejected because the tip of your current branch is behind
```

**Cause:** Remote có commits mà local không có

**Solution:**
```bash
# Step 1: Pull with rebase
git pull --rebase

# Step 2: If conflicts, resolve
# (See conflict resolution above)

# Step 3: Push again
git push
```

### Problem 2: "Diverged Branches"

**Symptoms:**
```
! [rejected]        master -> master (non-fast-forward)
```

**Cause:** Local và remote có history khác nhau

**Solution:**
```bash
# Option 1: Rebase (PREFERRED)
git pull --rebase
# Resolve conflicts if any
git push

# Option 2: Merge (ALTERNATIVE)
git pull --no-rebase
# Resolve merge conflicts
git push

# Option 3: Force push (CAUTION! Only if you're sure)
git push --force-with-lease
# NOT: git push --force (dangerous!)
```

### Problem 3: "Already Up to Date"

**Symptoms:**
```
git push
Everything up-to-date
```

**Cause:** Không có gì để push (remote đã có commits mới nhất)

**Solution:**
```bash
# Verify status
git status

# Check if you have uncommitted changes
git status --short

# If you meant to commit something
# Use git-commit skill first
```

### Problem 4: "Permission Denied"

**Symptoms:**
```
error: failed to push some refs to 'https://github.com/user/repo.git'
fatal: Authentication failed for 'https://github.com/user/repo.git'
```

**Cause:** Sai credentials hoặc không có quyền push

**Solution:**
```bash
# Step 1: Check remote URL
git remote -v

# Step 2: Verify you have access
# Try in browser: https://github.com/user/repo

# Step 3: Re-authenticate
git config --global credential.helper store
git push
# Enter credentials when prompted

# Step 4: Or use SSH instead
git remote set-url origin git@github.com:user/repo.git
git push
```

### Problem 5: "Connection Timed Out"

**Symptoms:**
```
fatal: unable to access 'https://github.com/user/repo.git/':
Connection timed out
```

**Cause:** Mạng vấn đề hoặc firewall

**Solution:**
```bash
# Step 1: Check internet
ping github.com

# Step 2: Check proxy settings
git config --global http.proxy

# Step 3: Try again
git push

# Step 4: If still fails, check VPN/firewall
# May need to whitelist git
```

### Problem 6: Push sang Branch chưa tồn tại trên Remote

**Symptoms:**
```
git push
error: src refspec feature/new-branch does not match any
```

**Cause:** Branch mới chưa được push lần đầu

**Solution:**
```bash
# Step 1: Verify branch exists locally
git branch
# Should show: * feature/new-branch

# Step 2: Push with -u to set upstream
git push -u origin feature/new-branch

# Step 3: Verify
git branch -vv
# Should show: feature/new-branch abc123 [origin/feature/new-branch]
```

---

## 🎯 Advanced Scenarios

### Scenario 1: Force Push (Cautious Use)

**When to use:**
- Local commits bị corrupted
- Muốn rollback pushed commits
- Fix broken commits trong history

**WARNING:** ⚠️ **DANGEROUS** - Can overwrite remote history!

**Workflow:**
```bash
# Step 1: Verify you really need force push
git log --oneline -5

# Step 2: Confirm with user
# "Force push will overwrite remote history.
#  Are you sure you want to proceed?"

# Step 3: Use --force-with-lease (SAFER)
git push --force-with-lease

# NOT: git push --force (DANGEROUS!)

# Step 4: Verify
git log --oneline -3
```

### Scenario 2: Revert Pushed Commit

**Situation:** Đã push commit sai, muốn revert

**Workflow:**
```bash
# Step 1: Find commit to revert
git log --oneline -10

# Step 2: Revert (creates NEW commit)
git revert abc123

# Step 3: If conflicts, resolve
# (See conflict resolution)

# Step 4: Push the revert
git push

# Note: Original commit still in history
# Revert commit is new commit that undoes changes
```

### Scenario 3: Cherry-pick to Different Branch

**Situation:** Muốn commit cụ thể sang branch khác

**Workflow:**
```bash
# Step 1: Find commit hash
git log --oneline -10

# Step 2: Switch to target branch
git checkout feature-branch

# Step 3: Cherry-pick
git cherry-pick abc123

# Step 4: If conflicts, resolve
git status
# Resolve conflicts
git add <resolved-files>
git cherry-pick --continue

# Step 5: Push to branch
git push origin feature-branch
```

### Scenario 4: Push sau Rebase Interactive

**Situation:** Đã rebase history local, cần force push

**Workflow:**
```bash
# Step 1: Completed interactive rebase
git rebase -i HEAD~5
# Squashed, reordered, or edited commits

# Step 2: History has changed
git log --oneline
# Commit hashes are different now

# Step 3: MUST force push
git push --force-with-lease

# WARNING: If others have based work on old commits
# This will cause issues for them
```

### Scenario 5: Push Large Files

**Situation:** Push bị fail vì file quá lớn

**Symptoms:**
```
error: RPC failed; curl 56 OpenSSL SSL_read: Connection was reset, errno 10054
fatal: the remote end hung up unexpectedly
```

**Solution:**
```bash
# Option 1: Increase buffer size
git config http.postBuffer 524288000

# Option 2: Use SSH instead of HTTPS
git remote set-url origin git@github.com:user/repo.git

# Option 3: Push in smaller chunks
git config --add http.lowSpeedLimit 0
git config --add http.lowSpeedTime 999999

# Option 4: Remove large file (if should not be committed)
# Use git-filter-repo or BFG Repo-Cleaner
```

---

## ✅ Best Practices

### For AI Agents

#### DO's ✅

1. **ALWAYS check commit status first**
   - `git status`
   - Ensure working tree clean

2. **PULL before PUSH**
   - `git pull --rebase`
   - Get latest changes first

3. **Handle conflicts properly**
   - Don't force push unless necessary
   - Resolve conflicts manually
   - Test after resolution

4. **Verify before pushing**
   - Check what will be pushed
   - `git log --oneline -5`
   - Confirm with user if needed

5. **Use safe force push**
   - `git push --force-with-lease`
   - NOT: `git push --force`

6. **Report clearly**
   - What was pushed
   - Any conflicts encountered
   - Current remote status

#### DON'Ts ❌

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

5. **Don't push to wrong branch**
   - Check current branch
   - Verify target branch

### For Developers

#### DO's ✅

1. **Pull frequently**
   - Before starting work
   - Before pushing
   - Keep local updated

2. **Push often**
   - Small, frequent pushes
   - Don't accumulate commits

3. **Resolve conflicts promptly**
   - Don't let them linger
   - Communicate with team

4. **Use feature branches**
   - Don't push directly to master
   - Use PRs/MRs for review

5. **Keep history clean**
   - Squash related commits
   - Write meaningful messages

#### DON'Ts ❌

1. **Don't push broken code**
   - Test before pushing
   - Fix before pushing

2. **Don't force push to shared branches**
   - Avoid on master, develop
   - Only on feature branches

3. **Don't push sensitive data**
   - Check before push
   - Use .gitignore

4. **Don't push huge binaries**
   - Use Git LFS
   - Or external storage

5. **Don't ignore push failures**
   - Read error messages
   - Fix underlying issues

---

## 📋 Checklist

### Pre-Push Checklist

- [ ] **Working tree clean**
  - No uncommitted changes
  - `git status` shows clean

- [ ] **Commits reviewed**
  - `git log --oneline -5` reviewed
  - Commit messages are correct
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

### Post-Push Checklist

- [ ] **Push verified**
  - `git log -1` shows on remote
  - GitHub/GitLab shows commit
  - No errors in output

- [ ] **CI/CD passed**
  - Pipeline running
  - All checks pass
  - No build failures

- [ ] **Team notified**
  - PR/MR created if needed
  - Team informed of changes
  - Documentation updated

- [ ] **Monitor for issues**
  - Check production/staging
  - Monitor for errors
  - Be ready to rollback

---

## 🔗 Quick Reference Card

```
GIT PUSH COMMANDS

Basic:
  git push              - Push to current branch
  git push -u origin <branch>  - Push & set upstream

Pull before push:
  git pull              - Pull and merge
  git pull --rebase     - Pull and rebase (PREFERRED)

Force push:
  git push --force-with-lease  - Safe force push
  git push --force             - DANGEROUS! Avoid

Remote management:
  git remote -v          - Show remotes
  git remote add <name> <url> - Add remote
  git branch -vv         - Show tracking branches

Troubleshooting:
  git push --dry-run     - Simulate push
  git push --verbose     - Detailed output
  git log --oneline -5   - Show recent commits

WORKFLOW:
  1. git status         - Check clean
  2. git log -1         - Verify commit
  3. git pull --rebase  - Get latest
  4. [resolve conflicts if any]
  5. git push           - Push to remote
  6. Verify on GitHub/GitLab
```

---

## 📚 Related Skills

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

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-01-23 | **OPTIMIZED** - Focused on push operations, conflict resolution, troubleshooting |
| 1.0 | 2026-01-21 | Initial version (combined commit + push) |

---

**Maintained by:** Claude Code AI
**Last Updated:** 2026-01-23
**Status:** Production Ready ✅

---

**🎯 Remember: Push is permanent. Push wisely!**
