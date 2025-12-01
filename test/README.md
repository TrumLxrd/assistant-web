# Test Suite for Asist Web App

## Setup

1. Install dependencies:
```bash
cd test
npm install
```

2. **IMPORTANT: Test Mode Configuration**

   By default, tests run in **MOCK MODE** which is safe and won't affect your production database.

   To use mock mode (recommended):
   ```bash
   # No configuration needed - mock mode is default
   npm test
   ```

   To use real API (may affect database):
   ```bash
   # Set environment variable
   export USE_MOCK=false
   npm test
   ```

   Or create a `.env.test` file:
   ```
   USE_MOCK=false
   TEST_API_URL=http://localhost:3000/api
   TEST_ADMIN_EMAIL=admin@example.com
   TEST_ADMIN_PASSWORD=admin123
   ```

## Running Tests

### Run All Tests (Mock Mode - Safe)
```bash
npm test
```

### Run Individual Tests
```bash
npm run test:edit        # Edit attendance functionality
npm run test:time        # Session time display
npm run test:timezone    # Egypt timezone handling
npm run test:weekly      # Weekly sessions logic
npm run test:deletion    # Session deletion & name preservation
```

### Run with Real API (Use with Caution)
```bash
# Windows PowerShell
$env:USE_MOCK="false"
npm test

# Linux/Mac
USE_MOCK=false npm test
```

## Test Modes

### Mock Mode (Default - Safe)
- ✅ No database connection required
- ✅ No risk to production data
- ✅ Fast execution
- ✅ Can run offline
- ⚠️ Limited to mock data scenarios

### Real API Mode
- ⚠️ Requires running server
- ⚠️ May affect database
- ⚠️ Requires valid credentials
- ✅ Tests actual API endpoints
- ✅ More comprehensive testing

## Test Files

- `attendance-edit.test.js` - Tests edit attendance button and modal
- `session-time-display.test.js` - Tests that only end time is shown
- `timezone-egypt.test.js` - Tests Egypt timezone handling
- `weekly-sessions.test.js` - Tests weekly sessions logic
- `session-deletion.test.js` - Tests session deletion and name preservation
- `test-utils.js` - Helper utilities for tests
- `mock-api.js` - Mock API implementation (for safe testing)
- `test-config.js` - Test configuration
- `run-all-tests.js` - Main test runner

## Safety Features

1. **Mock Mode by Default**: Tests use mock data unless explicitly disabled
2. **No Database Changes**: Mock mode doesn't touch any database
3. **Isolated Test Data**: Each test run starts with clean mock data
4. **Automatic Cleanup**: Test data is cleaned up after tests complete

## Requirements

- Node.js installed
- For real API mode: Backend server running
- For real API mode: Valid admin credentials

## Notes

- Mock mode is recommended for development and CI/CD
- Real API mode should only be used with a test database
- Never run tests against production database without proper safeguards
