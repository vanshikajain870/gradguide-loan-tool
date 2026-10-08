'use client';

import React from 'react';
import { StudyDetails } from '../../types/assessment';
import { BookOpen, Globe, Landmark, Award, Clock, DollarSign, Info, ArrowRight } from 'lucide-react';

interface StepStudyProps {
  data: StudyDetails;
  onChange: (data: Partial<StudyDetails>) => void;
  onNext: () => void;
}

export const StepStudy: React.FC<StepStudyProps> = ({ data, onChange, onNext }) => {
  const duration = Math.max(0.1, Number(data.durationYears) || 0);

  const fullTuition = data.tuitionPeriod === 'annual' ? data.tuitionAmount * duration : data.tuitionAmount;
  const fullLiving = data.livingCostsPeriod === 'annual' ? data.livingCostsAmount * duration : data.livingCostsAmount;
  const fullAdditional = data.additionalExpensesPeriod === 'annual' ? data.additionalExpensesAmount * duration : data.additionalExpensesAmount;
  const totalCost = fullTuition + fullLiving + fullAdditional;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Study Details</h2>
            <p className="text-xs text-slate-500">
              Capture country, university, course, duration, tuition, and living costs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Country */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
              <Globe className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Target Destination Country <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={data.country}
              onChange={(e) => onChange({ country: e.target.value })}
              placeholder="e.g. United States, UK, Canada, Germany"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            />
          </div>

          {/* University */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
              <Landmark className="w-3.5 h-3.5 mr-1 text-slate-400" />
              University / Institution Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={data.university}
              onChange={(e) => onChange({ university: e.target.value })}
              placeholder="e.g. Columbia University"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            />
          </div>

          {/* Course Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Course / Program Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={data.course}
              onChange={(e) => onChange({ course: e.target.value })}
              placeholder="e.g. MS in Computer Science"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Course Duration (Years) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="6"
              required
              value={data.durationYears}
              onChange={(e) => onChange({ durationYears: parseFloat(e.target.value) || 1 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            />
          </div>

          {/* Top 100 University Flag */}
          <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-800 flex items-center">
                  <Award className="w-4 h-4 text-amber-500 mr-1.5" />
                  Is this University ranked in the Global Top 100?
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Source Rule Note: <strong>State Bank of India (SBI)</strong> and <strong>Bank of Baroda (BOB)</strong> require Top 100 university ranking for non-collateral loan schemes (8.45% BOB / 9.40% SBI).
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0 ml-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="top100"
                    checked={data.isUniversityTop100 === true}
                    onChange={() => onChange({ isUniversityTop100: true })}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                  <span className="ml-1.5 text-xs font-medium text-slate-700">Yes (Top 100)</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="top100"
                    checked={data.isUniversityTop100 === false}
                    onChange={() => onChange({ isUniversityTop100: false })}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                  <span className="ml-1.5 text-xs font-medium text-slate-700">No</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="top100"
                    checked={data.isUniversityTop100 === 'unknown'}
                    onChange={() => onChange({ isUniversityTop100: 'unknown' })}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                  <span className="ml-1.5 text-xs font-medium text-slate-700">Unconfirmed</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
            <DollarSign className="w-4 h-4 mr-1.5 text-emerald-600" />
            Study Expenses Breakdown (Currency: {data.currency})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Tuition */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tuition Expenses <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={data.tuitionAmount}
                onChange={(e) => onChange({ tuitionAmount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-sky-500 focus:border-sky-500 outline-none mb-2"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Period:</span>
                <select
                  value={data.tuitionPeriod}
                  onChange={(e) => onChange({ tuitionPeriod: e.target.value as 'annual' | 'full_course' })}
                  className="px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-medium focus:ring-sky-500"
                >
                  <option value="annual">Per Year (Annual)</option>
                  <option value="full_course">Full Course Total</option>
                </select>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600 font-medium">
                Full course: ₹{fullTuition.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Living Expenses */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Living Expenses <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={data.livingCostsAmount}
                onChange={(e) => onChange({ livingCostsAmount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-sky-500 focus:border-sky-500 outline-none mb-2"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Period:</span>
                <select
                  value={data.livingCostsPeriod}
                  onChange={(e) => onChange({ livingCostsPeriod: e.target.value as 'annual' | 'full_course' })}
                  className="px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-medium focus:ring-sky-500"
                >
                  <option value="annual">Per Year (Annual)</option>
                  <option value="full_course">Full Course Total</option>
                </select>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600 font-medium">
                Full course: ₹{fullLiving.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Additional Expenses */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Additional / Travel / Health Insurance
              </label>
              <input
                type="number"
                min="0"
                value={data.additionalExpensesAmount}
                onChange={(e) => onChange({ additionalExpensesAmount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-sky-500 focus:border-sky-500 outline-none mb-2"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Period:</span>
                <select
                  value={data.additionalExpensesPeriod}
                  onChange={(e) => onChange({ additionalExpensesPeriod: e.target.value as 'annual' | 'full_course' })}
                  className="px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-medium focus:ring-sky-500"
                >
                  <option value="annual">Per Year (Annual)</option>
                  <option value="full_course">Full Course Total</option>
                </select>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600 font-medium">
                Full course: ₹{fullAdditional.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Live Total Cost Banner */}
          <div className="mt-6 bg-sky-900 text-white p-4 rounded-xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-xs font-medium text-sky-200 block uppercase tracking-wider">
                Calculated Full-Course Total Study Cost
              </span>
              <span className="text-2xl font-bold tracking-tight">
                ₹{totalCost.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right text-xs text-sky-200">
              Duration: {duration} Year(s)
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-md"
        >
          Next: Funding Breakdown
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </form>
  );
};
