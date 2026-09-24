import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { LeadService } from '../../services/leadService';
import confetti from 'canvas-confetti';
import { 
  UserPlus, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Phone, 
  Mail, 
  Check, 
  X, 
  Calendar, 
  Dumbbell, 
  UserCheck, 
  Filter
} from 'lucide-react';

const PIPELINE_STAGES = [
  { key: 'NEW', title: 'New Leads', color: '#3b82f6' },
  { key: 'CONTACTED', title: 'Contacted', color: '#f59e0b' },
  { key: 'TRIAL_BOOKED', title: 'Trial Booked', color: '#8b5cf6' },
  { key: 'TRIAL_COMPLETED', title: 'Trial Done', color: '#06b6d4' },
  { key: 'CONVERTED', title: 'Converted', color: '#10b981' },
  { key: 'LOST', title: 'Lost / Dropped', color: '#64748b' }
];

export const CRMLeads = () => {
  const { activeGym, activeUser, canPerformAction, refreshData, addToast, setActiveTab } = useApp();
  const [leads, setLeads] = useState(() => LeadService.getLeadsByGym(activeGym.id));
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedLeadToConvert, setSelectedLeadToConvert] = useState(null);

  // Form states
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    goal: 'Hypertrophy & Muscle Gain',
    source: 'Walk-in'
  });

  const [convertForm, setConvertForm] = useState({
    planId: 'plan_annual_elite',
    trainerId: 'user_trainer_arjun'
  });

  const plans = StorageService.getPlans().filter(p => p.gymId === activeGym.id);
  const trainers = StorageService.getUsers().filter(u => u.roleId === 'trainer' && u.gymId === activeGym.id);

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.phone.toLowerCase().includes(search.toLowerCase()) ||
    l.goal.toLowerCase().includes(search.toLowerCase())
  );

  const handleStageMove = (leadId, nextStage) => {
    LeadService.updateLeadStatus(leadId, nextStage, activeUser);
    setLeads(LeadService.getLeadsByGym(activeGym.id));
    refreshData();
    addToast(`Lead stage updated to ${nextStage}`, 'info');
  };

  const handleOpenConvert = (lead) => {
    setSelectedLeadToConvert(lead);
    setShowConvertModal(true);
  };

  const handleExecuteConvert = (e) => {
    e.preventDefault();
    if (!selectedLeadToConvert) return;

    // Loop 1 & Milestone 2: Convert qualified lead into active member!
    const result = LeadService.convertLeadToMember(
      selectedLeadToConvert.id,
      convertForm.planId,
      convertForm.trainerId,
      activeUser
    );

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    setShowConvertModal(false);
    setSelectedLeadToConvert(null);
    setLeads(LeadService.getLeadsByGym(activeGym.id));
    refreshData();
    addToast(`${result.member.name} converted to Active Member. Digital Pass: ${result.member.passId}`, 'success');
  };

  const handleAddManualLead = (e) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.phone) {
      addToast('Please enter name and phone number', 'danger');
      return;
    }

    LeadService.createLeadFromPublicWebsite({
      gymId: activeGym.id,
      name: newLeadForm.name,
      phone: newLeadForm.phone,
      email: newLeadForm.email,
      goal: newLeadForm.goal,
      source: newLeadForm.source
    });

    setLeads(LeadService.getLeadsByGym(activeGym.id));
    refreshData();
    setShowAddModal(false);
    setNewLeadForm({ name: '', phone: '', email: '', goal: 'Hypertrophy & Muscle Gain', source: 'Walk-in' });
    addToast(`Added new lead '${newLeadForm.name}'`, 'success');
  };

  return (
    <div>
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>CRM Sales & Trial Pipeline</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Loop 1: Track website trial inquiries through qualification to full member conversion.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <UserPlus size={16} />
            <span>Add Walk-in Lead</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '380px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          className="form-input"
          style={{ paddingLeft: '36px' }}
          placeholder="Search leads by name, phone, or goal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Visual Kanban Columns (Section 24) */}
      <div className="kanban-board">
        {PIPELINE_STAGES.map(stage => {
          const stageLeads = filteredLeads.filter(l => l.status === stage.key);

          return (
            <div key={stage.key} className="kanban-column" style={{ borderTop: `3px solid ${stage.color}` }}>
              <div className="kanban-column-header">
                <span className="kanban-title" style={{ color: stage.color }}>{stage.title}</span>
                <span className="kanban-count">{stageLeads.length}</span>
              </div>

              <div className="kanban-cards">
                {stageLeads.map(lead => (
                  <div key={lead.id} className="lead-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '14px' }}>{lead.name}</strong>
                      <span className="badge badge-info" style={{ fontSize: '9px', padding: '1px 5px' }}>
                        {lead.source}
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <Phone size={10} /> {lead.phone}
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      <Dumbbell size={10} /> Goal: <strong>{lead.goal}</strong>
                    </div>

                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.3', padding: '6px', background: 'var(--bg-dark)', borderRadius: '4px', marginBottom: '10px' }}>
                      {lead.notes}
                    </p>

                    {/* Quick Stage Transitions */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {stage.key === 'NEW' && (
                        <button 
                          className="btn btn-secondary btn-sm" 
                          style={{ fontSize: '11px', padding: '3px 8px', width: '100%' }}
                          onClick={() => handleStageMove(lead.id, 'CONTACTED')}
                        >
                          Mark Contacted ➔
                        </button>
                      )}

                      {stage.key === 'CONTACTED' && (
                        <button 
                          className="btn btn-secondary btn-sm" 
                          style={{ fontSize: '11px', padding: '3px 8px', width: '100%' }}
                          onClick={() => handleStageMove(lead.id, 'TRIAL_BOOKED')}
                        >
                          Book Free Trial ➔
                        </button>
                      )}

                      {stage.key === 'TRIAL_BOOKED' && (
                        <button 
                          className="btn btn-secondary btn-sm" 
                          style={{ fontSize: '11px', padding: '3px 8px', width: '100%' }}
                          onClick={() => handleStageMove(lead.id, 'TRIAL_COMPLETED')}
                        >
                          Mark Trial Done ➔
                        </button>
                      )}

                      {/* 1-Click Conversion Action (Prompt Loop 1) */}
                      {stage.key !== 'CONVERTED' && stage.key !== 'LOST' && (
                        <button 
                          className="btn btn-primary btn-sm" 
                          style={{ fontSize: '11px', padding: '4px 8px', width: '100%', background: '#10b981', borderColor: '#10b981' }}
                          onClick={() => handleOpenConvert(lead)}
                        >
                          <Sparkles size={12} /> Convert to Member
                        </button>
                      )}

                      {stage.key === 'CONVERTED' && (
                        <div style={{ width: '100%', textAlign: 'center', fontSize: '11px', color: '#10b981', fontWeight: '700' }}>
                          ✓ Active Enrolled Member
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 10px', color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 1-Click Convert Lead to Member Modal */}
      {showConvertModal && selectedLeadToConvert && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>Convert Lead to Active Gym Member</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Enrolling <strong>{selectedLeadToConvert.name}</strong> ({selectedLeadToConvert.phone})
                </p>
              </div>
              <button onClick={() => setShowConvertModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleExecuteConvert}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Membership Plan *</label>
                  <select 
                    className="form-select"
                    value={convertForm.planId}
                    onChange={(e) => setConvertForm({ ...convertForm, planId: e.target.value })}
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ₹{p.price.toLocaleString('en-IN')} ({p.durationMonths} Months)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Assign Personal Trainer</label>
                  <select 
                    className="form-select"
                    value={convertForm.trainerId}
                    onChange={(e) => setConvertForm({ ...convertForm, trainerId: e.target.value })}
                  >
                    {trainers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ padding: '12px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <div style={{ fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Automated Actions Upon Conversion:</div>
                  • Creates Member account with unique QR Digital Pass ID<br />
                  • Sets membership status to ACTIVE<br />
                  • Records simulated payment invoice in billing records<br />
                  • Removes lead from sales pipeline into member roster
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConvertModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981' }}>
                  Enroll & Issue Digital Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Walk-in Lead Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Add New Sales Lead</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddManualLead}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-input"
                    required
                    placeholder="e.g. Ritesh Deshmukh"
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input 
                    type="tel" 
                    className="form-input"
                    required
                    placeholder="+91 98000 00000"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-input"
                    placeholder="ritesh@gmail.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Lead Source</label>
                    <select 
                      className="form-select"
                      value={newLeadForm.source}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                    >
                      <option value="Walk-in">Walk-in Inquiry</option>
                      <option value="Website Free Trial">Website Free Trial</option>
                      <option value="Referral">Member Referral</option>
                      <option value="Instagram">Instagram DM</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Goal</label>
                    <select 
                      className="form-select"
                      value={newLeadForm.goal}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, goal: e.target.value })}
                    >
                      <option value="Hypertrophy & Muscle Gain">Hypertrophy & Muscle Gain</option>
                      <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                      <option value="Mobility & General Fitness">Mobility & General Fitness</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
