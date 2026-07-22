import React, { useState } from 'react';
import { Reaction } from '../types';
import {
  X,
  Bookmark,
  CheckCircle2,
  Bot,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  Sparkles,
  Layers,
} from 'lucide-react';

interface MechanismViewerProps {
  reaction: Reaction;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isLearned: boolean;
  onToggleLearned: (id: string) => void;
  onOpenAITutor: (prompt: string) => void;
}

export const MechanismViewer: React.FC<MechanismViewerProps> = ({
  reaction,
  onClose,
  isBookmarked,
  onToggleBookmark,
  isLearned,
  onToggleLearned,
  onOpenAITutor,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const activeStep = reaction.mechanism[activeStepIndex] || reaction.mechanism[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 my-auto overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex items-start justify-between gap-4 sticky top-0 z-10 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {reaction.categoryLabel}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50 uppercase tracking-wider">
                {reaction.difficulty}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-3">
              <span>{reaction.name}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Mark Learned Button */}
            <button
              onClick={() => onToggleLearned(reaction.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isLearned
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isLearned ? 'Mastered' : 'Mark Mastered'}</span>
            </button>

            {/* Bookmark Button */}
            <button
              onClick={() => onToggleBookmark(reaction.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isBookmarked
                  ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Reaction Summary & Equation Banner */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <p className="text-sm text-slate-300 leading-relaxed">{reaction.shortOverview}</p>

            {/* Equation Box */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-sm text-cyan-200 overflow-x-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="font-bold text-slate-100">{reaction.equation.reactants}</span>
                <span className="text-amber-400 font-extrabold text-base">+</span>
                <span className="text-indigo-300 font-semibold px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/50">
                  {reaction.equation.reagentsConditions}
                </span>
                <span className="text-amber-400 font-extrabold text-base">→</span>
                <span className="text-emerald-300 font-bold">{reaction.equation.products}</span>
              </div>
            </div>
          </div>

          {/* Reagents, Substrates & Main Products Detailed Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Substrates / Reactants</span>
              <p className="text-slate-400 leading-normal">{reaction.reactantsDescription}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px]">Reagents & Conditions</span>
              <p className="text-slate-400 leading-normal">{reaction.reagentsConditionsDescription}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-300 uppercase tracking-wider text-[10px]">Main Product</span>
              <p className="text-slate-400 leading-normal">{reaction.mainProductDescription}</p>
            </div>
          </div>

          {/* Interactive Step-by-Step Mechanism Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Step-by-Step Electron Movement Mechanism</span>
              </h3>
              <span className="text-xs text-slate-400">
                Step {activeStepIndex + 1} of {reaction.mechanism.length}
              </span>
            </div>

            {/* Step Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {reaction.mechanism.map((m, idx) => (
                <button
                  key={m.stepNumber}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeStepIndex === idx
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-slate-100 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-900/80 flex items-center justify-center text-[10px]">
                    {m.stepNumber}
                  </span>
                  <span>Step {m.stepNumber}</span>
                </button>
              ))}
            </div>

            {/* Active Step Visual Card */}
            {activeStep && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-4 shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-cyan-400">
                      Step {activeStep.stepNumber} Action
                    </span>
                    <h4 className="text-base font-bold text-slate-100">{activeStep.title}</h4>
                  </div>
                  {activeStep.intermediateName && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                      {activeStep.intermediateName}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">{activeStep.description}</p>

                {/* Electron Movement & Curved Arrow Analysis */}
                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-cyan-300">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Curved Arrow Electron Movement:</span>
                  </div>
                  <p className="leading-relaxed pl-6 text-slate-300">{activeStep.electronMovement}</p>
                </div>

                {/* Why This Step Happens */}
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 text-xs space-y-1">
                  <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                    Chemical Rationale:
                  </span>
                  <p className="text-slate-300">{activeStep.whyThisStep}</p>
                </div>
              </div>
            )}
          </div>

          {/* Key Intermediates */}
          {reaction.keyIntermediates && reaction.keyIntermediates.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Key Reaction Intermediates</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {reaction.keyIntermediates.map((inter, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-lg bg-indigo-950/60 text-indigo-200 border border-indigo-800/50 font-mono"
                  >
                    {inter}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Exam Traps & Common Student Mistakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Important Notes */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Important Selectivity & Synthetic Notes</span>
              </h4>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                {reaction.importantNotes.map((note, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 space-y-2">
              <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Common Exam Traps & Mistakes</span>
              </h4>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                {reaction.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Real World Example */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between gap-3">
            <span className="font-bold text-slate-400 uppercase tracking-wider shrink-0">Concrete Example:</span>
            <span className="font-mono text-cyan-300 truncate">{reaction.exampleReaction}</span>
          </div>
        </div>

        {/* Modal Footer / AI Tutor Trigger */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4 sticky bottom-0 z-10 shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenAITutor(`Explain electron movement in ${reaction.name} in simple student-friendly language`);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Tutor About {reaction.name}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
