'use client';

import React from 'react';
import { Info, Sparkles, ArrowRight } from 'lucide-react';

interface SampleDataBannerProps {
  onGoToAssessment: () => void;
}

export const SampleDataBanner: React.FC<SampleDataBannerProps> = ({ onGoToAssessment }) => {
  return (
    <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 mb-6 shadow-md border border-sky-800/50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 mt-0.5 sm:mt-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-sky-200">Synthetic Sample Student Profile Loaded</span>
              <span className="bg-sky-500/30 text-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-400/30">
                Regression Benchmark
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Loaded: <strong>Columbia University (MS CS, 2 Years)</strong> • Total Study Cost: <strong>₹30,00,000</strong> • Fees Paid: <strong>₹2,00,000</strong> • Available Funding: <strong>₹8,00,000</strong> • Estimated Loan Need: <strong>₹20,00,000</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={onGoToAssessment}
          className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-white text-slate-900 hover:bg-sky-50 transition-all shadow-sm shrink-0"
        >
          View Full Assessment Results
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </button>
      </div>
    </div>
  );
};
