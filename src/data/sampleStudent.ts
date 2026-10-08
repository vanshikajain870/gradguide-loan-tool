import { StudentAssessmentInput } from '../types/assessment';

export const SAMPLE_STUDENT_DATA: StudentAssessmentInput = {
  gender: 'female',
  study: {
    country: 'United States',
    university: 'Columbia University',
    isUniversityTop100: true,
    course: 'Master of Science in Computer Science',
    durationYears: 2,
    tuitionAmount: 1200000, // Annual tuition = 1,200,000 -> 2 years = 2,400,000
    tuitionPeriod: 'annual',
    livingCostsAmount: 300000, // Annual living = 300,000 -> 2 years = 600,000
    livingCostsPeriod: 'annual',
    additionalExpensesAmount: 0,
    additionalExpensesPeriod: 'full_course',
    currency: 'INR',
  },
  funding: {
    feesAlreadyPaid: 200000, // Fees paid
    savingsAllocated: 400000, // Savings allocated
    scholarships: 300000, // Applicable scholarship
    familyContribution: 100000, // Additional family contribution
    notes: 'Sample synthetic student profile for regression verification',
  },
  financial: {
    applicantIncome: 0,
    applicantIncomePeriod: 'monthly',
    coApplicantType: 'salaried',
    coApplicantIncome: 75000, // Monthly salary = 75,000
    coApplicantIncomePeriod: 'monthly',
    studentCibilScore: null,
    coApplicantCibilScore: 720,
    totalAssetsValue: 3500000,
    totalLiabilitiesValue: 500000,
    caCertificateNetWorth: 3000000, // Matches calculated (3.5M - 0.5M)
  },
  collateral: {
    hasCollateral: true,
    assetType: 'residential_property',
    propertyState: 'maharashtra',
    estimatedValue: 2500000,
    existingEncumbrances: 0,
    valueSource: 'user_estimated',
  },
  documents: [
    {
      id: 'doc-1',
      fileName: 'pan_card_coapplicant.pdf',
      fileSize: 1048576,
      fileType: 'application/pdf',
      category: 'pan_card',
      uploadTimestamp: '2026-10-08T10:00:00Z',
      status: 'verified',
      isUserConfirmed: true,
    },
    {
      id: 'doc-2',
      fileName: 'bank_statement_6months.pdf',
      fileSize: 2097152,
      fileType: 'application/pdf',
      category: 'bank_statement',
      uploadTimestamp: '2026-10-08T10:05:00Z',
      status: 'verified',
      isUserConfirmed: true,
    },
    {
      id: 'doc-3',
      fileName: 'academic_transcript_degree.pdf',
      fileSize: 1572864,
      fileType: 'application/pdf',
      category: 'academic_marksheets',
      uploadTimestamp: '2026-10-08T10:10:00Z',
      status: 'verified',
      isUserConfirmed: true,
    },
    {
      id: 'doc-4',
      fileName: 'salary_slips_3months.pdf',
      fileSize: 1200000,
      fileType: 'application/pdf',
      category: 'salary_slips',
      uploadTimestamp: '2026-10-08T10:12:00Z',
      status: 'verified',
      isUserConfirmed: true,
    },
  ],
};
