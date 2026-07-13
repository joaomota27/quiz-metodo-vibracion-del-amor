interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
  dark?: boolean;
}

export default function SoundToggle({ enabled, onToggle, dark = false }: SoundToggleProps) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 36, height: 36,
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s ease',
        background: dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.65)',
        color: dark ? 'rgba(255,255,255,0.7)' : '#f27db8',
        border: 'none', cursor: 'pointer',
      }}
      aria-label={enabled ? 'Desactivar sonido' : 'Activar sonido'}
    >
      {enabled ? <IconVolumeOn /> : <IconVolumeOff />}
    </button>
  );
}

function IconVolumeOn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconVolumeOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M17 9l4 4m0-4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
