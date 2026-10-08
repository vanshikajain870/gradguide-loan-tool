export type LoanType = 'collateral' | 'non_collateral';

export interface RateCondition {
  rateDisplay: string;
  minRate?: number;
  maxRate?: number;
  conditionNote?: string;
  isAvailable: boolean; // e.g. false for BOI non-collateral
}

export interface LenderRateConfig {
  collateral?: RateCondition;
  nonCollateral?: RateCondition;
}

export interface CibilConfig {
  minimumScore: number | null; // null if not specified in source
  isSpecifiedInSource: boolean;
}

export interface LenderDocRequirement {
  basic: string[];
  academic: string[];
  coApplicantSalaried: string[];
  coApplicantSelfEmployed: string[];
  collateralProperty?: string[];
}

export interface Lender {
  id: string;
  name: string;
  fullName: string;
  rates: LenderRateConfig;
  cibil: CibilConfig;
  documentRequirements: {
    collateral: LenderDocRequirement;
    nonCollateral: LenderDocRequirement;
  };
  sourceMetadata: {
    sourceUrl: string;
    retrievalDate: string;
    sourceDocumentName: string;
    notes: string;
  };
}
