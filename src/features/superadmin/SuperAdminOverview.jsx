import React from 'react';
import { useApp } from '../../store/AppContext';
import { PLATFORM_STATS } from '../../data/seedData';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight,
  Sliders,
  Palette,
  AlertCircle
} from 'lucide-react';

export const SuperAdminOverview = () => {
  const { gyms, setActiveTab, setActiveGymId, setActiveSurface } = useApp();

  return (
    <div>
      {/* Top Banner / Hero Metric */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15))',
        border: '1px solid rgba(236, 72, 153, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', background: '#ec4899', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: '800' }}>
              AGENCY CONTROL TOWER
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Platform Health: 99.98% Uptime</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Remote Control Across 128 Gym Locations
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '650px', marginTop: '4px' }}>
            Manage tenant branding, feature flags, 3-tier permissions, and user overrides across all deployed gyms without touching code.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setActiveTab('gyms')}
          >
            <Building2 size={16} />
            <span>Manage All Gyms</span>
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setActiveTab('permissions')}
          >
            <Sliders size={16} />
            <span>Permission Matrix</span>
          </button>
        </div>
      </div>

      {/* Primary Platform Metric Cards (Prompt Section 7: 128 Gyms, 116 Active, 7 Trial, 3 Suspended, 2 Onboarding) */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Tenants</span>
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <Building2 size={18} />
            </div>
          </div>
          <div className="stat-value">{PLATFORM_STATS.totalGyms} Gyms</div>
          <div className="stat-meta positive">
            <span>● 116 Active</span> • <span>7 Trial</span> • <span style={{ color: 'var(--danger)' }}>3 Suspended</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Platform ARR</span>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div className="stat-value">₹2.84 Cr</div>
          <div className="stat-meta positive">
            <TrendingUp size={12} />
            <span>+18.4% MRR growth MoM</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Platform Members</span>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="stat-value">{PLATFORM_STATS.totalPlatformMembers.toLocaleString()}</div>
          <div className="stat-meta">
            <span>Across 4 metropolitan hubs</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">AI Inferences This Month</span>
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div className="stat-value">{PLATFORM_STATS.aiQueriesThisMonth.toLocaleString()}</div>
          <div className="stat-meta positive">
            <span>Member coach & Owner AI</span>
          </div>
        </div>
      </div>

      {/* Featured Gym Tenants Spotlight */}
      <div style={{ marginTop: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Active Gym Tenants (Quick Control)</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Click any tenant to inspect health, customize branding, or switch context</p>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('gyms')}
          >
            <span>View All {gyms.length} Gyms</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {gyms.slice(0, 3).map(gym => (
            <div key={gym.id} className="glass-card" style={{ borderColor: gym.theme?.borderColor || 'var(--surface-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-sm)',
                    background: gym.theme?.bgSurface || 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    border: `1px solid ${gym.theme?.primaryColor || 'var(--surface-border)'}`
                  }}>
                    {gym.logo || '⚡'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800' }}>{gym.name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{gym.city} ({gym.area})</span>
                  </div>
                </div>

                <span className={`badge ${gym.status === 'ACTIVE' ? 'badge-success' : gym.status === 'TRIAL' ? 'badge-warning' : 'badge-danger'}`}>
                  {gym.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>ACTIVE MEMBERS</span>
                  <strong>{gym.metrics?.activeMembers || 0} Members</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>ESTIMATED MRR</span>
                  <strong style={{ color: 'var(--success)' }}>₹{(gym.metrics?.mrr || 0).toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>TODAY'S CHECK-INS</span>
                  <strong>{gym.metrics?.todayCheckins || 0} Check-ins</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>RETENTION RISK</span>
                  <strong style={{ color: gym.metrics?.retentionAlerts > 0 ? '#ef4444' : 'inherit' }}>
                    {gym.metrics?.retentionAlerts || 0} Signals
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setActiveGymId(gym.id);
                    setActiveSurface('gymos');
                  }}
                >
                  <span>Launch Gym OS</span>
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setActiveGymId(gym.id);
                    setActiveTab('branding');
                  }}
                  title="Configure Brand Theme"
                >
                  <Palette size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
