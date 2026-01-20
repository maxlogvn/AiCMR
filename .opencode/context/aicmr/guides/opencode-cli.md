# Guide: Opencode CLI

**Core Idea**: Use Opencode CLI for AI-assisted development with context management, code review, testing, and deployment commands that integrate with the AiCMR Docker environment and Git workflow.

**Key Points**:
1. Use /context commands to manage knowledge base and extract documentation
2. Apply /review for automated code review against established standards
3. Use /test to run tests within Docker containers at http://aicmr.local
4. Implement /commit for AI-assisted commit message generation and staging
5. Use /fix with specific error details and URLs for targeted debugging

**Quick Example**:
```bash
# Review backend code
/review backend/app/

# Run tests in Docker
/test backend/tests/

# Fix specific error
/fix "404 error at http://aicmr.local/api/users"
```

**Reference**: docs/07-opencode-cli-guide.md

**Related**: guides/getting-started.md, concepts/docker-architecture.md