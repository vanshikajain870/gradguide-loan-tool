import { StudentAssessmentInput, FinancialSummaryResult } from '../types/assessment';

/**
 * Calculates deterministic financial summary metrics from student assessment inputs.
 * Strictly implements the Financial Calculation Contract defined in the hiring assignment.
 */
export function calculateFinancialSummary(input: StudentAssessmentInput): FinancialSummaryResult {
  const { study, funding, financial, collateral } = input;

  const duration = Math.max(0.1, Number(study.durationYears) || 0);

  // 1. Calculate Full-Course Expenses
  const totalTuitionFullCourse =
    study.tuitionPeriod === 'annual' ? Math.max(0, study.tuitionAmount) * duration : Math.max(0, study.tuitionAmount);

  const totalLivingFullCourse =
    study.livingCostsPeriod === 'annual'
      ? Math.max(0, study.livingCostsAmount) * duration
      : Math.max(0, study.livingCostsAmount);

  const totalAdditionalFullCourse =
    study.additionalExpensesPeriod === 'annual'
      ? Math.max(0, study.additionalExpensesAmount) * duration
      : Math.max(0, study.additionalExpensesAmount);

  // Total Study Cost = All full-course study expenses (including expenses already paid)
  const totalStudyCost = totalTuitionFullCourse + totalLivingFullCourse + totalAdditionalFullCourse;

  // 2. Fees Already Paid & Remaining Cost
  const feesAlreadyPaid = Math.max(0, funding.feesAlreadyPaid || 0);
  const remainingStudyCost = Math.max(0, totalStudyCost - feesAlreadyPaid);

  // 3. Available Funding
  // Excludes fees already paid to avoid double counting
  const savings = Math.max(0, funding.savingsAllocated || 0);
  const scholarship = Math.max(0, funding.scholarships || 0);
  const family = Math.max(0, funding.familyContribution || 0);

  const availableFunding = savings + scholarship + family;

  // 4. Estimated Loan Requirement & Surplus
  const estimatedLoanRequirement = Math.max(0, remainingStudyCost - availableFunding);
  const surplusFunding = Math.max(0, availableFunding - remainingStudyCost);

  // 5. Financial Profile Net Worth
  const assets = Math.max(0, financial.totalAssetsValue || 0);
  const liabilities = Math.max(0, financial.totalLiabilitiesValue || 0);
  const calculatedNetWorth = assets - liabilities;

  const caReportedNetWorth = financial.caCertificateNetWorth !== undefined && financial.caCertificateNetWorth !== null
    ? Number(financial.caCertificateNetWorth)
    : null;

  const netWorthDiscrepancy = caReportedNetWorth !== null
    ? Math.abs(calculatedNetWorth - caReportedNetWorth)
    : null;

  // 6. Collateral Net Available Value
  const collVal = Math.max(0, collateral.estimatedValue || 0);
  const collEnc = Math.max(0, collateral.existingEncumbrances || 0);
  const totalCollateralNetValue = Math.max(0, collVal - collEnc);

  return {
    totalTuitionFullCourse: Math.round(totalTuitionFullCourse),
    totalLivingFullCourse: Math.round(totalLivingFullCourse),
    totalAdditionalFullCourse: Math.round(totalAdditionalFullCourse),
    totalStudyCost: Math.round(totalStudyCost),
    feesAlreadyPaid: Math.round(feesAlreadyPaid),
    remainingStudyCost: Math.round(remainingStudyCost),
    availableFunding: Math.round(availableFunding),
    estimatedLoanRequirement: Math.round(estimatedLoanRequirement),
    surplusFunding: Math.round(surplusFunding),
    calculatedNetWorth: Math.round(calculatedNetWorth),
    caReportedNetWorth: caReportedNetWorth !== null ? Math.round(caReportedNetWorth) : null,
    netWorthDiscrepancy: netWorthDiscrepancy !== null ? Math.round(netWorthDiscrepancy) : null,
    totalCollateralNetValue: Math.round(totalCollateralNetValue),
  };
}
