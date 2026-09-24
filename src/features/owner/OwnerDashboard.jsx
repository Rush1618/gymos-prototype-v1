import React from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { RetentionService } from '../../services/retentionService';
import { 
  Users, 
  CreditCard, 
  QrCode, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Flame,
  UserCheck
} from 'lucide-react';

export const OwnerDashboard = () => {
  const { activeGym, activeUser, setActiveTab, canAccessPage, canViewFeature } = useApp();

  const members = StorageService.getUsers().filter(u => u.roleId === 'member' && u.gymId === activeGym.id);
  const activeMembers = members.filter(m => m.status === 'ACTIVE');
  const leads = StorageService.getLeads().filter(l => l.gymId === activeGym.id);
  const newLeads = leads.filter(l => l.status === 'NEW');
  const attendance = StorageService.getAttendance().filter(a => a.gymId === activeGym.id);
  const classes = StorageService.getClasses().filter(c => c.gymId === activeGym.id);
  const payments = StorageService.getPayments().filter(p => p.gymId === activeGym.id);
  const retentionAlerts = RetentionService.getRetentionAlerts(activeGym.id);

  const totalRevenue = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      {/* Retention Risk Alert Banner (Section 34) */}
      {retentionAlerts.length > 0 && canAccessPage('page.retention') && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15), rgba(245, 158, 11, 0.15))',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: '#fff' }}>
                Retention Engine Alert: {retentionAlerts.length} Member(s) at Churn Risk
              </strong>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <strong>{retentionAlerts[0]?.memberName}</strong> hasn't checked in for {retentionAlerts[0]?.daysAbsent} days (historical average: {retentionAlerts[0]?.historicalRate} visits/wk).
              </div>
            </div>
          </div>

          <button 
            className="btn btn-sm"
            style={{ background: '#ef4444', color: '#fff', border: 'none' }}
            onClick={() => setActiveTab('retention')}
          >
            <span>Review & Send 1-Click Outreach</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Operational KPI Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Active Members</span>
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="stat-value">{activeMembers.length}</div>
          <div className="stat-meta positive">
            <span>● {members.length} Total Enrolled</span>
          </div>
        </div>

        {canViewFeature('payment.viewRevenueSummary') ? (
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Gross Revenue (MTD)</span>
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                <CreditCard size={18} />
              </div>
            </div>
            <div className="stat-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div className="stat-meta positive">
              <TrendingUp size={12} />
              <span>Across {payments.length} transactions</span>
            </div>
          </div>
        ) : (
          <div className="stat-card" style={{ opacity: 0.7 }}>
            <div className="stat-header">
              <span className="stat-title">Billing Metrics</span>
              <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
                <CreditCard size={18} />
              </div>
            </div>
            <div className="stat-value" style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Restricted</div>
            <div className="stat-meta">Hidden for role: {activeUser.roleId}</div>
          </div>
        )}

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Today's Check-ins</span>
            <div className="stat-icon" style={{ background: 'rgba(255, 87, 34, 0.15)', color: 'var(--primary)' }}>
              <QrCode size={18} />
            </div>
          </div>
          <div className="stat-value">{attendance.length}</div>
          <div className="stat-meta positive">
            <span>Live check-in stream verified</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Inbound Trial Leads</span>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Flame size={18} />
            </div>
          </div>
          <div className="stat-value">{newLeads.length} New</div>
          <div className="stat-meta">
            <span>{leads.length} in sales pipeline</span>
          </div>
        </div>
      </div>

      {/* Main Operational Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Today's Class Schedule */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} style={{ color: 'var(--primary)' }} />
              <span>Today's Group Sessions</span>
            </h3>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('classes')}
            >
              All Classes
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {classes.map(cls => (
              <div key={cls.id} style={{
                padding: '12px',
                background: 'var(--bg-dark)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--surface-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong style={{ fontSize: '13px' }}>{cls.title}</strong>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {cls.time} • Coach: {cls.trainerName}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${cls.bookedCount >= cls.capacity ? 'badge-danger' : 'badge-info'}`}>
                    {cls.bookedCount} / {cls.capacity} Booked
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Attendance Check-in Stream */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={18} style={{ color: '#10b981' }} />
              <span>Live Attendance Stream</span>
            </h3>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('attendance')}
            >
              Open QR Scanner
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {attendance.slice(0, 4).map(att => (
              <div key={att.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: 'var(--bg-dark)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--surface-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  <div>
                    <strong style={{ fontSize: '13px' }}>{att.memberName}</strong>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Pass: {att.passId}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <div>{att.time}</div>
                  <span className="badge badge-success" style={{ fontSize: '9px', padding: '1px 6px' }}>
                    {att.checkInMethod} Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
