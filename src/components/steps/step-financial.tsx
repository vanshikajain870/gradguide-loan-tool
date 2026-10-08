'use client';

import React from 'react';
import { FinancialProfile, CoApplicantType, IncomePeriod } from '../../types/assessment';
import { LineChart, DollarSign, ShieldAlert, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

interface StepFinancialProps {
  data: FinancialProfile;
  onChange: (data: Partial<FinancialProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepFinancial: React.FC<StepFinancialProps> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const calculatedNetWorth = (data.totalAssetsValue || 0) - (data.totalLiabilitiesValue || 0);
  const caNetWorth = data.caCertificateNetWorth;
  const netWorthDiscrepancy = caNetWorth !== null && caNetWorth !== undefined
    ? Math.abs(calculatedNetWorth - caNetWorth)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Financial Profile</h2>
            <p className="text-xs text-slate-500">
              Capture applicant/co-applicant income, assets, liabilities, CIBIL score, and CA certificate net worth.
            </p>
          </div>
        </div>

        {/* Co-applicant & Income Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Income & Co-applicant Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Co-applicant Employment Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Co-Applicant Employment Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={data.coApplicantType}
                onChange={(e) => onChange({ coApplicantType: e.target.value as CoApplicantType })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-sky-500 focus:border-sky-500 outline-none bg-white"
              >
                <option value="salaried">Salaried Employee</option>
                <option value="self_employed">Self-Employed / Business Owner</option>
                <option value="none">No Co-applicant / Independent</option>
              </select>
            </div>

            {/* Co-applicant Income */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Co-Applicant Gross Income (INR)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  value={data.coApplicantIncome}
                  onChange={(e) => onChange({ coApplicantIncome: parseFloat(e.target.value) || 0 })}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-sky-500 focus:border-sky-500 outline-none"
                  placeholder="e.g. 75000"
                />
                <select
                  value={data.coApplicantIncomePeriod}
                  onChange={(e) => onChange({ coApplicantIncomePeriod: e.target.value as IncomePeriod })}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-sky-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>

            {/* Co-applicant CIBIL Score */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Co-Applicant CIBIL Score
              </label>
              <input
                type="number"
                min="300"
                max="900"
                value={data.coApplicantCibilScore ?? ''}
                onChange={(e) => onChange({ coApplicantCibilScore: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="e.g. 750 (Leave blank if unknown)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Source Thresholds: <strong>SBI: 750</strong>, <strong>BOB: 700</strong>, <strong>BOI: 670</strong>. (Credila/Auxilo CIBIL not specified in source).
              </p>
            </div>

            {/* Student Income */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Applicant Income (if applicable)
              </label>
              <input
                type="number"
                min="0"
                value={data.applicantIncome}
                onChange={(e) => onChange({ applicantIncome: parseFloat(e.target.value) || 0 })}
                placeholder="Monthly income prior to study"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Assets & Liabilities Section */}
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Assets, Liabilities & Net Worth</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Total Assets */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Financial Assets (INR) <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Real estate value, savings, FDs, mutual funds, investments.
              </p>
              <input
                type="number"
                min="0"
                required
                value={data.totalAssetsValue}
                onChange={(e) => onChange({ totalAssetsValue: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-sky-500 outline-none bg-white"
              />
            </div>

            {/* Total Liabilities */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Outstanding Liabilities (INR) <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Existing home loans, personal loans, car loans, credit cards.
              </p>
              <input
                type="number"
                min="0"
                required
                value={data.totalLiabilitiesValue}
                onChange={(e) => onChange({ totalLiabilitiesValue: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-sky-500 outline-none bg-white"
              />
            </div>

            {/* CA Certificate Net Worth */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CA Certificate Net Worth (INR)
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Net worth figure reported in CA Net Worth Certificate (if available).
              </p>
              <input
                type="number"
                min="0"
                value={data.caCertificateNetWorth ?? ''}
                onChange={(e) => onChange({ caCertificateNetWorth: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="e.g. 3000000"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-sky-500 outline-none bg-white"
              />
            </div>
          </div>

          {/* Calculated Net Worth Preview Card */}
          <div className="mt-4 bg-purple-900 text-white p-4 rounded-xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-xs font-medium text-purple-200 uppercase tracking-wider block">
                Calculated Net Worth (Assets − Liabilities)
              </span>
              <span className="text-2xl font-bold tracking-tight">
                ₹{calculatedNetWorth.toLocaleString('en-IN')}
              </span>
            </div>
            {caNetWorth !== null && (
              <div className="text-right">
                <span className="text-xs text-purple-200 block">CA Certificate Net Worth</span>
                <span className="text-lg font-semibold text-purple-100">
                  ₹{caNetWorth.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* Discrepancy Alert */}
          {netWorthDiscrepancy !== null && netWorthDiscrepancy > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <span className="font-bold block text-sm mb-0.5">CA Net Worth Discrepancy Flagged</span>
                Calculated net worth (₹{calculatedNetWorth.toLocaleString('en-IN')}) differs from CA Certificate reported net worth (₹{caNetWorth?.toLocaleString('en-IN')}) by ₹{netWorthDiscrepancy.toLocaleString('en-IN')}. Both figures will be reported separately without silently overwriting either value.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back: Funding
        </button>

        <button
          type="submit"
          className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-md"
        >
          Next: Collateral Details
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </form>
  );
};
