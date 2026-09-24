import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { AIService } from '../../services/aiService';
import { Sparkles, Send, Bot, User, ArrowRight } from 'lucide-react';

export const OwnerAICoach = () => {
  const { activeGym, setActiveTab } = useApp();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your GymOS Business Intelligence AI for **${activeGym.name}**.\n\nI monitor your live member attendance, CRM leads, class capacity, and retention metrics. What would you like to investigate today?`
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const PRESET_QUESTIONS = [
    'What needs my attention today?',
    'Which members are at risk of churning?',
    'How are website trial leads performing?',
    'Analyze current monthly revenue'
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputPrompt.trim();
    if (!query) return;

    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      const response = AIService.askOwnerAI(activeGym.id, query);
      setMessages(prev => [...prev, { role: 'assistant', content: response.reply, action: response.action }]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Operations Intelligence Assistant</h2>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Query live facility attendance, member retention risks, lead pipeline velocity, and cash collection totals.
        </p>
      </div>

      {/* Preset Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {PRESET_QUESTIONS.map(q => (
          <button
            key={q}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '11px', padding: '6px 12px' }}
            onClick={() => handleSend(q)}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Conversation Thread */}
      <div className="glass-card" style={{ minHeight: '440px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px', maxHeight: '480px', overflowY: 'auto', paddingRight: '8px' }}>
          {messages.map((m, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {m.role === 'assistant' && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <Bot size={16} />
                </div>
              )}

              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: m.role === 'user' ? 'var(--primary)' : 'var(--bg-dark)',
                color: m.role === 'user' ? '#ffffff' : 'var(--text-main)',
                fontSize: '13px',
                lineHeight: '1.5',
                border: m.role === 'user' ? 'none' : '1px solid var(--surface-border)',
                whiteSpace: 'pre-wrap'
              }}>
                {m.content}

                {m.action === 'PRIORITY_SUMMARY' && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--surface-border)' }}>
                    <button 
                      className="btn btn-sm"
                      style={{ background: '#ef4444', color: '#fff', border: 'none', fontSize: '11px' }}
                      onClick={() => setActiveTab('retention')}
                    >
                      Open Retention Engine
                    </button>
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', flexShrink: 0 }}>
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Bot size={16} />
              </div>
              <div style={{ padding: '8px 14px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--text-muted)' }}>
                Analyzing tenant data...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--surface-border)', paddingTop: '14px' }}>
          <input 
            type="text" 
            className="form-input"
            placeholder="Ask anything about gym revenue, inactive members, or trial leads..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            className="btn btn-primary"
            onClick={() => handleSend()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
