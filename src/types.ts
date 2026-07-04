export type Screen =
  | 'welcome'
  | 'question-1'
  | 'question-2'
  | 'question-3'
  | 'question-4'
  | 'question-5'
  | 'processing'
  | 'result'
  | 'vsl'
  | 'sales';

export interface Scores {
  amorPropio: number;
  confianza: number;
  pazInterior: number;
  aberturaEmocional: number;
}

export interface QuizAnswers {
  q1?: string;
  q2?: string;
  q3?: number;
  q4?: string;
  q5?: string;
}

export interface AppState {
  screen: Screen;
  answers: QuizAnswers;
  scores: Scores;
  soundEnabled: boolean;
  audioUnlocked: boolean;
}
