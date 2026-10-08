'use client';

import React, { useState } from 'react';
import { StudentAssessmentInput } from '../../types/assessment';
import { generateLenderReadinessChecklist } from '../../lib/readinessChecklist';
import { LENDERS_DATABASE } from '../../data/lenderDatabase';
import { ClipboardCheck, CheckCircle2, AlertCircle, FileText, Info, ArrowUpRight } from 'lucide-react';

interface ReadinessChecklistProps {
  input: StudentAssessmentInput;
}

export const ReadinessChecklist: React.FC<ReadinessChecklistProps> = ({ input }) => {
  const [selectedLenderId, setSelectedLenderId] = useState<string>('sbi');
  const [selectedLoanType, setSelectedLoanType] = useState<'collateral' | 'non_collateral'>('collateral');

  const selectedLender = LENDERS_DATABASE.find((l) => l.id === selectedLenderId) || LENDERS_DATABASE[0];
  const checklist = generateLenderReadinessChecklist(selectedLender, selectedLoanType, input);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900">
                Original Feature 3: Lender-Specific Application Readiness Checklist
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Dynamic Checklist Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Check exact document readiness for specific lenders and loan routes grounded in assignment source data.
            </p>
          </div>
        </div>
      </div>

      {/* Rationale Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-6 text-xs text-slate-600">
        <strong className="text-slate-800">Problem Solved:</strong> Document requirements differ significantly between collateral and non-collateral loans (e.g. EC 30 years for collateral, state-specific Delhi/Maharashtra deeds, or Form 16 for salaried co-applicants).
        <br />
        <strong className="text-slate-800">Why It Matters:</strong> Clearly distinguishes uploaded document completeness from bank authentication or loan approval.
      </div>

      {/* Lender & Route Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Target Lender</label>
          <select
            value={selectedLenderId}
            onChange={(e) => setSelectedLenderId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-emerald-500 bg-white"
          >
            {LENDERS_DATABASE.map((lender) => (
              <option key={lender.id} value={lender.id}>
                {lender.fullName} ({lender.name})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Loan Scheme Route</label>
          <select
            value={selectedLoanType}
            onChange={(e) => setSelectedLoanType(e.target.value as 'collateral' | 'non_collateral')}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-emerald-500 bg-white"
          >
            <option value="collateral">Collateral Loan Scheme</option>
            <option value="non_collateral">Non-Collateral Loan Scheme</option>
          </select>
        </div>
      </div>

      {/* Readiness Score Summary Card */}
      <div className="bg-slate-900 text-white rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
            {checklist.lenderName} ({selectedLoanType === 'collateral' ? 'Collateral Route' : 'Non-Collateral Route'})
          </span>
          <h4 className="text-xl font-bold text-white mt-0.5">
            Application Document Readiness: {checklist.readyScorePercentage}%
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            {checklist.uploadedCount} of {checklist.totalRequired} required category document(s) uploaded.
          </p>
        </div>

        <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 flex items-center justify-center bg-slate-800 shrink-0 self-center">
          <span className="text-2xl font-bold text-emerald-400">{checklist.readyScorePercentage}%</span>
        </div>
      </div>

      {/* Missing Documents Breakdown */}
      {checklist.missingCategories.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1 text-rose-600" />
            Missing Document Categories ({checklist.missingCategories.length})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {checklist.missingCategories.map((item, idx) => (
              <div
                key={idx}
                className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 text-xs flex items-center justify-between text-rose-900"
              >
                <div className="flex items-center space-x-2 truncate">
                  <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-semibold truncate">{item.label}</span>
                </div>
                <span className="text-[10px] bg-rose-200 text-rose-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                  Required
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3 text-emerald-900 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong className="font-bold text-sm block">Document Checklist 100% Complete!</strong>
            All required document categories for {checklist.lenderName} ({selectedLoanType}) have been uploaded into the repository.
          </div>
        </div>
      )}

      {/* Explicit Disclaimer */}
      <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-start space-x-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>{checklist.disclaimer}</span>
      </div>
    </div>
  );
};
