import { expect, Page } from '@playwright/test';
import { HomeLoanCalculatorEmiPage } from '../pages/HomeLoanCalculatorEmiPage';

export async function validateEmiScenario(
    page: Page,
    scenario: any
) {
    const emiPage = new HomeLoanCalculatorEmiPage(page);

    await emiPage.navigate();

    await emiPage.moveLoanAmountSlider(
        scenario.loanAmountSliderSteps
    );

    await emiPage.moveInterestRateSlider(
        scenario.interestRateSliderSteps
    );

    await emiPage.moveLoanTenureSlider(
        scenario.tenureSliderSteps
    );

    const loanAmountText = await emiPage.getLoanAmount();

    const interestRateText = await emiPage.getInterestRate();

    const tenureText = await emiPage.getLoanTenure();

    expect(loanAmountText).toBe(scenario.loanAmount.toLocaleString('en-IN'));

    expect(Number(interestRateText)).toBe(scenario.interestRate);

    expect(Number(tenureText)).toBe(scenario.tenureYears);

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

    const emiText = await emiPage.getEmi();

    const actualEmi = Number(emiText?.replace(/,/g, ''));

    expect(actualEmi).toBe(expectedEmiRounded);
}