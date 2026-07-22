import { UserProgressData, QuizResult } from '../types';

const STORAGE_KEY = 'reactionwise_ai_user_progress_v1';

const DEFAULT_PROGRESS: UserProgressData = {
  bookmarks: [],
  quizHistory: [],
  learnedReactions: [],
  theme: 'dark',
  recentReactions: [],
};

export function getUserProgress(): UserProgressData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(data);
    return {
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
      quizHistory: Array.isArray(parsed.quizHistory) ? parsed.quizHistory : [],
      learnedReactions: Array.isArray(parsed.learnedReactions) ? parsed.learnedReactions : [],
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      recentReactions: Array.isArray(parsed.recentReactions) ? parsed.recentReactions : [],
    };
  } catch (err) {
    console.warn('Failed to parse localStorage user progress:', err);
    return DEFAULT_PROGRESS;
  }
}

export function saveUserProgress(progress: Partial<UserProgressData>): UserProgressData {
  try {
    const current = getUserProgress();
    const updated: UserProgressData = {
      ...current,
      ...progress,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save user progress to localStorage:', err);
    return getUserProgress();
  }
}

export function toggleBookmark(reactionId: string): boolean {
  const progress = getUserProgress();
  const exists = progress.bookmarks.includes(reactionId);
  const updatedBookmarks = exists
    ? progress.bookmarks.filter((id) => id !== reactionId)
    : [...progress.bookmarks, reactionId];

  saveUserProgress({ bookmarks: updatedBookmarks });
  return !exists; // Returns true if now bookmarked, false if removed
}

export function isBookmarked(reactionId: string): boolean {
  const progress = getUserProgress();
  return progress.bookmarks.includes(reactionId);
}

export function toggleLearned(reactionId: string): boolean {
  const progress = getUserProgress();
  const exists = progress.learnedReactions.includes(reactionId);
  const updatedLearned = exists
    ? progress.learnedReactions.filter((id) => id !== reactionId)
    : [...progress.learnedReactions, reactionId];

  saveUserProgress({ learnedReactions: updatedLearned });
  return !exists; // Returns true if now learned, false if unlearned
}

export function isLearned(reactionId: string): boolean {
  const progress = getUserProgress();
  return progress.learnedReactions.includes(reactionId);
}

export function addRecentReaction(reactionId: string): void {
  const progress = getUserProgress();
  const filtered = progress.recentReactions.filter((id) => id !== reactionId);
  const updated = [reactionId, ...filtered].slice(0, 10); // keep last 10
  saveUserProgress({ recentReactions: updated });
}

export function saveQuizResult(result: QuizResult): void {
  const progress = getUserProgress();
  const updatedHistory = [result, ...progress.quizHistory];
  saveUserProgress({ quizHistory: updatedHistory });
}

export function setThemePreference(theme: 'dark' | 'light'): void {
  saveUserProgress({ theme });
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
