
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, Bot, User } from 'lucide-react';
import { NeonPanel } from '../../components/neon/NeonPanel';
import { useAppStore } from '../../store/appStore';

export const AIAssistant: React.FC = () => {
  const { isAIAssistantOpen, toggleAIAssistant } = useAppStore();
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am KNOUX AI. How can I assist you with your media today?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', content: `I can help you with "${input}". Let me analyze your library...` }]);
    }, 1000);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isAIAssistantOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          style={{
            position: 'absolute',
            top: 40, bottom: 0, right: 0,
            width: 350,
            zIndex: 100,
            padding: 20
          }}
        >
          <NeonPanel style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={18} color="#00f0ff" />
                <span style={{ fontWeight: 600, color: '#00f0ff' }}>KNOUX AI</span>
              </div>
              <button onClick={toggleAIAssistant} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{ 
                    background: msg.role === 'user' ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255,255,255,0.05)', 
                    padding: '10px 14px', 
                    borderRadius: '12px',
                    borderTopRightRadius: msg.role === 'user' ? 2 : 12,
                    borderTopLeftRadius: msg.role === 'ai' ? 2 : 12,
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '13px'
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px' }}>
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask anything..."
                style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '8px', padding: '10px', color: 'white', outline: 'none' }}
              />
              <button onClick={sendMessage} style={{ background: '#00f0ff', border: 'none', borderRadius: '8px', width: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={16} color="#000" />
              </button>
            </div>
          </NeonPanel>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
