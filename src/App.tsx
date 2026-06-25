import { useState, useCallback, useEffect } from 'react';
import type { Screen, QuizAnswers, Scores } from './types';
import { calculateScores } from './utils/scoring';
import {
  playClickSound,
  playSelectSound,
  playTransitionSound,
  playCompleteSound,
  unlockAudio,
  vibrateShort,
  vibrateMedium,
  vibrateSpecial,
} from './utils/sound';

import AppLayout from './components/AppLayout';
import WelcomeScreen from './screens/WelcomeScreen';
import BeforeStartScreen from './screens/BeforeStartScreen';
import Question1Screen from './screens/Question1Screen';
import Question2Screen from './screens/Question2Screen';
import Question3Screen from './screens/Question3Screen';
import Question4Screen from './screens/Question4Screen';
import Question5Screen from './screens/Question5Screen';
import QuickQuestionsScreen from './screens/QuickQuestionsScreen';
import ProcessingScreen from './screens/ProcessingScreen';
import ResultScreen from './screens/ResultScreen';
import VideoSection from './screens/VideoSection';
import SalesPage from './screens/SalesPage';

const STORAGE_KEY = 'vda_app_state';

interface StoredState {
  screen: Screen;
  answers: QuizAnswers;
  soundEnabled: boolean;
}

function loadState(): StoredState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredState;
  } catch {
    return null;
  }
}

function saveState(state: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const EMPTY_ANSWERS: QuizAnswers = {};
const EMPTY_SCORES: Scores = { amorPropio: 0, confianza: 0, pazInterior: 0, aberturaEmocional: 0 };

export default function App() {
  const stored = loadState();

  const [screen, setScreen] = useState<Screen>(stored?.screen ?? 'welcome');
  const [answers, setAnswers] = useState<QuizAnswers>(stored?.answers ?? EMPTY_ANSWERS);
  const [scores, setScores] = useState<Scores>(EMPTY_SCORES);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(stored?.soundEnabled ?? true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  useEffect(() => {
    if (audioUnlocked) unlockAudio();
  }, [audioUnlocked]);

  function handleFirstInteraction() {
    if (!audioUnlocked) {
      setAudioUnlocked(true);
      unlockAudio();
    }
  }

  const sound = useCallback(
    (fn: () => void) => { if (soundEnabled && audioUnlocked) fn(); },
    [soundEnabled, audioUnlocked]
  );

  function persist(newScreen: Screen, newAnswers: QuizAnswers) {
    saveState({ screen: newScreen, answers: newAnswers, soundEnabled });
  }

  function handleSoundToggle() {
    handleFirstInteraction();
    sound(playClickSound);
    setSoundEnabled(v => !v);
  }

  function handleStart() {
    handleFirstInteraction();
    sound(playClickSound);
    vibrateShort();
    const next: Screen = 'before-start';
    persist(next, answers);
    setScreen(next);
  }

  function handleBeforeStartContinue() {
    handleFirstInteraction();
    sound(playTransitionSound);
    const next: Screen = 'question-1';
    persist(next, answers);
    setScreen(next);
  }

  function handleQ1(val: string) {
    sound(playSelectSound); vibrateShort();
    const a = { ...answers, q1: val };
    setAnswers(a); persist('question-2', a); setScreen('question-2');
  }

  function handleQ2(val: string) {
    sound(playSelectSound); vibrateShort();
    const a = { ...answers, q2: val };
    setAnswers(a); persist('question-3', a); setScreen('question-3');
  }

  function handleQ3(val: number) {
    sound(playSelectSound); vibrateShort();
    const a = { ...answers, q3: val };
    setAnswers(a); persist('question-4', a); setScreen('question-4');
  }

  function handleQ4(val: string) {
    sound(playSelectSound); vibrateShort();
    const a = { ...answers, q4: val };
    setAnswers(a); persist('question-5', a); setScreen('question-5');
  }

  function handleQ5(val: string) {
    sound(playSelectSound); vibrateShort();
    const a = { ...answers, q5: val };
    setAnswers(a); persist('quick-questions', a); setScreen('quick-questions');
  }

  function handleQuickQuestions(vals: { q6: string; q7: string; q8: string }) {
    sound(playCompleteSound); vibrateMedium();
    const a = { ...answers, ...vals };
    setAnswers(a); persist('processing', a); setScreen('processing');
  }

  function handleProcessingComplete() {
    const computed = calculateScores(answers);
    setScores(computed);
    vibrateSpecial();
    persist('result', answers);
    setScreen('result');
  }

  function handleResultContinue() {
    sound(playTransitionSound);
    persist('vsl', answers); setScreen('vsl');
  }

  function handleVSLContinue() {
    sound(playTransitionSound);
    persist('sales', answers); setScreen('sales');
  }

  const sp = { soundEnabled, onSoundToggle: handleSoundToggle };

  return (
    <AppLayout>
      <div onClick={handleFirstInteraction}>
        {screen === 'welcome' && <WelcomeScreen onStart={handleStart} {...sp} />}
        {screen === 'before-start' && <BeforeStartScreen onContinue={handleBeforeStartContinue} {...sp} />}
        {screen === 'question-1' && <Question1Screen initialValue={answers.q1} onAnswer={handleQ1} {...sp} />}
        {screen === 'question-2' && <Question2Screen initialValue={answers.q2} onAnswer={handleQ2} {...sp} />}
        {screen === 'question-3' && <Question3Screen initialValue={answers.q3} onAnswer={handleQ3} {...sp} />}
        {screen === 'question-4' && <Question4Screen initialValue={answers.q4} onAnswer={handleQ4} {...sp} />}
        {screen === 'question-5' && <Question5Screen initialValue={answers.q5} onAnswer={handleQ5} {...sp} />}
        {screen === 'quick-questions' && (
          <QuickQuestionsScreen
            initialValues={{ q6: answers.q6, q7: answers.q7, q8: answers.q8 }}
            onAnswer={handleQuickQuestions}
            {...sp}
          />
        )}
        {screen === 'processing' && <ProcessingScreen onComplete={handleProcessingComplete} soundEnabled={soundEnabled} />}
        {screen === 'result' && <ResultScreen scores={scores} onContinue={handleResultContinue} {...sp} />}
        {screen === 'vsl' && <VideoSection onContinue={handleVSLContinue} {...sp} />}
        {screen === 'sales' && <SalesPage />}
      </div>
    </AppLayout>
  );
}
