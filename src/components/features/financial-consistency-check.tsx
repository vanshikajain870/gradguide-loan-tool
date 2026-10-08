'use client';

import React from 'react';
import { StudentAssessmentInput, FinancialConsistencyFlag } from '../../types/assessment';
import { runFinancialConsistencyChecks } from '../../lib/consistencyCheck';
import { AlertTriangle, CheckCircle2, Info, HelpCircle, ShieldAlert } from 'lucide-react';

interface FinancialConsistencyCheckProps {
  input: StudentAssessmentInput;
}

export const FinancialConsistencyCheck: React.FC<FinancialConsistencyCheckProps> = ({ input }) => {
  const flags: FinancialConsistencyFlag[] = runFinancialConsistencyChecks(input);

  const errorCount = flags.filter((f) => f.severity === 'error').length;
  const warningCount = flags.filter((f) => f.severity === 'warning').length;
  const infoCount = flags.filter((f) => f.severity === 'info').length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900">Original Feature 2: Financial Consistency Check</h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                Automated Audit Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Scans financial inputs for double counting, period mismatches, and CA certificate discrepancies.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {errorCount > 0 && (
            <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-full border border-rose-200">
              {errorCount} Flag(s)
            </span>
          )}
          {warningCount > 0 && (
            <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-200">
              {warningCount} Warning(s)
            </span>
          )}
          {infoCount > 0 && (
            <span className="bg-sky-100 text-sky-800 font-bold px-2.5 py-1 rounded-full border border-sky-200">
              {infoCount} Audit Note(s)
            </span>
          )}
        </div>
      </div>

      {/* Rationale Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-6 text-xs text-slate-600">
        <strong className="text-slate-800">Problem Solved:</strong> Educational loan applications often get delayed or rejected due to inconsistent figures (e.g. scholarship double-counting or annual/monthly salary mismatches).
        <br />
        <strong className="text-slate-800">Why It Matters:</strong> Frames audit findings as objective review questions with actionable corrective guidance without inventing facts.
      </div>

      {flags.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3 text-emerald-900 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong className="font-bold block text-sm">Clean Financial Data Audit Passed</strong>
            No double-counting, period mismatches, or CA net worth discrepancies detected across your entered financial profile.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className={`rounded-xl p-4 border text-xs shadow-2xs ${
                flag.severity === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : flag.severity === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-sky-50 border-sky-200 text-sky-900'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {flag.severity === 'error' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : flag.severity === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 text-sky-600 shrink-0" />
                  )}
                  <h4 className="font-bold text-sm">{flag.title}</h4>
                </div>
                <span className="text-[10px] font-mono uppercase font-semibold opacity-75">
                  [{flag.category}]
                </span>
              </div>

              <p className="mb-2 text-slate-700 leading-relaxed">{flag.description}</p>

              <div className="bg-white/80 rounded-lg p-3 border border-slate-200/80 space-y-1.5 mt-2">
                <div className="flex items-start space-x-1.5 font-semibold text-slate-900">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Review Question: {flag.reviewQuestion}</span>
                </div>
                <div className="text-[11px] text-slate-600 pl-5">
                  <strong>Corrective Guidance:</strong> {flag.correctiveGuidance}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
