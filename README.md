# Singlish to Sinhala Translation Testing - IT3040 Assignment 1

This project contains automated tests for the Singlish to Sinhala translation system available at https://www.swifttranslator.com/ using Playwright.

## Project Overview

This testing suite includes:
- **30 Positive Functional Test Cases** - Verifying correct translation scenarios
- **12 Negative Functional Test Cases** - Verifying system behavior with edge cases and failures
- **1 UI Test Case** - Verifying real-time output update behavior
# Quick Start Guide

##  Fast Setup (3 Steps)

### 1. Install Everything
```powershell
npm install
npx playwright install chromium
```

### 2. Run Tests
```powershell
npm test
```

### 3. View Results
```powershell
npm run test:report

##  Understanding Results

After tests run, you'll see:
- ✓ = Test PASSED (green)
- ✘ = Test FAILED (red)

##  Update & Re-run

If you make changes to tests:
```powershell
npm test
```

## Project Structure

```
IT23548350/
├── tests/
│   ├── positive-functional.spec.js    # 30 positive test cases
│   ├── negative-functional.spec.js    # 12 negative test cases
│   └── ui-tests.spec.js               # 1 UI test case
├── playwright.config.js               # Playwright configuration
├── package.json                       # Project dependencies
├── Test_Cases_Template.csv            # Test case documentation (fill after running)
├── .gitignore                         # Git ignore file
└── README.md                          # This file
```

## Running the Tests

### Run All Tests

To execute all test suites:

```bash
npm test
```

### Run Tests in Headed Mode (See Browser)

To see the browser while tests are running:

```bash
npm run test:headed
```

### Run Tests in UI Mode (Interactive)

To run tests interactively with Playwright's UI mode:

```bash
npm run test:ui
```

### Run Specific Test File

To run only positive functional tests:

```bash
npx playwright test tests/positive-functional.spec.js
```

To run only negative functional tests:

```bash
npx playwright test tests/negative-functional.spec.js
```

To run only UI tests:

```bash
npx playwright test tests/ui-tests.spec.js
```

### Run Tests in Debug Mode

To debug a specific test:

```bash
npm run test:debug
```

### View Test Report

After running tests, view the HTML report:

```bash
npm run test:report
```


## Support and Resources

- **Playwright Documentation**: https://playwright.dev/docs/intro
- **Playwright API Reference**: https://playwright.dev/docs/api/class-test
- **Swift Translator Website**: https://www.swifttranslator.com/
- **Assignment Guidelines**: Refer to the course assignment document



