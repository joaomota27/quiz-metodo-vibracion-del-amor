import { ChevronRight } from 'lucide-react';
import React from 'react';

interface CTAButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  showArrow?: boolean;
  className?: string;
  pulse?: boolean;
  disabled?: boolean;
}

export default function CTAButton({
  children,
  onClick,
  variant = 'primary',
  fullWidth = true,
  showArrow = false,
  className = '',
  pulse = false,
  disabled = false,
}: CTAButtonProps) {
  const base: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '1rem 2rem',
    borderRadius: 9999,
    fontWeight: 600,
    fontSize: '1rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    transition: 'all 0.3s ease',
    width: fullWidth ? '100%' : undefined,
  };

  const styles: Record<string, React.CSSProperties> = {
    primary: {
      ...base,
      background: 'linear-gradient(135deg, #e8539c 0%, #f27db8 50%, #e8539c 100%)',
      backgroundSize: '200% auto',
      color: 'white',
      boxShadow: '0 4px 20px rgba(232,83,156,0.35)',
    },
    secondary: {
      ...base,
      background: 'white',
      color: '#e8539c',
      border: '1px solid rgba(232,83,156,0.25)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    },
    outline: {
      ...base,
      background: 'transparent',
      color: '#e8539c',
      border: '2px solid #e8539c',
    },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${pulse && !disabled ? 'anim-pulse-glow' : ''} ${className}`}
      style={styles[variant]}
    >
      {children}
      {showArrow && <ChevronRight size={18} strokeWidth={2.5} />}
    </button>
  );
}
