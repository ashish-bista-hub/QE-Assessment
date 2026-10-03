# Home Loan EMI Calculator - Playwright Automation

Automated test suite for the Home Loan EMI Calculator using Playwright, TypeScript and Playwright Test.

## Tech Stack

- Playwright
- TypeScript
- Playwright Test
- Node.js / npm
- `xlsx` for Excel validation
- GitHub Actions for CI

## **Prerequisites**

Before running the automation project, make sure the following are installed:

### **1. Node.js**

Install the latest version of **Node.js**.

Verify the installation:

```bash
node --version
npm --version
```

### **2. Git**

Git is required to clone the project repository.

Verify the installation:

```bash
git --version
```

### **3. Project Dependencies**

After cloning the project, open a terminal in the project directory and install the required dependencies:

```bash
npm ci
```

This installs all dependencies defined in `package.json`, including the `xlsx` package used for Excel validation.

### **4. Playwright Browsers**

Install the Playwright browsers required by the test suite:

```bash
npx playwright install
```

The test suite is configured to run against:

* **Chromium**
* **Firefox**
* **WebKit**

### **5. Verify the Setup**

Run the complete test suite:

```bash
npx playwright test
```

If the setup is successful, Playwright will execute the configured tests across the supported browsers.

### **Fresh Machine Setup**

For a new machine, the basic setup sequence is:

```bash
git clone <repository-url>
cd QE-Assessment
npm ci
npx playwright install
npx playwright test
```

No separate installation of TypeScript or `xlsx` is required because they are managed through the project's npm dependencies.

## Project Structure

```text
QE-Assessment/
├── config/
│   ├── assessment-config.json
│   └── test-data.json
├── functions/
│   ├── emi-test-functions.ts
│   ├── chart-table-validation.function.ts
│   └── excel-validation.function.ts
├── pages/
│   └── HomeLoanCalculatorEmiPage.ts
├── tests/
│   ├── emi-calculation.spec.ts
│   ├── chart-table-validation.spec.ts
│   ├── excel-validation.spec.ts
│   └── regression.spec.ts
├── playwright.config.ts
├── package.json
└── README.md
```

## Test Coverage

- Loan amount, interest rate and loan tenure sliders
- EMI calculation using an independent EMI formula
- Year-wise chart validation
- Year-wise payment table validation
- Excel download and amortization schedule validation
- Data-driven EMI scenarios
- Cross-browser regression

## Test Data

Test scenarios are maintained in:

```text
config/test-data.json
```

The current regression suite contains 8 scenarios covering different loan amounts, interest rates and tenures.

## Running the Tests

### Before executing the test please make sure above mentioned pre-requisite are installed properly at your machine.

### Run all tests

```bash
npx playwright test
```

### Run regression suite with all of our test data from `test-data.json`

```bash
npx playwright test tests/regression.spec.ts
```

### Run a regression test on specific browser

```bash
npx playwright test tests/regression.spec.ts --project=chromium
npx playwright test tests/regression.spec.ts --project=firefox
npx playwright test tests/regression.spec.ts --project=webkit
```

### Run an individual specific test

```bash
npx playwright test tests/emi-calculation.spec.ts
npx playwright test tests/chart-table-validation.spec.ts
npx playwright test tests/excel-validation.spec.ts
```

### Run an individual specific test on a specific browser

```bash
npx playwright test tests/emi-calculation.spec.ts --project=chromium
npx playwright test tests/chart-table-validation.spec.ts --project=chromium
npx playwright test tests/excel-validation.spec.ts --project=chromium

npx playwright test tests/emi-calculation.spec.ts --project=firefox
npx playwright test tests/chart-table-validation.spec.ts --project=firefox
npx playwright test tests/excel-validation.spec.ts --project=firefox

npx playwright test tests/emi-calculation.spec.ts --project=webkit
npx playwright test tests/chart-table-validation.spec.ts --project=webkit
npx playwright test tests/excel-validation.spec.ts --project=webkit
```

### Run a specific regression with specific scenario from our `test-data.json` file

```bash
npx playwright test tests/regression.spec.ts --grep "Regression - Default values"
npx playwright test tests/regression.spec.ts --grep "Regression - Higher loan amount"
npx playwright test tests/regression.spec.ts --grep "Regression - Lower interest rate"
npx playwright test tests/regression.spec.ts --grep "Regression - Higher interest rate"
npx playwright test tests/regression.spec.ts --grep "Regression - Short tenure"
npx playwright test tests/regression.spec.ts --grep "Regression - Long tenure"
npx playwright test tests/regression.spec.ts --grep "Regression - Higher loan with higher interest"
npx playwright test tests/regression.spec.ts --grep "Regression - Lower loan with shorter tenure"
```

### Run a specific regression with specific scenario from our `test-data.json` file on specific browser `replace chromium with another browser name`

```bash
npx playwright test tests/regression.spec.ts --grep "Regression - Default values" --project=chromium
npx playwright test tests/regression.spec.ts --grep "Regression - Higher loan amount" --project=chromium
npx playwright test tests/regression.spec.ts --grep "Regression - Lower interest rate" --project=chromium
npx playwright test tests/regression.spec.ts --grep "Regression - Higher interest rate" --project=chromium
npx playwright test tests/regression.spec.ts --grep "Regression - Short tenure" --project=chromium
npx playwright test tests/regression.spec.ts --grep "Regression - Long tenure" --project=chromium
npx playwright test tests/regression.spec.ts --grep "Regression - Higher loan with higher interest" --project=chromium
npx playwright test tests/regression.spec.ts --grep "Regression - Lower loan with shorter tenure" --project=chromium
```

### View HTML report

```bash
npx playwright show-report
```

## Regression Suite

The regression suite runs the following validations for every scenario:

1. EMI calculation
2. Chart and year-wise table
3. Excel download and amortization schedule

The suite runs against:

- Chromium
- Firefox
- WebKit

Current coverage:

**8 scenarios × 3 browsers = 24 regression tests**

All 24 regression tests have been successfully executed.

## Automation Design

The project uses:

- **Page Object Model** for application locators and UI actions
- **Reusable validation functions** for EMI, chart/table and Excel checks
- **Data-driven testing** for multiple scenarios - the idea behind this is no source needs to be changed, just change the test data and execute the test
- **Playwright auto-waiting** with condition-based synchronization where required
- Uses the **DRY - Don't Repeat Yourself** concept i.e. clear seperation of logic between validators & executors, refactoring is done to remove duplication of logical items, readability is maintained within the source code

The expected EMI is calculated independently in the test code and compared with the application's displayed EMI.

## CI/CD

GitHub Actions is configured to run the Playwright test suite on pushes and pull requests to `main` and `master`.

The CI workflow:

1. Checks out the repository
2. Installs Node.js LTS
3. Runs `npm ci`
4. Installs Playwright browsers and dependencies
5. Runs the complete test suite
6. Uploads the Playwright HTML report as an artifact

The Playwright report is retained for 30 days.

## Notes

Additional EMI scenarios can be added to `config/test-data.json` without creating separate test implementations.
