import { test } from '@playwright/test';
import { validateExcelDownload } from '../functions/excel-validation.function';

const testData = require('../config/test-data.json');

for (const scenario of testData.emiScenarios) {
  test(
    `validate Excel download - ${scenario.name}`,
    async ({ page }, testInfo) => {
      await validateExcelDownload(
        page,
        scenario,
        testInfo
      );
    }
  );
}