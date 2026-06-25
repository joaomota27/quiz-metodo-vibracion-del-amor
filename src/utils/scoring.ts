import type { QuizAnswers, Scores } from '../types';

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

function normalize(raw: number, maxRaw: number): number {
  const pct = (raw / maxRaw) * 100;
  // Map to 38–86 range
  const normalized = 38 + (pct / 100) * 48;
  return Math.round(clamp(normalized, 38, 86));
}

export function calculateScores(answers: QuizAnswers): Scores {
  let amorPropio = 0;
  let confianza = 0;
  let pazInterior = 0;
  let aberturaEmocional = 0;

  // Q1
  if (answers.q1 === 'A') { pazInterior += 4; confianza += 3; }
  else if (answers.q1 === 'B') { pazInterior += 2; confianza += 2; }
  else if (answers.q1 === 'C') { pazInterior += 1; amorPropio += 1; }
  else if (answers.q1 === 'D') { aberturaEmocional += 1; amorPropio += 1; }

  // Q2
  if (answers.q2 === 'A') { aberturaEmocional += 4; confianza += 3; }
  else if (answers.q2 === 'B') { aberturaEmocional += 3; confianza += 2; }
  else if (answers.q2 === 'C') { aberturaEmocional += 2; pazInterior += 1; }
  else if (answers.q2 === 'D') { aberturaEmocional += 1; pazInterior += 1; }

  // Q3 — slider 1–5
  const q3 = answers.q3 ?? 3;
  amorPropio += q3;

  // Q4
  if (answers.q4 === 'A') { amorPropio += 4; confianza += 4; }
  else if (answers.q4 === 'B') { amorPropio += 3; confianza += 3; }
  else if (answers.q4 === 'C') { amorPropio += 2; confianza += 2; }
  else if (answers.q4 === 'D') { amorPropio += 1; confianza += 1; }

  // Q5
  if (answers.q5 === 'A') amorPropio += 3;
  else if (answers.q5 === 'B') confianza += 3;
  else if (answers.q5 === 'C') pazInterior += 3;
  else if (answers.q5 === 'D') aberturaEmocional += 3;

  // Q6
  if (answers.q6 === 'A') amorPropio += 4;
  else if (answers.q6 === 'B') amorPropio += 2;
  else if (answers.q6 === 'C') amorPropio += 1;

  // Q7
  if (answers.q7 === 'A') { confianza += 4; amorPropio += 4; }
  else if (answers.q7 === 'B') { confianza += 3; amorPropio += 3; }
  else if (answers.q7 === 'C') { confianza += 2; amorPropio += 2; }
  else if (answers.q7 === 'D') { confianza += 1; amorPropio += 1; }

  // Q8
  if (answers.q8 === 'A') { pazInterior += 4; aberturaEmocional += 4; }
  else if (answers.q8 === 'B') { pazInterior += 3; aberturaEmocional += 3; }
  else if (answers.q8 === 'C') { pazInterior += 2; aberturaEmocional += 2; }

  // Max possible: amorPropio = 1+3+5+4+3+4+4 = 24, confianza = 3+3+4+3+4 = 17,
  // pazInterior = 4+2+3+4+4 = 17, aberturaEmocional = 4+1+3+4 = 12
  return {
    amorPropio: normalize(amorPropio, 24),
    confianza: normalize(confianza, 17),
    pazInterior: normalize(pazInterior, 17),
    aberturaEmocional: normalize(aberturaEmocional, 12),
  };
}

export function getLowestDimension(scores: Scores): keyof Scores {
  const entries = Object.entries(scores) as [keyof Scores, number][];
  return entries.reduce((a, b) => (b[1] < a[1] ? b : a))[0];
}

export function getPersonalizedText(lowest: keyof Scores): string {
  const texts: Record<keyof Scores, string> = {
    amorPropio:
      'Tu resultado indica que fortalecer la relación contigo misma puede ser un paso importante para sentirte más segura, valiosa y emocionalmente equilibrada.',
    confianza:
      'Tu resultado indica que tu confianza emocional puede fortalecerse con pequeños hábitos diarios que te ayuden a reconectar con tu valor personal.',
    pazInterior:
      'Tu resultado indica que crear momentos de calma y presencia puede ayudarte a vivir tu vida emocional con más ligereza y claridad.',
    aberturaEmocional:
      'Tu resultado indica que abrirte nuevamente al amor puede comenzar desde una relación más tranquila, segura y amorosa contigo misma.',
  };
  return texts[lowest];
}
