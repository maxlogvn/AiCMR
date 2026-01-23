"""
Git Push Skill - Working Examples
=================================

This file demonstrates how to use git push for various
remote repository operations in AiCMR.

Use these examples as reference when pushing code.
"""

# ===================================================================
# EXAMPLE 1: Basic Push Workflow
# ===================================================================

def example_1_basic_push():
    """
    Example: Basic push to remote repository
    """
    print("\n" + "="*80)
    print("Example 1: Basic Push Workflow")
    print("="*80)

    print("\nScenario: Code đã commit sẵn, chỉ cần push lên remote")
    print("-" * 80)

    print("\nStep 1: Check git status")
    print("-" * 80)
    print("git status")
    print()
    print("Expected output:")
    print("On branch master")
    print("Your branch is ahead of 'origin/master' by 1 commit.")
    print("  (use \"git push\" to publish your local commits)")
    print()
    print("nothing to commit, working tree clean")

    print("\nStep 2: Verify commit to be pushed")
    print("-" * 80)
    print("git log --oneline -3")
    print()
    print("Expected output:")
    print("abc123 ✨ feat: add user authentication with JWT")
    print("def456 🐛 fix: resolve timeout error")
    print("ghi789 📝 docs: update API documentation")

    print("\nStep 3: Check current branch")
    print("-" * 80)
    print("git branch")
    print()
    print("Expected output:")
    print("* master")

    print("\nStep 4: Pull latest from remote (IMPORTANT!)")
    print("-" * 80)
    print("git pull --rebase")
    print()
    print("Expected output:")
    print("Already up to date")
    print()
    print("OR if there are remote changes:")
    print("Successfully rebased and updated refs/heads/master")

    print("\nStep 5: Push to remote")
    print("-" * 80)
    print("git push")
    print()
    print("Expected output:")
    print("Enumerating objects: 15, done.")
    print("Counting objects: 100% (15/15), done.")
    print("...")
    print("To https://github.com/user/repo.git")
    print("   abc123..def456  master -> master")

    print("\nStep 6: Verify push")
    print("-" * 80)
    print("git log -1 --oneline")
    print()
    print("Expected output:")
    print("def456 ✨ feat: add user authentication with JWT")

    print("\nStep 7: Report results")
    print("-" * 80)
    print("✅ Pushed successfully")
    print("- Commit: abc123 ✨ feat: add user authentication with JWT")
    print("- Branch: master")
    print("- Remote: origin")


# ===================================================================
# EXAMPLE 2: Push with Uncommitted Changes
# ===================================================================

def example_2_push_with_uncommitted():
    """
    Example: Handle uncommitted changes before pushing
    """
    print("\n" + "="*80)
    print("Example 2: Push with Uncommitted Changes")
    print("="*80)

    print("\nScenario: Có thay đổi chưa được commit")
    print("-" * 80)

    print("\nStep 1: Check git status")
    print("-" * 80)
    print("git status")
    print()
    print("Expected output:")
    print("On branch master")
    print("Changes not staged for commit:")
    print("  modified:   backend/app/api/v1/posts.py")
    print()
    print("Untracked files:")
    print("  frontend/src/components/NewComponent.tsx")

    print("\nStep 2: Inform user")
    print("-" * 80)
    print("⚠️  Bạn có thay đổi chưa commit.")
    print("   Cần commit trước khi push.")
    print()
    print("Options:")
    print("1. Commit the changes")
    print("2. Stash the changes")
    print("3. Discard the changes")

    print("\nStep 3: Load git-commit skill")
    print("-" * 80)
    print("# Review changes")
    print("git diff")
    print()
    print("# Stage files")
    print("git add backend/app/api/v1/posts.py")
    print("git add frontend/src/components/NewComponent.tsx")
    print()
    print("# Commit")
    print('git commit -m "✨ feat: add new component and update posts API"')

    print("\nStep 4: Now proceed with push")
    print("-" * 80)
    print("# Verify commit")
    print("git log -1")
    print()
    print("# Pull latest")
    print("git pull --rebase")
    print()
    print("# Push")
    print("git push")
    print()
    print("✅ Pushed successfully!")


# ===================================================================
# EXAMPLE 3: Push after Pull with Merge
# ===================================================================

def example_3_push_after_pull():
    """
    Example: Pull remote changes before pushing
    """
    print("\n" + "="*80)
    print("Example 3: Push after Pull with Merge")
    print("="*80)

    print("\nScenario: Remote có commits mới hơn local")
    print("-" * 80)

    print("\nStep 1: Check git status")
    print("-" * 80)
    print("git status")
    print()
    print("Expected output:")
    print("On branch master")
    print("Your branch is behind 'origin/master' by 2 commits")
    print("  (use \"git pull\" to update your local branch)")

    print("\nStep 2: Pull with rebase")
    print("-" * 80)
    print("git pull --rebase")
    print()
    print("Expected output:")
    print("remote: Enumerating objects: 15, done.")
    print("remote: Counting objects: 100% (15/15), done.")
    print("...")
    print("Successfully rebased and updated refs/heads/master")

    print("\nStep 3: Check for conflicts")
    print("-" * 80)
    print("git status")
    print()
    print("Expected output (no conflicts):")
    print("On branch master")
    print("Your branch is ahead of 'origin/master' by 1 commit")
    print()
    print("OR (if conflicts):")
    print("CONFLICT (content): Merge conflict in file.py")

    print("\nStep 4: If no conflicts, push")
    print("-" * 80)
    print("git push")
    print()
    print("✅ Pushed successfully")
    print("✅ Pulled 2 commits from remote")
    print("✅ Pushed your commits")
    print("✅ Remote is now up to date")

    print("\nStep 5: If conflicts, resolve first")
    print("-" * 80)
    print("# See Example 4 for conflict resolution")


# ===================================================================
# EXAMPLE 4: Resolve Merge Conflict
# ===================================================================

def example_4_resolve_conflict():
    """
    Example: Resolve merge conflicts during pull
    """
    print("\n" + "="*80)
    print("Example 4: Resolve Merge Conflict")
    print("="*80)

    print("\nScenario: Conflict khi git pull")
    print("-" * 80)

    print("\nStep 1: Pull with rebase")
    print("-" * 80)
    print("git pull --rebase")
    print()
    print("Expected output (CONFLICT):")
    print("Auto-merging backend/app/api/v1/posts.py")
    print("CONFLICT (content): Merge conflict in backend/app/api/v1/posts.py")

    print("\nStep 2: Check git status")
    print("-" * 80)
    print("git status")
    print()
    print("Expected output:")
    print("Both modified: backend/app/api/v1/posts.py")

    print("\nStep 3: Show conflict details")
    print("-" * 80)
    print("git diff")
    print()
    print("Look for conflict markers:")
    print("<<<<<<< HEAD")
    print("Your changes")
    print("=======")
    print("Their changes")
    print(">>>>>>> origin/master")

    print("\nStep 4: Open conflicted file")
    print("-" * 80)
    print("# Use your editor to open:")
    print("backend/app/api/v1/posts.py")
    print()
    print("Example conflict:")
    print("<<<<<<< HEAD")
    print("def get_posts():")
    print("    return db.query(Post).all()")
    print("=======")
    print("def get_posts():")
    print("    return db.query(Post).filter_by(active=True).all()")
    print(">>>>>>> origin/master")

    print("\nStep 5: Resolve conflict manually")
    print("-" * 80)
    print("# Option 1: Keep your changes")
    print("def get_posts():")
    print("    return db.query(Post).all()")
    print()
    print("# Option 2: Keep their changes")
    print("def get_posts():")
    print("    return db.query(Post).filter_by(active=True).all()")
    print()
    print("# Option 3: Merge both")
    print("def get_posts(active_only=False):")
    print("    query = db.query(Post)")
    print("    if active_only:")
    print("        query = query.filter_by(active=True)")
    print("    return query.all()")

    print("\nStep 6: Remove conflict markers")
    print("-" * 80)
    print("# Delete all these lines:")
    print("<<<<<<< HEAD")
    print("=======")
    print(">>>>>>> origin/master")

    print("\nStep 7: Mark as resolved")
    print("-" * 80)
    print("git add backend/app/api/v1/posts.py")

    print("\nStep 8: Continue rebase")
    print("-" * 80)
    print("git rebase --continue")
    print()
    print("Expected output:")
    print("[detached HEAD abc123] Commit message")
    print(" 1 file changed, 5 insertions(+), 2 deletions(-)")
    print("Successfully rebased and updated refs/heads/master")

    print("\nStep 9: Push")
    print("-" * 80)
    print("git push")
    print()
    print("✅ Conflict resolved")
    print("✅ Pushed successfully")


# ===================================================================
# EXAMPLE 5: Push to Different Branch
# ===================================================================

def example_5_push_to_branch():
    """
    Example: Push to a different branch
    """
    print("\n" + "="*80)
    print("Example 5: Push to Different Branch")
    print("="*80)

    print("\nScenario: Push lên branch feature/auth")
    print("-" * 80)

    print("\nStep 1: Check current branch")
    print("-" * 80)
    print("git branch")
    print()
    print("Expected output:")
    print("* master")
    print("  develop")
    print("  feature/auth")

    print("\nStep 2: Switch to target branch")
    print("-" * 80)
    print("git checkout feature/auth")
    print()
    print("Expected output:")
    print("Switched to branch 'feature/auth'")
    print("Your branch is up to date with 'origin/feature/auth'")

    print("\nStep 3: OR create new branch if not exists")
    print("-" * 80)
    print("git checkout -b feature/new-feature")
    print()
    print("Expected output:")
    print("Switched to a new branch 'feature/new-feature'")

    print("\nStep 4: Verify branch")
    print("-" * 80)
    print("git branch")
    print()
    print("Expected output:")
    print("  master")
    print("* feature/auth")

    print("\nStep 5: Pull latest from that branch")
    print("-" * 80)
    print("git pull --rebase origin feature/auth")
    print()
    print("OR for new branch:")
    print("# No need to pull if new branch")

    print("\nStep 6: Push to that branch")
    print("-" * 80)
    print("# For existing branch:")
    print("git push")
    print()
    print("# For new branch (set upstream):")
    print("git push -u origin feature/new-feature")
    print()
    print("Expected output:")
    print("Branch 'feature/new-feature' set up to track remote branch")
    print("'feature/new-feature' from 'origin'")

    print("\nStep 7: Verify")
    print("-" * 80)
    print("git branch -vv")
    print()
    print("Expected output:")
    print("* feature/new-feature abc123 [origin/feature/new-feature] Commit message")
    print("  master            def456 [origin/master] Another commit")

    print("\nStep 8: Report")
    print("-" * 80)
    print("✅ Pushed to feature/new-feature")
    print("✅ Branch tracking established")


# ===================================================================
# EXAMPLE 6: Handle Rejected Push
# ===================================================================

def example_6_rejected_push():
    """
    Example: Handle rejected push
    """
    print("\n" + "="*80)
    print("Example 6: Handle Rejected Push")
    print("="*80)

    print("\nScenario: Push bị rejected")
    print("-" * 80)

    print("\nStep 1: Try to push")
    print("-" * 80)
    print("git push")
    print()
    print("Expected output (REJECTED):")
    print("! [rejected]        master -> master (fetch first)")
    print("error: failed to push some refs to 'https://github.com/user/repo.git'")
    print("hint: Updates were rejected because the tip of your current branch is behind")

    print("\nStep 2: Pull with rebase")
    print("-" * 80)
    print("git pull --rebase")
    print()
    print("Expected output:")
    print("remote: Enumerating objects...")
    print("...")
    print("Successfully rebased and updated refs/heads/master")

    print("\nStep 3: Check for conflicts")
    print("-" * 80)
    print("git status")
    print()
    print("If no conflicts:")
    print("→ Push again: git push")
    print()
    print("If conflicts:")
    print("→ Resolve conflicts (see Example 4)")
    print("→ Then push: git push")

    print("\nStep 4: Push again")
    print("-" * 80)
    print("git push")
    print()
    print("Expected output:")
    print("To https://github.com/user/repo.git")
    print("   abc123..def456  master -> master")

    print("\n✅ Pushed successfully after pull")


# ===================================================================
# EXAMPLE 7: Force Push (CAUTION!)
# ===================================================================

def example_7_force_push():
    """
    Example: Force push with caution
    """
    print("\n" + "="*80)
    print("Example 7: Force Push (CAUTION!)")
    print("="*80)

    print("\n⚠️  WARNING: Force push is DANGEROUS!")
    print("Only use when absolutely necessary")
    print("-" * 80)

    print("\nWhen to use force push:")
    print("1. Local commits bị corrupted")
    print("2. Muốn rollback pushed commits")
    print("3. Fix broken commits trong history")
    print("4. After interactive rebase")

    print("\nStep 1: Verify you really need force push")
    print("-" * 80)
    print("git log --oneline -5")
    print()
    print("Review commits to be force pushed")

    print("\nStep 2: Confirm with user")
    print("-" * 80)
    print("⚠️  Force push will overwrite remote history!")
    print("   This can break others' work if they based changes on old commits")
    print()
    print("Continue? (yes/no)")

    print("\nStep 3: Use --force-with-lease (SAFER)")
    print("-" * 80)
    print("git push --force-with-lease")
    print()
    print("NOT: git push --force (DANGEROUS!)")
    print()
    print("Why --force-with-lease?")
    print("- Checks if remote branch has changed")
    print("- Aborts if remote has new commits")
    print("- Safer than --force")

    print("\nStep 4: Verify")
    print("-" * 80)
    print("git log --oneline -3")
    print()
    print("Expected output:")
    print("abc123 ✨ feat: add user authentication")
    print("def456 🐛 fix: resolve timeout")
    print("ghi789 ♻️ refactor: reorganize code")

    print("\n✅ Force push completed")
    print("⚠️  Notify team that history was rewritten")


# ===================================================================
# EXAMPLE 8: Permission Denied
# ===================================================================

def example_8_permission_denied():
    """
    Example: Handle permission denied error
    """
    print("\n" + "="*80)
    print("Example 8: Permission Denied")
    print("="*80)

    print("\nScenario: Push bị permission denied")
    print("-" * 80)

    print("\nStep 1: Try to push")
    print("-" * 80)
    print("git push")
    print()
    print("Expected output (ERROR):")
    print("error: failed to push some refs to 'https://github.com/user/repo.git'")
    print("fatal: Authentication failed for 'https://github.com/user/repo.git'")

    print("\nStep 2: Check remote URL")
    print("-" * 80)
    print("git remote -v")
    print()
    print("Expected output:")
    print("origin  https://github.com/user/repo.git (fetch)")
    print("origin  https://github.com/user/repo.git (push)")

    print("\nStep 3: Verify you have access")
    print("-" * 80)
    print("# Try in browser:")
    print("https://github.com/user/repo")
    print()
    print("# Check if you're a collaborator")
    print("# Check if repo exists")
    print("# Check if you're logged in")

    print("\nStep 4: Re-authenticate")
    print("-" * 80)
    print("# Option 1: Store credentials")
    print("git config --global credential.helper store")
    print("git push")
    print("# Enter username and password when prompted")
    print()
    print("# Option 2: Use personal access token")
    print("# Generate token at GitHub Settings")
    print("# Use token as password")
    print()
    print("# Option 3: Switch to SSH")
    print("git remote set-url origin git@github.com:user/repo.git")
    print("git push")
    print("# Requires SSH key setup")

    print("\nStep 5: Push again")
    print("-" * 80)
    print("git push")
    print()
    print("Expected output:")
    print("To https://github.com/user/repo.git")
    print("   abc123..def456  master -> master")

    print("\n✅ Authentication successful")
    print("✅ Pushed successfully")


# ===================================================================
# EXAMPLE 9: Push Large Files
# ===================================================================

def example_9_large_files():
    """
    Example: Handle large file push issues
    """
    print("\n" + "="*80)
    print("Example 9: Push Large Files")
    print("="*80)

    print("\nScenario: Push bị fail vì file quá lớn")
    print("-" * 80)

    print("\nStep 1: Try to push")
    print("-" * 80)
    print("git push")
    print()
    print("Expected output (ERROR):")
    print("error: RPC failed; curl 56 OpenSSL SSL_read: Connection was reset")
    print("fatal: the remote end hung up unexpectedly")

    print("\nStep 2: Increase buffer size")
    print("-" * 80)
    print("# Set post buffer to 500MB")
    print("git config http.postBuffer 524288000")

    print("\nStep 3: Try push again")
    print("-" * 80)
    print("git push")

    print("\nStep 4: If still fails, use SSH")
    print("-" * 80)
    print("# Switch from HTTPS to SSH")
    print("git remote set-url origin git@github.com:user/repo.git")
    print("git push")

    print("\nStep 5: If file should not be committed")
    print("-" * 80)
    print("# Remove large file from history")
    print("git filter-branch --force --index-filter \\")
    print('  "git rm --cached --ignore-unmatch large-file.zip" \\')
    print("  --prune-empty --tag-name-filter cat -- --all")
    print()
    print("# Force push (CAUTION!)")
    print("git push --force-with-lease")

    print("\nStep 6: Use Git LFS for future")
    print("-" * 80)
    print("# Install Git LFS")
    print("git lfs install")
    print()
    print("# Track large files")
    print("git lfs track '*.zip'")
    print("git lfs track '*.psd'")
    print()
    print("# Commit .gitattributes")
    print("git add .gitattributes")
    print("git commit -m '🔧 chore: add Git LFS tracking'")

    print("\n✅ Large file issue resolved")


# ===================================================================
# EXAMPLE 10: Complete Push Workflow
# ===================================================================

def example_10_complete_workflow():
    """
    Example: Complete push workflow with all checks
    """
    print("\n" + "="*80)
    print("Example 10: Complete Push Workflow")
    print("="*80)

    print("\nScenario: Complete workflow từ đầu đến cuối")
    print("-" * 80)

    print("\n=== PRE-PUSH CHECKS ===")
    print()
    print("Check 1: Working tree clean")
    print("-" * 80)
    print("git status")
    print()
    print("✅ Expected: nothing to commit, working tree clean")
    print("❌ If not clean: Commit or stash changes first")

    print("\nCheck 2: Verify commits")
    print("-" * 80)
    print("git log --oneline -5")
    print()
    print("✅ Review:")
    print("  - Commit messages are correct")
    print("  - No sensitive commits")
    print("  - Changes make sense")

    print("\nCheck 3: Check current branch")
    print("-" * 80)
    print("git branch")
    print()
    print("✅ Verify: On intended branch")
    print("❌ If wrong: git checkout <correct-branch>")

    print("\nCheck 4: Pull latest")
    print("-" * 80)
    print("git pull --rebase")
    print()
    print("✅ Expected: Already up to date OR successful merge")
    print("❌ If conflicts: Resolve before pushing")

    print("\nCheck 5: Test locally")
    print("-" * 80)
    print("# Run tests")
    print("pytest tests/ -v")
    print()
    print("# Or run linter")
    print("black . --check")
    print()
    print("✅ All tests pass")

    print("\n=== PUSH ===")
    print()
    print("Step 1: Push to remote")
    print("-" * 80)
    print("git push")
    print()
    print("Expected output:")
    print("Enumerating objects: XX, done.")
    print("...")
    print("To https://github.com/user/repo.git")
    print("   abc123..def456  master -> master")

    print("\n=== POST-PUSH VERIFICATION ===")
    print()
    print("Check 1: Verify push")
    print("-" * 80)
    print("git log -1")
    print()
    print("✅ Commit shows in log")

    print("\nCheck 2: Check on GitHub/GitLab")
    print("-" * 80)
    print("# Open browser")
    print("https://github.com/user/repo")
    print()
    print("✅ Commit appears in repository")

    print("\nCheck 3: Monitor CI/CD")
    print("-" * 80)
    print("# Check CI/CD pipeline")
    print("# All checks should pass")
    print()
    print("✅ CI/CD passed")

    print("\nCheck 4: Notify team (if needed)")
    print("-" * 80)
    print("# Create PR/MR if on feature branch")
    print("# Or notify team of deployment")

    print("\n=== SUMMARY ===")
    print("-" * 80)
    print("✅ All pre-push checks passed")
    print("✅ Pushed successfully")
    print("✅ Post-push verification complete")
    print("✅ CI/CD monitoring active")
    print()
    print("🎉 Push workflow complete!")


# ===================================================================
# RUNNING EXAMPLES
# ===================================================================

if __name__ == "__main__":
    """
    Run all examples to demonstrate git push usage
    """
    print("\n" + "="*80)
    print("GIT PUSH SKILL - WORKING EXAMPLES")
    print("="*80)
    print()
    print("This file contains examples of how to use git push")
    print("for various remote repository operations in AiCMR.")
    print()
    print("To use these examples:")
    print("1. Read through the example functions below")
    print("2. Copy the commands you need")
    print("3. Execute them in your terminal")
    print()
    print("Available examples:")
    print("- Example 1: Basic push workflow")
    print("- Example 2: Push with uncommitted changes")
    print("- Example 3: Push after pull with merge")
    print("- Example 4: Resolve merge conflict")
    print("- Example 5: Push to different branch")
    print("- Example 6: Handle rejected push")
    print("- Example 7: Force push (CAUTION!)")
    print("- Example 8: Permission denied")
    print("- Example 9: Push large files")
    print("- Example 10: Complete push workflow")
    print()
    print("="*80)

    # Run example demonstrations
    example_1_basic_push()
    example_2_push_with_uncommitted()
    example_3_push_after_pull()
    example_4_resolve_conflict()
    example_5_push_to_branch()
    example_6_rejected_push()
    example_7_force_push()
    example_8_permission_denied()
    example_9_large_files()
    example_10_complete_workflow()

    print("\n" + "="*80)
    print("END OF EXAMPLES")
    print("="*80)


"""
SUMMARY
=======

Key Takeaways:

1. **ALWAYS pull before push**
   - git pull --rebase
   - Get latest changes first
   - Avoid unnecessary conflicts

2. **Check before pushing**
   - git status - Working tree clean?
   - git log - Correct commits?
   - git branch - Right branch?

3. **Handle conflicts properly**
   - Don't force push unless necessary
   - Resolve conflicts manually
   - Test after resolution

4. **Use safe force push**
   - git push --force-with-lease
   - NOT: git push --force
   - Only when absolutely necessary

5. **Verify after push**
   - Check git log
   - Check on GitHub/GitLab
   - Monitor CI/CD

Common Commands:
- git push              - Push to current branch
- git pull --rebase     - Pull and rebase (PREFERRED)
- git push -u origin <branch> - Push & set upstream
- git push --force-with-lease - Safe force push
- git remote -v          - Show remotes
- git branch -vv         - Show tracking branches

Troubleshooting:
1. git pull --rebase   - Sync with remote first
2. Resolve conflicts    - See Example 4
3. git push             - Try again
4. Check credentials    - If permission denied

For quick reference, see README.md
For full documentation, see SKILL.md
"""
