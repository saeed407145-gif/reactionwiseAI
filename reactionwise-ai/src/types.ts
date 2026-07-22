export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type CategoryId =
  | 'carbon-carbon-bond'
  | 'aromatic'
  | 'rearrangements'
  | 'pericyclic'
  | 'oxidation'
  | 'reduction'
  | 'substitution-elimination'
  | 'protecting-groups';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
  icon?: string;
  color: string;
  accentBorder: string;
  bgGlow: string;
}

export interface MechanismStep {
  stepNumber: number;
  title: string;
  description: string;
  electronMovement: string; // Simple student-friendly arrow pushing explanation
  whyThisStep: string; // Thermodynamic/kinetic driving force
  intermediateName?: string;
  svgDiagramType?: string;
}

export interface ReactionEquation {
  reactants: string;
  reagentsConditions: string;
  products: string;
  byproducts?: string;
}

export interface Reaction {
  id: string;
  name: string;
  shortOverview: string;
  category: CategoryId;
  categoryLabel: string;
  difficulty: DifficultyLevel;
  equation: ReactionEquation;
  reactantsDescription: string;
  reagentsConditionsDescription: string;
  mainProductDescription: string;
  mechanism: MechanismStep[];
  keyIntermediates: string[];
  importantNotes: string[];
  commonMistakes: string[];
  exampleReaction: string;
  tags: string[];
  historicalContext?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  reactionId?: string;
  difficulty: DifficultyLevel;
  category: CategoryId;
}

export interface QuizResult {
  id: string;
  date: string;
  timestamp?: number;
  score: number;
  totalQuestions: number;
  categoryScores?: Record<string, number>;
}

export interface UserProgressData {
  bookmarks: string[]; // reaction IDs
  learnedReactions: string[]; // reaction IDs marked as mastered
  recentReactions: string[]; // reaction IDs recently viewed
  quizHistory: QuizResult[];
  theme: 'dark' | 'light';
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  suggestedActions?: string[];
  reactionRefId?: string;
  stepIndex?: number;
}
