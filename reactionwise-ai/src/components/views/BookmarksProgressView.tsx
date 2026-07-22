import React from 'react';
import { ALL_REACTIONS } from '../../data/reactions';
import { Reaction } from '../../types';
import { ReactionCard } from '../ReactionCard';
import { getUserProgress } from '../../utils/localStorage';
import { Bookmark, CheckCircle2, Award, TrendingUp, BookOpen, Trash2, ArrowRight } from 'lucide-react';

interface BookmarksProgressViewProps {
  onSelectReaction: (reaction: Reaction) => void;
  bookmarks: string[];
  learnedReactions: string[];
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onToggleLearned: (id: string, e: React.MouseEvent) => void;
  setActiveTab: (tab: string) => void;
}

export const BookmarksProgressView: React.FC<BookmarksProgressViewProps> = ({
  onSelectReaction,
  bookmarks,
  learnedReactions,
  onToggleBookmark,
  onToggleLearned,
  setActiveTab,
}) => {
  const progressData = getUserProgress();

  const bookmarkedList = ALL_REACTIONS.filter((r) => bookmarks.includes(r.id));
  const learnedList = ALL_REACTIONS.filter((r) => learnedReactions.includes(r.id));

  const totalTaken = progressData.quizHistory.length;
  const avgAccuracy =
    totalTaken > 0
      ? Math.round(
          (progressData.quizHistory.reduce((acc, q) => acc + q.score / q.totalQuestions, 0) /
            totalTaken) *
            100
        )
      : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-amber-400" />
          <span>Bookmarks & Mastery Progress</span>
        </h1>
        <p className="text-xs text-slate-400">
          Track your organic chemistry reaction mastery, bookmarked mechanisms, and quiz performance over time.
        </p>
      </div>

      {/* Progress Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400 shrink-0">
            <Bookmark className="w-6 h-6 fill-amber-400/20" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Bookmarked Reactions</span>
            <p className="text-2xl font-extrabold text-amber-400">{bookmarks.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Mastered Reactions</span>
            <p className="text-2xl font-extrabold text-emerald-400">
              {learnedReactions.length} / {ALL_REACTIONS.length}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Quizzes Completed</span>
            <p className="text-2xl font-extrabold text-indigo-300">{totalTaken}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center text-cyan-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Average Quiz Accuracy</span>
            <p className="text-2xl font-extrabold text-cyan-400">{avgAccuracy}%</p>
          </div>
        </div>
      </div>

      {/* Bookmarked Reactions Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <span>Bookmarked Reactions ({bookmarkedList.length})</span>
          </h2>

          {bookmarkedList.length === 0 && (
            <button
              onClick={() => setActiveTab('library')}
              className="text-xs text-cyan-400 hover:underline font-medium"
            >
              Browse Library to Bookmark →
            </button>
          )}
        </div>

        {bookmarkedList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedList.map((reaction) => (
              <ReactionCard
                key={reaction.id}
                reaction={reaction}
                onSelect={onSelectReaction}
                isBookmarked={true}
                onToggleBookmark={onToggleBookmark}
                isLearned={learnedReactions.includes(reaction.id)}
                onToggleLearned={onToggleLearned}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            No bookmarked reactions yet. Click the bookmark icon on any reaction card in the library to save it for quick revision.
          </div>
        )}
      </section>

      {/* Mastered Reactions Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Mastered Reactions ({learnedList.length})</span>
        </h2>

        {learnedList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learnedList.map((reaction) => (
              <ReactionCard
                key={reaction.id}
                reaction={reaction}
                onSelect={onSelectReaction}
                isBookmarked={bookmarks.includes(reaction.id)}
                onToggleBookmark={onToggleBookmark}
                isLearned={true}
                onToggleLearned={onToggleLearned}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            No reactions marked as mastered yet. Click the checkmark icon on any reaction card when you feel confident in its mechanism!
          </div>
        )}
      </section>

      {/* Quiz History Table */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <span>Recent Quiz History</span>
        </h2>

        {progressData.quizHistory.length > 0 ? (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
            <div className="grid grid-cols-3 p-3 bg-slate-950 font-semibold text-slate-400 border-b border-slate-800">
              <span>Date</span>
              <span>Score</span>
              <span>Accuracy</span>
            </div>
            <div className="divide-y divide-slate-800/80">
              {progressData.quizHistory.slice(0, 5).map((q) => {
                const pct = Math.round((q.score / q.totalQuestions) * 100);
                return (
                  <div key={q.id} className="grid grid-cols-3 p-3 text-slate-300 items-center">
                    <span>{q.date}</span>
                    <span className="font-bold text-slate-100">
                      {q.score} / {q.totalQuestions}
                    </span>
                    <span className={`font-bold ${pct >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            No quiz attempts recorded yet. Head over to Quiz Mode to test your organic mechanism skills!
          </div>
        )}
      </section>
    </div>
  );
};
