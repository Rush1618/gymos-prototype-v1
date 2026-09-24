import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { AttendanceService } from '../../services/attendanceService';
import { SoundEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Clock, 
  Users, 
  Sparkles, 
  ShieldCheck,
  Check,
  Unlock,
  Lock,
  Camera
} from 'lucide-react';

export const AttendanceScanner = () => {
  const { activeGym, activeUser, refreshData, addToast } = useApp();
  const [passInput, setPassInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [turnstileOpen, setTurnstileOpen] = useState(false);
  const [recentAttendance, setRecentAttendance] = useState(() => 
    AttendanceService.getAttendanceByGym(activeGym.id)
  );

  const members = StorageService.getUsers().filter(u => u.roleId === 'member' && u.gymId === activeGym.id);

  const handleExecuteScan = (idToScan) => {
    const targetPass = idToScan || passInput.trim();
    if (!targetPass) {
      addToast('Please enter or select a Member Pass ID', 'danger');
      return;
    }

    setIsScanning(true);
    SoundEngine.playScanLaserBeep();

    setTimeout(() => {
      // Loop 2 & Loop 3: Process QR Scan Validation
      const res = AttendanceService.processQRScan(activeGym.id, targetPass, activeUser);
      setScanResult(res);
      setIsScanning(false);

      if (res.success) {
        SoundEngine.playSuccessChime();
        setTurnstileOpen(true);
        setTimeout(() => setTurnstileOpen(false), 4500);

        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch (err) {}

        setRecentAttendance(AttendanceService.getAttendanceByGym(activeGym.id));
        refreshData();
        addToast(`Access Granted! ${res.member.name} checked in.`, 'success');
      } else {
        SoundEngine.playDenyBuzz();
        addToast(res.message, 'danger');
      }
    }, 350);
  };

  const handleManualCheckin = (memberId) => {
    AttendanceService.processManualCheckin(activeGym.id, memberId, activeUser);
    setRecentAttendance(AttendanceService.getAttendanceByGym(activeGym.id));
    refreshData();
    addToast('Manual check-in override recorded', 'info');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Front Desk Attendance & QR Check-in Terminal</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Section 29: Instant digital QR code validation against real-time membership validity and automated churn recovery.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Interactive QR Scanner Simulator */}
        <div className="glass-card" style={{ border: '2px solid var(--primary)', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Live Scanner Terminal</h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Optic Validation Engine: ACTIVE</span>
            </div>
          </div>

          {/* Quick Simulation Shortcuts */}
          <div style={{ padding: '12px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              QUICK TEST PASS SIMULATORS:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setPassInput('PASS-IP-7821');
                  handleExecuteScan('PASS-IP-7821');
                }}
              >
                Rahul Sharma (PASS-IP-7821)
              </button>

              <button 
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setPassInput('PASS-IP-9042');
                  handleExecuteScan('PASS-IP-9042');
                }}
              >
                Priya Sen (PASS-IP-9042)
              </button>
            </div>
          </div>

          {/* Animated Optical Viewfinder */}
          <div style={{
            position: 'relative',
            height: '140px',
            background: '#05070a',
            borderRadius: 'var(--radius-md)',
            border: isScanning ? '2px solid #00e5ff' : '1px dashed var(--surface-border)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: isScanning ? '0 0 20px rgba(0, 229, 255, 0.3)' : 'none'
          }}>
            {/* Viewfinder Target Corners */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', width: '16px', height: '16px', borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '16px', height: '16px', borderTop: '2px solid var(--primary)', borderRight: '2px solid var(--primary)' }} />
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '16px', height: '16px', borderBottom: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)' }} />
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '16px', height: '16px', borderBottom: '2px solid var(--primary)', borderRight: '2px solid var(--primary)' }} />

            {/* Moving Laser Beam */}
            {isScanning && (
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '3px',
                background: '#00e5ff',
                boxShadow: '0 0 12px #00e5ff, 0 0 24px #00e5ff',
                animation: 'scannerLaser 0.35s ease-in-out infinite alternate'
              }} />
            )}

            <div style={{ textAlign: 'center', color: isScanning ? '#00e5ff' : 'var(--text-muted)', fontSize: '12px' }}>
              <Camera size={24} style={{ margin: '0 auto 6px', display: 'block', opacity: isScanning ? 1 : 0.5 }} />
              <span>{isScanning ? 'Decoding QR Optical Matrix...' : 'Align Member QR Code with Viewfinder'}</span>
            </div>
          </div>

          {/* Turnstile Status Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: turnstileOpen ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-dark)',
            border: `1px solid ${turnstileOpen ? '#10b981' : 'var(--surface-border)'}`,
            marginBottom: '18px',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {turnstileOpen ? (
                <Unlock size={16} color="#10b981" />
              ) : (
                <Lock size={16} color="var(--text-muted)" />
              )}
              <span style={{ fontSize: '12px', fontWeight: '700' }}>
                Turnstile 01 Barrier: <strong style={{ color: turnstileOpen ? '#10b981' : 'var(--text-muted)' }}>{turnstileOpen ? 'OPEN (PASSTHROUGH PERMITTED)' : 'LOCKED'}</strong>
              </span>
            </div>
            <span className={`badge ${turnstileOpen ? 'badge-success' : 'badge-info'}`} style={{ fontSize: '9px' }}>
              {turnstileOpen ? 'RELAY TRIGGERED' : 'READY'}
            </span>
          </div>

          {/* Input Box */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
              type="text" 
              className="form-input"
              placeholder="Scan or enter Pass ID (e.g. PASS-IP-7821)..."
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
            />
            <button 
              className="btn btn-primary"
              onClick={() => handleExecuteScan()}
              disabled={isScanning}
            >
              {isScanning ? 'Scanning...' : 'Verify Pass'}
            </button>
          </div>

          {/* Scanner Feedback Card */}
          {scanResult && (
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: scanResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${scanResult.success ? '#10b981' : '#ef4444'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                {scanResult.success ? (
                  <CheckCircle2 size={22} color="#10b981" />
                ) : (
                  <AlertCircle size={22} color="#ef4444" />
                )}
                <strong style={{ fontSize: '15px', color: scanResult.success ? '#10b981' : '#ef4444' }}>
                  {scanResult.success ? 'ACCESS GRANTED • VALID PASS' : 'CHECK-IN DENIED'}
                </strong>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '10px' }}>
                {scanResult.message}
              </p>

              {scanResult.member && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)' }}>
                  <img 
                    src={scanResult.member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'} 
                    alt={scanResult.member.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <strong style={{ fontSize: '14px' }}>{scanResult.member.name}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Tier: {scanResult.member.membershipPlan} • Status: <span style={{ color: '#10b981', fontWeight: 'bold' }}>ACTIVE</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Attendance History Stream */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} style={{ color: 'var(--primary)' }} />
              <span>Today's Verified Check-ins</span>
            </h3>
            <span className="badge badge-success">{recentAttendance.length} Checked In</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto' }}>
            {recentAttendance.map(att => (
              <div key={att.id} style={{
                padding: '12px',
                background: 'var(--bg-dark)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--surface-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong style={{ fontSize: '13px' }}>{att.memberName}</strong>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Pass: <code>{att.passId}</code> • Method: <strong>{att.checkInMethod}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700' }}>{att.time}</span>
                  <div style={{ fontSize: '10px', color: '#10b981' }}>✓ Gate Unlocked</div>
                </div>
              </div>
            ))}
          </div>

          {/* Manual Check-in Section */}
          <div style={{ marginTop: '20px', borderTop: '1px solid var(--surface-border)', paddingTop: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Manual Reception Override:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {members.slice(0, 3).map(m => (
                <button 
                  key={m.id}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                  onClick={() => handleManualCheckin(m.id)}
                >
                  Check-in {m.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
