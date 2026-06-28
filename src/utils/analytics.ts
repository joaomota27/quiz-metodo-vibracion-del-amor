export const ANALYTICS_KEY = 'quiz_analytics';

export interface AnalyticsEvent {
  event: string;
  step: string;
  timestamp: number;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  userAgent: string;
}

function getUTMParam(key: string): string | null {
  try {
    const stored = localStorage.getItem('vda_tracking_data');
    if (stored) {
      const data = JSON.parse(stored);
      if (data[key]) return data[key];
    }
  } catch {}
  try {
    return new URLSearchParams(window.location.search).get(key);
  } catch {}
  return null;
}

export function saveAnalyticsEvent(event: string, step: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    const existing: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    existing.push({
      event,
      step,
      timestamp: Date.now(),
      utm_source: getUTMParam('utm_source'),
      utm_medium: getUTMParam('utm_medium'),
      utm_campaign: getUTMParam('utm_campaign'),
      userAgent: navigator.userAgent,
    });
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(existing));
  } catch {}
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

export function clearAnalyticsEvents(): void {
  try {
    localStorage.removeItem(ANALYTICS_KEY);
  } catch {}
}
