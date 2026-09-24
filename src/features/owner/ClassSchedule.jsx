import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { ClassService } from '../../services/classService';
import { Calendar, Plus, Users, Clock, MapPin, X, Dumbbell, Check } from 'lucide-react';

export const ClassSchedule = () => {
  const { activeGym, activeUser, refreshData, addToast } = useApp();
  const [classes, setClasses] = useState(() => ClassService.getClassesByGym(activeGym.id));
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClassRoster, setSelectedClassRoster] = useState(null);

  const [form, setForm] = useState({
    title: '',
    category: 'High Intensity Conditioning',
    trainerName: 'Arjun Mehta',
    trainerId: 'user_trainer_arjun',
    time: '07:00 AM - 07:45 AM',
    date: new Date().toISOString().split('T')[0],
    room: 'Studio A (Main Turf)',
    capacity: 20
  });

  const trainers = StorageService.getUsers().filter(u => u.roleId === 'trainer' && u.gymId === activeGym.id);
  const allMembers = StorageService.getUsers().filter(u => u.roleId === 'member' && u.gymId === activeGym.id);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!form.title) {
      addToast('Please provide a class title', 'danger');
      return;
    }

    const created = ClassService.createClass({
      ...form,
      gymId: activeGym.id
    }, activeUser);

    setClasses(ClassService.getClassesByGym(activeGym.id));
    refreshData();
    setShowCreateModal(false);
    addToast(`Scheduled '${created.title}'!`, 'success');
  };

  const handleCancelClass = (classId) => {
    if (window.confirm('Cancel this scheduled class?')) {
      ClassService.cancelClass(classId, activeUser);
      setClasses(ClassService.getClassesByGym(activeGym.id));
      refreshData();
      addToast('Class cancelled', 'info');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Group Fitness Class Schedule</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Manage class schedules, coach assignments, capacity caps, and member attendee rosters.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} />
          <span>Schedule New Class</span>
        </button>
      </div>

      {/* Classes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {classes.map(cls => {
          const occupancyPercent = Math.round((cls.bookedCount / cls.capacity) * 100);

          return (
            <div key={cls.id} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span className="badge badge-info" style={{ fontSize: '9px', marginBottom: '6px' }}>{cls.category}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{cls.title}</h3>
                </div>

                <span className={`badge ${occupancyPercent >= 90 ? 'badge-danger' : occupancyPercent >= 60 ? 'badge-warning' : 'badge-success'}`}>
                  {occupancyPercent}% Booked
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={12} />
                  <span>{cls.time} • {cls.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={12} />
                  <span>{cls.room}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Dumbbell size={12} />
                  <span>Coach: <strong>{cls.trainerName}</strong></span>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Occupancy</span>
                  <strong>{cls.bookedCount} / {cls.capacity} Slots Filled</strong>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-dark)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${occupancyPercent}%`,
                    background: occupancyPercent >= 90 ? '#ef4444' : occupancyPercent >= 60 ? '#f59e0b' : 'var(--primary)',
                    borderRadius: '3px'
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => setSelectedClassRoster(cls)}
                >
                  <Users size={12} />
                  <span>View Attendee Roster ({cls.bookedCount})</span>
                </button>

                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleCancelClass(cls.id)}
                  title="Cancel Class"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendee Roster Modal */}
      {selectedClassRoster && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>{selectedClassRoster.title} — Attendees</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {selectedClassRoster.time} • Room: {selectedClassRoster.room}
                </p>
              </div>
              <button onClick={() => setSelectedClassRoster(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedClassRoster.attendees?.map(memberId => {
                  const member = allMembers.find(m => m.id === memberId);
                  return (
                    <div key={memberId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={member?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80'} 
                          alt="" 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <strong>{member?.name || 'Member'}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pass: {member?.passId || 'PASS-IP'}</div>
                        </div>
                      </div>
                      <span className="badge badge-success" style={{ fontSize: '9px' }}>Booked</span>
                    </div>
                  );
                })}

                {(!selectedClassRoster.attendees || selectedClassRoster.attendees.length === 0) && (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    No members have booked this class yet.
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setSelectedClassRoster(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Class Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Schedule New Group Class</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Class Title *</label>
                  <input 
                    type="text" 
                    className="form-input"
                    required
                    placeholder="e.g. Olympic Barbell Clinic, Core Blast"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assigned Coach</label>
                    <select 
                      className="form-select"
                      value={form.trainerName}
                      onChange={(e) => {
                        const tr = trainers.find(t => t.name === e.target.value);
                        setForm({ ...form, trainerName: e.target.value, trainerId: tr?.id || 'trainer_1' });
                      }}
                    >
                      {trainers.map(t => (
                        <option key={t.id} value={t.name}>{t.name} ({t.specialization})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Time Slot</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="07:00 AM - 08:00 AM"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Capacity</label>
                    <input 
                      type="number" 
                      className="form-input"
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
