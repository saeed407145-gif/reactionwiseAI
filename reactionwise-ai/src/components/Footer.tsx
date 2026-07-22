import React from 'react';
import { ShieldAlert, BookOpen, Atom, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Academic Disclaimer Box */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200/90 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-300">Educational Academic Disclaimer</p>
            <p>
              ReactionWise AI is strictly an offline interactive reference application designed for organic chemistry study and exam preparation. Users and students must always verify reaction mechanics, stoichiometry, safety protocols, and laboratory procedures with peer-reviewed academic literature, standard textbooks (e.g., Carey, March, Clayden), and Material Safety Data Sheets (MSDS). Never perform wet-lab synthesis without professional supervision and accredited safety equipment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <Atom className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-slate-100">ReactionWise AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Master 100+ organic chemistry named reactions offline with step-by-step electron pushing, mechanism visualizations, and rule-based AI tutoring.
            </p>
          </div>

          {/* Quick Nav */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-cyan-400 transition-colors">
                  Home Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('library')} className="hover:text-cyan-400 transition-colors">
                  100+ Named Reactions Library
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tutor')} className="hover:text-cyan-400 transition-colors">
                  Rule-Based AI Mechanism Tutor
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('quiz')} className="hover:text-cyan-400 transition-colors">
                  Organic Chemistry Practice Quiz
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('bookmarks')} className="hover:text-cyan-400 transition-colors">
                  Bookmarks & Mastery Progress
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Reaction Categories</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>C-C Bond Formation (Wittig, Aldol, Grignard)</li>
              <li>Electrophilic Aromatic Substitution (EAS)</li>
              <li>Molecular Rearrangements (Pinacol, Beckmann)</li>
              <li>Pericyclic Reactions (Diels-Alder, Claisen)</li>
              <li>Oxidation & Reduction (Swern, Luche, Birch)</li>
              <li>Substitution & Elimination (SN1, SN2, E1, E2)</li>
            </ul>
          </div>

          {/* Offline & Tech Details */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">App Architecture</h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p>⚡ 100% Offline Static JSON Knowledge Base</p>
              <p>🔒 Zero Tracking / Zero Database / Pure LocalStorage</p>
              <p>⚛️ Built with React 19 + TypeScript + Tailwind CSS</p>
              <p>🎯 Local Rule-Based Mechanism Inference Engine</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ReactionWise AI. Built for Organic Chemistry Students worldwide.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for chemistry education</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
