'use client';

import React from 'react';
import { FundingDetails } from '../../types/assessment';
import { Wallet, Info, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';

interface StepFundingProps {
  data: FundingDetails;
  onChange: (data: Partial<FundingDetails>) => void;
  onNext: () => void;
  onBack: () => void;
  totalStudyCost: number;
}

export const StepFunding: React.FC<StepFundingProps> = ({
  data,
  onChange,
  onNext,
  onBack,
  totalStudyCost,
}) => {
  const feesPaid = Math.max(0, data.feesAlreadyPaid || 0);
  const remainingCost = Math.max(0, totalStudyCost - feesPaid);
  const availableFunding = (data.savingsAllocated || 0) + (data.scholarships || 0) + (data.familyContribution || 0);
  const loanReq = Math.max(0, remainingCost - availableFunding);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Funding & Self-Contribution</h2>
            <p className="text-xs text-slate-500">
              Capture savings, scholarships, fees already paid, and family contributions.
            </p>
          </div>
        </div>

        {/* Anti-double counting guideline banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <p className="font-bold">Important Rules to Prevent Double Counting:</p>
              <ul className="list-disc list-inside space-y-1 text-amber-800">
                <li>
                  <strong>Fees Already Paid:</strong> If a scholarship or family savings were already used to pay initial fees/deposit, include that amount ONLY in "Fees Already Paid" and DO NOT count it again under scholarships or savings.
                </li>
                <li>
                  <strong>Education-Allocated Savings:</strong> Enter liquid funds explicitly set aside for education expenses.
                </li>
                <li>
                  <strong>Scholarships:</strong> Include only unapplied, future scholarship funds.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Fees Already Paid */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              1. Fees Already Paid to University (INR)
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Seat booking fee, tuition deposit, or initial semester fees paid to date.
            </p>
            <input
              type="number"
              min="0"
              value={data.feesAlreadyPaid}
              onChange={(e) => onChange({ feesAlreadyPaid: parseFloat(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-sky-500 focus:border-sky-500 outline-none bg-white"
            />
          </div>

          {/* Education Savings */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              2. Education-Allocated Personal Savings (INR)
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Liquid bank deposits, FDs earmarked for education (excluding fees paid).
            </p>
            <input
              type="number"
              min="0"
              value={data.savingsAllocated}
              onChange={(e) => onChange({ savingsAllocated: parseFloat(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-sky-500 focus:border-sky-500 outline-none bg-white"
            />
          </div>

          {/* Scholarships */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              3. Applicable / Awarded Scholarships (INR)
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Institutional tuition waivers, external grants not yet disbursed.
            </p>
            <input
              type="number"
              min="0"
              value={data.scholarships}
              onChange={(e) => onChange({ scholarships: parseFloat(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-sky-500 focus:border-sky-500 outline-none bg-white"
            />
          </div>

          {/* Family Contribution */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              4. Additional Family / Co-applicant Contribution (INR)
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Additional direct financial support committed by family members.
            </p>
            <input
              type="number"
              min="0"
              value={data.familyContribution}
              onChange={(e) => onChange({ familyContribution: parseFloat(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-sky-500 focus:border-sky-500 outline-none bg-white"
            />
          </div>
        </div>

        {/* Live Funding Summary Box */}
        <div className="mt-6 bg-slate-900 text-white rounded-xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[11px] text-slate-400 block uppercase">Total Study Cost</span>
            <span className="text-lg font-bold text-white">₹{totalStudyCost.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block uppercase">Remaining Cost</span>
            <span className="text-lg font-bold text-sky-400">₹{remainingCost.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block uppercase">Available Funding</span>
            <span className="text-lg font-bold text-emerald-400">₹{availableFunding.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block uppercase">Estimated Loan Requirement</span>
            <span className="text-lg font-bold text-amber-400">₹{loanReq.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back: Study Details
        </button>

        <button
          type="submit"
          className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-md"
        >
          Next: Financial Profile
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </form>
  );
};
