import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../../data/categories';
import { ALL_REACTIONS, searchReactions } from '../../data/reactions';
import { Reaction } from '../../types';
import { ReactionCard } from '../ReactionCard';
import { Search, Filter, BookOpen, Sparkles, CheckCircle2, Bookmark, Layers } from 'lucide-react';

interface LibraryViewProps {
  onSelectReaction: (reaction: Reaction) => void;
  bookmarks: string[];
  learnedReactions: string[];
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onToggleLearned: (id: string, e: React.MouseEvent) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  onSelectReaction,
  bookmarks,
  learnedReactions,
  onToggleBookmark,
  onToggleLearned,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState<boolean>(false);
  const [showOnlyLearned, setShowOnlyLearned] = useState<boolean>(false);

  const filteredReactions = useMemo(() => {
    let list = searchReactions(searchQuery, selectedCategory, difficultyFilter);

    if (showOnlyBookmarked) {
      list = list.filter((r) => bookmarks.includes(r.id));
    }
    if (showOnlyLearned) {
      list = list.filter((r) => learnedReactions.includes(r.id));
    }

    return list;
  }, [searchQuery, selectedCategory, difficultyFilter, showOnlyBookmarked, showOnlyLearned, bookmarks, learnedReactions]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <span>100+ Organic Named Reactions Library</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete offline database of mechanisms, electron pushing, reagents, and synthetic rules.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reaction, reagent, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Category Filter</span>
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All Categories ({ALL_REACTIONS.length})
          </button>

          {CATEGORIES.map((cat) => {
            const count = ALL_REACTIONS.filter((r) => r.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-slate-100 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-cyan-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty & Toggle Quick Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
        {/* Difficulty Selectors */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Difficulty:</span>
          {['all', 'beginner', 'intermediate', 'advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-2.5 py-1 rounded-lg uppercase tracking-wider font-bold transition-all ${
                difficultyFilter === diff
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Bookmarked & Learned Toggles */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              showOnlyBookmarked
                ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarked ({bookmarks.length})</span>
          </button>

          <button
            onClick={() => setShowOnlyLearned(!showOnlyLearned)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              showOnlyLearned
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mastered ({learnedReactions.length})</span>
          </button>
        </div>
      </div>

      {/* Reaction Cards Grid */}
      {filteredReactions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReactions.map((reaction) => (
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
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Reactions Match Your Filter</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search terms, clearing category/difficulty filters, or searching for specific reagents like "NaBH4", "Pd", or "acid".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setDifficultyFilter('all');
              setShowOnlyBookmarked(false);
              setShowOnlyLearned(false);
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
