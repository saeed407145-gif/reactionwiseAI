import React from 'react';
import { Reaction } from '../types';
import { Bookmark, CheckCircle2, ArrowRight, Zap, ShieldAlert, Sparkles } from 'lucide-react';

interface ReactionCardProps {
  reaction: Reaction;
  onSelect: (reaction: Reaction) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  isLearned: boolean;
  onToggleLearned: (id: string, e: React.MouseEvent) => void;
}

export const ReactionCard: React.FC<ReactionCardProps> = ({
  reaction,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  isLearned,
  onToggleLearned,
}) => {
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">Beginner</span>;
      case 'intermediate':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">Intermediate</span>;
      case 'advanced':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/50">Advanced</span>;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onSelect(reaction)}
      className="group relative bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-lg hover:shadow-cyan-500/10 overflow-hidden"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-500 opacity-60 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header Badges & Actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {reaction.categoryLabel}
            </span>
            {getDifficultyBadge(reaction.difficulty)}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Mark as Learned */}
            <button
              onClick={(e) => onToggleLearned(reaction.id, e)}
              className={`p-1.5 rounded-lg transition-colors ${
                isLearned
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                  : 'text-slate-500 hover:text-emerald-400 hover:bg-slate-800'
              }`}
              title={isLearned ? 'Marked as Mastered' : 'Mark as Mastered'}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>

            {/* Bookmark */}
            <button
              onClick={(e) => onToggleBookmark(reaction.id, e)}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                  : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Reaction'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Reaction Name */}
        <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mb-2 line-clamp-1">
          {reaction.name}
        </h3>

        {/* Chemical Equation Box */}
        <div className="mb-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs text-cyan-200/90 overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span>{reaction.equation.reactants}</span>
            <span className="text-amber-400 font-bold">→</span>
            <span className="text-slate-400 text-[11px] font-sans px-1 py-0.5 rounded bg-slate-800/60">
              {reaction.equation.reagentsConditions}
            </span>
            <span className="text-amber-400 font-bold">→</span>
            <span className="text-emerald-300 font-semibold">{reaction.equation.products}</span>
          </div>
        </div>

        {/* Short Overview */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {reaction.shortOverview}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-500 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>{reaction.mechanism.length} Step Mechanism</span>
        </span>

        <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>Explore Mechanism</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
