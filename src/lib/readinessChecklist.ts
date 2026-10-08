import { Lender } from '../types/lender';
import { StudentAssessmentInput, ApplicationReadinessChecklist, DocumentCategory } from '../types/assessment';

export interface RequiredDocCategoryItem {
  category: DocumentCategory;
  label: string;
  mandatory: boolean;
}

export function generateLenderReadinessChecklist(
  lender: Lender,
  loanType: 'collateral' | 'non_collateral',
  input: StudentAssessmentInput
): ApplicationReadinessChecklist {
  const isCollateral = loanType === 'collateral';
  const requiredCategories: RequiredDocCategoryItem[] = [
    { category: 'pan_card', label: 'PAN Card (Student & Co-applicant)', mandatory: true },
    { category: 'proof_of_residence', label: 'Proof of Residence (Passport / Voter ID / Aadhaar / Utility Bill)', mandatory: true },
    { category: 'bank_statement', label: 'Bank Account Statement (Last 6 months)', mandatory: true },
    { category: 'asset_liability_statement', label: 'Personal Asset & Liability Statement', mandatory: true },
    { category: 'academic_marksheets', label: '10th, 12th & Degree Marksheets', mandatory: true },
    { category: 'admission_proof', label: 'Proof of Admission & Duration', mandatory: true },
    { category: 'fee_structure', label: 'Official Fee Structure (I-20 for US)', mandatory: true },
    { category: 'test_scores', label: 'IELTS / TOEFL / GMAT / GRE Score Card', mandatory: true },
    { category: 'university_ranking', label: 'University Ranking Print-out', mandatory: true },
  ];

  if (input.financial.coApplicantType === 'salaried') {
    requiredCategories.push(
      { category: 'salary_slips', label: 'Latest Salary Slips (Last 3 months)', mandatory: true },
      { category: 'form_16', label: 'Form 16 (Last 2 years)', mandatory: true },
      { category: 'employer_id', label: 'Employer ID Card', mandatory: true },
      { category: 'itr', label: 'ITR Returns (Last 2 years)', mandatory: true }
    );
  } else if (input.financial.coApplicantType === 'self_employed') {
    requiredCategories.push(
      { category: 'itr', label: 'ITR Returns (Last 3 years)', mandatory: true },
      { category: 'balance_sheet_pnl', label: 'Balance Sheet & P&L Statement (Last 3 years)', mandatory: true },
      { category: 'business_proof', label: 'Proof of Business Address', mandatory: true }
    );
  }

  if (isCollateral) {
    requiredCategories.push(
      { category: 'property_title_deed', label: 'Property Title Deed & Registered Sale Agreement', mandatory: true },
      { category: 'registration_receipt', label: 'Original Registration Receipt', mandatory: true },
      { category: 'encumbrance_certificate', label: 'Encumbrance Certificate (EC - Last 30 years)', mandatory: true }
    );

    if (input.collateral.propertyState === 'delhi') {
      requiredCategories.push({ category: 'property_title_deed', label: 'Delhi: Conveyance Deed & DDA Allotment Letter', mandatory: true });
    } else if (input.collateral.propertyState === 'maharashtra') {
      requiredCategories.push({ category: 'property_title_deed', label: 'Maharashtra: Society NOC, Index II & Builder POA', mandatory: true });
    }
  }

  const uploadedCatSet = new Set(input.documents.map((d) => d.category));
  const verifiedCatSet = new Set(input.documents.filter((d) => d.status === 'verified').map((d) => d.category));

  const missingCategories = requiredCategories.filter((item) => !uploadedCatSet.has(item.category));
  const uploadedCount = requiredCategories.filter((item) => uploadedCatSet.has(item.category)).length;
  const verifiedCount = requiredCategories.filter((item) => verifiedCatSet.has(item.category)).length;
  const totalRequired = requiredCategories.length;

  const readyScorePercentage = totalRequired > 0 ? Math.round((uploadedCount / totalRequired) * 100) : 0;

  return {
    lenderId: lender.id,
    lenderName: lender.name,
    loanType,
    totalRequired,
    uploadedCount,
    verifiedCount,
    missingCategories: missingCategories.map((m) => ({ category: m.category, label: m.label, mandatory: m.mandatory })),
    readyScorePercentage,
    disclaimer: 'Notice: Document presence in this tool confirms workflow checklist compliance only. It does not constitute document authentication, legal verification, or loan approval by the lender.',
  };
}
