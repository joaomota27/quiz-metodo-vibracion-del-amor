import { Home, Calendar, Music, User } from 'lucide-react';
import React from 'react';

export type NavTab = 'inicio' | 'progreso' | 'biblioteca' | 'perfil';

interface Props {
  active: NavTab;
  onChange: (tab: NavTab) => void;
}

const TABS: { key: NavTab; label: string; icon: React.ReactNode }[] = [
  { key: 'inicio',     label: 'Inicio',      icon: <Home size={20} /> },
  { key: 'progreso',    label: 'Mi Progreso', icon: <Calendar size={20} /> },
  { key: 'biblioteca',  label: 'Biblioteca',  icon: <Music size={20} /> },
  { key: 'perfil',      label: 'Perfil',      icon: <User size={20} /> },
];

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="bottom-nav"
      style={{
        background: 'rgba(26,12,31,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        height: 'calc(56px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {TABS.map(tab => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            className="bottom-nav-item"
            onClick={() => onChange(tab.key)}
            style={{
              color: isActive ? '#f27db8' : 'rgba(255,255,255,0.4)',
              flex: 1,
            }}
          >
            {tab.icon}
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
