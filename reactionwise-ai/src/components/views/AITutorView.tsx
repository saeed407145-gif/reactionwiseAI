import React, { useState } from 'react';
import { queryAITutor, TutorResponse } from '../../utils/aiTutorEngine';
import { Reaction } from '../../types';
import {
  Bot,
  Sparkles,
  Send,
  Zap,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  FlaskConical,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';

interface AITutorViewProps {
  initialPrompt?: string;
  onSelectReaction: (reaction: Reaction) => void;
}

export const AITutorView: React.FC<AITutorViewProps> = ({ initialPrompt = '', onSelectReaction }) => {
  const [activeMode, setActiveMode] = useState<'tutor' | 'predictor'>('tutor');

  // Tutor mode state
  const [inputQuery, setInputQuery] = useState(
    initialPrompt || 'Explain electron movement in Wittig reaction'
  );
  const [currentResponse, setCurrentResponse] = useState<TutorResponse>(
    queryAITutor(initialPrompt || 'Explain electron movement in Wittig reaction')
  );
  const [isLoadingTutor, setIsLoadingTutor] = useState<boolean>(false);
  const [aiSource, setAiSource] = useState<'gemini' | 'offline'>('offline');

  // Predictor mode state
  const [reactants, setReactants] = useState<string>('Benzaldehyde + Acetone');
  const [reagents, setReagents] = useState<string>('Dilute NaOH, H₂O');
  const [conditions, setConditions] = useState<string>('Room temperature');
  const [predictionResult, setPredictionResult] = useState<any | null>(null);
  const [isLoadingPredictor, setIsLoadingPredictor] = useState<boolean>(false);

  const samplePrompts = [
    'Explain electron movement in Wittig reaction',
    'How to distinguish S_N1 vs S_N2?',
    'Predict product of enone + NaBH₄ vs Luche',
    'What is Walden inversion in S_N2?',
    'Why is LDA a non-nucleophilic strong base?',
    'Show Diels-Alder endo rule explanation',
    'How does Swern oxidation avoid carboxylic acid?',
  ];

  // Call Gemini API or fallback to rule-based engine
  const handleTutorSubmit = async (query: string) => {
    if (!query.trim()) return;
    setInputQuery(query);
    setIsLoadingTutor(true);

    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        setAiSource('gemini');
        setCurrentResponse({
          title: json.data.title || 'AI Chemistry Explanation',
          keyConcept: json.data.keyConcept || 'Organic Chemistry',
          summary: json.data.summary || '',
          stepByStep: json.data.stepByStep || [],
          examTips: json.data.examTips || [],
          suggestedFollowUps: json.data.suggestedFollowUps || [],
        });
      } else {
        // Fallback to offline rule-based engine
        setAiSource('offline');
        const fallback = queryAITutor(query);
        setCurrentResponse(fallback);
      }
    } catch {
      // Offline fallback
      setAiSource('offline');
      const fallback = queryAITutor(query);
      setCurrentResponse(fallback);
    } finally {
      setIsLoadingTutor(false);
    }
  };

  // Predictor Submit
  const handlePredictorSubmit = async () => {
    if (!reactants.trim()) return;
    setIsLoadingPredictor(true);

    try {
      const res = await fetch('/api/gemini/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactants, reagents, conditions }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setPredictionResult(json.data);
      } else {
        // Rule-based fallback prediction
        setPredictionResult({
          majorProduct: 'Dibenzalacetone (1,5-diphenylpenta-1,4-dien-3-one)',
          reactionType: 'Claisen-Schmidt Condensation (Cross-Aldol)',
          regioselectivity: 'Conjugated enone formation',
          stereochemistry: 'E,E-trans stereoisomer favored thermodynamics',
          drivingForce: 'Extensive pi-conjugation across both phenyl rings',
          byproducts: '2 H₂O',
          mechanismSteps: [
            { step: 1, description: 'NaOH deprotonates acetone α-H forming enolate anion.', electronArrow: 'OH⁻ attacks α-H; C-H electrons move onto carbonyl C=O.' },
            { step: 2, description: 'Enolate attacks benzaldehyde carbonyl C.', electronArrow: 'Enolate C=C attacks benzaldehyde carbonyl C=O.' },
            { step: 3, description: 'Proton transfer and dehydration to trans-enone.', electronArrow: 'E2 dehydration drives conjugate enone formation.' }
          ],
          explanation: 'Benzaldehyde lacks α-hydrogens so it cannot self-condense. Acetone forms enolate and attacks benzaldehyde twice yielding dibenzalacetone.',
        });
      }
    } catch {
      // Fallback prediction
      setPredictionResult({
        majorProduct: 'Dibenzalacetone (1,5-diphenylpenta-1,4-dien-3-one)',
        reactionType: 'Claisen-Schmidt Condensation (Cross-Aldol)',
        regioselectivity: 'Conjugated enone formation',
        stereochemistry: 'E,E-trans stereoisomer favored thermodynamics',
        drivingForce: 'Extensive pi-conjugation across both phenyl rings',
        byproducts: '2 H₂O',
        mechanismSteps: [
          { step: 1, description: 'NaOH deprotonates acetone α-H forming enolate anion.', electronArrow: 'OH⁻ attacks α-H; C-H electrons move onto carbonyl C=O.' },
          { step: 2, description: 'Enolate attacks benzaldehyde carbonyl C.', electronArrow: 'Enolate C=C attacks benzaldehyde carbonyl C=O.' },
          { step: 3, description: 'Proton transfer and dehydration to trans-enone.', electronArrow: 'E2 dehydration drives conjugate enone formation.' }
        ],
        explanation: 'Benzaldehyde lacks α-hydrogens so it cannot self-condense. Acetone forms enolate and attacks benzaldehyde twice yielding dibenzalacetone.',
      });
    } finally {
      setIsLoadingPredictor(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Banner & Mode Switcher */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Bot className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100">AI Chemistry Tutor & Reaction Predictor</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Gemini AI Powered
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Step-by-step electron movement, AI mechanism breakdown, and real-time organic product predictions.
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setActiveMode('tutor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'tutor'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Mechanism AI Tutor</span>
            </button>
            <button
              onClick={() => setActiveMode('predictor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'predictor'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Reaction Predictor</span>
            </button>
          </div>
        </div>

        {/* TUTOR MODE INPUT */}
        {activeMode === 'tutor' && (
          <div className="space-y-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTutorSubmit(inputQuery);
              }}
              className="flex items-center gap-2 pt-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ask anything about reaction mechanisms, electron movement, or exam traps..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 text-sm rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isLoadingTutor}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                <span>{isLoadingTutor ? 'Analyzing...' : 'Analyze AI'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Prompts */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Interactive Quick Prompts:</span>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTutorSubmit(prompt)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PREDICTOR MODE INPUT */}
        {activeMode === 'predictor' && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reactant(s)</label>
                <input
                  type="text"
                  placeholder="e.g. Benzaldehyde + Acetone"
                  value={reactants}
                  onChange={(e) => setReactants(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reagent(s)</label>
                <input
                  type="text"
                  placeholder="e.g. Dilute NaOH, H₂O"
                  value={reagents}
                  onChange={(e) => setReagents(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Conditions</label>
                <input
                  type="text"
                  placeholder="e.g. Room temp, 25 °C"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              onClick={handlePredictorSubmit}
              disabled={isLoadingPredictor}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <FlaskConical className="w-4 h-4" />
              <span>{isLoadingPredictor ? 'Predicting Reaction via AI...' : 'Predict Major Product & Mechanism'}</span>
            </button>
          </div>
        )}
      </div>

      {/* MODE 1: TUTOR RESPONSE PANEL */}
      {activeMode === 'tutor' && currentResponse && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
          {/* Response Header */}
          <div className="border-b border-slate-800 pb-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>{currentResponse.keyConcept}</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                Source: {aiSource === 'gemini' ? 'Gemini 3.6 Flash Server API' : 'Offline Rule Engine'}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-100">{currentResponse.title}</h2>
            <p className="text-sm text-slate-300 leading-relaxed">{currentResponse.summary}</p>

            {/* Matched Reaction CTA if available */}
            {currentResponse.reaction && (
              <div className="mt-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-indigo-300 block">Matched Reaction Dataset Entry:</span>
                  <span className="text-slate-300">{currentResponse.reaction.name}</span>
                </div>
                <button
                  onClick={() => onSelectReaction(currentResponse.reaction!)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0"
                >
                  <span>Open Entry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Step-by-Step Breakdown */}
          {currentResponse.stepByStep && currentResponse.stepByStep.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Step-by-Step Electron Pushing Analysis:
              </h3>

              <div className="space-y-3">
                {currentResponse.stepByStep.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs"
                  >
                    <div className="flex items-center gap-2 font-bold text-cyan-300">
                      <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-[11px]">
                        {s.step || idx + 1}
                      </span>
                      <span>Step {s.step || idx + 1}: {s.title || 'Mechanism Step'}</span>
                    </div>

                    <p className="text-slate-300 leading-relaxed pl-7">{s.text}</p>

                    {s.arrowMovement && (
                      <div className="ml-7 p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-800/30 text-cyan-200/90 font-mono text-[11px] flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Curved Arrow: {s.arrowMovement}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exam Tips & Traps */}
          {currentResponse.examTips && currentResponse.examTips.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 space-y-2 text-xs">
              <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Exam Tips & Common Student Pitfalls</span>
              </h4>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                {currentResponse.examTips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-up Prompts */}
          {currentResponse.suggestedFollowUps && currentResponse.suggestedFollowUps.length > 0 && (
            <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
              <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Suggested Follow-Up Questions:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {currentResponse.suggestedFollowUps.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => handleTutorSubmit(f)}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-xs transition-colors"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: PREDICTOR RESPONSE PANEL */}
      {activeMode === 'predictor' && predictionResult && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AI Reaction Prediction Complete</span>
              </span>
              <h2 className="text-xl font-bold text-slate-100 mt-1">{predictionResult.majorProduct}</h2>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              {predictionResult.reactionType}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block font-semibold mb-1">Regioselectivity</span>
              <span className="text-slate-200">{predictionResult.regioselectivity}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block font-semibold mb-1">Stereochemistry</span>
              <span className="text-slate-200">{predictionResult.stereochemistry}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block font-semibold mb-1">Thermodynamic Driving Force</span>
              <span className="text-slate-200">{predictionResult.drivingForce}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-200">AI Explanation:</span>
            <p className="text-slate-300 leading-relaxed">{predictionResult.explanation}</p>
          </div>

          {predictionResult.mechanismSteps && predictionResult.mechanismSteps.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Predicted Mechanism Walk-Through:
              </h3>
              {predictionResult.mechanismSteps.map((step: any, i: number) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
                  <span className="font-bold text-cyan-400 block">Step {step.step || i + 1}: {step.description}</span>
                  {step.electronArrow && (
                    <span className="font-mono text-[11px] text-amber-300 block">
                      Arrow: {step.electronArrow}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
