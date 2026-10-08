export type CostPeriod = 'annual' | 'full_course';
export type IncomePeriod = 'monthly' | 'annual';
export type CoApplicantType = 'salaried' | 'self_employed' | 'none';

export interface StudyDetails {
  country: string;
  university: string;
  isUniversityTop100: boolean | 'unknown';
  course: string;
  durationYears: number;
  tuitionAmount: number;
  tuitionPeriod: CostPeriod;
  livingCostsAmount: number;
  livingCostsPeriod: CostPeriod;
  additionalExpensesAmount: number;
  additionalExpensesPeriod: CostPeriod;
  currency: string;
}

export interface FundingDetails {
  savingsAllocated: number;
  scholarships: number;
  feesAlreadyPaid: number;
  familyContribution: number;
  notes?: string;
}

export interface FinancialProfile {
  applicantIncome: number;
  applicantIncomePeriod: IncomePeriod;
  coApplicantType: CoApplicantType;
  coApplicantIncome: number;
  coApplicantIncomePeriod: IncomePeriod;
  coApplicantCibilScore: number | null;
  studentCibilScore: number | null;
  totalAssetsValue: number;
  totalLiabilitiesValue: number;
  caCertificateNetWorth: number | null;
}

export interface CollateralDetails {
  hasCollateral: boolean;
  assetType?: 'residential_property' | 'commercial_property' | 'plot' | 'fixed_deposit' | 'lic_policy' | 'gold' | 'other';
  propertyState?: 'delhi' | 'maharashtra' | 'other';
  estimatedValue: number;
  existingEncumbrances: number;
  valueSource: 'user_estimated' | 'bank_valuation' | 'ca_certified';
}

export type DocumentCategory =
  | 'pan_card'
  | 'proof_of_residence'
  | 'bank_statement'
  | 'asset_liability_statement'
  | 'academic_marksheets'
  | 'admission_proof'
  | 'fee_structure'
  | 'test_scores'
  | 'university_ranking'
  | 'salary_slips'
  | 'form_16'
  | 'employer_id'
  | 'itr'
  | 'balance_sheet_pnl'
  | 'business_proof'
  | 'property_title_deed'
  | 'registration_receipt'
  | 'encumbrance_certificate'
  | 'ca_net_worth_certificate';

export interface UploadedDocument {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: DocumentCategory;
  uploadTimestamp: string;
  status: 'uploaded' | 'extraction_pending' | 'extracted_review_needed' | 'verified';
  extractedValues?: Record<string, { value: string | number; confidence: number; pageEvidence?: string }>;
  isUserConfirmed?: boolean;
}

export interface StudentAssessmentInput {
  study: StudyDetails;
  funding: FundingDetails;
  financial: FinancialProfile;
  collateral: CollateralDetails;
  documents: UploadedDocument[];
  gender?: 'male' | 'female' | 'other' | 'unspecified';
}

export interface FinancialSummaryResult {
  totalTuitionFullCourse: number;
  totalLivingFullCourse: number;
  totalAdditionalFullCourse: number;
  totalStudyCost: number;
  feesAlreadyPaid: number;
  remainingStudyCost: number;
  availableFunding: number;
  estimatedLoanRequirement: number;
  surplusFunding: number;
  calculatedNetWorth: number;
  caReportedNetWorth: number | null;
  netWorthDiscrepancy: number | null;
  totalCollateralNetValue: number;
}

export type CriterionStatus = 'meets' | 'does_not_meet' | 'unknown' | 'requires_confirmation';

export interface CriterionAssessment {
  criterionName: string;
  status: CriterionStatus;
  userValue?: string | number | null;
  requiredCondition: string;
  reason: string;
  sourceRef: string;
}

export interface LenderAssessmentResult {
  lenderId: string;
  lenderName: string;
  loanType: 'collateral' | 'non_collateral';
  overallEligibility: 'likely_eligible' | 'ineligible' | 'requires_confirmation';
  indicativeInterestRate: string;
  rateNotes?: string;
  cibilStatus: CriterionAssessment;
  universityRankingStatus: CriterionAssessment;
  collateralStatus: CriterionAssessment;
  documentCompletenessStatus: CriterionAssessment;
  missingDocuments: string[];
}

export interface FinancialConsistencyFlag {
  id: string;
  severity: 'error' | 'warning' | 'info';
  category: 'double_counting' | 'period_mismatch' | 'net_worth_discrepancy' | 'encumbrance_overlap' | 'funding_surplus';
  title: string;
  description: string;
  reviewQuestion: string;
  correctiveGuidance: string;
}

export interface ApplicationReadinessChecklist {
  lenderId: string;
  lenderName: string;
  loanType: 'collateral' | 'non_collateral';
  totalRequired: number;
  uploadedCount: number;
  verifiedCount: number;
  missingCategories: { category: DocumentCategory; label: string; mandatory: boolean }[];
  readyScorePercentage: number;
  disclaimer: string;
}
