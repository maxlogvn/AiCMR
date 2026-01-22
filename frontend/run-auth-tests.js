#!/usr/bin/env node

/**
 * Authentication E2E Test Runner
 * Helper script to run auth tests with proper setup
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(text) {
  log('\n' + '='.repeat(60), 'bright');
  log(text, 'cyan');
  log('='.repeat(60) + '\n', 'bright');
}

async function checkServerRunning(url, maxRetries = 10) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, { method: 'HEAD', timeout: 1000 });
      return true;
    } catch (error) {
      retries++;
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }
  return false;
}

async function runTests() {
  header('🧪 Authentication E2E Test Runner');

  // Get options
  const headless = process.argv.includes('--headless');
  const skipChecks = process.argv.includes('--skip-checks');
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

  log(`📍 Frontend URL: ${baseUrl}`, 'blue');
  log(`📍 Backend URL: ${backendUrl}`, 'blue');
  log(`🖥️  Mode: ${headless ? 'Headless' : 'Visible'}`, 'yellow');

  // Check if servers are running
  if (!skipChecks) {
    log('\n🔍 Checking if servers are running...', 'blue');

    log('  ⏳ Checking frontend...', 'yellow');
    const frontendRunning = await checkServerRunning(baseUrl);
    if (!frontendRunning) {
      log(`  ❌ Frontend is not running at ${baseUrl}`, 'red');
      log('  💡 Start frontend with: cd frontend && npm run dev', 'yellow');
      process.exit(1);
    }
    log('  ✅ Frontend is running', 'green');

    log('  ⏳ Checking backend...', 'yellow');
    const backendRunning = await checkServerRunning(backendUrl);
    if (!backendRunning) {
      log(`  ❌ Backend is not running at ${backendUrl}`, 'red');
      log('  💡 Start backend with: cd backend && python -m uvicorn app.main:app --reload --port 8000', 'yellow');
      process.exit(1);
    }
    log('  ✅ Backend is running', 'green');
  }

  // Check if test file exists
  const testFile = path.join(__dirname, 'auth-e2e.test.ts');
  if (!fs.existsSync(testFile)) {
    log(`\n❌ Test file not found: ${testFile}`, 'red');
    process.exit(1);
  }
  log('\n✅ Test file found', 'green');

  // Run tests
  log('\n▶️  Starting tests...', 'cyan');
  log('(This may take 30-60 seconds)\n', 'yellow');

  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      BASE_URL: baseUrl,
      BACKEND_URL: backendUrl,
      ...(headless && { HEADLESS: 'true' })
    };

    const child = spawn('npx', ['ts-node', 'auth-e2e.test.ts'], {
      stdio: 'inherit',
      env,
      cwd: __dirname
    });

    child.on('close', code => {
      if (code === 0) {
        log('\n' + '='.repeat(60), 'green');
        log('✨ All tests passed! ✨', 'green');
        log('='.repeat(60) + '\n', 'green');
        resolve();
      } else {
        log('\n' + '='.repeat(60), 'red');
        log('❌ Tests failed', 'red');
        log('='.repeat(60) + '\n', 'red');
        if (fs.existsSync('error-screenshot.png')) {
          log('📸 Screenshot saved: error-screenshot.png', 'yellow');
        }
        reject(new Error('Test execution failed'));
      }
    });

    child.on('error', (error) => {
      log(`\n❌ Error running tests: ${error.message}`, 'red');
      reject(error);
    });
  });
}

// Show help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('\n📖 Usage: npm run test:auth [OPTIONS]\n', 'bright');
  log('Options:', 'cyan');
  log('  --headless          Run in headless mode (no browser UI)', 'blue');
  log('  --skip-checks       Skip server availability checks', 'blue');
  log('  --help, -h          Show this help message', 'blue');
  log('\nEnvironment Variables:', 'cyan');
  log('  BASE_URL            Frontend URL (default: http://localhost:3000)', 'blue');
  log('  BACKEND_URL         Backend URL (default: http://localhost:8000)', 'blue');
  log('\nExamples:', 'cyan');
  log('  npm run test:auth', 'yellow');
  log('  npm run test:auth -- --headless', 'yellow');
  log('  BASE_URL=http://example.com npm run test:auth', 'yellow');
  log('');
  process.exit(0);
}

// Run
runTests().catch(error => {
  process.exit(1);
});
