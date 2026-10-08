import { Lender } from '../types/lender';
import {
  StudentAssessmentInput,
  LenderAssessmentResult,
  CriterionAssessment,
  FinancialSummaryResult,
} from '../types/assessment';
import { LENDERS_DATABASE } from '../data/lenderDatabase';
import { calculateFinancialSummary } from './calculations';

export function evaluateLenderForRoute(
  lender: Lender,
  loanType: 'collateral' | 'non_collateral',
  input: StudentAssessmentInput,
  summary: FinancialSummaryResult
): LenderAssessmentResult {
  const isCollateralRoute = loanType === 'collateral';
  const rateConfig = isCollateralRoute ? lender.rates.collateral : lender.rates.nonCollateral;

  // Check 0: Availability of Loan Route
  if (!rateConfig || !rateConfig.isAvailable) {
    return {
      lenderId: lender.id,
      lenderName: lender.name,
      loanType,
      overallEligibility: 'ineligible',
      indicativeInterestRate: rateConfig?.rateDisplay || 'Not offered',
      rateNotes: rateConfig?.conditionNote || 'Route not offered by lender',
      cibilStatus: {
        criterionName: 'CIBIL Score',
        status: 'does_not_meet',
        requiredCondition: 'Scheme availability',
        reason: `${lender.name} does not offer non-collateral education loans.`,
        sourceRef: lender.sourceMetadata.notes,
      },
      universityRankingStatus: {
        criterionName: 'University Rank',
        status: 'does_not_meet',
        requiredCondition: 'N/A',
        reason: 'Scheme unavailable.',
        sourceRef: lender.sourceMetadata.notes,
      },
      collateralStatus: {
        criterionName: 'Collateral Requirement',
        status: 'does_not_meet',
        requiredCondition: 'N/A',
        reason: 'Scheme unavailable.',
        sourceRef: lender.sourceMetadata.notes,
      },
      documentCompletenessStatus: {
        criterionName: 'Document Completeness',
        status: 'does_not_meet',
        requiredCondition: 'N/A',
        reason: 'Scheme unavailable.',
        sourceRef: lender.sourceMetadata.notes,
      },
      missingDocuments: [],
    };
  }

  // 1. Evaluate CIBIL Score Criterion
  let cibilStatus: CriterionAssessment;
  const userCibil = input.financial.coApplicantCibilScore || input.financial.studentCibilScore;

  if (!lender.cibil.isSpecifiedInSource || lender.cibil.minimumScore === null) {
    cibilStatus = {
      criterionName: 'Minimum CIBIL Score',
      status: 'requires_confirmation',
      userValue: userCibil ?? 'Not provided',
      requiredCondition: 'Not specified in source database',
      reason: `Minimum CIBIL score for ${lender.name} is not specified in the assignment database. Requires lender confirmation.`,
      sourceRef: `Database entry for ${lender.name}`,
    };
  } else if (userCibil === null || userCibil === undefined) {
    cibilStatus = {
      criterionName: 'Minimum CIBIL Score',
      status: 'unknown',
      userValue: 'Missing input',
      requiredCondition: `>= ${lender.cibil.minimumScore}`,
      reason: `Co-applicant / Student CIBIL score was not provided. Minimum score of ${lender.cibil.minimumScore} is required by ${lender.name}.`,
      sourceRef: `Table 2: Minimum CIBIL Score (${lender.name}: ${lender.cibil.minimumScore})`,
    };
  } else if (userCibil >= lender.cibil.minimumScore) {
    cibilStatus = {
      criterionName: 'Minimum CIBIL Score',
      status: 'meets',
      userValue: userCibil,
      requiredCondition: `>= ${lender.cibil.minimumScore}`,
      reason: `Provided score (${userCibil}) meets ${lender.name}'s minimum threshold of ${lender.cibil.minimumScore}.`,
      sourceRef: `Table 2: Minimum CIBIL Score (${lender.name}: ${lender.cibil.minimumScore})`,
    };
  } else {
    cibilStatus = {
      criterionName: 'Minimum CIBIL Score',
      status: 'does_not_meet',
      userValue: userCibil,
      requiredCondition: `>= ${lender.cibil.minimumScore}`,
      reason: `Provided score (${userCibil}) is below ${lender.name}'s minimum threshold of ${lender.cibil.minimumScore}.`,
      sourceRef: `Table 2: Minimum CIBIL Score (${lender.name}: ${lender.cibil.minimumScore})`,
    };
  }

  // 2. Evaluate University Ranking Criterion (Top 100 condition)
  let univStatus: CriterionAssessment;
  const isTop100Required = !isCollateralRoute && (lender.id === 'bob' || lender.id === 'sbi');

  if (isTop100Required) {
    if (input.study.isUniversityTop100 === true) {
      univStatus = {
        criterionName: 'University Ranking Criterion',
        status: 'meets',
        userValue: input.study.university || 'Top 100 University',
        requiredCondition: 'Top 100 Universities',
        reason: `${lender.name} non-collateral rate (${rateConfig.rateDisplay}) applies to Top 100 universities.`,
        sourceRef: `Table 1: Lender Rates (${lender.name} Non-collateral condition: Top 100 universities)`,
      };
    } else if (input.study.isUniversityTop100 === false) {
      univStatus = {
        criterionName: 'University Ranking Criterion',
        status: 'does_not_meet',
        userValue: input.study.university || 'Outside Top 100',
        requiredCondition: 'Top 100 Universities',
        reason: `${lender.name} non-collateral scheme specifically requires admission to a Top 100 ranked university.`,
        sourceRef: `Table 1: Lender Rates (${lender.name} Non-collateral condition: Top 100 universities)`,
      };
    } else {
      univStatus = {
        criterionName: 'University Ranking Criterion',
        status: 'unknown',
        userValue: 'Ranking unconfirmed',
        requiredCondition: 'Top 100 Universities',
        reason: `University ranking top 100 status is not confirmed for ${input.study.university || 'selected institution'}.`,
        sourceRef: `Table 1: Lender Rates (${lender.name} Non-collateral condition)`,
      };
    }
  } else {
    univStatus = {
      criterionName: 'University Ranking Criterion',
      status: 'meets',
      userValue: input.study.university || 'Standard institution',
      requiredCondition: 'No top-100 restriction stated',
      reason: `No university ranking restriction is specified for ${lender.name} ${loanType} route in the source database.`,
      sourceRef: 'Table 1: Lender Rates',
    };
  }

  // 3. Evaluate Collateral Requirement
  let collateralStatus: CriterionAssessment;
  if (isCollateralRoute) {
    if (input.collateral.hasCollateral && summary.totalCollateralNetValue > 0) {
      collateralStatus = {
        criterionName: 'Collateral Security',
        status: 'meets',
        userValue: `Net value: ₹${summary.totalCollateralNetValue.toLocaleString('en-IN')}`,
        requiredCondition: 'Acceptable property/asset collateral',
        reason: `Collateral declared with net value ₹${summary.totalCollateralNetValue.toLocaleString('en-IN')}. Note: LTV ratio and bank legal valuation require lender confirmation.`,
        sourceRef: 'Section 3: Collateral Loan Required Documents',
      };
    } else {
      collateralStatus = {
        criterionName: 'Collateral Security',
        status: 'does_not_meet',
        userValue: 'No collateral declared',
        requiredCondition: 'Secured collateral asset required',
        reason: 'Collateral loan route requires acceptable property or liquid asset security.',
        sourceRef: 'Section 3: Collateral Loan Required Documents',
      };
    }
  } else {
    collateralStatus = {
      criterionName: 'Collateral Exemption',
      status: 'meets',
      userValue: 'Non-collateral route',
      requiredCondition: 'Unsecured loan route',
      reason: 'No collateral asset required for non-collateral scheme.',
      sourceRef: 'Section 4: Non-Collateral Loan Required Documents',
    };
  }

  // 4. Evaluate Document Completeness Criterion
  const docReqs = isCollateralRoute
    ? lender.documentRequirements.collateral
    : lender.documentRequirements.nonCollateral;

  const uploadedCategories = new Set(input.documents.map((d) => d.category));
  const missingDocs: string[] = [];

  if (!uploadedCategories.has('pan_card')) missingDocs.push('PAN Card');
  if (!uploadedCategories.has('proof_of_residence')) missingDocs.push('Proof of Residence');
  if (!uploadedCategories.has('bank_statement')) missingDocs.push('Bank Account Statement (last 6 months)');
  if (!uploadedCategories.has('academic_marksheets')) missingDocs.push('10th, 12th & Degree Marksheets');

  if (input.financial.coApplicantType === 'salaried') {
    if (!uploadedCategories.has('salary_slips')) missingDocs.push('Salary Slips (last 3 months)');
    if (!uploadedCategories.has('itr')) missingDocs.push('ITR (last 2 years)');
  } else if (input.financial.coApplicantType === 'self_employed') {
    if (!uploadedCategories.has('itr')) missingDocs.push('ITR (last 3 years)');
    if (!uploadedCategories.has('balance_sheet_pnl')) missingDocs.push('Balance Sheet & P&L (last 3 years)');
  }

  if (isCollateralRoute && !uploadedCategories.has('property_title_deed')) {
    missingDocs.push('Property Title Deed / Sale Agreement');
  }

  let docStatus: CriterionAssessment;
  if (missingDocs.length === 0) {
    docStatus = {
      criterionName: 'Document Completeness',
      status: 'meets',
      userValue: `${input.documents.length} document(s) uploaded`,
      requiredCondition: 'All mandatory baseline documents',
      reason: 'All core required document categories uploaded.',
      sourceRef: isCollateralRoute ? 'Section 3: Collateral Required Documents' : 'Section 4: Non-Collateral Required Documents',
    };
  } else {
    docStatus = {
      criterionName: 'Document Completeness',
      status: 'requires_confirmation',
      userValue: `Missing ${missingDocs.length} category document(s)`,
      requiredCondition: 'All mandatory baseline documents',
      reason: `Missing key document(s): ${missingDocs.join(', ')}.`,
      sourceRef: isCollateralRoute ? 'Section 3: Collateral Required Documents' : 'Section 4: Non-Collateral Required Documents',
    };
  }

  // 5. Determine Overall Eligibility
  let overallEligibility: 'likely_eligible' | 'ineligible' | 'requires_confirmation' = 'likely_eligible';

  if (
    cibilStatus.status === 'does_not_meet' ||
    univStatus.status === 'does_not_meet' ||
    collateralStatus.status === 'does_not_meet'
  ) {
    overallEligibility = 'ineligible';
  } else if (
    cibilStatus.status === 'unknown' ||
    cibilStatus.status === 'requires_confirmation' ||
    univStatus.status === 'unknown' ||
    docStatus.status === 'requires_confirmation'
  ) {
    overallEligibility = 'requires_confirmation';
  }

  return {
    lenderId: lender.id,
    lenderName: lender.name,
    loanType,
    overallEligibility,
    indicativeInterestRate: rateConfig.rateDisplay,
    rateNotes: rateConfig.conditionNote,
    cibilStatus,
    universityRankingStatus: univStatus,
    collateralStatus,
    documentCompletenessStatus: docStatus,
    missingDocuments: missingDocs,
  };
}

export function evaluateAllLenders(
  input: StudentAssessmentInput
): { collateralResults: LenderAssessmentResult[]; nonCollateralResults: LenderAssessmentResult[] } {
  const summary = calculateFinancialSummary(input);

  const collateralResults = LENDERS_DATABASE.map((lender) =>
    evaluateLenderForRoute(lender, 'collateral', input, summary)
  );

  const nonCollateralResults = LENDERS_DATABASE.map((lender) =>
    evaluateLenderForRoute(lender, 'non_collateral', input, summary)
  );

  return { collateralResults, nonCollateralResults };
}
