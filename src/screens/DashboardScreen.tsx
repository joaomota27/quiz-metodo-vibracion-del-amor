import { useState, useEffect, type ReactNode, type FormEvent } from 'react';
import { getAnalyticsEvents, clearAnalyticsEvents, type AnalyticsEvent } from '../utils/analytics';
import { Lock, BarChart2, Users, TrendingDown, RefreshCw, Trash2 } from 'lucide-react';

const FUNNEL_STEPS = [
  { key: 'welcome', label: 'Welcome' },
  { key: 'before-start', label: 'Antes de empezar' },
  { key: 'question-1', label: 'Pregunta 1' },
  { key: 'question-2', label: 'Pregunta 2' },
  { key: 'question-3', label: 'Pregunta 3' },
  { key: 'question-4', label: 'Pregunta 4' },
  { key: 'question-5', label: 'Pregunta 5' },
  { key: 'quick-questions', label: 'Preguntas rápidas' },
  { key: 'processing', label: 'Procesando' },
  { key: 'result', label: 'Resultado' },
  { key: 'vsl', label: 'Video' },
  { key: 'sales', label: 'Ventas' },
];

function countByStep(events: AnalyticsEvent[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const e of events) {
    counts[e.step] = (counts[e.step] ?? 0) + 1;
  }
  return counts;
}

function countBySource(events: AnalyticsEvent[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const e of events) {
    const src = e.utm_source ?? '(direct)';
    counts[src] = (counts[src] ?? 0) + 1;
  }
  return counts;
}

function FunnelBar({ label, count, total, prev }: { label: string; count: number; total: number; prev: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  const dropOff = prev > 0 && prev !== count ? Math.round(((prev - count) / prev) * 100) : null;
  const barWidth = Math.max(pct, 2);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {dropOff !== null && dropOff > 0 && (
            <span style={{ fontSize: 11, color: '#f87171', background: 'rgba(248,113,113,0.12)', borderRadius: 4, padding: '1px 5px' }}>
              -{dropOff}%
            </span>
          )}
          <span style={{ color: 'white', fontWeight: 600, fontSize: 13, minWidth: 28, textAlign: 'right' }}>{count}</span>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, minWidth: 36, textAlign: 'right' }}>{pct.toFixed(1)}%</span>
        </div>
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${barWidth}%`,
          background: 'linear-gradient(90deg,#e8539c,#f27db8)',
          borderRadius: 999,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
}

function BarChart({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const max = Math.max(...entries.map(e => e[1]), 1);
  const chartH = 120;
  const barW = 40;
  const gap = 12;
  const svgW = entries.length * (barW + gap);

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={Math.max(svgW, 200)} height={chartH + 40} style={{ display: 'block' }}>
        {entries.map(([key, val], i) => {
          const barH = Math.max((val / max) * chartH, 2);
          const x = i * (barW + gap);
          const y = chartH - barH;
          return (
            <g key={key}>
              <defs>
                <linearGradient id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e8539c" />
                  <stop offset="100%" stopColor="#f27db8" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <rect x={x} y={y} width={barW} height={barH} fill={`url(#g${i})`} rx={4} />
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fill="white" fontSize={11} fontWeight={600}>{val}</text>
              <text x={x + barW / 2} y={chartH + 16} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={10}>
                {key.length > 8 ? key.slice(0, 8) + '…' : key}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Card({ title, children, icon }: { title: string; children: ReactNode; icon?: ReactNode }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        {icon && <span style={{ color: '#f27db8' }}>{icon}</span>}
        <h2 style={{
          color: 'white',
          fontSize: 15,
          fontWeight: 600,
          margin: 0,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12,
      padding: 16,
      textAlign: 'center',
    }}>
      <p style={{ color: '#f27db8', fontSize: clampFont(28, 36), fontWeight: 700, margin: 0 }}>{value}</p>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4, marginBottom: 0 }}>{label}</p>
      {sub && <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 2, marginBottom: 0 }}>{sub}</p>}
    </div>
  );
}

function clampFont(min: number, max: number): string {
  return `clamp(${min}px, 5vw, ${max}px)`;
}

export default function DashboardScreen() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    if (authed) void refresh();
  }, [authed]);

  function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (pw === 'admin123') {
      setAuthed(true);
      setError('');
    } else {
      setError('Contraseña incorrecta.');
    }
  }

  async function refresh() {
    setEvents(await getAnalyticsEvents());
  }

  async function handleClear() {
    if (confirm('¿Eliminar todos los datos de analytics?')) {
      await clearAnalyticsEvents();
      setEvents([]);
    }
  }

  const bg = 'linear-gradient(135deg,#0f0612,#1a0c1f)';

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg,#e8539c,#f27db8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Lock size={24} color="white" />
            </div>
            <h1 style={{
              color: 'white',
              fontSize: clampFont(20, 26),
              fontFamily: "'Playfair Display', Georgia, serif",
              marginBottom: 8,
            }}>Dashboard Analytics</h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>Método Vibración del Amor™</p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Contraseña"
              value={pw}
              onChange={e => setPw(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 12,
                border: `1px solid ${error ? '#f87171' : 'rgba(255,255,255,0.12)'}`,
                background: 'rgba(255,255,255,0.07)',
                color: 'white',
                fontSize: 15,
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: error ? 8 : 16,
              }}
              autoFocus
            />
            {error && <p style={{ color: '#f87171', fontSize: 12, marginBottom: 12 }}>{error}</p>}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg,#e8539c,#f27db8)',
                color: 'white',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                minHeight: 44,
              }}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const stepCounts = countByStep(events);
  const sourceCounts = countBySource(events);
  const totalStarts = stepCounts['welcome'] ?? 0;
  const totalCompleted = stepCounts['result'] ?? 0;
  const completionRate = totalStarts > 0 ? Math.round((totalCompleted / totalStarts) * 100) : 0;
  const totalSales = stepCounts['sales'] ?? 0;

  const uniqueSessions = new Set(events.map(e => Math.floor(e.timestamp / (1000 * 60 * 30)))).size;

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: 0 }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{
            color: 'white',
            fontSize: clampFont(16, 20),
            fontFamily: "'Playfair Display', Georgia, serif",
            margin: 0,
          }}>Analytics Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>
            Vibración del Amor™ · {events.length} eventos registrados
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => void refresh()}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '8px 12px',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              minHeight: 44,
            }}
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => void handleClear()}
            style={{
              background: 'rgba(248,113,113,0.1)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: 8,
              padding: '8px 12px',
              color: '#f87171',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              minHeight: 44,
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
          <StatCard label="Inicios del quiz" value={totalStarts} />
          <StatCard label="Completaron quiz" value={totalCompleted} sub={`${completionRate}% tasa`} />
          <StatCard label="Llegaron a ventas" value={totalSales} />
          <StatCard label="Sesiones (~30min)" value={uniqueSessions} />
        </div>

        {/* Funnel */}
        <Card title="Embudo de conversión" icon={<TrendingDown size={16} />}>
          {FUNNEL_STEPS.map((step, i) => {
            const count = stepCounts[step.key] ?? 0;
            const prev = i === 0 ? count : (stepCounts[FUNNEL_STEPS[i - 1].key] ?? 0);
            return (
              <FunnelBar
                key={step.key}
                label={step.label}
                count={count}
                total={totalStarts}
                prev={prev}
              />
            );
          })}
        </Card>

        {/* Traffic Sources */}
        <Card title="Fuentes de tráfico (utm_source)" icon={<Users size={16} />}>
          {Object.keys(sourceCounts).length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, textAlign: 'center', margin: '16px 0' }}>
              Sin datos de UTM registrados aún.
            </p>
          ) : (
            <BarChart data={sourceCounts} />
          )}
        </Card>

        {/* UTM Details */}
        {Object.keys(sourceCounts).length > 0 && (
          <Card title="Detalle de fuentes" icon={<BarChart2 size={16} />}>
            {Object.entries(sourceCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([src, cnt]) => {
                const pct = events.length > 0 ? Math.round((cnt / events.length) * 100) : 0;
                return (
                  <div key={src} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{src}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{cnt}</span>
                      <span style={{
                        background: 'rgba(232,83,156,0.15)',
                        color: '#f27db8',
                        fontSize: 11,
                        borderRadius: 4,
                        padding: '1px 6px',
                        minWidth: 36,
                        textAlign: 'center',
                      }}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
          </Card>
        )}

        {/* Step completion rates */}
        <Card title="Tasa de completación por paso" icon={<BarChart2 size={16} />}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>
            Porcentaje de visitantes que llegaron a cada etapa (base: inicios)
          </div>
          {FUNNEL_STEPS.map(step => {
            const count = stepCounts[step.key] ?? 0;
            const rate = totalStarts > 0 ? Math.round((count / totalStarts) * 100) : 0;
            return (
              <div key={step.key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>{step.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{count}</span>
                  <span style={{
                    color: rate >= 70 ? '#4ade80' : rate >= 40 ? '#fbbf24' : '#f87171',
                    fontWeight: 600,
                    fontSize: 12,
                    minWidth: 36,
                    textAlign: 'right',
                  }}>{rate}%</span>
                </div>
              </div>
            );
          })}
        </Card>

        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, textAlign: 'center', marginTop: 8, marginBottom: 24 }}>
          Datos centralizados de visitantes · quiz_analytics_events
        </p>
      </div>
    </div>
  );
}
