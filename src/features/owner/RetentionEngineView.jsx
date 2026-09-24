import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { RetentionService } from '../../services/retentionService';
import { 
  ShieldAlert, 
  Sparkles, 
  Send, 
  Phone, 
  Clock, 
  Calendar, 
  TrendingDown, 
  AlertTriangle, 
  CheckCheck,
  MessageSquare
} from 'lucide-react';

export const RetentionEngineView = () => {
  const { activeGym, activeUser, refreshData, addToast } = useApp();
  const [retentionAlerts, setRetentionAlerts] = useState(() => 
    RetentionService.getRetentionAlerts(activeGym.id)
  );
  const [selectedTone, setSelectedTone] = useState('MOTIVATIONAL');
  const [customMessages, setCustomMessages] = useState({});

  const handleToneChange = (alert, tone) => {
    setSelectedTone(tone);
    const generated = RetentionService.generateReengagementMessage(alert, tone);
    setCustomMessages(prev => ({ ...prev, [alert.memberId]: generated }));
  };

  const handleSendOutreach = (alert, channel = 'WhatsApp') => {
    const msg = customMessages[alert.memberId] || alert.suggestedMessage;
    RetentionService.logOutreach(activeGym.id, alert.memberId, alert.memberName, msg, channel, activeUser);
    
    refreshData();
    addToast(`🚀 Re-engagement message dispatched to ${alert.memberName} via ${channel}!`, 'success');
  };

  return (
    <div>
      {/* Overview & Rule Transparency Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(245, 158, 11, 0.12))',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <ShieldAlert size={20} color="#ef4444" />
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Transparent Rule-Based Retention Engine</h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '750px', lineHeight: '1.5' }}>
          Section 34: Rather than relying on an opaque black-box ML model, GymOS uses strict deterministic behavioral rules:
          <br />
          <code>[Last Visit &gt; 14 Days] + [Historical Average &gt;= 2.0 Visits/Week] = High Churn Risk Signal</code>
        </p>
      </div>

      {/* Retention Risk Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {retentionAlerts.map(alert => {
          const currentMsg = customMessages[alert.memberId] || alert.suggestedMessage;

          return (
            <div key={alert.memberId} className="glass-card" style={{ border: '1px solid rgba(239, 68, 68, 0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{alert.memberName}</h3>
                    <span className="badge badge-danger">
                      ⚠ HIGH CHURN RISK
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Plan: <strong>{alert.membershipPlan}</strong> • Phone: {alert.phone}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-sm btn-primary"
                    style={{ background: '#25D366', borderColor: '#25D366', color: '#fff' }}
                    onClick={() => handleSendOutreach(alert, 'WhatsApp')}
                  >
                    <MessageSquare size={14} />
                    <span>Send WhatsApp Outreach</span>
                  </button>

                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleSendOutreach(alert, 'SMS')}
                  >
                    <span>Send SMS</span>
                  </button>
                </div>
              </div>

              {/* Attendance Breakdown Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', padding: '14px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', marginBottom: '18px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>LAST GYM VISIT</span>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#ef4444' }}>
                    {alert.daysAbsent} Days Ago
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Exceeds 14-day threshold</span>
                </div>

                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>HISTORICAL AVERAGE</span>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                    {alert.historicalRate} Visits / Week
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--success)' }}>High prior commitment</span>
                </div>

                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CURRENT RECENT VISITS</span>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#ef4444' }}>
                    {alert.currentRate} Visits
                  </div>
                  <span style={{ fontSize: '11px', color: '#ef4444' }}>Total drop in activity</span>
                </div>
              </div>

              {/* 1-Click AI Message Generator */}
              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} style={{ color: 'var(--primary)' }} />
                    <strong style={{ fontSize: '13px' }}>AI Tailored Re-engagement Copy</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['MOTIVATIONAL', 'CASUAL_FRIENDLY', 'GOAL_FOCUSED'].map(t => (
                      <button 
                        key={t}
                        className={`btn btn-sm ${selectedTone === t ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '11px', padding: '3px 8px' }}
                        onClick={() => handleToneChange(alert, t)}
                      >
                        {t.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea 
                  className="form-textarea"
                  rows={3}
                  value={currentMsg}
                  onChange={(e) => setCustomMessages({ ...customMessages, [alert.memberId]: e.target.value })}
                  style={{ fontSize: '12px', lineHeight: '1.4' }}
                />
              </div>
            </div>
          );
        })}

        {retentionAlerts.length === 0 && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCheck size={40} color="#10b981" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Zero Members at Churn Risk</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
              All enrolled members have visited within the last 14 days or have low historical baseline attendance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
