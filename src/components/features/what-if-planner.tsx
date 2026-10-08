'use client';

import React, { useState } from 'react';
import { StudentAssessmentInput, FinancialSummaryResult } from '../../types/assessment';
import { Sliders, HelpCircle, RefreshCw, TrendingDown, ArrowUpRight } from 'lucide-react';

interface WhatIfPlannerProps {
  input: StudentAssessmentInput;
  baselineSummary: FinancialSummaryResult;
}

export const WhatIfPlanner: React.FC<WhatIfPlannerProps> = ({ input, baselineSummary }) => {
  const [tuitionAdjust, setTuitionAdjust] = useState<number>(0);
  const [livingAdjust, setLivingAdjust] = useState<number>(0);
  const [scholarshipAdjust, setScholarshipAdjust] = useState<number>(0);
  const [savingsAdjust, setSavingsAdjust] = useState<number>(0);

  // Compute Scenario Values
  const duration = Math.max(0.1, Number(input.study.durationYears) || 0);

  const revisedTuitionFull = input.study.tuitionPeriod === 'annual'
    ? (input.study.tuitionAmount + tuitionAdjust) * duration
    : input.study.tuitionAmount + tuitionAdjust;

  const revisedLivingFull = input.study.livingCostsPeriod === 'annual'
    ? (input.study.livingCostsAmount + livingAdjust) * duration
    : input.study.livingCostsAmount + livingAdjust;

  const revisedTotalStudyCost = revisedTuitionFull + revisedLivingFull + baselineSummary.totalAdditionalFullCourse;
  const revisedRemainingCost = Math.max(0, revisedTotalStudyCost - baselineSummary.feesAlreadyPaid);

  const revisedScholarships = Math.max(0, input.funding.scholarships + scholarshipAdjust);
  const revisedSavings = Math.max(0, input.funding.savingsAllocated + savingsAdjust);
  const revisedAvailableFunding = revisedSavings + revisedScholarships + input.funding.familyContribution;

  const revisedLoanRequirement = Math.max(0, revisedRemainingCost - revisedAvailableFunding);
  const loanDifference = revisedLoanRequirement - baselineSummary.estimatedLoanRequirement;

  const handleReset = () => {
    setTuitionAdjust(0);
    setLivingAdjust(0);
    setScholarshipAdjust(0);
    setSavingsAdjust(0);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900">Original Feature 1: What-if Funding Planner</h3>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                Interactive Scenario Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Instantly test cost and funding adjustments without modifying your baseline form inputs.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Reset Scenario
        </button>
      </div>

      {/* Feature Rationale Callout */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-6 text-xs text-slate-600">
        <strong className="text-slate-800">Problem Solved:</strong> Students frequently evaluate alternative funding conditions (e.g. prospective scholarships, currency shifts, family contributions) before committing to a loan route.
        <br />
        <strong className="text-slate-800">Why It Matters:</strong> Allows instant side-by-side gap comparisons without corrupting original saved assessment data.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sliders / Inputs */}
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Adjust Scenario Variables
          </h4>

          {/* Scholarship Delta */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Additional Scholarship Award</span>
              <span className="text-emerald-700 font-bold">+₹{scholarshipAdjust.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000000"
              step="25000"
              value={scholarshipAdjust}
              onChange={(e) => setScholarshipAdjust(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Savings Delta */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Additional Savings / Family Contribution</span>
              <span className="text-sky-700 font-bold">+₹{savingsAdjust.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000000"
              step="25000"
              value={savingsAdjust}
              onChange={(e) => setSavingsAdjust(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>

          {/* Tuition Delta */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Tuition Change per Year</span>
              <span className={tuitionAdjust > 0 ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                {tuitionAdjust >= 0 ? `+₹${tuitionAdjust.toLocaleString('en-IN')}` : `-₹${Math.abs(tuitionAdjust).toLocaleString('en-IN')}`}
              </span>
            </div>
            <input
              type="range"
              min="-300000"
              max="500000"
              step="25000"
              value={tuitionAdjust}
              onChange={(e) => setTuitionAdjust(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* Comparison Output Cards */}
        <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex justify-between">
              <span>Baseline vs Scenario Comparison</span>
              <span className="text-sky-400">Live Scenario</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-[11px] text-slate-400 block">Baseline Study Cost</span>
                <span className="text-sm font-bold text-white">₹{baselineSummary.totalStudyCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-[11px] text-slate-400 block">Scenario Study Cost</span>
                <span className="text-sm font-bold text-sky-300">₹{revisedTotalStudyCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-[11px] text-slate-400 block">Baseline Available Funding</span>
                <span className="text-sm font-bold text-emerald-400">₹{baselineSummary.availableFunding.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-[11px] text-slate-400 block">Scenario Available Funding</span>
                <span className="text-sm font-bold text-emerald-300">₹{revisedAvailableFunding.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Revised Loan Requirement</span>
              <span className="text-2xl font-bold text-amber-400">₹{revisedLoanRequirement.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Funding Gap Delta</span>
              <span className={`text-sm font-bold ${loanDifference < 0 ? 'text-emerald-400' : loanDifference > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                {loanDifference < 0 ? `Reduced by ₹${Math.abs(loanDifference).toLocaleString('en-IN')}` : loanDifference > 0 ? `Increased by ₹${loanDifference.toLocaleString('en-IN')}` : 'No Change'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
