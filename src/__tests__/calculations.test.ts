import { describe, it, expect } from 'vitest';
import { calculateFinancialSummary } from '../lib/calculations';
import { SAMPLE_STUDENT_DATA } from '../data/sampleStudent';
import { StudentAssessmentInput } from '../types/assessment';

describe('Financial Calculations Engine', () => {
  it('passes the exact regression test provided in the hiring assignment', () => {
    // Exact synthetic regression data specified in assignment:
    // Total study cost = 3,000,000
    // Fees already paid = 200,000
    // Education-allocated savings = 400,000
    // Applicable scholarship = 300,000
    // Additional family contribution = 100,000
    // Expected remaining study cost = 2,800,000
    // Expected available funding = 800,000
    // Expected estimated loan requirement = 2,000,000
    const summary = calculateFinancialSummary(SAMPLE_STUDENT_DATA);

    expect(summary.totalStudyCost).toBe(3000000);
    expect(summary.feesAlreadyPaid).toBe(200000);
    expect(summary.remainingStudyCost).toBe(2800000);
    expect(summary.availableFunding).toBe(800000);
    expect(summary.estimatedLoanRequirement).toBe(2000000);
  });

  it('handles annual to full-course conversion correctly', () => {
    const input: StudentAssessmentInput = {
      ...SAMPLE_STUDENT_DATA,
      study: {
        ...SAMPLE_STUDENT_DATA.study,
        durationYears: 3,
        tuitionAmount: 500000,
        tuitionPeriod: 'annual', // 500k * 3 = 1,500,000
        livingCostsAmount: 200000,
        livingCostsPeriod: 'annual', // 200k * 3 = 600,000
        additionalExpensesAmount: 100000,
        additionalExpensesPeriod: 'full_course', // 100,000
      },
    };

    const summary = calculateFinancialSummary(input);
    expect(summary.totalTuitionFullCourse).toBe(1500000);
    expect(summary.totalLivingFullCourse).toBe(600000);
    expect(summary.totalAdditionalFullCourse).toBe(100000);
    expect(summary.totalStudyCost).toBe(2200000);
  });

  it('deducts fees paid exactly once and clamps remaining cost at zero', () => {
    const input: StudentAssessmentInput = {
      ...SAMPLE_STUDENT_DATA,
      funding: {
        ...SAMPLE_STUDENT_DATA.funding,
        feesAlreadyPaid: 4000000, // Exceeds total study cost of 3M
      },
    };

    const summary = calculateFinancialSummary(input);
    expect(summary.remainingStudyCost).toBe(0);
    expect(summary.estimatedLoanRequirement).toBe(0);
  });

  it('calculates net worth correctly from assets minus liabilities', () => {
    const input: StudentAssessmentInput = {
      ...SAMPLE_STUDENT_DATA,
      financial: {
        ...SAMPLE_STUDENT_DATA.financial,
        totalAssetsValue: 5000000,
        totalLiabilitiesValue: 1200000,
        caCertificateNetWorth: 3800000,
      },
    };

    const summary = calculateFinancialSummary(input);
    expect(summary.calculatedNetWorth).toBe(3800000);
    expect(summary.caReportedNetWorth).toBe(3800000);
    expect(summary.netWorthDiscrepancy).toBe(0);
  });

  it('detects discrepancy between calculated net worth and CA certificate', () => {
    const input: StudentAssessmentInput = {
      ...SAMPLE_STUDENT_DATA,
      financial: {
        ...SAMPLE_STUDENT_DATA.financial,
        totalAssetsValue: 5000000,
        totalLiabilitiesValue: 1000000, // Calculated = 4,000,000
        caCertificateNetWorth: 3500000, // Discrepancy = 500,000
      },
    };

    const summary = calculateFinancialSummary(input);
    expect(summary.calculatedNetWorth).toBe(4000000);
    expect(summary.caReportedNetWorth).toBe(3500000);
    expect(summary.netWorthDiscrepancy).toBe(500000);
  });
});
