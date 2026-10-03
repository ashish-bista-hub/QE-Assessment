import { expect, Page } from '@playwright/test';
import { HomeLoanCalculatorEmiPage } from '../pages/HomeLoanCalculatorEmiPage';

export async function validateChartAndTable(
    page: Page,
    scenario: any
) {
    const emiPage = new HomeLoanCalculatorEmiPage(page);

    await emiPage.navigate();

    // Apply test scenario
    await emiPage.moveLoanAmountSlider(scenario.loanAmountSliderSteps);

    await emiPage.moveInterestRateSlider(scenario.interestRateSliderSteps);

    await emiPage.moveLoanTenureSlider(scenario.tenureSliderSteps);

    // Calculate expected EMI
    const monthlyInterestRate = scenario.interestRate / 12 / 100;

    const numberOfPayments = scenario.tenureYears * 12;

    const expectedEmi = scenario.loanAmount * monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const expectedEmiRounded = Math.round(expectedEmi);

    // Wait until application calculation is complete
    await expect(emiPage.emiAmount).toHaveText(
        expectedEmiRounded.toLocaleString('en-IN'),
        { timeout: 5000 }
    );

    // Get chart data only after calculation is complete
    const chartData = await emiPage.getYearlyChartData();

    // Get table data only after calculation is complete
    const tableData = await emiPage.getYearlyPaymentTableData();

    // Validate number of years
    expect(chartData.interest.length).toBe(tableData.length);

    expect(chartData.principal.length).toBe(tableData.length);

    expect(chartData.balance.length).toBe(tableData.length);

    // Validate year-wise values
    for (let i = 0; i < tableData.length; i++) {
        const tableRow = tableData[i];

        const chartInterest = chartData.interest[i];

        const chartPrincipal = chartData.principal[i];

        const chartBalance = chartData.balance[i];

        // Validate year
        expect(chartInterest.year).toBe(tableRow.year);

        expect(chartPrincipal.year).toBe(tableRow.year);

        expect(chartBalance.year).toBe(tableRow.year);

        // Validate Interest
        expect(Math.round(chartInterest.value)).toBe(tableRow.interest);

        // Validate Principal
        expect(Math.round(chartPrincipal.value)).toBe(tableRow.principal);

        // Validate Balance
        expect(Math.round(chartBalance.value)).toBe(tableRow.balance);
    }

    console.log(`${scenario.name}: validated ${tableData.length} years successfully.`);
}