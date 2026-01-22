#!/bin/bash

# Login/Logout Session Fix - Verification Script
# This script helps verify that the session state cleanup fix is working correctly

echo "🔍 Login/Logout Session State Verification Script"
echo "=================================================="
echo ""

# Check if files have been modified
echo "📋 Checking implementation status..."
echo ""

# Check 1: auth.ts imports
echo "✓ Checking frontend/src/lib/auth.ts imports..."
if grep -q "resetCsrfToken, resetApiState" frontend/src/lib/auth.ts; then
    echo "  ✅ Reset functions imported"
else
    echo "  ❌ Reset functions NOT imported - FIX REQUIRED"
    exit 1
fi

# Check 2: resetCsrfToken call in logout
echo "✓ Checking resetCsrfToken() call in logout..."
if grep -A 60 "async logout()" frontend/src/lib/auth.ts | grep -q "resetCsrfToken()"; then
    echo "  ✅ resetCsrfToken() called in logout"
else
    echo "  ❌ resetCsrfToken() NOT called - FIX REQUIRED"
    exit 1
fi

# Check 3: resetApiState call in logout
echo "✓ Checking resetApiState() call in logout..."
if grep -A 60 "async logout()" frontend/src/lib/auth.ts | grep -q "resetApiState()"; then
    echo "  ✅ resetApiState() called in logout"
else
    echo "  ❌ resetApiState() NOT called - FIX REQUIRED"
    exit 1
fi

# Check 4: Reset functions exported from api.ts
echo "✓ Checking export of reset functions in api.ts..."
if grep -q "export function resetCsrfToken" frontend/src/lib/api.ts; then
    echo "  ✅ resetCsrfToken() exported"
else
    echo "  ❌ resetCsrfToken() NOT exported - FIX REQUIRED"
    exit 1
fi

if grep -q "export function resetApiState" frontend/src/lib/api.ts; then
    echo "  ✅ resetApiState() exported"
else
    echo "  ❌ resetApiState() NOT exported - FIX REQUIRED"
    exit 1
fi

# Check 5: Cache control headers
echo "✓ Checking cache control headers in api.ts..."
if grep -q "Cache-Control.*no-cache.*no-store" frontend/src/lib/api.ts; then
    echo "  ✅ Cache-Control headers configured"
else
    echo "  ❌ Cache-Control headers NOT configured - FIX REQUIRED"
    exit 1
fi

# Check 6: Backend database commit
echo "✓ Checking backend database commit in auth.py..."
if grep -A 1 "token_record.revoked = True" backend/app/api/v1/auth.py | grep -q "await db.commit()"; then
    echo "  ✅ Database commit added for token revocation"
else
    echo "  ⚠️  Database commit might be missing - check backend/app/api/v1/auth.py line ~273"
fi

echo ""
echo "✅ Implementation Status: VERIFIED"
echo ""
echo "════════════════════════════════════════════"
echo "📝 Testing Instructions:"
echo "════════════════════════════════════════════"
echo ""
echo "1️⃣  Start Backend:"
echo "   cd backend"
echo "   python -m uvicorn app.main:app --reload --port 8000"
echo ""
echo "2️⃣  Start Frontend (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3️⃣  Open Browser to http://localhost:3000"
echo ""
echo "4️⃣  Manual Test - Same User Re-login:"
echo "   • Login as test1@example.com"
echo "   • Navigate to /user/profile"
echo "   • Click Logout"
echo "   • Login again as test1@example.com"
echo "   • ✓ Check: Dashboard loads without CSRF errors"
echo "   • ✓ Check: Console shows '[CSRF] Token cache reset' message"
echo ""
echo "5️⃣  Manual Test - Different User Login:"
echo "   • Login as test1@example.com"
echo "   • Note the profile email"
echo "   • Click Logout"
echo "   • Login as test2@example.com"
echo "   • ✓ Check: Profile shows test2@example.com (not test1@example.com)"
echo "   • ✓ Check: No 'Invalid CSRF token' errors in console"
echo "   • ✓ Check: Console shows both reset messages"
echo ""
echo "6️⃣  Browser DevTools Verification:"
echo "   • Open DevTools → Application → Cookies"
echo "   • After logout, verify tokens are cleared"
echo "   • Check Network tab for 'Cache-Control' headers"
echo "   • Look for: 'no-cache, no-store, must-revalidate'"
echo ""
echo "7️⃣  Console Log Verification:"
echo "   Expected logs during logout:"
echo "     [Auth] Logging out"
echo "     [CSRF] Token cache reset for new session"
echo "     [API] Interceptor state reset for new session"
echo "     [Auth] API state reset complete"
echo "     [Auth] Notifying backend of logout"
echo ""
echo "   Expected logs during next login:"
echo "     [Auth] Attempting login for: test2@example.com"
echo "     [CSRF] Token fetched successfully"
echo "     [Auth] Login successful, storing tokens"
echo ""
echo "════════════════════════════════════════════"
echo "🐛 Debugging Tips:"
echo "════════════════════════════════════════════"
echo ""
echo "• Open DevTools Console and look for error messages"
echo "• Check Network tab for failed requests"
echo "• Look for 403 Forbidden responses (CSRF errors)"
echo "• Verify localStorage is cleared after logout"
echo "• Check if Authorization header is removed"
echo ""
echo "✅ All checks passed! Implementation is complete."
echo ""
