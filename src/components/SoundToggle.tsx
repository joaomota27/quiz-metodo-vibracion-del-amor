import { Volume2, VolumeX } from 'lucide-react';

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
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  );
}
