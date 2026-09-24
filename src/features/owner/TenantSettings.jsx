import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { GymService } from '../../services/gymService';
import { Settings, Save, MapPin, Phone, Mail, Clock } from 'lucide-react';

export const TenantSettings = () => {
  const { activeGym, activeUser, refreshData, addToast } = useApp();
  const [form, setForm] = useState({
    area: activeGym.area || '',
    phone: activeGym.phone || '',
    timezone: activeGym.timezone || 'Asia/Kolkata (IST)',
    currency: activeGym.currency || 'INR (₹)'
  });

  const handleSave = (e) => {
    e.preventDefault();
    GymService.updateGym(activeGym.id, form, activeUser);
    refreshData();
    addToast('Tenant operational settings saved', 'success');
  };

  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Tenant Operational Settings</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Configure physical address, contact telephone, timezone, and operational currency for {activeGym.name}.
        </p>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Physical Address / Facility Location</label>
            <input 
              type="text" 
              className="form-input"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Contact Telephone</label>
              <input 
                type="text" 
                className="form-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Operating Currency</label>
              <input 
                type="text" 
                className="form-input"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Timezone</label>
            <input 
              type="text" 
              className="form-input"
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
            <Save size={16} />
            <span>Save Preferences</span>
          </button>
        </form>
      </div>
    </div>
  );
};
