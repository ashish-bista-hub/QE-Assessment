import { test } from '@playwright/test';
import { validateChartAndTable } from '../functions/chart-table-validation.function';

const testData = require('../config/test-data.json');

for (const scenario of testData.emiScenarios) {
  test(
    `validate chart and table - ${scenario.name}`,
    async ({ page }) => {
      await validateChartAndTable(
        page,
        scenario
      );
    }
  );
}