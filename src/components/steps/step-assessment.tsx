'use client';

import React, { useState } from 'react';
import { StudentAssessmentInput } from '../../types/assessment';
import { calculateFinancialSummary } from '../../lib/calculations';
import { evaluateAllLenders } from '../../lib/ruleEngine';
import { WhatIfPlanner } from '../features/what-if-planner';
import { FinancialConsistencyCheck } from '../features/financial-consistency-check';
import { ReadinessChecklist } from '../features/readiness-checklist';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
  Printer,
  ArrowLeft,
  Banknote,
  ShieldCheck,
  Building,
  GraduationCap,
  Sparkles,
  Info,
} from 'lucide-react';

interface StepAssessmentProps {
  input: StudentAssessmentInput;
  onBack: () => void;
}

export const StepAssessment: React.FC<StepAssessmentProps> = ({ input, onBack }) => {
  const [activeRouteTab, setActiveRouteTab] = useState<'collateral' | 'non_collateral'>('collateral');

  const summary = calculateFinancialSummary(input);
  const { collateralResults, nonCollateralResults } = evaluateAllLenders(input);

  const displayedResults = activeRouteTab === 'collateral' ? collateralResults : nonCollateralResults;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Printable Assessment Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-sky-500/20 text-sky-300 font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border border-sky-400/30">
                Official Assessment Report
              </span>
              <span className="text-slate-400 text-xs">
                Generated: {new Date().toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Education Loan Financial Assessment
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              {input.study.university} • {input.study.course} ({input.study.country})
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all shadow-sm"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Print / Save Report PDF
            </button>
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Edit Inputs
            </button>
          </div>
        </div>

        {/* Core Financial Metrics Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Study Cost</span>
            <span className="text-base font-bold text-white">₹{summary.totalStudyCost.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fees Already Paid</span>
            <span className="text-base font-bold text-slate-300">₹{summary.feesAlreadyPaid.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Remaining Cost</span>
            <span className="text-base font-bold text-sky-400">₹{summary.remainingStudyCost.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Available Funding</span>
            <span className="text-base font-bold text-emerald-400">₹{summary.availableFunding.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Estimated Loan Need</span>
            <span className="text-lg font-extrabold text-amber-400">₹{summary.estimatedLoanRequirement.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Calculated Net Worth</span>
            <span className="text-base font-bold text-purple-300">₹{summary.calculatedNetWorth.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* THREE ORIGINAL FEATURES INTEGRATION */}
      <div className="space-y-8">
        {/* Feature 1: What-if Funding Planner */}
        <WhatIfPlanner input={input} baselineSummary={summary} />

        {/* Feature 2: Financial Consistency Check */}
        <FinancialConsistencyCheck input={input} />

        {/* Feature 3: Lender-Specific Application Readiness Checklist */}
        <ReadinessChecklist input={input} />
      </div>

      {/* LENDER ASSESSMENT MATRIX SECTION */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Source-Grounded Lender Evaluation Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Evaluates BOI, BOB, SBI, Credila, and Auxilo against verified criteria from the assignment dataset.
            </p>
          </div>

          {/* Collateral vs Non-Collateral Route Tabs */}
          <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 border border-slate-200 shrink-0">
            <button
              onClick={() => setActiveRouteTab('collateral')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeRouteTab === 'collateral'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Collateral Loan Schemes
            </button>
            <button
              onClick={() => setActiveRouteTab('non_collateral')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeRouteTab === 'non_collateral'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Non-Collateral Loan Schemes
            </button>
          </div>
        </div>

        {/* Lender Cards Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayedResults.map((result) => {
            const isEligible = result.overallEligibility === 'likely_eligible';
            const isIneligible = result.overallEligibility === 'ineligible';

            return (
              <div
                key={result.lenderId}
                className={`rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                  isIneligible
                    ? 'border-rose-200 bg-rose-50/30'
                    : isEligible
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4 pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-base text-slate-900">{result.lenderName}</span>
                        <span className="text-xs text-slate-500 font-medium">({result.loanType === 'collateral' ? 'Collateral Route' : 'Non-collateral Route'})</span>
                      </div>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-800">
                          Interest Rate: <span className="text-sky-700">{result.indicativeInterestRate}</span>
                        </span>
                      </div>
                      {result.rateNotes && (
                        <p className="text-[11px] text-slate-500 mt-0.5 italic">{result.rateNotes}</p>
                      )}
                    </div>

                    {/* Eligibility Badge */}
                    <div className="shrink-0">
                      {isEligible && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Likely Eligible
                        </span>
                      )}
                      {isIneligible && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Ineligible
                        </span>
                      )}
                      {!isEligible && !isIneligible && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertCircle className="w-3.5 h-3.5 mr-1" />
                          Requires Confirmation
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Criterion-Level Evaluations */}
                  <div className="space-y-3">
                    {/* CIBIL Criterion */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-800">Minimum CIBIL Score</span>
                        <CriterionBadge status={result.cibilStatus.status} />
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{result.cibilStatus.reason}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">Source: {result.cibilStatus.sourceRef}</span>
                    </div>

                    {/* University Ranking Criterion */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-800">University Ranking Requirement</span>
                        <CriterionBadge status={result.universityRankingStatus.status} />
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{result.universityRankingStatus.reason}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">Source: {result.universityRankingStatus.sourceRef}</span>
                    </div>

                    {/* Collateral Criterion */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-800">Collateral Requirement</span>
                        <CriterionBadge status={result.collateralStatus.status} />
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{result.collateralStatus.reason}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">Source: {result.collateralStatus.sourceRef}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Disclaimer */}
                <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-400">
                  Decision support estimate. Actual loan sanction is subject to final bank credit committee appraisal.
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CriterionBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'meets') {
    return (
      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
        <CheckCircle2 className="w-3 h-3 mr-1" /> Meets Criterion
      </span>
    );
  }
  if (status === 'does_not_meet') {
    return (
      <span className="inline-flex items-center text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
        <XCircle className="w-3 h-3 mr-1" /> Does Not Meet
      </span>
    );
  }
  if (status === 'unknown') {
    return (
      <span className="inline-flex items-center text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">
        <HelpCircle className="w-3 h-3 mr-1" /> Missing Input
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
      <AlertCircle className="w-3 h-3 mr-1" /> Requires Confirmation
    </span>
  );
};
