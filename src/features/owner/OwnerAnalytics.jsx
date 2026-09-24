import React from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { RetentionService } from '../../services/retentionService';
import { BarChart3, TrendingUp, Users, Target, ShieldCheck, Flame } from 'lucide-react';

export const OwnerAnalytics = () => {
  const { activeGym } = useApp();

  const members = StorageService.getUsers().filter(u => u.roleId === 'member' && u.gymId === activeGym.id);
  const leads = StorageService.getLeads().filter(l => l.gymId === activeGym.id);
  const convertedLeads = leads.filter(l => l.status === 'CONVERTED').length;
  const leadConversionRate = leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0;
  const classes = StorageService.getClasses().filter(c => c.gymId === activeGym.id);
  const payments = StorageService.getPayments().filter(p => p.gymId === activeGym.id);
  const retentionAlerts = RetentionService.getRetentionAlerts(activeGym.id);

  const totalRevenue = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Tenant Operational Analytics</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Section 35: Unit-level business performance, funnel conversion velocity, and class occupancy rates for {activeGym.name}.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Trial Conversion Rate</span>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Target size={18} />
            </div>
          </div>
          <div className="stat-value">{leadConversionRate}%</div>
          <div className="stat-meta positive">
            <span>{convertedLeads} / {leads.length} leads converted</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Average Member Lifetime Value</span>
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="stat-value">₹18,400</div>
          <div className="stat-meta positive">Annual Tier Dominated</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Attendance Health</span>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="stat-value">92.4%</div>
          <div className="stat-meta">
            <span>{retentionAlerts.length} retention signals detected</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Monthly Cash Collected</span>
            <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
              <Flame size={18} />
            </div>
          </div>
          <div className="stat-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="stat-meta positive">
            <span>Real collections MTD</span>
          </div>
        </div>
      </div>

      {/* Class Occupancy Meters */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Group Class Occupancy Velocity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {classes.map(cls => {
            const pct = Math.round((cls.bookedCount / cls.capacity) * 100);
            return (
              <div key={cls.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <strong>{cls.title} ({cls.time})</strong>
                  <span style={{ color: pct >= 80 ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {cls.bookedCount} / {cls.capacity} booked ({pct}%)
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--primary)', borderRadius: '4px' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
