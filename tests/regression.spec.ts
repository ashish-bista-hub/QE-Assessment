import { test } from '@playwright/test';

import { validateEmiScenario } from '../functions/emi-calculation.function';
import { validateChartAndTable } from '../functions/chart-table-validation.function';
import { validateExcelDownload } from '../functions/excel-validation.function';

const testData = require('../config/test-data.json');

test.setTimeout(60000);

for (const scenario of testData.emiScenarios) {
    test(
        `Regression - ${scenario.name}`,
        async ({ page }, testInfo) => {

            await validateEmiScenario(page, scenario);

            await validateChartAndTable(page, scenario);

            await validateExcelDownload(
                page,
                scenario,
                testInfo
            );
        }
    );
}