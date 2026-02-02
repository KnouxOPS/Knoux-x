import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Settings, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { NeonPanel } from '../../components/neon/NeonPanel';
import { NeonButton } from '../../components/neon/NeonButton';
import { NeonBadge } from '../../components/neon/NeonBadge';
import { NeonInput } from '../../components/neon/NeonInput';
import { useAppStore } from '../../store/appStore';
import { openRouterService, AVAILABLE_MODELS } from '../../core/services/ai/OpenRouterService';

export const AIAssistant: React.FC = () => {
  const { isAIAssistantOpen, toggleAIAssistant } = useAppStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState(openRouterService.getCurrentModel());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: 'user', content: input, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
        const stream = openRouterService.streamChat(userMsg.content);
        let replyContent = '';
        const replyId = Date.now() + 1;
        setMessages(prev => [...prev, { role: 'assistant', content: '', id: replyId }]);

        for await (const chunk of stream) {
            replyContent += chunk;
            setMessages(prev => prev.map(m => m.id === replyId ? { ...m, content: replyContent } : m));
        }
    } catch (e) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Error communicating with AI.", id: Date.now() }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
      if (apiKey) await openRouterService.setApiKey(apiKey);
      await openRouterService.setModel(selectedModel);
      setShowSettings(false);
  };

  return (
    <AnimatePresence>
      {isAIAssistantOpen && (
        <motion.div
          style={{ position: 'fixed', bottom: 20, right: 20, width: 400, zIndex: 100 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <NeonPanel style={{ height: 600, display: 'flex', flexDirection: 'column' }} glowIntensity="high">
            {/* Header */}
            <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Bot size={20} color="#00f0ff" />
                    <span style={{ fontWeight: 'bold' }}>KNOUX AI</span>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                    <button onClick={() => setShowSettings(!showSettings)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Settings size={16} /></button>
                    <button onClick={() => { setMessages([]); openRouterService.clearContext(); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    <button onClick={toggleAIAssistant} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={18} /></button>
                </div>
            </div>

            {/* Settings */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden', background: 'rgba(0,0,0,0.3)', padding: 10 }}>
                        <NeonInput 
                            placeholder="OpenRouter API Key" 
                            type="password" 
                            value={apiKey} 
                            onChange={e => setApiKey(e.target.value)} 
                            style={{ marginBottom: 10 }}
                        />
                        <select 
                            value={selectedModel} 
                            onChange={e => setSelectedModel(e.target.value)}
                            style={{ width: '100%', padding: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 8, marginBottom: 10 }}
                        >
                            {AVAILABLE_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        <NeonButton size="sm" fullWidth onClick={handleSaveSettings}>Save Settings</NeonButton>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages */}
            <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: 50 }}>
                        <Sparkles size={48} style={{ marginBottom: 10 }} />
                        <p>How can I help you today?</p>
                        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
                            <NeonBadge onClick={() => setInput("Recommend a movie")}>Recommend Movie</NeonBadge>
                            <NeonBadge onClick={() => setInput("Create a playlist")}>Create Playlist</NeonBadge>
                        </div>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                        <div style={{
                            padding: '10px 14px',
                            borderRadius: 12,
                            background: msg.role === 'user' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '0.9rem'
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 10 }}>
                <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 20, padding: '10px 15px', color: 'white', outline: 'none' }}
                />
                <motion.button 
                    onClick={sendMessage}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #00f0ff, #ff00f0)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                    <Send size={18} color="white" />
                </motion.button>
            </div>
          </NeonPanel>
        </motion.div>
      )}
    </AnimatePresence>
  );
};