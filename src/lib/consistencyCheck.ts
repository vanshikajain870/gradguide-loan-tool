import { StudentAssessmentInput, FinancialConsistencyFlag, FinancialSummaryResult } from '../types/assessment';
import { calculateFinancialSummary } from './calculations';

export function runFinancialConsistencyChecks(
  input: StudentAssessmentInput
): FinancialConsistencyFlag[] {
  const flags: FinancialConsistencyFlag[] = [];
  const summary: FinancialSummaryResult = calculateFinancialSummary(input);

  // 1. CA Net Worth Discrepancy Check
  if (summary.caReportedNetWorth !== null && summary.netWorthDiscrepancy !== null) {
    if (summary.netWorthDiscrepancy > 1000) {
      flags.push({
        id: 'flag-net-worth-discrepancy',
        severity: 'warning',
        category: 'net_worth_discrepancy',
        title: 'Net Worth Discrepancy Flagged',
        description: `Calculated net worth (₹${summary.calculatedNetWorth.toLocaleString('en-IN')}) differs from CA Certificate reported net worth (₹${summary.caReportedNetWorth.toLocaleString('en-IN')}) by ₹${summary.netWorthDiscrepancy.toLocaleString('en-IN')}.`,
        reviewQuestion: 'Does the CA Net Worth Certificate include assets or tax liabilities not captured in your itemized asset/liability form?',
        correctiveGuidance: 'Review itemized assets and liabilities. Ensure both figures reflect the same audit date and asset valuation basis.',
      });
    }
  }

  // 2. Double-Counted Funding Check (Scholarship vs Savings vs Fees Paid)
  const totalFundingSources = input.funding.savingsAllocated + input.funding.scholarships + input.funding.familyContribution;
  if (input.funding.feesAlreadyPaid > 0 && input.funding.feesAlreadyPaid === input.funding.scholarships) {
    flags.push({
      id: 'flag-fees-paid-scholarship-overlap',
      severity: 'warning',
      category: 'double_counting',
      title: 'Potential Double-Deduction of Scholarship',
      description: 'Fees already paid is identical to the entered scholarship amount.',
      reviewQuestion: 'Was the scholarship used directly to pay the fees already paid?',
      correctiveGuidance: 'If the scholarship was already applied to pay the fees already paid, do not list it again under available scholarships, otherwise it will be deducted twice from your remaining cost.',
    });
  }

  if (totalFundingSources > summary.remainingStudyCost && summary.remainingStudyCost > 0) {
    flags.push({
      id: 'flag-funding-surplus',
      severity: 'info',
      category: 'funding_surplus',
      title: 'Funding Surplus Identified',
      description: `Declared available funding (₹${summary.availableFunding.toLocaleString('en-IN')}) exceeds remaining study cost (₹${summary.remainingStudyCost.toLocaleString('en-IN')}) by ₹${summary.surplusFunding.toLocaleString('en-IN')}.`,
      reviewQuestion: 'Are all declared funding sources committed specifically to education expenses?',
      correctiveGuidance: 'Your estimated education loan requirement is ₹0 because your existing funding covers remaining costs.',
    });
  }

  // 3. Encumbrance vs General Liabilities Double Deduction Check
  if (input.collateral.existingEncumbrances > 0 && input.financial.totalLiabilitiesValue > 0) {
    if (input.collateral.existingEncumbrances > input.financial.totalLiabilitiesValue) {
      flags.push({
        id: 'flag-encumbrance-liability-mismatch',
        severity: 'error',
        category: 'encumbrance_overlap',
        title: 'Collateral Encumbrance Exceeds Total Liabilities',
        description: `Property encumbrance (₹${input.collateral.existingEncumbrances.toLocaleString('en-IN')}) is greater than total declared financial liabilities (₹${input.financial.totalLiabilitiesValue.toLocaleString('en-IN')}).`,
        reviewQuestion: 'Should the home loan / mortgage encumbrance be added to total financial liabilities?',
        correctiveGuidance: 'Ensure secured mortgages on collateral properties are included in your total liabilities figure so net worth calculations remain accurate.',
      });
    } else {
      flags.push({
        id: 'flag-encumbrance-overlap-review',
        severity: 'info',
        category: 'encumbrance_overlap',
        title: 'Secured Debt Audit Note',
        description: `Property encumbrance of ₹${input.collateral.existingEncumbrances.toLocaleString('en-IN')} has been deducted from property collateral value.`,
        reviewQuestion: 'Is this secured debt already included in your total financial profile liabilities?',
        correctiveGuidance: 'Secured property debt is deducted from collateral valuation to find net available collateral. Ensure total liabilities in your financial profile does not double-deduct this amount.',
      });
    }
  }

  // 4. Period Mismatch / Implausible Income Check
  const coAppMonthly = input.financial.coApplicantIncomePeriod === 'annual'
    ? input.financial.coApplicantIncome / 12
    : input.financial.coApplicantIncome;

  if (input.financial.coApplicantType !== 'none') {
    if (input.financial.coApplicantIncome > 0 && coAppMonthly < 5000 && input.financial.coApplicantIncomePeriod === 'monthly') {
      flags.push({
        id: 'flag-implausible-monthly-income',
        severity: 'warning',
        category: 'period_mismatch',
        title: 'Very Low Co-applicant Monthly Income',
        description: `Entered co-applicant monthly income is ₹${input.financial.coApplicantIncome.toLocaleString('en-IN')}/month.`,
        reviewQuestion: 'Did you accidentally enter annual income into the monthly income input field?',
        correctiveGuidance: 'Verify if the figure represents monthly income or annual income.',
      });
    } else if (input.financial.coApplicantIncomePeriod === 'annual' && input.financial.coApplicantIncome > 10000000) {
      flags.push({
        id: 'flag-high-income-annual-check',
        severity: 'info',
        category: 'period_mismatch',
        title: 'Annual Income Input Verification',
        description: `Entered annual co-applicant income is ₹${input.financial.coApplicantIncome.toLocaleString('en-IN')}.`,
        reviewQuestion: 'Is this figure annual gross income as shown on Form 16 / ITR?',
        correctiveGuidance: 'Confirm that annual income matches the latest 2 years ITR returns.',
      });
    }
  }

  return flags;
}
