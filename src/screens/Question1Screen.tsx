import { useState } from 'react';
import AnswerOption from '../components/AnswerOption';
import QuestionCard from '../components/QuestionCard';

const OPTIONS = [
  { label: 'A', text: 'Me siento tranquila y en paz.' },
  { label: 'B', text: 'He tenido algunos altibajos.' },
  { label: 'C', text: 'Me siento emocionalmente agotada.' },
  { label: 'D', text: 'Siento que algo dentro de mí necesita cambiar.' },
];

interface Props {
  initialValue?: string;
  onAnswer: (val: string) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export default function Question1Screen({ initialValue, onAnswer, soundEnabled, onSoundToggle }: Props) {
  const [selected, setSelected] = useState<string>(initialValue ?? '');

  return (
    <QuestionCard
      stepNumber={1} totalSteps={6}
      question="Durante las últimas semanas, ¿cómo describirías tu estado emocional?"
      microfeedback="Excelente, seguimos avanzando…"
      soundEnabled={soundEnabled} onSoundToggle={onSoundToggle}
      onNext={() => { if (selected) onAnswer(selected); }}
      canNext={!!selected}
    >
      {OPTIONS.map(opt => (
        <AnswerOption key={opt.label} label={opt.label} text={opt.text}
          selected={selected === opt.label} onClick={() => setSelected(opt.label)} />
      ))}
    </QuestionCard>
  );
}
