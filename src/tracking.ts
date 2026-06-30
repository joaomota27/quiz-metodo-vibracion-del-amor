import { TRACKING_CONFIG } from './tracking-config';

// ── Types ──────────────────────────────────────────────────

export interface TrackingData {
  fbclid: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

interface DebugEvent {
  name: string;
  params?: Record<string, unknown>;
  time: string;
}

// ── Constants ──────────────────────────────────────────────

const STORAGE_KEY = 'vda_tracking_data';
const DEBUG_KEY = 'vda_debug_events';
const PARAM_KEYS = ['fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

// ── Pixel loader (singleton, idempotent) ───────────────────

let pixelLoaded = false;

function getFacebookPixelIds(): string[] {
  return TRACKING_CONFIG.facebookPixelIds.filter(
    id => id && !id.startsWith('COLOCAR_PIXEL_')
  );
}

function loadPixel(): void {
  if (pixelLoaded) return;
  if (typeof window === 'undefined') return;
  const pixelIds = getFacebookPixelIds();
  if (pixelIds.length === 0) {
    return;
  }

  // Standard Meta Pixel base code
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  pixelIds.forEach(pixelId => {
    (window as any).fbq('init', pixelId);
  });
  (window as any).fbq('track', 'PageView');
  pixelLoaded = true;
  logDebug('PageView');
}

// ── URL param capture + localStorage persistence ───────────

function captureParams(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  const existing = getTrackingData();
  let changed = false;
  const data: TrackingData = { ...existing };

  for (const key of PARAM_KEYS) {
    const val = url.searchParams.get(key);
    if (val) {
      (data as any)[key] = val;
      changed = true;
    }
  }

  if (changed) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }
}

export function getTrackingData(): TrackingData {
  if (typeof window === 'undefined') {
    return { fbclid: null, utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as TrackingData;
  } catch {}
  return { fbclid: null, utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null };
}

// ── Build query string with tracking params for Hotmart ────

export function buildTrackingQuery(): string {
  const data = getTrackingData();
  const params = new URLSearchParams();
  for (const key of PARAM_KEYS) {
    const val = (data as any)[key];
    if (val) params.append(key, val);
  }
  const qs = params.toString();
  return qs ? `&${qs}` : '';
}

export function appendTrackingToUrl(url: string): string {
  const tracking = buildTrackingQuery();
  if (!tracking) return url;
  const sep = url.includes('?') ? '' : '?';
  return `${url}${sep}${tracking}`;
}

// ── Event tracking ─────────────────────────────────────────

const firedEvents = new Set<string>();

export function trackEvent(name: string, params?: Record<string, unknown>, unique = false): void {
  if (unique && firedEvents.has(name)) return;
  firedEvents.add(name);

  if (typeof window === 'undefined') return;
  if (!(window as any).fbq) return;

  (window as any).fbq('trackCustom', name, params ?? {});
  logDebug(name, params);
}

export function trackPageView(): void {
  if (typeof window === 'undefined') return;
  if (!(window as any).fbq) return;
  (window as any).fbq('track', 'PageView');
  logDebug('PageView');
}

// ── Debug mode ─────────────────────────────────────────────

function isDebugMode(): boolean {
  if (typeof window === 'undefined') return false;
  return new URL(window.location.href).searchParams.get('debug_tracking') === 'true';
}

function getDebugEvents(): DebugEvent[] {
  try {
    const raw = sessionStorage.getItem(DEBUG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function logDebug(name: string, params?: Record<string, unknown>): void {
  if (!isDebugMode()) return;
  const events = getDebugEvents();
  events.push({ name, params, time: new Date().toLocaleTimeString() });
  try {
    sessionStorage.setItem(DEBUG_KEY, JSON.stringify(events));
  } catch {}
  renderDebugPanel();
}

function renderDebugPanel(): void {
  if (!isDebugMode()) return;
  if (typeof document === 'undefined') return;

  let panel = document.getElementById('vda-debug-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'vda-debug-panel';
    panel.style.cssText = `
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 99999;
      background: rgba(15,6,18,0.95); color: #0f0; font-family: monospace;
      font-size: 10px; padding: 8px 12px; max-height: 40vh; overflow-y: auto;
      border-top: 2px solid #e8539c; backdrop-filter: blur(10px);
    `;
    document.body.appendChild(panel);
  }

  const data = getTrackingData();
  const events = getDebugEvents();
  const eventsHtml = events.slice(-10).map(e =>
    `<div style="color:#f27db8">▸ ${e.name}${e.params ? ' ' + JSON.stringify(e.params) : ''} <span style="color:#666">${e.time}</span></div>`
  ).join('');

  panel.innerHTML = `
    <div style="color:#fff;font-weight:bold;margin-bottom:4px">VDA TRACKING DEBUG</div>
    <div style="color:#aaa">Pixels: <span style="color:#f27db8">${getFacebookPixelIds().join(', ') || '—'}</span></div>
    <div style="color:#aaa">Page: <span style="color:#fff">${typeof window !== 'undefined' ? window.location.pathname : ''}</span></div>
    <div style="color:#aaa">fbclid: <span style="color:#fff">${data.fbclid ?? '—'}</span></div>
    <div style="color:#aaa">utm_source: <span style="color:#fff">${data.utm_source ?? '—'}</span></div>
    <div style="color:#aaa">utm_medium: <span style="color:#fff">${data.utm_medium ?? '—'}</span></div>
    <div style="color:#aaa">utm_campaign: <span style="color:#fff">${data.utm_campaign ?? '—'}</span></div>
    <div style="color:#aaa">utm_content: <span style="color:#fff">${data.utm_content ?? '—'}</span></div>
    <div style="color:#aaa">utm_term: <span style="color:#fff">${data.utm_term ?? '—'}</span></div>
    <div style="margin-top:6px;color:#fff;font-weight:bold">Events (${events.length}):</div>
    ${eventsHtml || '<div style="color:#666">No events yet</div>'}
  `;
}

// ── Init ───────────────────────────────────────────────────

let initialized = false;

export function initTracking(): void {
  if (initialized) return;
  initialized = true;
  captureParams();
  loadPixel();
  if (isDebugMode()) renderDebugPanel();
}
