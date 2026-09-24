import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { GymService } from '../../services/gymService';
import { 
  Building2, 
  Plus, 
  Search, 
  Sliders, 
  Palette, 
  ExternalLink, 
  Power, 
  Layers, 
  Check, 
  X,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';

export const GymManagement = () => {
  const { gyms, activeGymId, setActiveGymId, setActiveSurface, setActiveTab, activeUser, refreshData, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    ownerEmail: '',
    city: 'Mumbai',
    area: '',
    phone: '',
    platformPlan: 'PRO',
    gymType: 'Strength & Conditioning',
    logo: '⚡'
  });

  const filteredGyms = gyms.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || 
                        g.city.toLowerCase().includes(search.toLowerCase()) ||
                        g.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || g.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.ownerName || !formData.ownerEmail) {
      addToast('Please fill all required fields', 'danger');
      return;
    }

    const created = GymService.createGym(formData, activeUser);
    refreshData();
    setShowCreateModal(false);
    addToast(`Gym tenant '${created.name}' created successfully!`, 'success');
  };

  const handleStatusToggle = (gymId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    GymService.toggleGymStatus(gymId, nextStatus, activeUser);
    refreshData();
    addToast(`Gym status changed to ${nextStatus}`, 'info');
  };

  return (
    <div>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Gym Tenants Directory</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Remotely manage configurations, plans, and lifecycle across all gym deployments</p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={16} />
          <span>Provision New Gym</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search gym by name, city, or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'ACTIVE', 'TRIAL', 'SUSPENDED'].map(st => (
            <button
              key={st}
              className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Gym Tenants Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Gym & Location</th>
              <th>Owner Details</th>
              <th>Platform Plan</th>
              <th>Members</th>
              <th>Est. MRR</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Remote Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGyms.map(gym => (
              <tr key={gym.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      background: gym.theme?.bgSurface || 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      border: '1px solid var(--surface-border)'
                    }}>
                      {gym.logo || '⚡'}
                    </div>
                    <div>
                      <strong>{gym.name}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={10} />
                        {gym.city}, {gym.area}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{gym.ownerName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{gym.ownerEmail}</div>
                </td>
                <td>
                  <span className={`badge ${gym.platformPlan === 'ENTERPRISE' ? 'badge-purple' : gym.platformPlan === 'PRO' ? 'badge-info' : 'badge-warning'}`}>
                    {gym.platformPlan}
                  </span>
                </td>
                <td>
                  <strong>{gym.metrics?.activeMembers || 0}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}> / {gym.metrics?.membersCount || 0}</span>
                </td>
                <td>
                  <strong style={{ color: 'var(--success)' }}>₹{(gym.metrics?.mrr || 0).toLocaleString('en-IN')}</strong>
                </td>
                <td>
                  <span className={`badge ${gym.status === 'ACTIVE' ? 'badge-success' : gym.status === 'TRIAL' ? 'badge-warning' : 'badge-danger'}`}>
                    {gym.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      title="Open Gym Operating System"
                      onClick={() => {
                        setActiveGymId(gym.id);
                        setActiveSurface('gymos');
                      }}
                    >
                      <ExternalLink size={12} />
                      <span>Open OS</span>
                    </button>

                    <button 
                      className="btn btn-secondary btn-sm"
                      title="Configure Branding & Theme"
                      onClick={() => {
                        setActiveGymId(gym.id);
                        setActiveTab('branding');
                      }}
                    >
                      <Palette size={12} />
                    </button>

                    <button 
                      className="btn btn-secondary btn-sm"
                      title="Feature Flags"
                      onClick={() => {
                        setActiveGymId(gym.id);
                        setActiveTab('features');
                      }}
                    >
                      <Layers size={12} />
                    </button>

                    <button 
                      className={`btn btn-sm ${gym.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'}`}
                      title={gym.status === 'ACTIVE' ? 'Suspend Gym' : 'Activate Gym'}
                      onClick={() => handleStatusToggle(gym.id, gym.status)}
                    >
                      <Power size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Provision New Gym Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Provision New Gym Tenant</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Gym / Brand Name *</label>
                  <input 
                    type="text" 
                    className="form-input"
                    required
                    placeholder="e.g. ThunderFit Athletics"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Owner Name *</label>
                    <input 
                      type="text" 
                      className="form-input"
                      required
                      placeholder="e.g. Kunal Shah"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Owner Email *</label>
                    <input 
                      type="email" 
                      className="form-input"
                      required
                      placeholder="kunal@thunderfit.in"
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <select 
                      className="form-select"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    >
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="New Delhi">New Delhi</option>
                      <option value="Pune">Pune</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Area / Locality</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="e.g. Andheri West"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Platform Plan</label>
                    <select 
                      className="form-select"
                      value={formData.platformPlan}
                      onChange={(e) => setFormData({ ...formData, platformPlan: e.target.value })}
                    >
                      <option value="STARTER">STARTER (Basic)</option>
                      <option value="PRO">PRO (CRM + AI Coach + QR)</option>
                      <option value="ENTERPRISE">ENTERPRISE (Full Stack)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gym Facility Type</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={formData.gymType}
                      onChange={(e) => setFormData({ ...formData, gymType: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Deploy Gym Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
