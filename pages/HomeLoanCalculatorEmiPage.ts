import { Page, Locator } from '@playwright/test';

const assessmentConfig = require('../config/assessment-config.json');

export class HomeLoanCalculatorEmiPage {
    readonly page: Page;

    readonly loanAmountInput: Locator;
    readonly interestRateInput: Locator;
    readonly loanTenureInput: Locator;

    readonly loanAmountSlider: Locator;
    readonly interestRateSlider: Locator;
    readonly loanTenureSlider: Locator;

    readonly emiAmount: Locator;
    readonly excelDownload: Locator;

    constructor(page: Page) {
        this.page = page;

        this.loanAmountInput = page.locator(
            assessmentConfig.selectors.loanAmountInput
        );

        this.interestRateInput = page.locator(
            assessmentConfig.selectors.interestRateInput
        );

        this.loanTenureInput = page.locator(
            assessmentConfig.selectors.loanTenureInput
        );

        this.loanAmountSlider = page.locator(
            assessmentConfig.selectors.loanAmountSlider
        );

        this.interestRateSlider = page.locator(
            assessmentConfig.selectors.interestRateSlider
        );

        this.loanTenureSlider = page.locator(
            assessmentConfig.selectors.loanTenureSlider
        );

        this.emiAmount = page.locator(
            assessmentConfig.selectors.emiAmount
        );

        this.excelDownload = page.locator(
            assessmentConfig.selectors.excelDownload
        );
    }

    async navigate() {
        await this.page.goto(assessmentConfig.baseUrl, {
            waitUntil: 'domcontentloaded'
        });

        await this.loanAmountSlider.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.interestRateSlider.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.loanTenureSlider.waitFor({
            state: 'visible',
            timeout: 15000
        });
    }

    async moveLoanAmountSlider(steps: number) {
        await this.loanAmountSlider.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.loanAmountSlider.focus();

        const direction = steps >= 0 ? 'ArrowRight' : 'ArrowLeft';

        for (let i = 0; i < Math.abs(steps); i++) {
            await this.page.keyboard.press(direction);
        }
    }

    async moveInterestRateSlider(steps: number) {
        await this.interestRateSlider.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.interestRateSlider.focus();

        const direction = steps >= 0 ? 'ArrowRight' : 'ArrowLeft';

        for (let i = 0; i < Math.abs(steps); i++) {
            await this.page.keyboard.press(direction);
        }
    }

    async moveLoanTenureSlider(steps: number) {
        await this.loanTenureSlider.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.loanTenureSlider.focus();

        const direction = steps >= 0 ? 'ArrowRight' : 'ArrowLeft';

        for (let i = 0; i < Math.abs(steps); i++) {
            await this.page.keyboard.press(direction);
        }
    }

    async getLoanAmount() {
        return await this.loanAmountInput.inputValue();
    }

    async getInterestRate() {
        return await this.interestRateInput.inputValue();
    }

    async getLoanTenure() {
        return await this.loanTenureInput.inputValue();
    }

    async getEmi() {
        return await this.emiAmount.textContent();
    }

    // --------------------------------------------------
    // Excel
    // --------------------------------------------------

    async clickExcelDownload() {
        await this.excelDownload.click();
    }

    // --------------------------------------------------
    // Chart
    // --------------------------------------------------

    async getYearlyChartData() {
        return await this.page.evaluate(() => {
            const charts = ((window as any).Highcharts?.charts || []).filter((chart: any) => chart);

            const yearlyChart = charts.find(
                (chart: any) =>
                    chart.series?.some((s: any) => s.name === 'Interest') &&
                    chart.series?.some((s: any) => s.name === 'Principal') &&
                    chart.series?.some((s: any) => s.name === 'Balance')
            );

            if (!yearlyChart) {
                throw new Error('Year-wise payment chart was not found');
            }

            const getSeriesData = (name: string) => {
                const series = yearlyChart.series.find(
                    (s: any) => s.name === name
                );

                if (!series) {
                    throw new Error(`Chart series "${name}" was not found`);
                }

                return series.points.map((point: any) => ({
                    year: Number(point.category),
                    value: Number(point.y)
                }));
            };

            return {
                interest: getSeriesData('Interest'),
                principal: getSeriesData('Principal'),
                balance: getSeriesData('Balance')
            };
        });
    }

    // --------------------------------------------------
    // Payment table
    // --------------------------------------------------

    async getYearlyPaymentTableData() {
        return await this.page
            .locator('table')
            .first()
            .locator('tr')
            .evaluateAll((rows) => {
                return rows
                    .map((row) => {
                        const cells = Array.from(
                            row.querySelectorAll('td')
                        ).map(
                            (cell) => cell.textContent?.trim() || ''
                        );

                        return { cells };
                    })
                    .filter((row) => /^\d{4}$/.test(row.cells[0]))
                    .map((row) => ({
                        year: Number(row.cells[0]),
                        principal: Number(
                            row.cells[1].replace(/[₹,\s]/g, '')
                        ),
                        interest: Number(
                            row.cells[2].replace(/[₹,\s]/g, '')
                        ),
                        totalPayment: Number(
                            row.cells[3].replace(/[₹,\s]/g, '')
                        ),
                        balance: Number(
                            row.cells[4].replace(/[₹,\s]/g, '')
                        ),
                        percentage: row.cells[5]
                    }));
            });
    }
}