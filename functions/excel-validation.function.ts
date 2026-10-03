import { expect, Page, TestInfo } from '@playwright/test';
import * as XLSX from 'xlsx';
import { HomeLoanCalculatorEmiPage } from '../pages/HomeLoanCalculatorEmiPage';

export async function validateExcelDownload(
    page: Page,
    scenario: any,
    testInfo: TestInfo
) {
    const emiPage = new HomeLoanCalculatorEmiPage(page);

    await emiPage.navigate();

    // Apply scenario values through sliders
    await emiPage.moveLoanAmountSlider(scenario.loanAmountSliderSteps);

    await emiPage.moveInterestRateSlider(scenario.interestRateSliderSteps);

    await emiPage.moveLoanTenureSlider(scenario.tenureSliderSteps);

    // Wait until the calculated EMI matches the scenario.
    const monthlyInterestRate = scenario.interestRate / 12 / 100;

    const numberOfPayments = scenario.tenureYears * 12;

    const expectedEmi = scenario.loanAmount * monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const expectedEmiRounded = Math.round(expectedEmi);

    await expect(emiPage.emiAmount).toHaveText(
        expectedEmiRounded.toLocaleString('en-IN'),
        { timeout: 5000 }
    );

    // Download
    const downloadPromise = page.waitForEvent('download');

    await emiPage.clickExcelDownload();

    const download = await downloadPromise;

    const fileName = download.suggestedFilename();

    expect(fileName).toMatch(/\.xlsx$/i);

    // Unique Playwright test directory.
    const filePath = testInfo.outputPath(fileName);

    await download.saveAs(filePath);

    // Read workbook
    const workbook = XLSX.readFile(filePath);

    expect(workbook.SheetNames).toContain('Copyright © EMICalculator.net');

    const worksheet = workbook.Sheets['Copyright © EMICalculator.net'];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: ''
    }) as unknown[][];


    // Validate scenario inputs
    expect(rows[1][0]).toBe('Home Loan Amount');
    expect(rows[1][1]).toBe(scenario.loanAmount);

    expect(rows[2][0]).toBe('Interest Rate (%)');
    expect(Number(rows[2][1])).toBeCloseTo(scenario.interestRate, 10);

    expect(rows[3][0]).toBe('Loan Tenure (months)');
    expect(rows[3][1]).toBe(numberOfPayments);

    // Validate EMI
    expect(rows[6][0]).toBe('Loan EMI');
    expect(rows[6][1]).toBe(expectedEmiRounded);

    const monthlyRows = rows.slice(12);

    expect(monthlyRows.length).toBe(numberOfPayments);

    // Validate every monthly record
    for (let i = 0; i < monthlyRows.length; i++) {
        const row = monthlyRows[i];

        const monthNumber = Number(row[0]);
        const principal = Number(row[2]);
        const interest = Number(row[3]);
        const monthlyPayment = Number(row[4]);
        const balance = Number(row[5]);

        // Month sequence
        expect(monthNumber).toBe(i + 1);

        // Monthly payment should match EMI
        expect(monthlyPayment).toBe(expectedEmiRounded);

        // Principal + interest should approximately equal EMI.
        // Excel rounds the components independently.
        expect(Math.abs(principal + interest - monthlyPayment)).toBeLessThanOrEqual(1);

        // Balance calculation
        if (i === 0) {
            expect(Math.abs(scenario.loanAmount - principal - balance)).toBeLessThanOrEqual(1);
        } else {
            const previousRow = monthlyRows[i - 1];

            const previousBalance = Number(previousRow[5]);

            expect(Math.abs(previousBalance - principal - balance)).toBeLessThanOrEqual(1);
        }
    }

    // Final balance and payment percentage
    const lastRow = monthlyRows[monthlyRows.length - 1];

    expect(Number(lastRow[5])).toBe(0);
    expect(Number(lastRow[6])).toBe(100);

    console.log(`${scenario.name}: Excel download and scenario values validated.`);
}