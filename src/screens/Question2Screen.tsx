import { useState } from 'react';
import AnswerOption from '../components/AnswerOption';
import QuestionCard from '../components/QuestionCard';

const OPTIONS = [
  { label: 'A', text: 'Esperanza.' },
  { label: 'B', text: 'Ilusión con algunas dudas.' },
  { label: 'C', text: 'Incertidumbre.' },
  { label: 'D', text: 'Prefiero no pensar demasiado en eso.' },
];

interface Props {
  initialValue?: string;
  onAnswer: (val: string) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export default function Question2Screen({ initialValue, onAnswer, soundEnabled, onSoundToggle }: Props) {
  const [selected, setSelected] = useState<string>(initialValue ?? '');

  return (
    <QuestionCard
      stepNumber={2} totalSteps={6}
      question="Cuando piensas en el amor, ¿qué sentimiento aparece primero?"
      microfeedback="Estamos entendiendo mejor tu energía emocional…"
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
