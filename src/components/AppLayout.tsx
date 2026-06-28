import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function AppLayout({ children, className = '' }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex items-start justify-center" style={{ background: '#fdf4f8' }}>
      <div
        className={`w-full max-w-md min-h-screen relative overflow-x-hidden ${className}`}
        style={{ maxWidth: '100%', boxSizing: 'border-box' }}
      >
        {children}
      </div>
    </div>
  );
}
