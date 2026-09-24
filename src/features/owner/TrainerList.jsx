import React from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { Dumbbell, Users, Calendar, Award, Star } from 'lucide-react';

export const TrainerList = () => {
  const { activeGym } = useApp();
  const trainers = StorageService.getUsers().filter(u => u.roleId === 'trainer' && u.gymId === activeGym.id);
  const classes = StorageService.getClasses().filter(c => c.gymId === activeGym.id);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Coaching Staff & Personal Trainers</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Section 26: Coach specializations, active client loads, and assigned group fitness schedules.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {trainers.map(trainer => {
          const trainerClasses = classes.filter(c => c.trainerId === trainer.id || c.trainerName === trainer.name);

          return (
            <div key={trainer.id} className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <img 
                  src={trainer.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'} 
                  alt={trainer.name} 
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{trainer.name}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700' }}>
                    {trainer.specialization || 'Strength & Conditioning'}
                  </span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {trainer.experienceYears || 5} Years Coaching Experience
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '10px', display: 'block' }}>ASSIGNED CLIENTS</span>
                  <strong>{trainer.assignedClientsCount || 12} Members</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '10px', display: 'block' }}>GROUP CLASSES</span>
                  <strong>{trainerClasses.length} Scheduled</strong>
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Weekly Class Load:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {trainerClasses.map(c => (
                    <div key={c.id} style={{ fontSize: '11px', padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{c.title}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{c.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
