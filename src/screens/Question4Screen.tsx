import { useState, useEffect } from 'react';
import AnswerOption from '../components/AnswerOption';
import QuestionCard from '../components/QuestionCard';

const OPTIONS = [
  { label: 'A', text: 'Nunca.' },
  { label: 'B', text: 'Algunas veces.' },
  { label: 'C', text: 'Muy seguido.' },
  { label: 'D', text: 'Casi siempre.' },
];

interface Props {
  initialValue?: string;
  onAnswer: (val: string) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export default function Question4Screen({ initialValue, onAnswer, soundEnabled, onSoundToggle }: Props) {
  const [selected, setSelected] = useState<string>(initialValue ?? '');

  useEffect(() => {
    if (selected) {
      const t = setTimeout(() => onAnswer(selected), 350);
      return () => clearTimeout(t);
    }
  }, [selected, onAnswer]);

  return (
    <QuestionCard
      stepNumber={4} totalSteps={5}
      question="¿Con qué frecuencia dejas tus propias necesidades para cuidar de los demás?"
      microfeedback="Estamos entendiendo mejor tu energía emocional…"
      soundEnabled={soundEnabled} onSoundToggle={onSoundToggle}
      onNext={() => { if (selected) onAnswer(selected); }}
      canNext={!!selected}
      autoAdvance
    >
      {OPTIONS.map(opt => (
        <AnswerOption key={opt.label} label={opt.label} text={opt.text}
          selected={selected === opt.label} onClick={() => setSelected(opt.label)} />
      ))}
    </QuestionCard>
  );
}
