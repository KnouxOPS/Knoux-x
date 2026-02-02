/**
 * ═══════════════════════════════════════════════════════════════════════
 * KNOUX Player X™ - AI Assistant
 * ═══════════════════════════════════════════════════════════════════════
 * 
* مساعد الذكاء الاصطناعي - دردشة ذكية للمستخدم
 * 
 * @module Features/AI
 * @author KNOUX Development Team
 * @version 1.0.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User,
  Sparkles,
  ChevronDown,
  Trash2,
} from 'lucide-react';
import { NeonPanel } from '../../components/neon/NeonPanel';
import { NeonButton } from '../../components/neon/NeonButton';
import { useAppStore } from '../../store/appStore';

// ═══════════════════════════════════════════════════════════════════════════
// أنواع البيانات
// ═══════════════════════════════════════════════════════════════════════════

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Suggestion {
  label: string;
  prompt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// مكون مساعد الذكاء الاصطناعي
// ═══════════════════════════════════════════════════════════════════════════

export const AIAssistant: React.FC = () => {
  const { isAIAssistantOpen, toggleAIAssistant } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ═════════════════════════════════════════════════════════════════════════
  // الاقتراحات
  // ═════════════════════════════════════════════════════════════════════════

  const suggestions: Suggestion[] = [
    { label: 'Recommend movies', prompt: 'Recommend some good movies to watch' },
    { label: 'Create playlist', prompt: 'Create a playlist for relaxing evening' },
    { label: 'Audio help', prompt: 'How do I adjust the equalizer?' },
    { label: 'Subtitle sync', prompt: 'How do I sync subtitles with AI?' },
  ];

  // ═════════════════════════════════════════════════════════════════════════
  // التمرير التلقائي
  // ═════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ═════════════════════════════════════════════════════════════════════════
  // إرسال الرسالة
  // ═════════════════════════════════════════════════════════════════════════

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await window.knouxAPI.ai.chat(content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([]);
  };

  // ═════════════════════════════════════════════════════════════════════════
  // عرض المكون
  // ═════════════════════════════════════════════════════════════════════════

  return (
    <AnimatePresence>
      {isAIAssistantOpen && (
        <motion.div
          className="ai-assistant"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <NeonPanel
            variant="primary"
            padding="none"
            glowIntensity="medium"
            className="ai-panel"
          >
            {/* Header */}
            <div className="ai-header">
              <div className="ai-title">
                <Sparkles size={18} className="ai-icon" />
                <span>KNOUX AI</span>
              </div>
              <div className="ai-actions">
                <motion.button
                  className="ai-action-btn"
                  onClick={clearChat}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Clear chat"
                >
                  <Trash2 size={16} />
                </motion.button>
                <motion.button
                  className="ai-action-btn"
                  onClick={toggleAIAssistant}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Close"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="ai-messages">
              {messages.length === 0 ? (
                <div className="ai-welcome">
                  <Bot size={48} className="welcome-icon" />
                  <h3>Hello! I'm KNOUX AI</h3>
                  <p>I can help you with:</p>
                  <ul>
                    <li>Media recommendations</li>
                    <li>Playlist creation</li>
                    <li>Player controls</li>
                    <li>Subtitle synchronization</li>
                  </ul>

                  <div className="suggestions">
                    {suggestions.map((suggestion) => (
                      <motion.button
                        key={suggestion.label}
                        className="suggestion-chip"
                        onClick={() => sendMessage(suggestion.prompt)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {suggestion.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`message ${message.role}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="message-avatar">
                        {message.role === 'assistant' ? (
                          <Bot size={18} />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <div className="message-content">
                        <p>{message.content}</p>
                        <span className="message-time">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      className="message assistant loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="message-avatar">
                        <Bot size={18} />
                      </div>
                      <div className="message-content">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <form className="ai-input" onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isLoading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Send size={18} />
              </motion.button>
            </form>
          </NeonPanel>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
