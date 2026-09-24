import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { RetentionService } from '../../services/retentionService';
import { AttendanceService } from '../../services/attendanceService';
import { LeadService } from '../../services/leadService';
import { SoundEngine } from '../../utils/audio';
import { 
  Users, 
  CreditCard, 
  QrCode, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Activity, 
  Unlock, 
  Dumbbell, 
  Plus 
} from 'lucide-react';

export const OwnerDashboard = () => {
  const { activeGym, activeUser, setActiveTab, canAccessPage, canViewFeature, refreshData, addToast } = useApp();
  const [hoveredHour, setHoveredHour] = useState(null);
  const [selectedBay, setSelectedBay] = useState(null);
  const [remoteGateOpen, setRemoteGateOpen] = useState(false);

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

  // Facility Floor Plan Bays
  const [bays, setBays] = useState([
    { id: 'bay_1', name: 'Platform 1', type: 'Olympic Rig', status: 'occupied', athlete: 'Rahul Sharma', exercise: 'Deadlift (210kg)' },
    { id: 'bay_2', name: 'Platform 2', type: 'Olympic Rig', status: 'occupied', athlete: 'Priya Verma', exercise: 'Snatch Practice' },
    { id: 'bay_3', name: 'Platform 3', type: 'Olympic Rig', status: 'available', athlete: null, exercise: null },
    { id: 'bay_4', name: 'Platform 4', type: 'Olympic Rig', status: 'occupied', athlete: 'Arjun Mehta', exercise: 'Coaching Session' },
    { id: 'bay_5', name: 'Platform 5', type: 'Olympic Rig', status: 'available', athlete: null, exercise: null },
    { id: 'bay_6', name: 'Platform 6', type: 'Olympic Rig', status: 'occupied', athlete: 'Vikram Malhotra', exercise: 'Front Squat' },
    { id: 'bay_7', name: 'Platform 7', type: 'Olympic Rig', status: 'available', athlete: null, exercise: null },
    { id: 'bay_8', name: 'Platform 8', type: 'Olympic Rig', status: 'occupied', athlete: 'Siddharth Jain', exercise: 'Clean & Jerk' },
    { id: 'turf_track', name: 'Turf Track', type: '30m Sled Lane', status: 'occupied', athlete: 'Conditioning Squad', exercise: 'Sled Drills' },
    { id: 'recovery_sauna', name: 'Sauna Suite', type: 'Infrared Suite', status: 'occupied', athlete: '2 Members In Session', exercise: 'Recovery' }
  ]);

  // Hourly floor occupancy distribution data (06:00 to 22:00)
  const hourlyTraffic = [
    { hour: '06h', athletes: 18, label: '06:00 AM' },
    { hour: '07h', athletes: 54, label: '07:00 AM (Morning Peak)' },
    { hour: '08h', athletes: 48, label: '08:00 AM' },
    { hour: '09h', athletes: 32, label: '09:00 AM' },
    { hour: '11h', athletes: 15, label: '11:00 AM' },
    { hour: '13h', athletes: 12, label: '01:00 PM' },
    { hour: '16h', athletes: 28, label: '04:00 PM' },
    { hour: '18h', athletes: 58, label: '06:00 PM (Evening Peak)' },
    { hour: '19h', athletes: 52, label: '07:00 PM' },
    { hour: '20h', athletes: 44, label: '08:00 PM' },
    { hour: '21h', athletes: 22, label: '09:00 PM' }
  ];

  const currentAthletesOnFloor = 42;
  const maxFloorCapacity = 60;
  const occupancyRate = Math.round((currentAthletesOnFloor / maxFloorCapacity) * 100);

  // Quick Action Handlers
  const handleSimulateQuickScan = () => {
    SoundEngine.playScanLaserBeep();
    const candidate = members[0] || { passId: 'PASS-TEST-99', name: 'Vikram Malhotra' };
    const res = AttendanceService.processQRScan(activeGym.id, candidate.passId, activeUser);
    if (res.success) {
      SoundEngine.playSuccessChime();
      refreshData();
      addToast(`Member check-in: ${candidate.name} verified at Front Desk`, 'success');
    }
  };

  const handleSimulateLead = () => {
    SoundEngine.playClick();
    const names = ['Kunal Shah', 'Rhea Kapoor', 'Devendra Sen', 'Tanvi Singhania'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    LeadService.createLeadFromPublicWebsite({
      gymId: activeGym.id,
      name: `${randomName}`,
      phone: '+91 98200 ' + Math.floor(10000 + Math.random() * 90000),
      email: `${randomName.toLowerCase().replace(/\s/g, '')}@gmail.com`,
      goal: 'Hypertrophy & Strength',
      source: 'Website Trial'
    });
    refreshData();
    addToast(`New inquiry: ${randomName} added to leads pipeline`, 'info');
  };

  const handleRemoteUnlockGate = () => {
    SoundEngine.playScanLaserBeep();
    setTimeout(() => {
      SoundEngine.playSuccessChime();
      setRemoteGateOpen(true);
      addToast(`Turnstile 01 released remotely`, 'success');
      setTimeout(() => setRemoteGateOpen(false), 4000);
    }, 200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Retention Risk Alert Banner */}
      {retentionAlerts.length > 0 && canAccessPage('page.retention') && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: 'var(--radius-sm)', 
              background: 'rgba(239, 68, 68, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#ef4444' 
            }}>
              <AlertTriangle size={16} />
            </div>
            <div>
              <strong style={{ fontSize: '13px', color: '#f8fafc' }}>
                Inactive Member Notice: {retentionAlerts.length} member(s) absent &gt; 14 days
              </strong>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {retentionAlerts[0]?.memberName} has not checked in for {retentionAlerts[0]?.daysAbsent} days (usual rate: {retentionAlerts[0]?.historicalRate} visits/week).
              </div>
            </div>
          </div>

          <button 
            className="btn btn-sm"
            style={{ 
              background: '#ef4444', 
              color: '#fff', 
              border: 'none',
              fontWeight: '600'
            }}
            onClick={() => {
              SoundEngine.playClick();
              setActiveTab('retention');
            }}
          >
            <span>Review Member</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* Primary KPI Deck */}
      <div className="stat-grid">
        {/* Active Members */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Active Members</span>
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>
              <Users size={16} />
            </div>
          </div>
          <div className="stat-value">{activeMembers.length}</div>
          <div className="stat-meta positive">
            <span>{members.length} enrolled members</span>
          </div>
        </div>

        {/* Revenue */}
        {canViewFeature('payment.viewRevenueSummary') ? (
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Revenue (MTD)</span>
              <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80' }}>
                <CreditCard size={16} />
              </div>
            </div>
            <div className="stat-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div className="stat-meta positive" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={12} />
              <span>{targetPercent}% of ₹{monthlyTarget.toLocaleString('en-IN')} monthly target</span>
            </div>
            {/* Target Progress Bar */}
            <div style={{ width: '100%', height: '3px', background: 'var(--surface-border)', borderRadius: '2px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${targetPercent}%`, height: '100%', background: '#22c55e' }} />
            </div>
          </div>
        ) : (
          <div className="stat-card" style={{ opacity: 0.6 }}>
            <div className="stat-header">
              <span className="stat-title">Revenue (MTD)</span>
              <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
                <CreditCard size={16} />
              </div>
            </div>
            <div className="stat-value" style={{ fontSize: '16px', color: 'var(--text-muted)' }}>Restricted</div>
            <div className="stat-meta">Access restricted for this role</div>
          </div>
        )}

        {/* Today's Check-ins */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Today's Check-ins</span>
            <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.1)', color: 'var(--primary)' }}>
              <QrCode size={16} />
            </div>
          </div>
          <div className="stat-value">{attendance.length}</div>
          <div className="stat-meta positive">
            <span>All entries verified via turnstile</span>
          </div>
        </div>

        {/* Inbound Leads */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">New Inquiries</span>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>
              <Clock size={16} />
            </div>
          </div>
          <div className="stat-value">{newLeads.length}</div>
          <div className="stat-meta">
            <span>{leads.length} total in CRM pipeline</span>
          </div>
        </div>
      </div>

      {/* Facility Floor Plan & Bay Availability */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>
              Platform & Area Availability
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Current status of lifting platforms, turf, and recovery amenities.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)' }} /> In Use (6)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }} /> Available (4)
            </span>
          </div>
        </div>

        {/* Blueprint Grid */}
        <div className="blueprint-grid">
          {bays.map(bay => {
            const isSelected = selectedBay?.id === bay.id;
            return (
              <div 
                key={bay.id}
                className={`blueprint-bay ${bay.status}`}
                style={{
                  borderColor: isSelected ? 'rgba(255, 255, 255, 0.4)' : undefined
                }}
                onClick={() => {
                  SoundEngine.playClick();
                  setSelectedBay(isSelected ? null : bay);
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '12px', color: 'var(--text-main)' }}>{bay.name}</strong>
                  <span className={`badge ${bay.status === 'occupied' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                    {bay.status === 'occupied' ? 'In Use' : 'Open'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {bay.type}
                </div>
                {bay.athlete && (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {bay.athlete}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Bay Inspection Drawer */}
        {selectedBay && (
          <div style={{
            marginTop: '14px',
            padding: '14px 18px',
            background: 'var(--bg-dark)',
            border: '1px solid var(--surface-border)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Dumbbell size={14} color="var(--primary)" />
                <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>{selectedBay.name} — {selectedBay.type}</strong>
                <span className={`badge ${selectedBay.status === 'occupied' ? 'badge-warning' : 'badge-success'}`}>
                  {selectedBay.status === 'occupied' ? 'In Use' : 'Available'}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {selectedBay.athlete 
                  ? `Member: ${selectedBay.athlete} • Activity: ${selectedBay.exercise}`
                  : 'Platform is open for walk-ins or scheduled coaching.'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  SoundEngine.playClick();
                  setBays(bays.map(b => b.id === selectedBay.id ? { ...b, status: b.status === 'occupied' ? 'available' : 'occupied', athlete: b.status === 'occupied' ? null : activeUser.name } : b));
                  setSelectedBay(null);
                  addToast(`Platform status updated`, 'info');
                }}
              >
                Toggle Status
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedBay(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hourly Floor Traffic & Occupancy */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>
              Floor Occupancy & Traffic by Hour
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Estimated active capacity across weight room, platforms, and turf.
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            background: 'var(--bg-dark)', 
            padding: '8px 14px', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--surface-border)' 
          }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Occupancy</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                {currentAthletesOnFloor} / {maxFloorCapacity} athletes ({occupancyRate}%)
              </div>
            </div>
            <Activity size={16} color="var(--primary)" />
          </div>
        </div>

        {/* Hourly Traffic Bar Histogram */}
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '90px', gap: '6px', padding: '0 4px 8px' }}>
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
                    background: isPeak ? 'var(--primary)' : 'var(--surface-border-hover)',
                    borderRadius: '2px 2px 0 0',
                    transition: 'all 0.15s',
                    opacity: hoveredHour !== null && !isHovered ? 0.35 : 1
                  }} />
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.hour}</span>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-dark)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-border)' }}>
            {hoveredHour !== null ? (
              <span><strong>{hourlyTraffic[hoveredHour].label}:</strong> {hourlyTraffic[hoveredHour].athletes} estimated athletes</span>
            ) : (
              <span>Peak hours are typically 07:00 – 08:30 AM and 06:00 – 07:30 PM.</span>
            )}
          </div>
        </div>
      </div>

      {/* Front Desk & Turnstile Controls */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: '12px',
        padding: '14px 18px',
        background: 'var(--bg-card)',
        border: '1px solid var(--surface-border)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div>
          <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>
            {remoteGateOpen ? 'Turnstile 01: Gate Released' : 'Front Desk Controls'}
          </strong>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Turnstile 01 hardware online • Optical QR reader ready
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleRemoteUnlockGate}
            style={{ color: remoteGateOpen ? '#22c55e' : undefined }}
          >
            <Unlock size={13} />
            <span>Remote Unlock Turnstile</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleSimulateQuickScan}
          >
            <QrCode size={13} />
            <span>Test QR Check-in</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleSimulateLead}
          >
            <Plus size={13} />
            <span>Test Inbound Lead</span>
          </button>
        </div>
      </div>

      {/* Classes & Live Attendance Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Today's Class Schedule */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={15} style={{ color: 'var(--primary)' }} />
              <span>Today's Classes</span>
            </h3>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                SoundEngine.playClick();
                setActiveTab('classes');
              }}
            >
              View Schedule
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {classes.map(cls => (
              <div key={cls.id} style={{
                padding: '10px 12px',
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
                  <span className={`badge ${cls.bookedCount >= cls.capacity ? 'badge-danger' : 'badge-info'}`} style={{ fontSize: '10px' }}>
                    {cls.bookedCount} / {cls.capacity} Booked
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Attendance Check-in Stream */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={15} style={{ color: '#22c55e' }} />
              <span>Recent Check-ins</span>
            </h3>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => {
                SoundEngine.playClick();
                setActiveTab('attendance');
              }}
            >
              Open Scanner
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    background: '#22c55e'
                  }} />
                  <div>
                    <strong style={{ fontSize: '13px' }}>{att.memberName}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pass: {att.passId}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <div>{att.time}</div>
                  <span className="badge badge-success" style={{ fontSize: '9px', padding: '1px 5px' }}>
                    {att.checkInMethod}
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
