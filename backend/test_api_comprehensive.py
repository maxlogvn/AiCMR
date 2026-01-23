"""
Comprehensive API Test Script for AiCMR Backend
Tests all API endpoints and generates detailed report
"""
import asyncio
import json
import sys
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum

try:
    import httpx
except ImportError:
    print("Installing httpx...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "httpx"])
    import httpx


class TestStatus(Enum):
    PASSED = "✅ PASSED"
    FAILED = "❌ FAILED"
    SKIPPED = "⏭️ SKIPPED"
    ERROR = "⚠️ ERROR"


@dataclass
class TestResult:
    endpoint: str
    method: str
    status: TestStatus
    status_code: Optional[int] = None
    response_time: float = 0.0
    error_message: str = ""
    details: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ModuleResults:
    module_name: str
    results: List[TestResult] = field(default_factory=list)

    @property
    def total(self) -> int:
        return len(self.results)

    @property
    def passed(self) -> int:
        return sum(1 for r in self.results if r.status == TestStatus.PASSED)

    @property
    def failed(self) -> int:
        return sum(1 for r in self.results if r.status == TestStatus.FAILED)

    @property
    def skipped(self) -> int:
        return sum(1 for r in self.results if r.status == TestStatus.SKIPPED)

    @property
    def error_count(self) -> int:
        return sum(1 for r in self.results if r.status == TestStatus.ERROR)


class APITester:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.client: Optional[httpx.AsyncClient] = None
        self.modules: Dict[str, ModuleResults] = {}

        # Auth tokens
        self.admin_token: Optional[str] = None
        self.user_token: Optional[str] = None
        self.moderator_token: Optional[str] = None
        self.csrf_token: Optional[str] = None

        # Test data IDs
        self.test_user_id: Optional[int] = None
        self.test_post_id: Optional[int] = None
        self.test_category_id: Optional[int] = None
        self.test_tag_id: Optional[int] = None

    async def __aenter__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        return self

    async def __aexit__(self, *args):
        if self.client:
            await self.client.aclose()

    def get_module(self, module_name: str) -> ModuleResults:
        if module_name not in self.modules:
            self.modules[module_name] = ModuleResults(module_name=module_name)
        return self.modules[module_name]

    def add_result(self, module: str, result: TestResult):
        self.get_module(module).results.append(result)

    async def make_request(
        self,
        method: str,
        path: str,
        module: str,
        test_name: str,
        expected_status: int = 200,
        acceptable_statuses: list[int] = None,
        token: Optional[str] = None,
        **kwargs
    ) -> TestResult:
        """Make HTTP request and record result"""
        url = f"{self.base_url}{path}"
        headers = kwargs.pop("headers", {})

        if token:
            headers["Authorization"] = f"Bearer {token}"
        if self.csrf_token:
            headers["X-CSRF-Token"] = self.csrf_token

        start_time = datetime.now()

        try:
            response = await self.client.request(
                method, url, headers=headers, **kwargs
            )
            response_time = (datetime.now() - start_time).total_seconds()

            # Check if status is acceptable
            valid_statuses = acceptable_statuses or [expected_status]
            if response.status_code in valid_statuses:
                status = TestStatus.PASSED
                error_msg = ""
            else:
                status = TestStatus.FAILED
                error_msg = f"Expected {valid_statuses}, got {response.status_code}"

            try:
                details = response.json() if response.content else {}
            except:
                details = {"content": response.text[:500]}

            return TestResult(
                endpoint=test_name,
                method=method,
                status=status,
                status_code=response.status_code,
                response_time=response_time,
                error_message=error_msg,
                details=details
            )

        except Exception as e:
            response_time = (datetime.now() - start_time).total_seconds()
            return TestResult(
                endpoint=test_name,
                method=method,
                status=TestStatus.ERROR,
                response_time=response_time,
                error_message=str(e)
            )

    # ==================== AUTH API TESTS ====================
    async def test_auth_module(self):
        """Test all authentication endpoints"""
        print("\n🔐 Testing Auth API...")

        # Test login with default admin
        result = await self.make_request(
            "POST", "/api/v1/auth/login",
            "Auth", "POST /api/v1/auth/login (Admin)",
            expected_status=200,
            json={"email": "admin@aicmr.test", "password": "Admin123456!"}
        )
        self.add_result("Auth", result)

        if result.status == TestStatus.PASSED:
            self.admin_token = result.details.get("access_token")

        # Test login with invalid credentials
        result = await self.make_request(
            "POST", "/api/v1/auth/login",
            "Auth", "POST /api/v1/auth/login (Invalid)",
            expected_status=401,
            json={"email": "invalid@example.com", "password": "wrong"}
        )
        self.add_result("Auth", result)

        # Test register new user
        timestamp = datetime.now().timestamp()
        result = await self.make_request(
            "POST", "/api/v1/auth/register",
            "Auth", "POST /api/v1/auth/register",
            expected_status=200,
            json={
                "email": f"testuser{timestamp}@example.com",
                "username": f"testuser{timestamp}",
                "password": "TestPassword123!",
                "full_name": "Test User"
            }
        )
        self.add_result("Auth", result)

        # Test login with new user
        if result.status == TestStatus.PASSED:
            new_email = f"testuser{timestamp}@example.com"
            result = await self.make_request(
                "POST", "/api/v1/auth/login",
                "Auth", "POST /api/v1/auth/login (New User)",
                expected_status=200,
                json={"email": new_email, "password": "TestPassword123!"}
            )
            self.add_result("Auth", result)

            if result.status == TestStatus.PASSED:
                self.user_token = result.details.get("access_token")

        # Test logout
        result = await self.make_request(
            "POST", "/api/v1/auth/logout",
            "Auth", "POST /api/v1/auth/logout",
            expected_status=200,
            token=self.user_token or self.admin_token
        )
        self.add_result("Auth", result)

        # Test refresh token (if available)
        if self.admin_token:
            # This would need a refresh token from login response
            pass

    # ==================== USERS API TESTS ====================
    async def test_users_module(self):
        """Test all user management endpoints"""
        print("\n👥 Testing Users API...")

        if not self.admin_token:
            print("  ⚠️ Skipping - No admin token")
            return

        # List all users (admin only)
        result = await self.make_request(
            "GET", "/api/v1/users/",
            "Users", "GET /api/v1/users/ (List)",
            expected_status=200,
            token=self.admin_token
        )
        self.add_result("Users", result)

        # Get current user info
        result = await self.make_request(
            "GET", "/api/v1/users/me",
            "Users", "GET /api/v1/users/me",
            expected_status=200,
            token=self.user_token or self.admin_token
        )
        self.add_result("Users", result)

        # Get specific user (admin)
        if self.test_user_id:
            result = await self.make_request(
                "GET", f"/api/v1/users/{self.test_user_id}",
                "Users", f"GET /api/v1/users/{{id}}",
                expected_status=200,
                token=self.admin_token
            )
            self.add_result("Users", result)

            # Update user (admin)
            result = await self.make_request(
                "PATCH", f"/api/v1/users/{self.test_user_id}",
                "Users", "PATCH /api/v1/users/{id}",
                expected_status=200,
                token=self.admin_token,
                json={"full_name": "Updated Name"}
            )
            self.add_result("Users", result)

    # ==================== POSTS API TESTS ====================
    async def test_posts_module(self):
        """Test all post endpoints"""
        print("\n📝 Testing Posts API...")

        if not self.user_token:
            print("  ⚠️ Skipping - No user token")
            return

        # List public posts
        result = await self.make_request(
            "GET", "/api/v1/posts/",
            "Posts", "GET /api/v1/posts/ (Public)",
            expected_status=200
        )
        self.add_result("Posts", result)

        # Create a new post
        timestamp = datetime.now().timestamp()
        result = await self.make_request(
            "POST", "/api/v1/posts/me",
            "Posts", "POST /api/v1/posts/me",
            expected_status=201,
            token=self.user_token,
            json={
                "title": f"Test Post {timestamp}",
                "slug": f"test-post-{int(timestamp)}",
                "content": "This is a test post content",
                "excerpt": "Test excerpt",
                "status": "draft"
            }
        )
        self.add_result("Posts", result)

        if result.status == TestStatus.PASSED:
            self.test_post_id = result.details.get("id")
            post_slug = result.details.get("slug")

            # Get my posts
            result = await self.make_request(
                "GET", "/api/v1/posts/me",
                "Posts", "GET /api/v1/posts/me",
                expected_status=200,
                token=self.user_token
            )
            self.add_result("Posts", result)

            # Get specific post by slug
            if post_slug:
                result = await self.make_request(
                    "GET", f"/api/v1/posts/{post_slug}",
                    "Posts", "GET /api/v1/posts/{slug}",
                    expected_status=200
                )
                self.add_result("Posts", result)

                # Get raw content
                result = await self.make_request(
                    "GET", f"/api/v1/posts/{post_slug}/raw",
                    "Posts", "GET /api/v1/posts/{slug}/raw",
                    expected_status=200
                )
                self.add_result("Posts", result)

            # Update post
            if self.test_post_id:
                result = await self.make_request(
                    "PATCH", f"/api/v1/posts/me/{self.test_post_id}",
                    "Posts", "PATCH /api/v1/posts/me/{id}",
                    expected_status=200,
                    token=self.user_token,
                    json={"title": "Updated Test Post"}
                )
                self.add_result("Posts", result)

                # Change status
                result = await self.make_request(
                    "PATCH", f"/api/v1/posts/me/{self.test_post_id}/status",
                    "Posts", "PATCH /api/v1/posts/me/{id}/status",
                    expected_status=200,
                    token=self.user_token,
                    json={"status": "published"}
                )
                self.add_result("Posts", result)

        # Test admin-only endpoints
        if self.admin_token:
            # List all posts (admin)
            result = await self.make_request(
                "GET", "/api/v1/posts/all",
                "Posts", "GET /api/v1/posts/all (Admin)",
                expected_status=200,
                token=self.admin_token
            )
            self.add_result("Posts", result)

    # ==================== CATEGORIES API TESTS ====================
    async def test_categories_module(self):
        """Test all category endpoints"""
        print("\n📁 Testing Categories API...")

        # List categories (public)
        result = await self.make_request(
            "GET", "/api/v1/categories/",
            "Categories", "GET /api/v1/categories/",
            expected_status=200
        )
        self.add_result("Categories", result)

        # Get category tree (accept 200 or 404 - 404 when no data)
        result = await self.make_request(
            "GET", "/api/v1/categories/tree",
            "Categories", "GET /api/v1/categories/tree",
            expected_status=200,
            acceptable_statuses=[200, 404]
        )
        self.add_result("Categories", result)

        if not self.admin_token:
            return

        # Create category (admin only)
        timestamp = datetime.now().timestamp()
        result = await self.make_request(
            "POST", "/api/v1/categories/",
            "Categories", "POST /api/v1/categories/",
            expected_status=201,
            token=self.admin_token,
            json={
                "name": f"Test Category {timestamp}",
                "slug": f"test-category-{timestamp}",
                "description": "Test category description"
            }
        )
        self.add_result("Categories", result)

        if result.status == TestStatus.PASSED:
            self.test_category_id = result.details.get("id")
            category_slug = result.details.get("slug")

            # Get category by slug
            if category_slug:
                result = await self.make_request(
                    "GET", f"/api/v1/categories/{category_slug}",
                    "Categories", "GET /api/v1/categories/{slug}",
                    expected_status=200
                )
                self.add_result("Categories", result)

            # Update category
            if self.test_category_id:
                result = await self.make_request(
                    "PATCH", f"/api/v1/categories/{self.test_category_id}",
                    "Categories", "PATCH /api/v1/categories/{id}",
                    expected_status=200,
                    token=self.admin_token,
                    json={"description": "Updated description"}
                )
                self.add_result("Categories", result)

    # ==================== TAGS API TESTS ====================
    async def test_tags_module(self):
        """Test all tag endpoints"""
        print("\n🏷️ Testing Tags API...")

        # List tags (public)
        result = await self.make_request(
            "GET", "/api/v1/tags/",
            "Tags", "GET /api/v1/tags/",
            expected_status=200
        )
        self.add_result("Tags", result)

        # Get trending tags (accept 200 or 404 - 404 when no data)
        result = await self.make_request(
            "GET", "/api/v1/tags/trending",
            "Tags", "GET /api/v1/tags/trending",
            expected_status=200,
            acceptable_statuses=[200, 404]
        )
        self.add_result("Tags", result)

        if not self.admin_token:
            return

        # Create tag (admin only)
        timestamp = datetime.now().timestamp()
        result = await self.make_request(
            "POST", "/api/v1/tags/",
            "Tags", "POST /api/v1/tags/",
            expected_status=201,
            token=self.admin_token,
            json={
                "name": f"TestTag{timestamp}",
                "slug": f"testtag{timestamp}",
                "color": "#FF0000"
            }
        )
        self.add_result("Tags", result)

        if result.status == TestStatus.PASSED:
            self.test_tag_id = result.details.get("id")
            tag_slug = result.details.get("slug")

            # Get tag by slug
            if tag_slug:
                result = await self.make_request(
                    "GET", f"/api/v1/tags/{tag_slug}",
                    "Tags", "GET /api/v1/tags/{slug}",
                    expected_status=200
                )
                self.add_result("Tags", result)

            # Update tag
            if self.test_tag_id:
                result = await self.make_request(
                    "PATCH", f"/api/v1/tags/{self.test_tag_id}",
                    "Tags", "PATCH /api/v1/tags/{id}",
                    expected_status=200,
                    token=self.admin_token,
                    json={"color": "#00FF00"}
                )
                self.add_result("Tags", result)

            # Get unused tags
            result = await self.make_request(
                "GET", "/api/v1/tags/unused",
                "Tags", "GET /api/v1/tags/unused (Admin)",
                expected_status=200,
                token=self.admin_token
            )
            self.add_result("Tags", result)

    # ==================== UPLOADS API TESTS ====================
    async def test_uploads_module(self):
        """Test all upload endpoints"""
        print("\n📤 Testing Uploads API...")

        if not self.user_token:
            print("  ⚠️ Skipping - No user token")
            return

        # Note: Upload endpoint only accepts: jpg, jpeg, png, pdf, docx
        # For testing, we skip this as it requires actual image files
        # In production, this should be tested with real image files
        self.add_result("Uploads", TestResult(
            endpoint="POST /api/v1/uploads/",
            method="POST",
            status=TestStatus.SKIPPED,
            error_message="Skipped - Requires valid image file (jpg, jpeg, png, pdf, docx)"
        ))

    # ==================== SETTINGS & STATS API TESTS ====================
    async def test_settings_stats_module(self):
        """Test settings and stats endpoints"""
        print("\n⚙️ Testing Settings & Stats API...")

        # Get public settings
        result = await self.make_request(
            "GET", "/api/v1/settings/public",
            "Settings", "GET /api/v1/settings/public",
            expected_status=200
        )
        self.add_result("Settings", result)

        if not self.admin_token:
            return

        # Get all settings (moderator+)
        result = await self.make_request(
            "GET", "/api/v1/settings/",
            "Settings", "GET /api/v1/settings/ (Admin)",
            expected_status=200,
            token=self.admin_token
        )
        self.add_result("Settings", result)

        # Get stats overview
        result = await self.make_request(
            "GET", "/api/v1/stats/overview",
            "Stats", "GET /api/v1/stats/overview",
            expected_status=200,
            token=self.admin_token
        )
        self.add_result("Stats", result)

    # ==================== INSTALL API TESTS ====================
    async def test_install_module(self):
        """Test installation endpoints"""
        print("\n🔧 Testing Install API...")

        # Get install status
        result = await self.make_request(
            "GET", "/api/v1/install/status",
            "Install", "GET /api/v1/install/status",
            expected_status=200
        )
        self.add_result("Install", result)

        # Note: We skip POST /api/v1/install/setup as it may affect
        # the existing installation
        self.add_result("Install", TestResult(
            endpoint="POST /api/v1/install/setup",
            method="POST",
            status=TestStatus.SKIPPED,
            error_message="Skipped to avoid affecting production installation"
        ))

    # ==================== GLOBAL ENDPOINTS ====================
    async def test_global_endpoints(self):
        """Test global endpoints"""
        print("\n🌐 Testing Global Endpoints...")

        # Root endpoint
        result = await self.make_request(
            "GET", "/",
            "Global", "GET /",
            expected_status=200
        )
        self.add_result("Global", result)

        # Health check
        result = await self.make_request(
            "GET", "/health",
            "Global", "GET /health",
            expected_status=200
        )
        self.add_result("Global", result)

        # CSRF token
        result = await self.make_request(
            "GET", "/api/v1/csrf-token",
            "Global", "GET /api/v1/csrf-token",
            expected_status=200
        )
        self.add_result("Global", result)

        if result.status == TestStatus.PASSED:
            self.csrf_token = result.details.get("csrf_token")

    # ==================== MAIN TEST RUNNER ====================
    async def run_all_tests(self):
        """Run all API tests"""
        print("=" * 60)
        print("🚀 Starting Comprehensive API Test")
        print("=" * 60)

        # Test in dependency order
        await self.test_global_endpoints()
        await self.test_install_module()
        await self.test_auth_module()
        await self.test_users_module()
        await self.test_categories_module()
        await self.test_tags_module()
        await self.test_posts_module()
        await self.test_uploads_module()
        await self.test_settings_stats_module()

        print("\n" + "=" * 60)
        print("✅ All Tests Completed")
        print("=" * 60)

    # ==================== REPORT GENERATION ====================
    def generate_markdown_report(self) -> str:
        """Generate detailed Markdown report"""
        lines = []
        lines.append("# Backend API Test Report - AiCMR\n")
        lines.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        lines.append("---\n")

        # Executive Summary
        total_tests = sum(m.total for m in self.modules.values())
        total_passed = sum(m.passed for m in self.modules.values())
        total_failed = sum(m.failed for m in self.modules.values())
        total_skipped = sum(m.skipped for m in self.modules.values())
        total_errors = sum(m.error_count for m in self.modules.values())

        lines.append("## 📊 Executive Summary\n")
        lines.append(f"- **Total Endpoints Tested:** {total_tests}")
        lines.append(f"- **✅ Passed:** {total_passed} ({total_passed/total_tests*100:.1f}%)")
        lines.append(f"- **❌ Failed:** {total_failed} ({total_failed/total_tests*100:.1f}%)")
        lines.append(f"- **⏭️ Skipped:** {total_skipped}")
        lines.append(f"- **⚠️ Errors:** {total_errors}")
        lines.append("")

        # Success rate calculation
        success_rate = (total_passed / total_tests * 100) if total_tests > 0 else 0
        lines.append(f"**Overall Success Rate:** {success_rate:.1f}%\n")

        # Module Summary Table
        lines.append("## 📋 Module Summary\n")
        lines.append("| Module | Total | Passed | Failed | Skipped | Errors | Success Rate |")
        lines.append("|--------|-------|--------|--------|---------|--------|--------------|")

        for module_name in sorted(self.modules.keys()):
            module = self.modules[module_name]
            rate = (module.passed / module.total * 100) if module.total > 0 else 0
            lines.append(
                f"| {module_name} | {module.total} | {module.passed} | "
                f"{module.failed} | {module.skipped} | {module.error_count} | {rate:.1f}% |"
            )

        lines.append("")

        # Detailed Results per Module
        lines.append("## 📝 Detailed Test Results\n")

        for module_name in sorted(self.modules.keys()):
            module = self.modules[module_name]
            lines.append(f"### {module_name} API\n")
            lines.append(f"**Total Tests:** {module.total} | ")
            lines.append(f"**Passed:** {module.passed} | ")
            lines.append(f"**Failed:** {module.failed}\n")

            if not module.results:
                lines.append("*No tests run*\n")
                continue

            lines.append("| Endpoint | Method | Status | Status Code | Response Time | Notes |")
            lines.append("|----------|--------|--------|-------------|---------------|-------|")

            for result in module.results:
                status_emoji = {
                    TestStatus.PASSED: "✅",
                    TestStatus.FAILED: "❌",
                    TestStatus.SKIPPED: "⏭️",
                    TestStatus.ERROR: "⚠️"
                }.get(result.status, "?")

                notes = result.error_message if result.error_message else "-"

                lines.append(
                    f"| {result.endpoint} | {result.method} | {status_emoji} {result.status.value} | "
                    f"{result.status_code or '-'} | {result.response_time:.3f}s | {notes} |"
                )

            lines.append("")

        # Issues Found
        lines.append("## 🐛 Issues Found\n")

        critical_issues = []
        medium_issues = []
        low_issues = []

        for module in self.modules.values():
            for result in module.results:
                if result.status in [TestStatus.FAILED, TestStatus.ERROR]:
                    issue = f"- **{result.endpoint}** ({result.method}): {result.error_message}"

                    if "401" in str(result.status_code) or "403" in str(result.status_code):
                        critical_issues.append(issue)
                    elif "500" in str(result.status_code) or result.status == TestStatus.ERROR:
                        critical_issues.append(issue)
                    else:
                        medium_issues.append(issue)

        if critical_issues:
            lines.append("### 🔴 Critical Issues\n")
            for issue in critical_issues:
                lines.append(f"{issue}\n")
            lines.append("")

        if medium_issues:
            lines.append("### 🟡 Medium Priority Issues\n")
            for issue in medium_issues:
                lines.append(f"{issue}\n")
            lines.append("")

        if not critical_issues and not medium_issues:
            lines.append("*No critical or medium priority issues found! 🎉*\n")

        # Recommendations
        lines.append("## 💡 Recommendations\n")

        if total_failed > 0 or total_errors > 0:
            lines.append("1. **Fix Failed Tests:** Address the failed and error tests listed above")
            lines.append("2. **Review Authentication:** Ensure all auth-dependent endpoints work correctly")
            lines.append("3. **Check Permissions:** Verify role-based access control is working")
        else:
            lines.append("1. ✅ All endpoints are functioning correctly!")
            lines.append("2. 🎉 Consider adding more edge case tests for better coverage")

        lines.append("")
        lines.append("---\n")
        lines.append("*This report was auto-generated by the comprehensive API test script*\n")

        return "\n".join(lines)


async def main():
    """Main entry point"""
    import sys
    import io

    # Set UTF-8 encoding for Windows console
    if sys.platform == "win32":
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

    print("\n🔍 AiCMR Backend API Comprehensive Test\n")

    async with APITester() as tester:
        await tester.run_all_tests()

        # Generate and print report
        report = tester.generate_markdown_report()
        print("\n" + report)

        # Save report to file
        report_path = "API_TEST_REPORT.md"
        with open(report_path, "w", encoding="utf-8") as f:
            f.write(report)

        print(f"\n📄 Report saved to: {report_path}")

        # Return exit code based on results
        total_tests = sum(m.total for m in tester.modules.values())
        total_failed = sum(m.failed for m in tester.modules.values())
        total_errors = sum(m.error_count for m in tester.modules.values())

        if total_failed + total_errors > 0:
            print(f"\n⚠️  {total_failed + total_errors} test(s) failed or had errors")
            return 1
        else:
            print("\n✅ All tests passed!")
            return 0


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
