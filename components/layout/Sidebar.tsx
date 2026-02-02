
import React from 'react';
import { Play, Library, Settings, MessageSquare, FolderOpen } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { NeonButton } from '../neon/NeonButton';

export const Sidebar: React.FC = () => {
  const { currentView, setView, toggleAIAssistant } = useAppStore();

  const navItems = [
    { id: 'player', label: 'Player', icon: <Play size={18} /> },
    { id: 'library', label: 'Library', icon: <Library size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside style={{ width: '240px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Menu</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                background: currentView === item.id ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: currentView === item.id ? '#00f0ff' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: 500
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <NeonButton 
          variant="ghost" 
          fullWidth 
          leftIcon={<MessageSquare size={16} />}
          onClick={toggleAIAssistant}
        >
          AI Assistant
        </NeonButton>
      </div>
    </aside>
  );
};
