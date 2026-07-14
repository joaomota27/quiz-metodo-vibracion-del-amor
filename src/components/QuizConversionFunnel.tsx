import { useMemo, useState } from 'react';

export interface QuizFunnelStep {
  id: string;
  name: string;
  reachedCount: number;
  conversionFromStart: number;
  conversionFromPrevious: number | null;
  dropoffRate: number | null;
}

interface Props {
  steps: QuizFunnelStep[];
  loading?: boolean;
}

function formatPercent(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return '—';
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
}

function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR');
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function tooltipText(step: QuizFunnelStep, index: number): string {
  const parts = [
    step.name,
    `${formatNumber(step.reachedCount)} visitantes chegaram nesta etapa`,
    `${formatPercent(step.conversionFromStart)} dos visitantes totais chegaram aqui`,
  ];

  if (index > 0) {
    parts.push(`${formatPercent(step.conversionFromPrevious)} avançaram da etapa anterior`);
    parts.push(`${formatPercent(step.dropoffRate)} de abandono`);
  }

  return parts.join('\n');
}

export default function QuizConversionFunnel({ steps, loading = false }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  const chart = useMemo(() => {
    const stepWidth = 156;
    const gap = 18;
    const width = Math.max(steps.length * stepWidth + Math.max(steps.length - 1, 0) * gap, 320);
    const height = 220;
    const centerY = 84;
    const maxFlowHeight = 96;
    const minFlowHeight = 8;
    const first = Math.max(steps[0]?.reachedCount ?? 0, 1);

    const points = steps.map((step, index) => {
      const x = index * (stepWidth + gap) + stepWidth / 2;
      const rawHeight = step.reachedCount > 0 ? (step.reachedCount / first) * maxFlowHeight : 0;
      const flowHeight = step.reachedCount > 0 ? clamp(rawHeight, minFlowHeight, maxFlowHeight) : 0;
      return { x, flowHeight };
    });

    return { stepWidth, gap, width, height, centerY, maxFlowHeight, points };
  }, [steps]);

  if (loading) {
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              height: 54,
              borderRadius: 14,
              background: 'linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.1),rgba(255,255,255,0.05))',
              opacity: 0.75,
            }}
          />
        ))}
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 13, textAlign: 'center', margin: '20px 0' }}>
        Este quiz ainda não possui etapas configuradas.
      </p>
    );
  }

  if ((steps[0]?.reachedCount ?? 0) === 0) {
    return (
      <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 13, textAlign: 'center', margin: '20px 0' }}>
        Ainda não há dados suficientes para visualizar a conversão deste quiz.
      </p>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
          Sessões únicas que alcançaram cada etapa. Passe o mouse sobre uma etapa para ver conversão e abandono.
        </p>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div style={{ width: chart.width, minWidth: '100%', position: 'relative' }}>
          <svg
            width={chart.width}
            height={chart.height}
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            role="img"
            aria-label="Funil de conversão do quiz"
            style={{ display: 'block' }}
          >
            <defs>
              <linearGradient id="quiz-funnel-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.88" />
                <stop offset="35%" stopColor="#a78bd4" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#e8539c" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#f27db8" stopOpacity="0.95" />
              </linearGradient>
              <filter id="quiz-funnel-glow" x="-20%" y="-80%" width="140%" height="260%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.9 0 1 0 0 0.3 0 0 1 0 0.7 0 0 0 0.28 0" />
                <feBlend in="SourceGraphic" />
              </filter>
            </defs>

            {chart.points.slice(0, -1).map((point, index) => {
              const next = chart.points[index + 1];
              const c1 = point.x + chart.stepWidth * 0.45;
              const c2 = next.x - chart.stepWidth * 0.45;
              const topA = chart.centerY - point.flowHeight / 2;
              const bottomA = chart.centerY + point.flowHeight / 2;
              const topB = chart.centerY - next.flowHeight / 2;
              const bottomB = chart.centerY + next.flowHeight / 2;
              const d = [
                `M ${point.x} ${topA}`,
                `C ${c1} ${topA}, ${c2} ${topB}, ${next.x} ${topB}`,
                `L ${next.x} ${bottomB}`,
                `C ${c2} ${bottomB}, ${c1} ${bottomA}, ${point.x} ${bottomA}`,
                'Z',
              ].join(' ');
              return <path key={`${steps[index].id}-${steps[index + 1].id}`} d={d} fill="url(#quiz-funnel-flow)" filter="url(#quiz-funnel-glow)" />;
            })}

            {chart.points.map((point, index) => {
              const step = steps[index];
              const active = hovered === index;
              return (
                <g
                  key={step.id}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'default' }}
                >
                  <title>{tooltipText(step, index)}</title>
                  <rect
                    x={point.x - 3}
                    y={chart.centerY - chart.maxFlowHeight / 2 - 8}
                    width="6"
                    height={chart.maxFlowHeight + 16}
                    rx="3"
                    fill={active ? '#ffffff' : 'rgba(255,255,255,0.28)'}
                  />
                  <circle
                    cx={point.x}
                    cy={chart.centerY}
                    r={active ? 7 : 5}
                    fill="#ffffff"
                    opacity={active ? 0.95 : 0.78}
                  />
                  <text x={point.x} y="164" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="11" fontWeight="600">
                    {formatNumber(step.reachedCount)}
                  </text>
                  <text x={point.x} y="181" textAnchor="middle" fill="#f27db8" fontSize="11" fontWeight="600">
                    {formatPercent(step.conversionFromStart)}
                  </text>
                  <foreignObject x={point.x - chart.stepWidth / 2 + 8} y="190" width={chart.stepWidth - 16} height="30">
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.62)',
                        fontSize: 10.5,
                        lineHeight: 1.2,
                        textAlign: 'center',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {step.name}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>

          {hovered !== null && (
            <div
              style={{
                position: 'absolute',
                left: clamp(chart.points[hovered].x - 116, 8, chart.width - 240),
                top: 8,
                width: 224,
                background: 'rgba(15,6,18,0.96)',
                border: '1px solid rgba(242,125,184,0.3)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
                borderRadius: 14,
                padding: 12,
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              <p style={{ color: 'white', fontSize: 12, fontWeight: 700, margin: '0 0 8px' }}>{steps[hovered].name}</p>
              <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 11, lineHeight: 1.45, margin: 0, whiteSpace: 'pre-line' }}>
                {tooltipText(steps[hovered], hovered).split('\n').slice(1).join('\n')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
        {steps.map((step, index) => (
          <div
            key={step.id}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) auto auto auto',
              gap: 10,
              alignItems: 'center',
              padding: '9px 0',
              borderTop: index === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: 12, minWidth: 0 }}>{step.name}</span>
            <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{formatNumber(step.reachedCount)}</span>
            <span style={{ color: '#f27db8', fontSize: 11, fontWeight: 600, minWidth: 44, textAlign: 'right' }}>{formatPercent(step.conversionFromStart)}</span>
            <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: 11, minWidth: 44, textAlign: 'right' }}>{index === 0 ? '—' : formatPercent(step.conversionFromPrevious)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
