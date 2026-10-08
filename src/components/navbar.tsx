'use client';

import React from 'react';
import { GraduationCap, RotateCcw, Database, PlayCircle } from 'lucide-react';

interface NavbarProps {
  onLoadSample: () => void;
  onReset: () => void;
  isSampleLoaded: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoadSample, onReset, isSampleLoaded }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">GradGuide</span>
              <span className="text-xs bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full border border-sky-200">
                Assessment Tool
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Source-Grounded Education Loan & Financial Decision Support
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onLoadSample}
            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              isSampleLoaded
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:from-sky-700 hover:to-indigo-700'
            }`}
          >
            <PlayCircle className="w-4 h-4 mr-1.5" />
            {isSampleLoaded ? 'Sample Data Active' : 'Load Sample Data'}
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
            title="Reset form to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </button>

          <div className="hidden md:flex items-center text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
            <Database className="w-3.5 h-3.5 text-sky-600 mr-1.5" />
            <span>Lender DB: 5 Source Banks</span>
          </div>
        </div>
      </div>
    </header>
  );
};
