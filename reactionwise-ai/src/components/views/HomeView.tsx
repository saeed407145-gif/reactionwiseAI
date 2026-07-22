import React from 'react';
import { CATEGORIES } from '../../data/categories';
import { ALL_REACTIONS } from '../../data/reactions';
import { Reaction } from '../../types';
import { ReactionCard } from '../ReactionCard';
import { Atom, BookOpen, Bot, Award, Bookmark, Search, Sparkles, Zap, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  setSelectedCategory: (cat: string) => void;
  onSelectReaction: (reaction: Reaction) => void;
  featuredReaction: Reaction;
  bookmarks: string[];
  learnedReactions: string[];
  recentReactions: Reaction[];
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onToggleLearned: (id: string, e: React.MouseEvent) => void;
  onOpenAITutorPrompt: (prompt: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  setSelectedCategory,
  onSelectReaction,
  featuredReaction,
  bookmarks,
  learnedReactions,
  recentReactions,
  onToggleBookmark,
  onToggleLearned,
  onOpenAITutorPrompt,
}) => {
  const samplePrompts = [
    'Explain electron movement in Wittig reaction',
    'How to distinguish S_N1 vs S_N2?',
    'Predict product of enone + NaBH₄ vs Luche',
    'What is Walden inversion?',
    'Why is LDA non-nucleophilic?',
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 sm:p-10 overflow-hidden shadow-2xl">
        {/* Glow & Grid Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>100% Offline Organic Chemistry Reference & Mechanism Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Master Organic Chemistry <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-amber-400 bg-clip-text text-transparent">
              Named Reactions & Mechanisms
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore <strong className="text-cyan-300">{ALL_REACTIONS.length}+ built-in named organic reactions</strong>. Study step-by-step curved arrow electron pushing, key intermediates, synthetic notes, common exam traps, and rule-based AI mechanism guidance.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('library')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore 100+ Reactions</span>
            </button>

            <button
              onClick={() => setActiveTab('periodic-table')}
              className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-bold text-sm border border-cyan-500/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>3D Periodic Table</span>
            </button>

            <button
              onClick={() => setActiveTab('basics')}
              className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Chemistry Fundamentals</span>
            </button>

            <button
              onClick={() => setActiveTab('tutor')}
              className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700 transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI Tutor & Predictor</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className="px-5 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-sm border border-amber-500/40 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Quiz Mode</span>
            </button>
          </div>
        </div>

        {/* Floating Quick Stats */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Built-in Reactions</span>
            <p className="text-xl font-bold text-cyan-400">{ALL_REACTIONS.length}+</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Categories</span>
            <p className="text-xl font-bold text-indigo-300">{CATEGORIES.length}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Your Mastered</span>
            <p className="text-xl font-bold text-emerald-400">{learnedReactions.length}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Bookmarked</span>
            <p className="text-xl font-bold text-amber-400">{bookmarks.length}</p>
          </div>
        </div>
      </section>

      {/* Featured Reaction of the Day */}
      {featuredReaction && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-slate-100">Featured Reaction of the Day</h2>
            </div>
            <span className="text-xs text-amber-400/90 font-medium">Updated Daily</span>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                  {featuredReaction.categoryLabel}
                </span>
                <span className="text-xs font-bold text-cyan-400 uppercase">{featuredReaction.difficulty}</span>
              </div>

              <h3 className="text-xl font-bold text-slate-100">{featuredReaction.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{featuredReaction.shortOverview}</p>

              <div className="pt-2 font-mono text-xs text-cyan-200">
                <span>{featuredReaction.equation.reactants}</span>
                <span className="text-amber-400 mx-1">→</span>
                <span className="text-emerald-300">{featuredReaction.equation.products}</span>
              </div>
            </div>

            <button
              onClick={() => onSelectReaction(featuredReaction)}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <span>Study Mechanism</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Category Visual Grids */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">Explore Reaction Categories</h2>
          </div>
          <button
            onClick={() => setActiveTab('library')}
            className="text-xs text-cyan-400 hover:underline font-medium"
          >
            View All Categories →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const count = ALL_REACTIONS.filter((r) => r.category === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveTab('library');
                }}
                className="group p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    {count} Reactions
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick AI Mechanism Tutor Prompts */}
      <section className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-slate-100">AI Mechanism Tutor Interactive Prompts</h2>
        </div>
        <p className="text-xs text-slate-400">
          Click any prompt below to launch the offline rule-based AI reasoning engine for instant step-by-step electron pushing analysis:
        </p>

        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                onOpenAITutorPrompt(p);
                setActiveTab('tutor');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium transition-all flex items-center gap-2 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>{p}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recently Viewed Reactions (if any) */}
      {recentReactions.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span>Recently Reviewed Reactions</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentReactions.slice(0, 3).map((reaction) => (
              <ReactionCard
                key={reaction.id}
                reaction={reaction}
                onSelect={onSelectReaction}
                isBookmarked={bookmarks.includes(reaction.id)}
                onToggleBookmark={onToggleBookmark}
                isLearned={learnedReactions.includes(reaction.id)}
                onToggleLearned={onToggleLearned}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
