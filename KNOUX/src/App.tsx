/**
 * ═══════════════════════════════════════════════════════════════════════
 * KNOUX Player X™ - Main App Component
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * المكون الرئيسي للتطبيق
 * 
 * @module App
 * @author KNOUX Development Team
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TitleBar } from './components/layout/TitleBar';
import { Sidebar } from './components/layout/Sidebar';
import { PlayerView } from './features/player/PlayerView';
import { LibraryView } from './features/library/LibraryView';
import { SettingsView } from './features/settings/SettingsView';
import { AIAssistant } from './features/ai/AIAssistant';
import { useAppStore } from './store/appStore';
import './styles/global.css';

// ═══════════════════════════════════════════════════════════════════════════
// المكون الرئيسي
// ═══════════════════════════════════════════════════════════════════════════

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentView, theme, accentColor } = useAppStore();

  // ═════════════════════════════════════════════════════════════════════════
  // التهيئة
  // ═════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const initialize = async () => {
      // Simulate initialization
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsLoading(false);
    };

    initialize();
  }, []);

  // ═════════════════════════════════════════════════════════════════════════
  // عرض شاشة التحميل
  // ═════════════════════════════════════════════════════════════════════════

  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div
          className="loading-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="loading-logo"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="logo-text">KNOUX</span>
            <span className="logo-subtitle">Player X™</span>
          </motion.div>
          
          <motion.div
            className="loading-bar"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
          
          <motion.p
            className="loading-text"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Initializing...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // عرض التطبيق الرئيسي
  // ═════════════════════════════════════════════════════════════════════════

  return (
    <div
      className={`app-container theme-${theme}`}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      {/* Title Bar */}
      <TitleBar />

      {/* Main Content */}
      <div className="main-layout">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="content-area">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="view-container"
            >
              {currentView === 'player' && <PlayerView />}
              {currentView === 'library' && <LibraryView />}
              {currentView === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default App;
