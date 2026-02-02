import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TitleBar } from './components/layout/TitleBar';
import { Sidebar } from './components/layout/Sidebar';
import { PlayerView } from './features/player/PlayerView';
import { LibraryView } from './features/library/LibraryView';
import { SettingsView } from './features/settings/SettingsView';
import { AIAssistant } from './features/ai/AIAssistant';
import { useAppStore } from './store/appStore';
import { SystemOrchestrator } from './core/orchestrator/SystemOrchestrator';
import { openRouterService } from './core/services/ai/OpenRouterService';
import './styles/global.css';
import './styles/splash.css';

// Splash Screen Component
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <motion.div className="splash-screen-enhanced" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <div className="splash-content">
                <img src="https://knoux.dev/icons/app-icon.png" className="splash-logo-image" alt="Logo" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/150/000000/00f0ff?text=KNOUX'} />
                <h1 className="splash-brand-name">KNOUX</h1>
                <span className="splash-brand-subtitle">PLAYER X™</span>
                <div className="splash-progress-container">
                    <div className="splash-progress-bar" style={{ width: `${progress}%` }} />
                </div>
                <div className="splash-loading-text">INITIALIZING CORE SYSTEMS...</div>
            </div>
        </motion.div>
    );
};

const App: React.FC = () => {
  const { currentView } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // Initialize core systems
      SystemOrchestrator.initialize();
      openRouterService.initialize();
  }, []);

  return (
    <>
        <AnimatePresence>
            {loading && <SplashScreen onComplete={() => setLoading(false)} />}
        </AnimatePresence>
        
        {!loading && (
            <motion.div className="app-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <TitleBar />
              <div className="main-layout">
                <Sidebar />
                <main className="content-area">
                  <div className="view-container">
                    {currentView === 'player' && <PlayerView />}
                    {currentView === 'library' && <LibraryView />}
                    {currentView === 'settings' && <SettingsView />}
                  </div>
                  <AIAssistant />
                </main>
              </div>
            </motion.div>
        )}
    </>
  );
};

export default App;