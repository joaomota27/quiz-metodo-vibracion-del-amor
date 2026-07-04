import type { SupabaseClient } from '@supabase/supabase-js';

export const ANALYTICS_KEY = 'quiz_analytics';
const SESSION_KEY = 'quiz_session_id';
const TABLE_NAME = 'quiz_analytics_events';

export interface AnalyticsEvent {
  id?: string;
  event: string;
  step: string;
  timestamp: number;
  session_id?: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  userAgent: string;
}

interface AnalyticsRow {
  id?: string;
  event: string;
  step: string;
  timestamp: number;
  session_id: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  user_agent: string;
}

let supabasePromise: Promise<SupabaseClient | null> | undefined;

function getSupabase(): Promise<SupabaseClient | null> {
  if (supabasePromise) return supabasePromise;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return Promise.resolve(null);

  supabasePromise = import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(url, anonKey)
  );
  return supabasePromise;
}

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
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

function toRow(event: AnalyticsEvent): AnalyticsRow {
  return {
    event: event.event,
    step: event.step,
    timestamp: event.timestamp,
    session_id: event.session_id ?? getSessionId(),
    utm_source: event.utm_source,
    utm_medium: event.utm_medium,
    utm_campaign: event.utm_campaign,
    user_agent: event.userAgent,
  };
}

function fromRow(row: AnalyticsRow): AnalyticsEvent {
  return {
    id: row.id,
    event: row.event,
    step: row.step,
    timestamp: row.timestamp,
    session_id: row.session_id,
    utm_source: row.utm_source,
    utm_medium: row.utm_medium,
    utm_campaign: row.utm_campaign,
    userAgent: row.user_agent,
  };
}

function saveLocal(event: AnalyticsEvent): void {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    const existing: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    existing.push(event);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(existing));
  } catch {}
}

export function saveAnalyticsEvent(event: string, step: string): void {
  if (typeof window === 'undefined') return;
  const payload: AnalyticsEvent = {
    event,
    step,
    timestamp: Date.now(),
    session_id: getSessionId(),
    utm_source: getUTMParam('utm_source'),
    utm_medium: getUTMParam('utm_medium'),
    utm_campaign: getUTMParam('utm_campaign'),
    userAgent: navigator.userAgent,
  };

  saveLocal(payload);

  void getSupabase().then(client => {
    if (client) return client.from(TABLE_NAME).insert(toRow(payload));
  });
}

export async function getAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  const client = await getSupabase();
  if (client) {
    const { data, error } = await client
      .from(TABLE_NAME)
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10000);

    if (!error && data) return (data as AnalyticsRow[]).map(fromRow);
  }

  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

export async function clearAnalyticsEvents(): Promise<void> {
  const client = await getSupabase();
  if (client) {
    await client.from(TABLE_NAME).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }

  try {
    localStorage.removeItem(ANALYTICS_KEY);
  } catch {}
}
