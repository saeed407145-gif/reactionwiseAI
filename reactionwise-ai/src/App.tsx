import React, { useState, useEffect } from 'react';
import { ALL_REACTIONS, getReactionById, getFeaturedReaction } from './data/reactions';
import { Reaction } from './types';
import {
  getUserProgress,
  toggleBookmark as toggleBookmarkStorage,
  toggleLearned as toggleLearnedStorage,
  addRecentReaction,
  setThemePreference,
} from './utils/localStorage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/views/HomeView';
import { LibraryView } from './components/views/LibraryView';
import { AITutorView } from './components/views/AITutorView';
import { QuizView } from './components/views/QuizView';
import { BookmarksProgressView } from './components/views/BookmarksProgressView';
import { PeriodicTable3DView } from './components/views/PeriodicTable3DView';
import { BasicKnowledgeView } from './components/views/BasicKnowledgeView';
import { MechanismViewer } from './components/MechanismViewer';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);

  // User progress state synced with localStorage
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [learnedReactions, setLearnedReactions] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [tutorPrompt, setTutorPrompt] = useState<string>('');

  // Initial load from localStorage
  useEffect(() => {
    const progress = getUserProgress();
    setBookmarks(progress.bookmarks);
    setLearnedReactions(progress.learnedReactions);
    setRecentIds(progress.recentReactions);
    setTheme(progress.theme);

    // Apply dark class to document
    if (progress.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const featuredReaction = getFeaturedReaction();

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setThemePreference(nextTheme);
  };

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleBookmarkStorage(id);
    const updated = getUserProgress();
    setBookmarks(updated.bookmarks);
  };

  const handleToggleLearned = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleLearnedStorage(id);
    const updated = getUserProgress();
    setLearnedReactions(updated.learnedReactions);
  };

  const handleSelectReaction = (reaction: Reaction) => {
    setSelectedReaction(reaction);
    addRecentReaction(reaction.id);
    const updated = getUserProgress();
    setRecentIds(updated.recentReactions);
  };

  const handleOpenAITutorWithPrompt = (prompt: string) => {
    setTutorPrompt(prompt);
    setActiveTab('tutor');
  };

  const recentReactionsList = recentIds
    .map((id) => getReactionById(id))
    .filter((r): r is Reaction => r !== undefined);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        bookmarkCount={bookmarks.length}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'home' && (
          <HomeView
            setActiveTab={setActiveTab}
            setSelectedCategory={setSelectedCategory}
            onSelectReaction={handleSelectReaction}
            featuredReaction={featuredReaction}
            bookmarks={bookmarks}
            learnedReactions={learnedReactions}
            recentReactions={recentReactionsList}
            onToggleBookmark={handleToggleBookmark}
            onToggleLearned={handleToggleLearned}
            onOpenAITutorPrompt={handleOpenAITutorWithPrompt}
          />
        )}

        {activeTab === 'library' && (
          <LibraryView
            onSelectReaction={handleSelectReaction}
            bookmarks={bookmarks}
            learnedReactions={learnedReactions}
            onToggleBookmark={handleToggleBookmark}
            onToggleLearned={handleToggleLearned}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === 'periodic-table' && <PeriodicTable3DView />}

        {activeTab === 'basics' && <BasicKnowledgeView />}

        {activeTab === 'tutor' && (
          <AITutorView
            initialPrompt={tutorPrompt}
            onSelectReaction={handleSelectReaction}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            onSelectReactionById={(id) => {
              const r = getReactionById(id);
              if (r) handleSelectReaction(r);
            }}
          />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarksProgressView
            onSelectReaction={handleSelectReaction}
            bookmarks={bookmarks}
            learnedReactions={learnedReactions}
            onToggleBookmark={handleToggleBookmark}
            onToggleLearned={handleToggleLearned}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Modal Mechanism Viewer */}
      {selectedReaction && (
        <MechanismViewer
          reaction={selectedReaction}
          onClose={() => setSelectedReaction(null)}
          isBookmarked={bookmarks.includes(selectedReaction.id)}
          onToggleBookmark={(id) => handleToggleBookmark(id)}
          isLearned={learnedReactions.includes(selectedReaction.id)}
          onToggleLearned={(id) => handleToggleLearned(id)}
          onOpenAITutor={(prompt) => {
            setSelectedReaction(null);
            handleOpenAITutorWithPrompt(prompt);
          }}
        />
      )}

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
