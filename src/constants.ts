export const CHECKOUT_URL = 'https://pay.hotmart.com/B106469520T?checkoutMode=10';
export const VSL_VIDEO_URL = 'https://www.youtube.com/embed/VIDEO_ID';

export const TOTAL_QUESTIONS = 5;

export const SCREEN_ORDER = [
  'welcome',
  'question-1',
  'question-2',
  'question-3',
  'question-4',
  'question-5',
  'processing',
  'result',
  'vsl',
  'sales',
] as const;

export const QUIZ_STEP_LABELS: Record<(typeof SCREEN_ORDER)[number], string> = {
  welcome: 'Visitantes',
  'question-1': 'Estado emocional',
  'question-2': 'Sentimento sobre o amor',
  'question-3': 'Conexão consigo mesma',
  'question-4': 'Necessidades e cuidado',
  'question-5': 'Área emocional prioritária',
  processing: 'Processando',
  result: 'Conclusão do quiz',
  vsl: 'Vídeo',
  sales: 'Página de vendas',
};

export const QUIZ_RELEVANT_FUNNEL_SCREENS = [
  'question-1',
  'question-2',
  'question-3',
  'question-4',
  'question-5',
  'result',
] as const;

export function getScreenProgress(screen: string): number {
  const quizScreens = [
    'question-1',
    'question-2',
    'question-3',
    'question-4',
    'question-5',
  ];
  const idx = quizScreens.indexOf(screen);
  if (idx === -1) return 0;
  return Math.round(((idx + 1) / quizScreens.length) * 100);
}

export function getStepNumber(screen: string): number {
  const steps: Record<string, number> = {
    'question-1': 1,
    'question-2': 2,
    'question-3': 3,
    'question-4': 4,
    'question-5': 5,
  };
  return steps[screen] ?? 0;
}
