import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { ClassService } from '../../services/classService';
import { WorkoutService } from '../../services/workoutService';
import { AttendanceService } from '../../services/attendanceService';
import { AIService } from '../../services/aiService';
import { SoundEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { 
  QrCode, 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Bot, 
  User, 
  Check, 
  Clock, 
  Flame, 
  Award,
  Send,
  Plus,
  ShieldCheck,
  ChevronRight,
  Smartphone,
  CheckCircle2,
  Zap
} from 'lucide-react';

export const MemberPortal = () => {
  const { activeGym, activeUser, refreshData, addToast } = useApp();
  const [memberTab, setMemberTab] = useState('overview');
  const [liveClock, setLiveClock] = useState(() => new Date().toLocaleTimeString());
  const [tapStatus, setTapStatus] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Classes & Bookings
  const classes = StorageService.getClasses().filter(c => c.gymId === activeGym.id);
  const myWorkouts = StorageService.getWorkouts().filter(w => w.memberId === activeUser.id);
  const myAttendance = StorageService.getAttendance().filter(a => a.memberId === activeUser.id);

  // New Workout Form
  const [workoutForm, setWorkoutForm] = useState({
    name: 'Upper Body Hypertrophy',
    durationMinutes: 50,
    exercises: [
      { name: 'Incline Dumbbell Press', sets: 4, reps: '10, 10, 8, 8', weightKg: 28, isPR: true },
      { name: 'Lat Pulldown (Close Grip)', sets: 3, reps: '12, 10, 10', weightKg: 65, isPR: false }
    ]
  });
  const [newExName, setNewExName] = useState('');
  const [newExWeight, setNewExWeight] = useState(20);

  // AI Member Coach
  const [coachMessages, setCoachMessages] = useState([
    {
      role: 'assistant',
      content: `Hey ${activeUser.name.split(' ')[0]}! 💪 I'm your IronPulse AI Coach. What are we targeting today? You can ask me to "Create today's workout", "Give me a quick 25-min session", or ask about nutrition and recovery!`
    }
  ]);
  const [coachInput, setCoachInput] = useState('');

  const handleBookClass = (classId) => {
    try {
      ClassService.bookClass(classId, activeUser.id, activeUser);
      refreshData();
      try {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
      addToast('Slot booked in group class!', 'success');
    } catch (err) {
      addToast(err.message, 'danger');
    }
  };

  const handleCancelBooking = (classId) => {
    try {
      ClassService.cancelBooking(classId, activeUser.id, activeUser);
      refreshData();
      addToast('Class booking cancelled', 'info');
    } catch (err) {
      addToast(err.message, 'danger');
    }
  };

  const handleAddExerciseToForm = () => {
    if (!newExName) return;
    setWorkoutForm({
      ...workoutForm,
      exercises: [
        ...workoutForm.exercises,
        { name: newExName, sets: 3, reps: '10, 10, 10', weightKg: newExWeight, isPR: false }
      ]
    });
    setNewExName('');
  };

  const handleSaveWorkout = (e) => {
    e.preventDefault();
    WorkoutService.logWorkout({
      memberId: activeUser.id,
      gymId: activeGym.id,
      name: workoutForm.name,
      durationMinutes: workoutForm.durationMinutes,
      exercises: workoutForm.exercises
    }, activeUser);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    refreshData();
    addToast('Workout logged! Personal records updated.', 'success');
  };

  const handleSendCoach = (queryText) => {
    const text = queryText || coachInput.trim();
    if (!text) return;

    setCoachMessages(prev => [...prev, { role: 'user', content: text }]);
    setCoachInput('');

    setTimeout(() => {
      const res = AIService.askMemberCoach(activeUser, text);
      setCoachMessages(prev => [...prev, { role: 'assistant', content: res.reply }]);
    }, 400);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Member Header Card */}
      <div className="glass-card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.12), rgba(0, 229, 255, 0.05))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img 
              src={activeUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'} 
              alt={activeUser.name}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '900' }}>{activeUser.name}</h2>
                <span className="badge badge-success">ACTIVE MEMBER</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {activeGym.name} • Plan: <strong>{activeUser.membershipPlan || 'Annual Elite Pro'}</strong>
              </p>
              <div style={{ fontSize: '11px', color: 'var(--primary)', fontFamily: 'monospace', marginTop: '2px' }}>
                DIGITAL PASS ID: {activeUser.passId || 'PASS-IP-7821'}
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => setMemberTab('qr_pass')}
            style={{ boxShadow: '0 0 16px rgba(255, 87, 34, 0.4)' }}
          >
            <QrCode size={18} />
            <span>Open Mobile QR Pass</span>
          </button>
        </div>

        {/* Member Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--surface-border)', paddingTop: '16px', marginTop: '20px', overflowX: 'auto' }}>
          {[
            { id: 'overview', label: 'My Dashboard', icon: Dumbbell },
            { id: 'qr_pass', label: 'Digital QR Pass', icon: QrCode },
            { id: 'classes', label: 'Book Classes', icon: Calendar },
            { id: 'workouts', label: 'Log Workout', icon: Flame },
            { id: 'ai_coach', label: 'AI Coach', icon: Bot }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = memberTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setMemberTab(tab.id)}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {memberTab === 'overview' && (
        <div>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Workout Consistency</span>
                <Flame size={18} color="var(--primary)" />
              </div>
              <div className="stat-value">{activeUser.historicalVisitsPerWeek || 3.2} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>visits/wk</span></div>
              <div className="stat-meta positive">
                <span>{myAttendance.length} Total verified entries</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Personal Records</span>
                <Award size={18} color="#ffd600" />
              </div>
              <div className="stat-value">5 PRs</div>
              <div className="stat-meta positive">Deadlift & Bench Press milestones</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Upcoming Booked Classes</span>
                <Calendar size={18} color="#3b82f6" />
              </div>
              <div className="stat-value">
                {classes.filter(c => c.attendees?.includes(activeUser.id)).length} Classes
              </div>
              <div className="stat-meta">Next: Tomorrow 07:00 AM</div>
            </div>
          </div>

          {/* Quick Workouts History */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Recent Workout Sessions</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setMemberTab('workouts')}>
                Log Today's Session
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myWorkouts.map(wo => (
                <div key={wo.id} style={{ padding: '14px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '14px' }}>{wo.name}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{wo.date} • {wo.durationMinutes} mins</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {wo.exercises?.map((ex, i) => (
                      <span key={i} className="badge badge-info" style={{ fontSize: '10px' }}>
                        {ex.name} ({ex.weightKg}kg) {ex.isPR && '🏆 PR'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIGITAL QR PASS (Section 29) */}
      {memberTab === 'qr_pass' && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <div className="digital-pass-card" style={{ maxWidth: '380px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                {activeGym.logo || '⚡'}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '0.5px' }}>{activeGym.name}</h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span className="badge badge-success">
                VERIFIED ACTIVE PASS
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--primary)', background: 'rgba(255, 87, 34, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                <Clock size={11} style={{ display: 'inline', marginRight: '4px' }} />
                {liveClock}
              </span>
            </div>

            <div style={{ margin: '14px 0' }}>
              <img 
                src={activeUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                alt="" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto', border: '3px solid var(--primary)' }}
              />
              <h4 style={{ fontSize: '18px', fontWeight: '800', marginTop: '8px' }}>{activeUser.name}</h4>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activeUser.membershipPlan || 'Elite Pro'}</span>
            </div>

            {/* Visual Dynamic Scannable QR Code with Hologram Sheen */}
            <div className="pass-qr-box" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 87, 34, 0.3), transparent)',
                animation: 'holoSheen 3s infinite linear'
              }} />

              <svg width="150" height="150" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="white" />
                {/* QR Finder patterns */}
                <rect x="5" y="5" width="25" height="25" fill="#000" />
                <rect x="8" y="8" width="19" height="19" fill="#fff" />
                <rect x="11" y="11" width="13" height="13" fill="#000" />
                <rect x="70" y="5" width="25" height="25" fill="#000" />
                <rect x="73" y="8" width="19" height="19" fill="#fff" />
                <rect x="76" y="11" width="13" height="13" fill="#000" />
                <rect x="5" y="70" width="25" height="25" fill="#000" />
                <rect x="8" y="73" width="19" height="19" fill="#fff" />
                <rect x="11" y="76" width="13" height="13" fill="#000" />
                {/* Simulated Data Points */}
                <rect x="36" y="10" width="8" height="8" fill="#000" />
                <rect x="48" y="18" width="8" height="8" fill="#000" />
                <rect x="36" y="36" width="28" height="28" fill="#ff5722" rx="4" />
                <rect x="70" y="42" width="6" height="16" fill="#000" />
                <rect x="12" y="42" width="14" height="6" fill="#000" />
                <rect x="42" y="72" width="12" height="12" fill="#000" />
                <rect x="65" y="72" width="20" height="6" fill="#000" />
                <rect x="75" y="82" width="10" height="8" fill="#000" />
              </svg>
            </div>

            <div style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: '800', letterSpacing: '1px', color: 'var(--primary)' }}>
              {activeUser.passId || 'PASS-IP-7821'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
              Present this optical code at reception scanner or kiosk entry
            </div>

            {/* Tap Simulation & Wallet Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  SoundEngine.playScanLaserBeep();
                  const res = AttendanceService.processQRScan(activeGym.id, activeUser.passId || 'PASS-IP-7821', activeUser);
                  if (res.success) {
                    SoundEngine.playSuccessChime();
                    setTapStatus('UNLOCKED');
                    try { confetti({ particleCount: 70, spread: 60 }); } catch (e) {}
                    refreshData();
                    addToast(`⚡ Turnstile Unlocked! Welcome to ${activeGym.name}, ${activeUser.name}.`, 'success');
                  } else {
                    SoundEngine.playDenyBuzz();
                    addToast(res.message, 'danger');
                  }
                }}
                style={{ width: '100%', fontSize: '13px', background: tapStatus === 'UNLOCKED' ? '#10b981' : 'var(--primary)' }}
              >
                <Zap size={14} />
                <span>{tapStatus === 'UNLOCKED' ? 'Turnstile Unlocked! (Gate Open)' : 'Simulate Turnstile NFC / QR Tap'}</span>
              </button>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  SoundEngine.playClickPop();
                  addToast('Pass saved to Apple Wallet & Google Pay profile 📱', 'info');
                }}
                style={{ width: '100%', fontSize: '11px' }}
              >
                <Smartphone size={12} />
                <span>Add to Apple Wallet / Google Pay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BOOK CLASSES */}
      {memberTab === 'classes' && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Available Group Fitness Classes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {classes.map(cls => {
              const isBooked = cls.attendees?.includes(activeUser.id);
              const isFull = cls.bookedCount >= cls.capacity;

              return (
                <div key={cls.id} className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '800' }}>{cls.title}</h4>
                    <span className="badge badge-info">{cls.category}</span>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
                    <div><Clock size={12} /> {cls.time} • {cls.date}</div>
                    <div>Coach: <strong>{cls.trainerName}</strong></div>
                    <div>Capacity: <strong>{cls.bookedCount} / {cls.capacity} Booked</strong></div>
                  </div>

                  {isBooked ? (
                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', borderColor: '#ef4444', color: '#ef4444' }}
                      onClick={() => handleCancelBooking(cls.id)}
                    >
                      Cancel My Booking
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%' }}
                      disabled={isFull}
                      onClick={() => handleBookClass(cls.id)}
                    >
                      {isFull ? 'Class Full' : 'Book Session'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: WORKOUT LOGGER */}
      {memberTab === 'workouts' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Log Today's Workout</h3>

          <form onSubmit={handleSaveWorkout}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Session Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={workoutForm.name}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration (Minutes)</label>
                <input 
                  type="number" 
                  className="form-input"
                  value={workoutForm.durationMinutes}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, durationMinutes: e.target.value })}
                />
              </div>
            </div>

            {/* Exercise List */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Exercises Logged</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {workoutForm.exercises.map((ex, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <strong>{ex.name}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ex.sets} sets × {ex.reps}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>{ex.weightKg} kg</span>
                      {ex.isPR && <span className="badge badge-warning" style={{ fontSize: '9px' }}>PR</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Add Exercise */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
              <input 
                type="text" 
                className="form-input"
                placeholder="Exercise name (e.g. Barbell Squat)..."
                value={newExName}
                onChange={(e) => setNewExName(e.target.value)}
              />
              <input 
                type="number" 
                className="form-input"
                style={{ width: '100px' }}
                placeholder="Kg"
                value={newExWeight}
                onChange={(e) => setNewExWeight(e.target.value)}
              />
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={handleAddExerciseToForm}
              >
                <Plus size={14} /> Add
              </button>
            </div>

            <button type="submit" className="btn btn-primary">
              Save Workout Log
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: AI MEMBER COACH */}
      {memberTab === 'ai_coach' && (
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #00e5ff, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Bot size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Contextual Member AI Coach</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Trained on your workout logs, strength milestones, and health goals.
              </p>
            </div>
          </div>

          {/* Quick Prompts */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {['Create today\'s workout', 'Quick 25-minute session', 'Nutrition & protein guidance', 'Recovery & sauna tips'].map(p => (
              <button key={p} className="btn btn-secondary btn-sm" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={() => handleSendCoach(p)}>
                {p}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '320px', maxHeight: '420px', overflowY: 'auto', marginBottom: '16px', paddingRight: '8px' }}>
            {coachMessages.map((msg, i) => (
              <div 
                key={i}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: msg.role === 'user' ? 'var(--primary)' : 'var(--bg-dark)',
                  color: '#fff',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              className="form-input"
              placeholder="Ask your coach anything about exercise form, sets, or recovery..."
              value={coachInput}
              onChange={(e) => setCoachInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCoach()}
            />
            <button className="btn btn-primary" onClick={() => handleSendCoach()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
