import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { RetentionService } from '../../services/retentionService';
import { AttendanceService } from '../../services/attendanceService';
import { LeadService } from '../../services/leadService';
import { SoundEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';
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
  UserCheck,
  Activity,
  Zap,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const OwnerDashboard = () => {
  const { activeGym, activeUser, setActiveTab, canAccessPage, canViewFeature, refreshData, addToast } = useApp();
  const [hoveredHour, setHoveredHour] = useState(null);

  const members = StorageService.getUsers().filter(u => u.roleId === 'member' && u.gymId === activeGym.id);
  const activeMembers = members.filter(m => m.status === 'ACTIVE');
  const leads = StorageService.getLeads().filter(l => l.gymId === activeGym.id);
  const newLeads = leads.filter(l => l.status === 'NEW');
  const attendance = StorageService.getAttendance().filter(a => a.gymId === activeGym.id);
  const classes = StorageService.getClasses().filter(c => c.gymId === activeGym.id);
  const payments = StorageService.getPayments().filter(p => p.gymId === activeGym.id);
  const retentionAlerts = RetentionService.getRetentionAlerts(activeGym.id);

  const totalRevenue = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const monthlyTarget = 400000;
  const targetPercent = Math.min(100, Math.round((totalRevenue / monthlyTarget) * 100));

  // Hourly floor occupancy distribution data (06:00 to 22:00)
  const hourlyTraffic = [
    { hour: '06h', athletes: 18, label: '06:00 AM' },
    { hour: '07h', athletes: 54, label: '07:00 AM (Peak Morning Rush)' },
    { hour: '08h', athletes: 48, label: '08:00 AM' },
    { hour: '09h', athletes: 32, label: '09:00 AM' },
    { hour: '11h', athletes: 15, label: '11:00 AM (Low)' },
    { hour: '13h', athletes: 12, label: '01:00 PM' },
    { hour: '16h', athletes: 28, label: '04:00 PM' },
    { hour: '18h', athletes: 58, label: '06:00 PM (Prime Evening Peak)' },
    { hour: '19h', athletes: 52, label: '07:00 PM' },
    { hour: '20h', athletes: 44, label: '08:00 PM' },
    { hour: '21h', athletes: 22, label: '09:00 PM' }
  ];

  const currentAthletesOnFloor = 42;
  const maxFloorCapacity = 60;
  const occupancyRate = Math.round((currentAthletesOnFloor / maxFloorCapacity) * 100);

  // Quick Tactical Simulation Handlers
  const handleSimulateQuickScan = () => {
    SoundEngine.playScanLaserBeep();
    const candidate = members[0] || { passId: 'PASS-TEST-99', name: 'Vikram Malhotra' };
    const res = AttendanceService.processQRScan(activeGym.id, candidate.passId, activeUser);
    if (res.success) {
      SoundEngine.playSuccessChime();
      try { confetti({ particleCount: 50, spread: 60 }); } catch (e) {}
      refreshData();
      addToast(`⚡ Turnstile Scan: ${candidate.name} passed through Reception Kiosk!`, 'success');
    }
  };

  const handleSimulateLead = () => {
    SoundEngine.playClick();
    const names = ['Kunal Shah', 'Rhea Kapoor', 'Devendra Sen', 'Tanvi Singhania'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    LeadService.createLeadFromPublicWebsite({
      gymId: activeGym.id,
      name: `${randomName} (${Math.floor(100 + Math.random() * 900)})`,
      phone: '+91 98200 ' + Math.floor(10000 + Math.random() * 90000),
      email: `${randomName.toLowerCase().replace(/\s/g, '')}@gmail.com`,
      goal: 'Hypertrophy & Strength',
      source: 'Instagram Ad'
    });
    try { confetti({ particleCount: 60, spread: 50 }); } catch (e) {}
    refreshData();
    addToast(`⚡ Inbound Lead: ${randomName} added to ${activeGym.name} CRM pipeline!`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Retention Risk Alert Banner */}
      {retentionAlerts.length > 0 && canAccessPage('page.retention') && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.18), rgba(245, 158, 11, 0.12))',
          border: '1px solid rgba(239, 68, 68, 0.45)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'rgba(239, 68, 68, 0.25)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#ef4444',
              boxShadow: '0 0 12px rgba(239, 68, 68, 0.4)'
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '15px', color: '#fff' }}>
                Retention Engine Alert: {retentionAlerts.length} Member(s) at Churn Risk
              </strong>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                <strong>{retentionAlerts[0]?.memberName}</strong> hasn't checked in for {retentionAlerts[0]?.daysAbsent} days (historical average: {retentionAlerts[0]?.historicalRate} visits/wk).
              </div>
            </div>
          </div>

          <button 
            className="btn btn-sm"
            style={{ 
              background: '#ef4444', 
              color: '#fff', 
              border: 'none',
              boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)',
              fontWeight: '700'
            }}
            onClick={() => {
              SoundEngine.playClick();
              setActiveTab('retention');
            }}
          >
            <span>Review & Send 1-Click WhatsApp</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Operational KPI Grid */}
      <div className="stat-grid">
        {/* Active Members */}
        <div className="stat-card" style={{ borderTop: '3px solid #3b82f6' }}>
          <div className="stat-header">
            <span className="stat-title">Active Members</span>
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="stat-value">{activeMembers.length}</div>
          <div className="stat-meta positive">
            <span>● {members.length} Total Enrolled • 98.4% Retention</span>
          </div>
        </div>

        {/* Revenue */}
        {canViewFeature('payment.viewRevenueSummary') ? (
          <div className="stat-card" style={{ borderTop: '3px solid #10b981' }}>
            <div className="stat-header">
              <span className="stat-title">Gross Revenue (MTD)</span>
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                <CreditCard size={18} />
              </div>
            </div>
            <div className="stat-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div className="stat-meta positive" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={13} />
              <span>{targetPercent}% of ₹{monthlyTarget.toLocaleString('en-IN')} Target</span>
            </div>
            {/* Target Progress Bar */}
            <div style={{ width: '100%', height: '4px', background: 'var(--surface-border)', borderRadius: '2px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${targetPercent}%`, height: '100%', background: '#10b981' }} />
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

        {/* Today's Check-ins */}
        <div className="stat-card" style={{ borderTop: '3px solid var(--primary)' }}>
          <div className="stat-header">
            <span className="stat-title">Today's Check-ins</span>
            <div className="stat-icon" style={{ background: 'rgba(255, 87, 34, 0.15)', color: 'var(--primary)' }}>
              <QrCode size={18} />
            </div>
          </div>
          <div className="stat-value">{attendance.length}</div>
          <div className="stat-meta positive">
            <span>Live check-in stream verified • 100% keyless</span>
          </div>
        </div>

        {/* Inbound Leads */}
        <div className="stat-card" style={{ borderTop: '3px solid #f59e0b' }}>
          <div className="stat-header">
            <span className="stat-title">Inbound Trial Leads</span>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Flame size={18} />
            </div>
          </div>
          <div className="stat-value">{newLeads.length} New</div>
          <div className="stat-meta">
            <span>{leads.length} active prospects in sales pipeline</span>
          </div>
        </div>
      </div>

      {/* Real-Time Facility Telemetry & Heatmap Widget */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-success">LIVE SENSORS</span>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>
                Athletic Floor Occupancy & Hourly Traffic Heatmap
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Real-time turnstile telemetry monitoring Olympic lifting platforms, turf, and cardio mezzanine.
            </p>
          </div>

          {/* Live Occupancy Gauge Pill */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '14px', 
            background: 'var(--bg-dark)', 
            padding: '10px 18px', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--surface-border)' 
          }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Occupancy</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: occupancyRate > 80 ? '#ef4444' : '#10b981' }}>
                {currentAthletesOnFloor} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ {maxFloorCapacity} Max ({occupancyRate}%)</span>
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray={`${occupancyRate}, 100`} />
              </svg>
              <Activity size={14} color="var(--primary)" style={{ position: 'absolute' }} />
            </div>
          </div>
        </div>

        {/* Hourly Traffic Bar Histogram */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '110px', gap: '8px', padding: '0 6px 12px' }}>
            {hourlyTraffic.map((item, idx) => {
              const heightPercent = Math.round((item.athletes / 60) * 100);
              const isPeak = item.athletes >= 48;
              const isHovered = hoveredHour === idx;
              return (
                <div 
                  key={item.hour} 
                  style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    height: '100%', 
                    justifyContent: 'flex-end',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredHour(idx)}
                  onMouseLeave={() => setHoveredHour(null)}
                >
                  <div style={{
                    width: '100%',
                    height: `${heightPercent}%`,
                    background: isPeak 
                      ? 'linear-gradient(180deg, #ff5722 0%, #f4511e 100%)' 
                      : 'linear-gradient(180deg, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.3) 100%)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.2s',
                    transform: isHovered ? 'scaleY(1.08)' : 'scaleY(1)',
                    boxShadow: isPeak ? '0 0 12px rgba(255, 87, 34, 0.4)' : 'none',
                    opacity: hoveredHour !== null && !isHovered ? 0.4 : 1
                  }} />
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>{item.hour}</span>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-dark)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-border)' }}>
            {hoveredHour !== null ? (
              <span><strong>{hourlyTraffic[hoveredHour].label}:</strong> {hourlyTraffic[hoveredHour].athletes} Estimated active athletes</span>
            ) : (
              <span>💡 Peak training periods occur at <strong>07:00 AM (snatch & clean squads)</strong> and <strong>06:00 PM (executive conditioning)</strong>.</span>
            )}
          </div>
        </div>
      </div>

      {/* Tactical Quick Action Deck */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: '12px',
        padding: '16px 20px',
        background: 'var(--bg-card)',
        border: '1px solid var(--surface-border)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={16} color="var(--primary)" />
          <strong style={{ fontSize: '13px' }}>Tactical Operations Deck:</strong>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleSimulateQuickScan}
          >
            <QrCode size={13} color="var(--primary)" />
            <span>Simulate Turnstile Entry</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleSimulateLead}
          >
            <Plus size={13} color="#f59e0b" />
            <span>Simulate Inbound Lead</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              SoundEngine.playClick();
              setActiveTab('classes');
            }}
          >
            <Calendar size={13} color="#3b82f6" />
            <span>Manage Schedule</span>
          </button>
        </div>
      </div>

      {/* Main Operational Split: Classes & Live Attendance Stream */}
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
              onClick={() => {
                SoundEngine.playClick();
                setActiveTab('classes');
              }}
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
              onClick={() => {
                SoundEngine.playClick();
                setActiveTab('attendance');
              }}
            >
              Open QR Scanner
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {attendance.slice(0, 5).map(att => (
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
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: '#10b981',
                    boxShadow: '0 0 8px #10b981'
                  }} />
                  <div>
                    <strong style={{ fontSize: '13px' }}>{att.memberName}</strong>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Pass ID: {att.passId}</div>
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

