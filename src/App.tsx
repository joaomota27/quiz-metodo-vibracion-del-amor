import { lazy, Suspense, useState, useCallback, useEffect } from 'react';

const removeFloating = () => {
  document.querySelectorAll('[style="position: fixed"][style="bottom: 1rem"][style="right: 1rem"][style="z-index: 2147483647"]').forEach(el => el.remove());
};

removeFloating();

const observer = new MutationObserver(removeFloating);
observer.observe(document.body, { childList: true, subtree: true });

import type { Screen, QuizAnswers, Scores } from './types';
import { calculateScores } from './utils/scoring';
import {
  playClickSound,
  playSelectSound,
  playTransitionSound,
  unlockAudio,
  vibrateShort,
  vibrateSpecial,
} from './utils/sound';
import { initTracking, trackEvent, trackPageView } from './tracking';
import { saveAnalyticsEvent } from './utils/analytics';

import AppLayout from './components/AppLayout';
import WelcomeScreen from './screens/WelcomeScreen';
import Question1Screen from './screens/Question1Screen';
import Question2Screen from './screens/Question2Screen';
import Question3Screen from './screens/Question3Screen';
import Question4Screen from './screens/Question4Screen';
import Question5Screen from './screens/Question5Screen';
import ProcessingScreen from './screens/ProcessingScreen';

const ResultScreen = lazy(() => import('./screens/ResultScreen'));
const VideoSection = lazy(() => import('./screens/VideoSection'));
const SalesPage = lazy(() => import('./screens/SalesPage'));

const STORAGE_KEY = 'vda_app_state';

interface StoredState {
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
  } catch {}
}

const EMPTY_ANSWERS: QuizAnswers = {};
const EMPTY_SCORES: Scores = { amorPropio: 0, confianza: 0, pazInterior: 0, aberturaEmocional: 0 };

export default function App() {
  const stored = loadState();

  const [screen, setScreen] = useState<Screen>('welcome');
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS);
  const [scores, setScores] = useState<Scores>(EMPTY_SCORES);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(stored?.soundEnabled ?? true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Global audio unlock on any user gesture
  useEffect(() => {
    const unlock = () => {
      if (!audioUnlocked) {
        setAudioUnlocked(true);
        unlockAudio();
      }
    };
    document.addEventListener('touchstart', unlock, { once: true, passive: true });
    document.addEventListener('click', unlock, { once: true });
    return () => {
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
    };
  }, [audioUnlocked]);

  useEffect(() => {
    if (audioUnlocked) unlockAudio();
  }, [audioUnlocked]);

  useEffect(() => {
    initTracking();
    saveAnalyticsEvent('PageView', 'welcome');
  }, []);

  useEffect(() => {
    trackPageView();
    saveAnalyticsEvent('ScreenView', screen);
  }, [screen]);

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

  function persist() {
    saveState({ soundEnabled });
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
    saveAnalyticsEvent('QuizStart', 'welcome');
    trackEvent('QuizStarted', undefined, true);
    saveAnalyticsEvent('QuizStarted', 'welcome');
    const next: Screen = 'question-1';
    persist();
    setScreen(next);
  }

  function handleQ1(val: string) {
    sound(playSelectSound); vibrateShort();
    trackEvent('QuizQuestionAnswered', { question_number: 1 });
    saveAnalyticsEvent('QuestionAnswered', 'question-1');
    const a = { ...answers, q1: val };
    setAnswers(a); persist(); setScreen('question-2');
  }

  function handleQ2(val: string) {
    sound(playSelectSound); vibrateShort();
    trackEvent('QuizQuestionAnswered', { question_number: 2 });
    saveAnalyticsEvent('QuestionAnswered', 'question-2');
    const a = { ...answers, q2: val };
    setAnswers(a); persist(); setScreen('question-3');
  }

  function handleQ3(val: number) {
    sound(playSelectSound); vibrateShort();
    trackEvent('QuizQuestionAnswered', { question_number: 3 });
    saveAnalyticsEvent('QuestionAnswered', 'question-3');
    const a = { ...answers, q3: val };
    setAnswers(a); persist(); setScreen('question-4');
  }

  function handleQ4(val: string) {
    sound(playSelectSound); vibrateShort();
    trackEvent('QuizQuestionAnswered', { question_number: 4 });
    saveAnalyticsEvent('QuestionAnswered', 'question-4');
    const a = { ...answers, q4: val };
    setAnswers(a); persist(); setScreen('question-5');
  }

  function handleQ5(val: string) {
    sound(playSelectSound); vibrateShort();
    trackEvent('QuizQuestionAnswered', { question_number: 5 });
    trackEvent('QuizCompleted', undefined, true);
    saveAnalyticsEvent('QuestionAnswered', 'question-5');
    saveAnalyticsEvent('QuizCompleted', 'question-5');
    const a = { ...answers, q5: val };
    setAnswers(a); persist(); setScreen('processing');
  }

  function handleProcessingComplete() {
    const computed = calculateScores(answers);
    setScores(computed);
    vibrateSpecial();
    persist();
    setScreen('result');
  }

  function handleResultContinue() {
    sound(playTransitionSound);
    trackEvent('ViewResult', undefined, true);
    saveAnalyticsEvent('ViewResult', 'result');
    persist(); setScreen('vsl');
  }

  function handleVSLContinue() {
    sound(playTransitionSound);
    trackEvent('InitiateCheckout', undefined, true);
    saveAnalyticsEvent('InitiateCheckout', 'vsl');
    persist(); setScreen('sales');
  }

  const sp = { soundEnabled, onSoundToggle: handleSoundToggle };

  return (
    <AppLayout>
      <div onClick={handleFirstInteraction} style={{ width: '100%' }}>
        <Suspense fallback={null}>
          {screen === 'welcome' && <WelcomeScreen onStart={handleStart} {...sp} />}
          {screen === 'question-1' && <Question1Screen initialValue={answers.q1} onAnswer={handleQ1} {...sp} />}
          {screen === 'question-2' && <Question2Screen initialValue={answers.q2} onAnswer={handleQ2} {...sp} />}
          {screen === 'question-3' && <Question3Screen initialValue={answers.q3} onAnswer={handleQ3} {...sp} />}
          {screen === 'question-4' && <Question4Screen initialValue={answers.q4} onAnswer={handleQ4} {...sp} />}
          {screen === 'question-5' && <Question5Screen initialValue={answers.q5} onAnswer={handleQ5} {...sp} />}
          {screen === 'processing' && <ProcessingScreen onComplete={handleProcessingComplete} soundEnabled={soundEnabled} />}
          {screen === 'result' && <ResultScreen scores={scores} onContinue={handleResultContinue} {...sp} />}
          {screen === 'vsl' && <VideoSection onContinue={handleVSLContinue} {...sp} />}
          {screen === 'sales' && <SalesPage />}
        </Suspense>
      </div>
    </AppLayout>
  );
}
