import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { Bell, Search, Plus, QrCode, Sparkles, CheckCheck } from 'lucide-react';

export const AppHeader = ({ title, subtitle, onQuickAction }) => {
  const { activeGym, activeUser, activeSurface, setActiveTab } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState(() => StorageService.getNotifications());

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    StorageService.saveNotifications(updated);
    setNotifications(updated);
  };

  return (
    <header className="content-topbar">
      <div className="topbar-titles">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="topbar-actions">
        {/* Quick action buttons depending on surface */}
        {activeSurface === 'gymos' && (
          <>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('attendance')}
              title="Open QR Attendance Scanner"
            >
              <QrCode size={14} />
              <span>QR Scanner</span>
            </button>

            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('leads')}
              title="View & Add Leads"
            >
              <Plus size={14} />
              <span>New Lead</span>
            </button>
          </>
        )}

        {/* Notifications Icon & Popover */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setShowNotifs(!showNotifs)}
            style={{ position: 'relative', padding: '8px' }}
            title="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#fff',
                borderRadius: '50%',
                fontSize: '10px',
                fontWeight: 'bold',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div style={{
              position: 'absolute',
              top: '42px',
              right: '0',
              width: '320px',
              background: 'var(--bg-card)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 100,
              padding: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong style={{ fontSize: '13px' }}>Tenant Notifications</strong>
                <button 
                  onClick={handleMarkAllRead} 
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '11px', cursor: 'pointer' }}
                >
                  Mark all read
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.slice(0, 5).map(n => (
                  <div key={n.id} style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: n.isRead ? 'transparent' : 'rgba(255, 87, 34, 0.08)',
                    border: '1px solid var(--surface-border)',
                    fontSize: '12px'
                  }}>
                    <div style={{ fontWeight: '700', marginBottom: '2px', color: n.type === 'RETENTION_SIGNAL' ? '#ef4444' : 'var(--text-main)' }}>
                      {n.title}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: '1.3' }}>
                      {n.message}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '4px' }}>
                      {n.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
