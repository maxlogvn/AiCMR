#!/bin/bash
# 🎯 Authentication Testing Cheat Sheet

cat << 'EOF'

╔═══════════════════════════════════════════════════════════════════════════╗
║                 🧪 AUTHENTICATION E2E TESTING CHEAT SHEET                 ║
╚═══════════════════════════════════════════════════════════════════════════╝

📋 QUICK COMMANDS
═══════════════════════════════════════════════════════════════════════════

🚀 START BACKEND (Terminal #1)
  $ cd backend
  $ python -m uvicorn app.main:app --reload --port 8000

🚀 START FRONTEND (Terminal #2)
  $ cd frontend
  $ npm run dev

🚀 RUN TESTS (Terminal #3)
  $ cd frontend
  $ npm run test:auth
  
  # Or with headless mode
  $ npm run test:auth:headless

═══════════════════════════════════════════════════════════════════════════

📊 TEST COVERAGE (10 Tests)
═══════════════════════════════════════════════════════════════════════════

✓ TEST 1:  Login Page Load & UI Elements
✓ TEST 2:  Email Validation
✓ TEST 3:  Password Validation  
✓ TEST 4:  Password Visibility Toggle
✓ TEST 5:  Invalid Credentials Error Handling
✓ TEST 6:  Navigation to Register Page
✓ TEST 7:  Register Page UI Elements
✓ TEST 8:  Register Form Validation
✓ TEST 9:  Password Confirmation Matching
✓ TEST 10: Successful Registration Flow

═══════════════════════════════════════════════════════════════════════════

🔧 MODES & OPTIONS
═══════════════════════════════════════════════════════════════════════════

Development Mode (with browser UI, slow):
  $ npm run test:auth

Headless Mode (no UI, fast, for CI):
  $ npm run test:auth:headless

Custom URLs:
  $ BASE_URL=http://example.com BACKEND_URL=http://api.example.com npm run test:auth

Helper Script with checks:
  $ node run-auth-tests.js
  $ node run-auth-tests.js --headless
  $ node run-auth-tests.js --help

Direct ts-node:
  $ ts-node auth-e2e.test.ts

═══════════════════════════════════════════════════════════════════════════

✅ EXPECTED OUTPUT (Success)
═══════════════════════════════════════════════════════════════════════════

🧪 Starting Authentication E2E Tests...

📋 TEST 1: Login Page Load & UI Elements
──────────────────────────────────────────────────
✅ Login header found
✅ Email input field found
✅ Password input field found
✅ Submit button found
✅ Register link found
✅ Login form is visible
✓ TEST 1 PASSED

[... more tests ...]

==================================================
✨ ALL TESTS COMPLETED SUCCESSFULLY ✨
==================================================

═══════════════════════════════════════════════════════════════════════════

🐛 TROUBLESHOOTING
═══════════════════════════════════════════════════════════════════════════

❌ "Frontend is not running"
  → Run: cd frontend && npm run dev

❌ "Backend is not running"
  → Run: cd backend && python -m uvicorn app.main:app --reload --port 8000

❌ "Cannot find module 'agent-browser'"
  → Run: cd frontend && npm install agent-browser --save-dev

❌ "Test timeout"
  → Check network, backend CPU/memory
  → Increase timeout in code (5000ms → 10000ms)

❌ "error-screenshot.png created"
  → Test failed, open screenshot to debug
  → Check console logs for details

═══════════════════════════════════════════════════════════════════════════

📁 FILES CREATED
═══════════════════════════════════════════════════════════════════════════

frontend/auth-e2e.test.ts        ← Main test file
frontend/run-auth-tests.js       ← Helper runner
frontend/AUTH_E2E_TESTING.md     ← Full documentation
frontend/QUICK_START.md          ← Quick start guide
frontend/TEST_CHEATSHEET.sh      ← This file

═══════════════════════════════════════════════════════════════════════════

🎯 WORKFLOW
═══════════════════════════════════════════════════════════════════════════

1. Open Terminal #1: Start Backend
   $ cd backend && python -m uvicorn app.main:app --reload --port 8000

2. Open Terminal #2: Start Frontend
   $ cd frontend && npm run dev

3. Wait both are ready, then Open Terminal #3: Run Tests
   $ cd frontend && npm run test:auth

4. Watch tests run (30-60 seconds)

5. Check results:
   ✅ All passed → Ready to commit
   ❌ Failed → Check error-screenshot.png, fix code, rerun

═══════════════════════════════════════════════════════════════════════════

💡 TIPS
═══════════════════════════════════════════════════════════════════════════

• Run tests after auth code changes
• Use headless mode before committing
• Check error-screenshot.png if fails
• Test data uses timestamps to avoid conflicts
• Each run creates real users on database
• Can integrate with CI/CD (GitHub Actions, etc)

═══════════════════════════════════════════════════════════════════════════

📚 DOCUMENTATION
═══════════════════════════════════════════════════════════════════════════

Full details:      → AUTH_E2E_TESTING.md
Quick start:       → QUICK_START.md
This file:         → TEST_CHEATSHEET.sh
Helper script:     → node run-auth-tests.js --help

═══════════════════════════════════════════════════════════════════════════

✨ Happy Testing! 🚀

EOF
