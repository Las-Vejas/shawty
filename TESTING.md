# Testing Setup Guide

## Overview
This project now has a comprehensive testing framework using **Vitest** with **100 passing tests** covering utilities, analytics, API endpoints, and components.

## Test Suite Structure

### Test Files
- **`src/lib/__tests__/utils.test.ts`** (9 tests)
  - Tests for the `cn()` classname utility function
  - Covers merging Tailwind classes, handling null/undefined, and resolving conflicts

- **`src/lib/__tests__/analytics.test.ts`** (18 tests)
  - Tests for `parseUserAgent()` - parsing UA strings for different browsers
  - Tests for `getClientIP()` - extracting IPs from various headers
  - Tests for `getLocationFromIP()` - API calls for geolocation data

- **`src/routes/__tests__/api.links.test.ts`** (25 tests)
  - URL validation logic
  - Self-referencing link prevention
  - Custom slug validation (length, characters, formatting)
  - Random short code generation

- **`src/routes/__tests__/link-validation.test.ts`** (30 tests)
  - URL parsing and validation
  - Custom slug validation edge cases
  - Hostname extraction
  - Link data structure validation
  - Error handling

- **`src/lib/components/__tests__/button.test.ts`** (18 tests)
  - Button variants (default, secondary, destructive, outline, ghost, link)
  - Button sizes (default, sm, lg, icon, icon-sm, icon-lg)
  - Button attributes and accessibility
  - Component class generation

## Running Tests

### Commands
```bash
# Run all tests once
npm run test:run

# Run tests in watch mode (interactive)
npm run test

# Run tests with UI dashboard
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Watch Mode
For development, use `npm run test` to run tests in watch mode. Tests will re-run automatically when you modify files.

### UI Dashboard
Use `npm run test:ui` to see a visual dashboard of all tests with pass/fail status, execution time, and detailed logs.

## Configuration

### vitest.config.ts
- **Test Environment**: `jsdom` (for DOM testing support)
- **Coverage Provider**: `v8`
- **Path Aliases**: `$lib` and `$app` configured for imports

## Test Statistics
- **Total Test Files**: 5
- **Total Tests**: 100
- **Status**: All passing ✓

## Writing New Tests

### Template
```typescript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Best Practices
1. Use descriptive test names that explain the expected behavior
2. Follow the AAA pattern (Arrange, Act, Assert)
3. Keep tests focused on a single behavior
4. Use test groups with `describe()` to organize related tests
5. Mock external dependencies (APIs, file system, etc.)

## Dependencies
- `vitest`: Testing framework
- `@vitest/ui`: Visual test dashboard
- `jsdom`: DOM environment for testing
- `@testing-library/svelte`: Svelte component testing utilities
- `@testing-library/dom`: DOM testing utilities

## Coverage Goals
While coverage report generation is configured, tests focus on critical paths:
- ✓ All utility functions
- ✓ Input validation and error handling
- ✓ API route logic (excluding database calls)
- ✓ Component variant combinations
- ✓ Edge cases and boundary conditions

## CI/CD Integration
To integrate tests into your CI/CD pipeline, add to your workflow:
```bash
npm run test:run
```

This will exit with code 0 on success and non-zero on failure, making it compatible with most CI systems.
