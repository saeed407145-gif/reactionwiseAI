import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';
import { QuizQuestion, QuizResult } from '../../types';
import { saveQuizResult } from '../../utils/localStorage';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, HelpCircle, Sparkles, Trophy } from 'lucide-react';

interface QuizViewProps {
  onSelectReactionById?: (id: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onSelectReactionById }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; isCorrect: boolean }[]>([]);

  // Shuffle questions on quiz start
  const startNewQuiz = () => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsCompleted(false);
    setUserAnswers([]);
  };

  useEffect(() => {
    startNewQuiz();
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleSubmitAnswer = (optionIdx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionIndex(optionIdx);
    setIsAnswerSubmitted(true);

    const isCorrect = optionIdx === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswers((prev) => [...prev, { questionId: currentQuestion.id, isCorrect }]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsCompleted(true);
      // Save result to localStorage
      const finalResult: QuizResult = {
        id: `quiz_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        score,
        totalQuestions: questions.length,
        categoryScores: {},
      };
      saveQuizResult(finalResult);
    }
  };

  if (questions.length === 0) return null;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Quiz Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Organic Chemistry Practice Quiz</h1>
            <p className="text-xs text-slate-400">
              Test your knowledge of named reaction mechanisms, reagents, and regioselectivity.
            </p>
          </div>
        </div>

        <button
          onClick={startNewQuiz}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Quiz</span>
        </button>
      </div>

      {!isCompleted ? (
        /* Active Question Card */
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-4">
            <span className="font-semibold text-cyan-400">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-400">Score: {score}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                {currentQuestion.difficulty}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <h2 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
            {currentQuestion.question}
          </h2>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCorrectOption = idx === currentQuestion.correctAnswerIndex;

              let buttonStyle =
                'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-200';

              if (isAnswerSubmitted) {
                if (isCorrectOption) {
                  buttonStyle = 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 font-bold';
                } else if (isSelected) {
                  buttonStyle = 'bg-rose-950/80 border-rose-500/80 text-rose-200 font-bold';
                } else {
                  buttonStyle = 'bg-slate-950/50 border-slate-900 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSubmitAnswer(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all duration-200 flex items-start justify-between gap-3 ${buttonStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{option}</span>
                  </div>

                  {isAnswerSubmitted && (
                    <div className="shrink-0">
                      {isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-rose-400" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box (Visible after submission) */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Educational Explanation:</span>
                </span>

                {currentQuestion.reactionId && onSelectReactionById && (
                  <button
                    onClick={() => onSelectReactionById(currentQuestion.reactionId!)}
                    className="text-xs text-amber-400 hover:underline font-semibold"
                  >
                    View Related Mechanism →
                  </button>
                )}
              </div>

              <p className="text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                >
                  <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'Complete Quiz'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Completion Summary Card */
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-cyan-500 p-0.5 mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-100">Quiz Completed!</h2>
            <p className="text-xs text-slate-400 mt-1">
              Here is your organic chemistry performance summary:
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 max-w-sm mx-auto space-y-2">
            <span className="text-xs font-semibold text-slate-400">Final Score</span>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent">
              {score} / {questions.length}
            </p>
            <p className="text-xs text-slate-400 font-medium">
              Accuracy: {Math.round((score / questions.length) * 100)}%
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={startNewQuiz}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Practice Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
