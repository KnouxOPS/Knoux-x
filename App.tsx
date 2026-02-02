
import React from 'react';
import { useAppStore } from './store/appStore';
import { TitleBar } from './components/layout/TitleBar';
import { Sidebar } from './components/layout/Sidebar';
import { PlayerView } from './features/player/PlayerView';
import { AIAssistant } from './features/ai/AIAssistant';
import './styles/global.css';

const App: React.FC = () => {
  const { currentView } = useAppStore();

  return (
    <div className="app-container">
      <TitleBar />
      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          <div className="view-container">
            {currentView === 'player' && <PlayerView />}
            {currentView === 'library' && <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Library View Mockup</div>}
            {currentView === 'settings' && <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Settings View Mockup</div>}
          </div>
          <AIAssistant />
        </main>
      </div>
    </div>
  );
};

export default App;
