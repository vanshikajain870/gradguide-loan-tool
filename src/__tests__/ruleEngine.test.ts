import { describe, it, expect } from 'vitest';
import { evaluateAllLenders } from '../lib/ruleEngine';
import { SAMPLE_STUDENT_DATA } from '../data/sampleStudent';
import { LENDERS_DATABASE } from '../data/lenderDatabase';
import { StudentAssessmentInput } from '../types/assessment';

describe('Lender Assessment Rule Engine', () => {
  it('correctly flags BOI non-collateral route as ineligible / not possible', () => {
    const { nonCollateralResults } = evaluateAllLenders(SAMPLE_STUDENT_DATA);
    const boiNonCollateral = nonCollateralResults.find((r) => r.lenderId === 'boi');

    expect(boiNonCollateral).toBeDefined();
    expect(boiNonCollateral?.overallEligibility).toBe('ineligible');
    expect(boiNonCollateral?.indicativeInterestRate).toBe('Not possible');
  });

  it('evaluates CIBIL thresholds accurately according to source database', () => {
    // SBI requires 750, BOB requires 700, BOI requires 670
    // Test with CIBIL score = 720 (meets BOB & BOI, fails SBI)
    const input: StudentAssessmentInput = {
      ...SAMPLE_STUDENT_DATA,
      financial: {
        ...SAMPLE_STUDENT_DATA.financial,
        coApplicantCibilScore: 720,
      },
    };

    const { collateralResults } = evaluateAllLenders(input);
    const sbi = collateralResults.find((r) => r.lenderId === 'sbi');
    const bob = collateralResults.find((r) => r.lenderId === 'bob');
    const boi = collateralResults.find((r) => r.lenderId === 'boi');

    expect(sbi?.cibilStatus.status).toBe('does_not_meet');
    expect(bob?.cibilStatus.status).toBe('meets');
    expect(boi?.cibilStatus.status).toBe('meets');
  });

  it('marks Credila and Auxilo CIBIL status as requires_confirmation since unstated in source', () => {
    const { collateralResults } = evaluateAllLenders(SAMPLE_STUDENT_DATA);
    const credila = collateralResults.find((r) => r.lenderId === 'credila');
    const auxilo = collateralResults.find((r) => r.lenderId === 'auxilo');

    expect(credila?.cibilStatus.status).toBe('requires_confirmation');
    expect(auxilo?.cibilStatus.status).toBe('requires_confirmation');
  });

  it('enforces Top 100 university condition for SBI & BOB non-collateral loans', () => {
    const notTop100Input: StudentAssessmentInput = {
      ...SAMPLE_STUDENT_DATA,
      study: {
        ...SAMPLE_STUDENT_DATA.study,
        isUniversityTop100: false,
      },
    };

    const { nonCollateralResults } = evaluateAllLenders(notTop100Input);
    const sbiNonColl = nonCollateralResults.find((r) => r.lenderId === 'sbi');
    const bobNonColl = nonCollateralResults.find((r) => r.lenderId === 'bob');

    expect(sbiNonColl?.universityRankingStatus.status).toBe('does_not_meet');
    expect(bobNonColl?.universityRankingStatus.status).toBe('does_not_meet');
  });
});
