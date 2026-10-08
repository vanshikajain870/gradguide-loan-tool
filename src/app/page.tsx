'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/navbar';
import { StepIndicator } from '../components/step-indicator';
import { SampleDataBanner } from '../components/sample-data-banner';
import { StepStudy } from '../components/steps/step-study';
import { StepFunding } from '../components/steps/step-funding';
import { StepFinancial } from '../components/steps/step-financial';
import { StepCollateral } from '../components/steps/step-collateral';
import { StepDocuments } from '../components/steps/step-documents';
import { StepAssessment } from '../components/steps/step-assessment';

import { StudentAssessmentInput, UploadedDocument, DocumentCategory } from '../types/assessment';
import { SAMPLE_STUDENT_DATA } from '../data/sampleStudent';
import { calculateFinancialSummary } from '../lib/calculations';

const INITIAL_FORM_STATE: StudentAssessmentInput = {
  gender: 'female',
  study: {
    country: 'United States',
    university: '',
    isUniversityTop100: 'unknown',
    course: '',
    durationYears: 2,
    tuitionAmount: 0,
    tuitionPeriod: 'annual',
    livingCostsAmount: 0,
    livingCostsPeriod: 'annual',
    additionalExpensesAmount: 0,
    additionalExpensesPeriod: 'full_course',
    currency: 'INR',
  },
  funding: {
    feesAlreadyPaid: 0,
    savingsAllocated: 0,
    scholarships: 0,
    familyContribution: 0,
  },
  financial: {
    applicantIncome: 0,
    applicantIncomePeriod: 'monthly',
    coApplicantType: 'salaried',
    coApplicantIncome: 0,
    coApplicantIncomePeriod: 'monthly',
    coApplicantCibilScore: null,
    studentCibilScore: null,
    totalAssetsValue: 0,
    totalLiabilitiesValue: 0,
    caCertificateNetWorth: null,
  },
  collateral: {
    hasCollateral: false,
    assetType: 'residential_property',
    propertyState: 'other',
    estimatedValue: 0,
    existingEncumbrances: 0,
    valueSource: 'user_estimated',
  },
  documents: [],
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  const [studentInput, setStudentInput] = useState<StudentAssessmentInput>(SAMPLE_STUDENT_DATA);
  const [isSampleLoaded, setIsSampleLoaded] = useState<boolean>(true);

  // Navigation handlers
  const handleNextStep = () => {
    const next = Math.min(6, currentStep + 1);
    setCurrentStep(next);
    setMaxStepReached((prev) => Math.max(prev, next));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackStep = () => {
    const prev = Math.max(1, currentStep - 1);
    setCurrentStep(prev);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepClick = (step: number) => {
    if (step <= Math.max(maxStepReached, currentStep)) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sample Data & Reset
  const handleLoadSample = () => {
    setStudentInput(SAMPLE_STUDENT_DATA);
    setIsSampleLoaded(true);
  };

  const handleReset = () => {
    setStudentInput(INITIAL_FORM_STATE);
    setIsSampleLoaded(false);
    setCurrentStep(1);
    setMaxStepReached(1);
  };

  // State Updates
  const updateStudyDetails = (data: Partial<StudentAssessmentInput['study']>) => {
    setStudentInput((prev) => ({
      ...prev,
      study: { ...prev.study, ...data },
    }));
  };

  const updateFundingDetails = (data: Partial<StudentAssessmentInput['funding']>) => {
    setStudentInput((prev) => ({
      ...prev,
      funding: { ...prev.funding, ...data },
    }));
  };

  const updateFinancialProfile = (data: Partial<StudentAssessmentInput['financial']>) => {
    setStudentInput((prev) => ({
      ...prev,
      financial: { ...prev.financial, ...data },
    }));
  };

  const updateCollateralDetails = (data: Partial<StudentAssessmentInput['collateral']>) => {
    setStudentInput((prev) => ({
      ...prev,
      collateral: { ...prev.collateral, ...data },
    }));
  };

  // Document Management
  const handleAddDocument = (doc: UploadedDocument) => {
    setStudentInput((prev) => ({
      ...prev,
      documents: [...prev.documents.filter((d) => d.category !== doc.category), doc],
    }));
  };

  const handleRemoveDocument = (docId: string) => {
    setStudentInput((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== docId),
    }));
  };

  const handleUpdateDocument = (updatedDoc: UploadedDocument) => {
    setStudentInput((prev) => ({
      ...prev,
      documents: prev.documents.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)),
    }));
  };

  const handleApplyExtractedValue = (category: DocumentCategory, fieldKey: string, value: any) => {
    setStudentInput((prev) => {
      const copy = { ...prev };
      if (fieldKey === 'caCertificateNetWorth') {
        copy.financial.caCertificateNetWorth = Number(value);
      } else if (fieldKey === 'coApplicantMonthlyIncome') {
        copy.financial.coApplicantIncome = Number(value);
        copy.financial.coApplicantIncomePeriod = 'monthly';
      } else if (fieldKey === 'savingsAllocated') {
        copy.funding.savingsAllocated = Number(value);
      }
      return copy;
    });
  };

  const summary = calculateFinancialSummary(studentInput);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        isSampleLoaded={isSampleLoaded}
      />

      <StepIndicator
        currentStep={currentStep}
        onStepClick={handleStepClick}
        maxStepReached={maxStepReached}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isSampleLoaded && (
          <SampleDataBanner onGoToAssessment={() => {
            setCurrentStep(6);
            setMaxStepReached(6);
          }} />
        )}

        {currentStep === 1 && (
          <StepStudy
            data={studentInput.study}
            onChange={updateStudyDetails}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 2 && (
          <StepFunding
            data={studentInput.funding}
            onChange={updateFundingDetails}
            onNext={handleNextStep}
            onBack={handleBackStep}
            totalStudyCost={summary.totalStudyCost}
          />
        )}

        {currentStep === 3 && (
          <StepFinancial
            data={studentInput.financial}
            onChange={updateFinancialProfile}
            onNext={handleNextStep}
            onBack={handleBackStep}
          />
        )}

        {currentStep === 4 && (
          <StepCollateral
            data={studentInput.collateral}
            onChange={updateCollateralDetails}
            onNext={handleNextStep}
            onBack={handleBackStep}
          />
        )}

        {currentStep === 5 && (
          <StepDocuments
            documents={studentInput.documents}
            onAddDocument={handleAddDocument}
            onRemoveDocument={handleRemoveDocument}
            onUpdateDocument={handleUpdateDocument}
            onApplyExtractedValue={handleApplyExtractedValue}
            onNext={handleNextStep}
            onBack={handleBackStep}
          />
        )}

        {currentStep === 6 && (
          <StepAssessment
            input={studentInput}
            onBack={() => setCurrentStep(1)}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            GradGuide Education Loan Assessment Tool • Decision-support product grounded in reference lender dataset.
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Note: This tool provides financial assessments and decision support. It does not guarantee loan approval or rejection by any lender.
          </p>
        </div>
      </footer>
    </div>
  );
}
