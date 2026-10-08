'use client';

import React from 'react';
import { CollateralDetails } from '../../types/assessment';
import { ShieldCheck, Home, AlertTriangle, Info, ArrowLeft, ArrowRight } from 'lucide-react';

interface StepCollateralProps {
  data: CollateralDetails;
  onChange: (data: Partial<CollateralDetails>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepCollateral: React.FC<StepCollateralProps> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const netCollateral = Math.max(0, (data.estimatedValue || 0) - (data.existingEncumbrances || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Collateral Assets</h2>
            <p className="text-xs text-slate-500">
              Capture collateral property or liquid assets, estimated value, existing secured debt, and location.
            </p>
          </div>
        </div>

        {/* Collateral Toggle */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-900 block">Do you have collateral asset to offer?</span>
              <span className="text-xs text-slate-500">
                Property (residential/commercial/plot) or liquid assets (FD/LIC). Collateral loans generally offer lower interest rates (e.g. 8.40% SBI collateral vs 9.40% non-collateral).
              </span>
            </div>
            <div className="flex items-center space-x-3 shrink-0 ml-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="hasCollateral"
                  checked={data.hasCollateral === true}
                  onChange={() => onChange({ hasCollateral: true })}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-1.5 text-xs font-semibold text-slate-800">Yes, Have Collateral</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="hasCollateral"
                  checked={data.hasCollateral === false}
                  onChange={() => onChange({ hasCollateral: false })}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-1.5 text-xs font-semibold text-slate-800">No Collateral</span>
              </label>
            </div>
          </div>
        </div>

        {data.hasCollateral && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Asset Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Collateral Asset Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={data.assetType || 'residential_property'}
                  onChange={(e) => onChange({ assetType: e.target.value as CollateralDetails['assetType'] })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="residential_property">Residential Property (House / Flat / Land)</option>
                  <option value="commercial_property">Commercial Property (Shop / Office)</option>
                  <option value="plot">Plot / Layout Land</option>
                  <option value="fixed_deposit">Fixed Deposit (FD)</option>
                  <option value="lic_policy">Surrender Value of LIC Policy</option>
                  <option value="gold">Gold / Other Liquid Security</option>
                </select>
              </div>

              {/* State Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property State Location (for specific document rules)
                </label>
                <select
                  value={data.propertyState || 'other'}
                  onChange={(e) => onChange({ propertyState: e.target.value as CollateralDetails['propertyState'] })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="other">General State / Other</option>
                  <option value="delhi">Delhi (Requires Conveyance Deed & DDA Allotment)</option>
                  <option value="maharashtra">Maharashtra (Requires Society NOC, Index II & Builder POA)</option>
                </select>
              </div>

              {/* Estimated Value */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Gross Market Value (INR) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={data.estimatedValue}
                  onChange={(e) => onChange({ estimatedValue: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g. 2500000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Existing Encumbrances */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Existing Secured Debt / Mortgage Encumbrances (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={data.existingEncumbrances}
                  onChange={(e) => onChange({ existingEncumbrances: parseFloat(e.target.value) || 0 })}
                  placeholder="Existing home loan balance on property"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Value Source Label */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Value Source Label <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="valueSource"
                      checked={data.valueSource === 'user_estimated'}
                      onChange={() => onChange({ valueSource: 'user_estimated' })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-1.5 text-xs text-slate-700 font-medium">User Estimated Value</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="valueSource"
                      checked={data.valueSource === 'bank_valuation'}
                      onChange={() => onChange({ valueSource: 'bank_valuation' })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-1.5 text-xs text-slate-700 font-medium">Empaneled Bank Valuation Report</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="valueSource"
                      checked={data.valueSource === 'ca_certified'}
                      onChange={() => onChange({ valueSource: 'ca_certified' })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-1.5 text-xs text-slate-700 font-medium">Government Registered Valuer Certificate</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Net Available Collateral Preview Card */}
            <div className="bg-indigo-900 text-white p-4 rounded-xl flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs font-medium text-indigo-200 uppercase tracking-wider block">
                  Net Available Collateral Value (Gross Value − Existing Encumbrance)
                </span>
                <span className="text-2xl font-bold tracking-tight">
                  ₹{netCollateral.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-indigo-300 ml-2">
                  ({data.valueSource === 'user_estimated' ? 'User Estimated' : 'Verified Valuation'})
                </span>
              </div>
            </div>

            {/* Source Grounding Warning */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 flex items-start space-x-3">
              <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block font-semibold mb-0.5">Source-Grounded Collateral Disclaimer:</strong>
                An asset having value does not guarantee lender acceptance. LTV (Loan-to-Value) ratios and legal search reports vary per bank policy. Exact borrowing capacity against collateral requires official bank valuation and title verification.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back: Financial Profile
        </button>

        <button
          type="submit"
          className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-md"
        >
          Next: Upload Documents
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </form>
  );
};
