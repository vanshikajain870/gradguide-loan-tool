'use client';

import React from 'react';
import { BookOpen, Wallet, LineChart, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  maxStepReached: number;
}

const STEPS = [
  { id: 1, name: 'Study details', icon: BookOpen },
  { id: 2, name: 'Funding', icon: Wallet },
  { id: 3, name: 'Financial profile', icon: LineChart },
  { id: 4, name: 'Collateral', icon: ShieldCheck },
  { id: 5, name: 'Documents', icon: FileText },
  { id: 6, name: 'Assessment', icon: CheckCircle2 },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
  maxStepReached,
}) => {
  return (
    <div className="w-full bg-white border-b border-slate-200 py-3 px-4 shadow-xs">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center justify-between overflow-x-auto no-scrollbar space-x-2 sm:space-x-4">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isCurrent = currentStep === step.id;
              const isCompleted = step.id < currentStep || step.id <= maxStepReached;
              const isClickable = step.id <= Math.max(maxStepReached, currentStep);

              return (
                <li key={step.id} className="flex-1 min-w-[130px]">
                  <button
                    onClick={() => isClickable && onStepClick(step.id)}
                    disabled={!isClickable}
                    className={`w-full group flex items-center p-2 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? 'border-sky-500 bg-sky-50/80 shadow-xs'
                        : isCompleted
                        ? 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                        : 'border-slate-100 bg-white opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs mr-2.5 shrink-0 transition-colors ${
                        isCurrent
                          ? 'bg-sky-600 text-white'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isCompleted && !isCurrent ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>

                    <div className="truncate">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 block">
                        Step {step.id}
                      </span>
                      <span
                        className={`text-xs font-semibold block truncate ${
                          isCurrent ? 'text-sky-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};
