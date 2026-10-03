import { test } from '@playwright/test';
import { validateEmiScenario } from '../functions/emi-calculation.function';

const testData = require('../config/test-data.json');

for (const scenario of testData.emiScenarios) {
  test(
    `validate EMI - ${scenario.name}`,
    async ({ page }) => {
      await validateEmiScenario(
        page,
        scenario
      );
    }
  );
}