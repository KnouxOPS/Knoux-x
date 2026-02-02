
import React from 'react';
import { Music, Minus, Square, X } from 'lucide-react';

export const TitleBar: React.FC = () => {
  return (
    <div style={{
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      background: 'rgba(0,0,0,0.2)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      WebkitAppRegion: 'drag' // Electron specific
    } as any}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00f0ff' }}>
        <Music size={16} />
        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px' }}>KNOUX PLAYER X</span>
      </div>
      <div style={{ display: 'flex', gap: '16px', WebkitAppRegion: 'no-drag' } as any}>
        <Minus size={14} style={{ cursor: 'pointer', opacity: 0.7 }} />
        <Square size={12} style={{ cursor: 'pointer', opacity: 0.7 }} />
        <X size={14} style={{ cursor: 'pointer', opacity: 0.7, color: '#ff4444' }} />
      </div>
    </div>
  );
};
