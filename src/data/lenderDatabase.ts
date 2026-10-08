import { Lender } from '../types/lender';

export const SOURCE_METADATA = {
  sourceDocumentName: 'GradGuide Education Loan Lender Database',
  sourceUrl: 'https://docs.google.com/document/d/17NyIZxq7mtm_IfiW2HoAWUepetSCKJOQ5pWAps8e8Pc/edit?usp=sharing',
  retrievalDate: '2026-10-08',
  disclaimer: 'This reference database is strictly grounded in the GradGuide Education Loan Process Guide. Unstated conditions are marked as unknown or requiring lender confirmation.',
};

const COMMON_BASIC_DOCS = [
  'PAN Card',
  'Proof of residence (Voter ID / Passport / Electricity Bill / Telephone Bill / Ration Card / Bank account statement / Aadhaar)',
  'Bank account statement for last 6 months (personal / salary)',
  'Personal Asset & Liability Statement',
  'All documents should be self-attested',
];

const COMMON_ACADEMIC_DOCS = [
  '10th, 12th and Degree marksheets/certificates',
  'Proof of admission showing total course duration',
  'Fee structure (I-20 for US, if available)',
  'IELTS / GMAT / GRE score card',
  'University ranking print-out',
];

const SALARIED_CO_APPLICANT_DOCS = [
  'Latest salary slips – last 3 months',
  'Form 16 – last 2 years',
  'Employer ID card',
  'ITR – last 2 years',
];

const SELF_EMPLOYED_CO_APPLICANT_DOCS = [
  'ITR – last 3 years',
  'Balance sheet and Profit & Loss account – last 3 years',
  'Proof of business address',
];

const PROPERTY_DOCUMENTS = [
  'Property title deed and registered sale agreement',
  'Original registration receipt',
  'Allotment letter by Municipal Corporation / authorised government authority, if applicable',
  'Previous chain of sale deeds / Encumbrance Certificate (EC) of last 30 years',
  'Latest property tax bill or electricity bill with same address',
  'Municipality-approved building plan or plot layout',
  'Occupancy Certificate (OC), if apartment',
  'Delhi: Conveyance deed and DDA allotment letter',
  'Maharashtra: NOC from builder / society in bank format, with Index II, share certificate (for resale), society conveyance deed, confirmation of POA by builder, commencement certificate (if new property), and certified board resolution / POA from builder',
];

export const LENDERS_DATABASE: Lender[] = [
  {
    id: 'boi',
    name: 'BOI',
    fullName: 'Bank of India',
    rates: {
      nonCollateral: {
        rateDisplay: 'Not possible',
        isAvailable: false,
        conditionNote: 'Non-collateral education loan is not offered by BOI according to source database.',
      },
      collateral: {
        rateDisplay: '9.00% (Girls: 8.60%)',
        minRate: 8.6,
        maxRate: 9.0,
        isAvailable: true,
        conditionNote: 'Standard rate: 9.00%. Concession rate for female students: 8.60%.',
      },
    },
    cibil: {
      minimumScore: 670,
      isSpecifiedInSource: true,
    },
    documentRequirements: {
      collateral: {
        basic: COMMON_BASIC_DOCS,
        academic: COMMON_ACADEMIC_DOCS,
        coApplicantSalaried: SALARIED_CO_APPLICANT_DOCS,
        coApplicantSelfEmployed: SELF_EMPLOYED_CO_APPLICANT_DOCS,
        collateralProperty: PROPERTY_DOCUMENTS,
      },
      nonCollateral: {
        basic: COMMON_BASIC_DOCS,
        academic: COMMON_ACADEMIC_DOCS,
        coApplicantSalaried: SALARIED_CO_APPLICANT_DOCS,
        coApplicantSelfEmployed: SELF_EMPLOYED_CO_APPLICANT_DOCS,
      },
    },
    sourceMetadata: {
      ...SOURCE_METADATA,
      notes: 'Minimum CIBIL: 670. Non-collateral route not possible. Collateral rate 9.00% standard / 8.60% for girls.',
    },
  },
  {
    id: 'bob',
    name: 'BOB',
    fullName: 'Bank of Baroda',
    rates: {
      nonCollateral: {
        rateDisplay: '8.45%',
        minRate: 8.45,
        maxRate: 8.45,
        isAvailable: true,
        conditionNote: 'Requires admission to Top 100 universities.',
      },
      collateral: {
        rateDisplay: '8.95% (Boys) / 8.75% (Girls)',
        minRate: 8.75,
        maxRate: 8.95,
        isAvailable: true,
        conditionNote: 'Boys: 8.95%, Girls: 8.75%.',
      },
    },
    cibil: {
      minimumScore: 700,
      isSpecifiedInSource: true,
    },
    documentRequirements: {
      collateral: {
        basic: COMMON_BASIC_DOCS,
        academic: COMMON_ACADEMIC_DOCS,
        coApplicantSalaried: SALARIED_CO_APPLICANT_DOCS,
        coApplicantSelfEmployed: SELF_EMPLOYED_CO_APPLICANT_DOCS,
        collateralProperty: PROPERTY_DOCUMENTS,
      },
      nonCollateral: {
        basic: COMMON_BASIC_DOCS,
        academic: COMMON_ACADEMIC_DOCS,
        coApplicantSalaried: SALARIED_CO_APPLICANT_DOCS,
        coApplicantSelfEmployed: SELF_EMPLOYED_CO_APPLICANT_DOCS,
      },
    },
    sourceMetadata: {
      ...SOURCE_METADATA,
      notes: 'Minimum CIBIL: 700. Non-collateral rate 8.45% (Top 100 universities). Collateral: 8.95% (Boys), 8.75% (Girls).',
    },
  },
  {
    id: 'sbi',
    name: 'SBI',
    fullName: 'State Bank of India',
    rates: {
      nonCollateral: {
        rateDisplay: '9.40%',
        minRate: 9.4,
        maxRate: 9.4,
        isAvailable: true,
        conditionNote: 'Requires admission to Top 100 universities.',
      },
      collateral: {
        rateDisplay: '8.40%',
        minRate: 8.4,
        maxRate: 8.4,
        isAvailable: true,
        conditionNote: 'Standard collateral rate 8.40%.',
      },
    },
    cibil: {
      minimumScore: 750,
      isSpecifiedInSource: true,
    },
    documentRequirements: {
      collateral: {
        basic: COMMON_BASIC_DOCS,
        academic: COMMON_ACADEMIC_DOCS,
        coApplicantSalaried: SALARIED_CO_APPLICANT_DOCS,
        coApplicantSelfEmployed: SELF_EMPLOYED_CO_APPLICANT_DOCS,
        collateralProperty: PROPERTY_DOCUMENTS,
      },
      nonCollateral: {
        basic: COMMON_BASIC_DOCS,
        academic: COMMON_ACADEMIC_DOCS,
        coApplicantSalaried: SALARIED_CO_APPLICANT_DOCS,
        coApplicantSelfEmployed: SELF_EMPLOYED_CO_APPLICANT_DOCS,
      },
    },
    sourceMetadata: {
      ...SOURCE_METADATA,
      notes: 'Minimum CIBIL: 750. Non-collateral rate 9.40% (Top 100 universities). Collateral: 8.40%.',
    },
  },
  {
    id: 'credila',
    name: 'Credila',
    fullName: 'HDFC Credila',
    rates: {
      nonCollateral: {
        rateDisplay: '10.75%',
        minRate: 10.75,
        maxRate: 10.75,
        isAvailable: true,
        conditionNote: 'Indicative non-collateral interest rate: 10.75%.',
      },
      collateral: {
        rateDisplay: '9.25% – 9.75%',
        minRate: 9.25,
        maxRate: 9.75,
        isAvailable: true,
        conditionNote: 'Indicative rate range: 9.25% to 9.75% based on risk evaluation.',
      },
    },
    cibil: {
      minimumScore: null,
      isSpecifiedInSource: false,
    },
    documentRequirements: {
      collateral: {
        basic: COMMON_BASIC_DOCS,
        academic: COMMON_ACADEMIC_DOCS,
        coApplicantSalaried: SALARIED_CO_APPLICANT_DOCS,
        coApplicantSelfEmployed: SELF_EMPLOYED_CO_APPLICANT_DOCS,
        collateralProperty: PROPERTY_DOCUMENTS,
      },
      nonCollateral: {
        basic: COMMON_BASIC_DOCS,
        academic: COMMON_ACADEMIC_DOCS,
        coApplicantSalaried: SALARIED_CO_APPLICANT_DOCS,
        coApplicantSelfEmployed: SELF_EMPLOYED_CO_APPLICANT_DOCS,
      },
    },
    sourceMetadata: {
      ...SOURCE_METADATA,
      notes: 'Minimum CIBIL score not specified in source document (requires lender confirmation). Non-collateral: 10.75%, Collateral: 9.25% – 9.75%.',
    },
  },
  {
    id: 'auxilo',
    name: 'Auxilo',
    fullName: 'Auxilo Finserve',
    rates: {
      nonCollateral: {
        rateDisplay: '10.25%',
        minRate: 10.25,
        maxRate: 10.25,
        isAvailable: true,
        conditionNote: 'Indicative non-collateral interest rate: 10.25%.',
      },
      collateral: {
        rateDisplay: '10.00%',
        minRate: 10.0,
        maxRate: 10.0,
        isAvailable: true,
        conditionNote: 'Indicative collateral interest rate: 10.00%.',
      },
    },
    cibil: {
      minimumScore: null,
      isSpecifiedInSource: false,
    },
    documentRequirements: {
      collateral: {
        basic: COMMON_BASIC_DOCS,
        academic: COMMON_ACADEMIC_DOCS,
        coApplicantSalaried: SALARIED_CO_APPLICANT_DOCS,
        coApplicantSelfEmployed: SELF_EMPLOYED_CO_APPLICANT_DOCS,
        collateralProperty: PROPERTY_DOCUMENTS,
      },
      nonCollateral: {
        basic: COMMON_BASIC_DOCS,
        academic: COMMON_ACADEMIC_DOCS,
        coApplicantSalaried: SALARIED_CO_APPLICANT_DOCS,
        coApplicantSelfEmployed: SELF_EMPLOYED_CO_APPLICANT_DOCS,
      },
    },
    sourceMetadata: {
      ...SOURCE_METADATA,
      notes: 'Minimum CIBIL score not specified in source document (requires lender confirmation). Non-collateral: 10.25%, Collateral: 10.00%.',
    },
  },
];
