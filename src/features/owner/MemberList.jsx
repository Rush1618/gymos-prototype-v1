import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { 
  Users, 
  Search, 
  QrCode, 
  Calendar, 
  Dumbbell, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react';

export const MemberList = () => {
  const { activeGym, canAccessPage, canViewFeature, canPerformAction, setActiveTab } = useApp();
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  const members = StorageService.getUsers().filter(u => u.roleId === 'member' && u.gymId === activeGym.id);
  const trainers = StorageService.getUsers().filter(u => u.roleId === 'trainer' && u.gymId === activeGym.id);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    (m.passId && m.passId.toLowerCase().includes(search.toLowerCase())) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Active Member Directory</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Section 25: Centralized member profiles, digital passes, attendance consistency, and retention health.
          </p>
        </div>

        <span className="badge badge-purple" style={{ padding: '6px 12px' }}>
          {members.length} Enrolled Members
        </span>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '380px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          className="form-input"
          style={{ paddingLeft: '36px' }}
          placeholder="Search by name, email, or pass ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Members Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Member & Pass ID</th>
              <th>Membership Tier</th>
              <th>Assigned Coach</th>
              <th>Last Visit</th>
              <th>Retention Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map(member => {
              const trainer = trainers.find(t => t.id === member.assignedTrainerId);
              const isAtRisk = member.retentionRisk === 'HIGH_RISK';

              return (
                <tr key={member.id} style={{ background: isAtRisk ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'} 
                        alt={member.name}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <strong>{member.name}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {member.email}
                        </div>
                        <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--primary)', marginTop: '2px' }}>
                          QR Pass: {member.passId || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <strong>{member.membershipPlan || 'Standard Tier'}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--success)' }}>Active Member</div>
                  </td>

                  <td>
                    <span style={{ fontSize: '12px' }}>{trainer ? trainer.name : 'General Staff'}</span>
                  </td>

                  <td>
                    <strong>{member.lastVisitDaysAgo === 0 ? 'Today' : `${member.lastVisitDaysAgo} days ago`}</strong>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      Avg: {member.historicalVisitsPerWeek || 3} visits/wk
                    </div>
                  </td>

                  <td>
                    {isAtRisk ? (
                      <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={10} /> Churn Risk (17d)
                      </span>
                    ) : (
                      <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={10} /> Consistent
                      </span>
                    )}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedMember(member)}
                      >
                        Profile
                      </button>

                      {isAtRisk && (
                        <button 
                          className="btn btn-sm"
                          style={{ background: '#ef4444', color: '#fff', border: 'none', fontSize: '11px' }}
                          onClick={() => setActiveTab('retention')}
                          title="Open Retention Engine Outreach"
                        >
                          Outreach
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Member Profile Modal */}
      {selectedMember && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={selectedMember.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                  alt={selectedMember.name} 
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h2>{selectedMember.name}</h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Pass: <strong>{selectedMember.passId}</strong> • Member since {selectedMember.joinedDate || '2025'}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div style={{ padding: '12px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CURRENT PLAN</span>
                  <div style={{ fontSize: '14px', fontWeight: '800', marginTop: '2px' }}>{selectedMember.membershipPlan}</div>
                </div>

                <div style={{ padding: '12px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ATTENDANCE VELOCITY</span>
                  <div style={{ fontSize: '14px', fontWeight: '800', marginTop: '2px' }}>
                    {selectedMember.historicalVisitsPerWeek} visits/week
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Details</label>
                <div style={{ fontSize: '13px', color: 'var(--text-main)', display: 'flex', gap: '16px' }}>
                  <span><Phone size={12} /> {selectedMember.phone}</span>
                  <span><Mail size={12} /> {selectedMember.email}</span>
                </div>
              </div>

              {canViewFeature('member.viewNotes') && (
                <div className="form-group">
                  <label className="form-label">Confidential Staff Notes</label>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '10px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)' }}>
                    {selectedMember.retentionRisk === 'HIGH_RISK'
                      ? '⚠️ Member missed last 17 days due to work travel. Triggered AI retention re-engagement message to coach Arjun.'
                      : 'Consistent trainee with regular 7 AM routine. Shows great deadlift form progression.'}
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setSelectedMember(null)}>
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
