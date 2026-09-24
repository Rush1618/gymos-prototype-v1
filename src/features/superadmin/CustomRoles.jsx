import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { AuditService } from '../../services/auditService';
import { SYSTEM_ROLES } from '../../config/roles';
import { PERMISSION_DEFINITIONS } from '../../config/permissions';
import { Sliders, Plus, Check, X, Shield, Users, Trash2 } from 'lucide-react';

export const CustomRoles = () => {
  const { activeUser, refreshData, addToast } = useApp();
  const [customRoles, setCustomRoles] = useState(() => StorageService.getCustomRoles());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    baseRole: 'trainer',
    badgeColor: '#10b981',
    permissions: {}
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newRole.name) {
      addToast('Please provide a role name', 'danger');
      return;
    }

    const key = `custom_${newRole.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const roleObj = {
      key,
      name: newRole.name,
      description: newRole.description || 'Custom role provisioned by Super Admin',
      badgeColor: newRole.badgeColor,
      scope: 'TENANT',
      isSystem: false,
      baseRole: newRole.baseRole,
      permissions: newRole.permissions
    };

    const updated = [...customRoles, roleObj];
    StorageService.saveCustomRoles(updated);
    setCustomRoles(updated);

    AuditService.log({
      actorName: activeUser.name,
      actorRole: 'SUPER ADMIN',
      action: 'CUSTOM_ROLE_CREATED',
      targetRole: key,
      details: `Created custom role '${roleObj.name}' with base template '${roleObj.baseRole}'`
    });

    setShowCreateModal(false);
    refreshData();
    addToast(`Custom role '${roleObj.name}' created!`, 'success');
  };

  const handleDelete = (roleKey) => {
    const filtered = customRoles.filter(r => r.key !== roleKey);
    StorageService.saveCustomRoles(filtered);
    setCustomRoles(filtered);

    AuditService.log({
      actorName: activeUser.name,
      actorRole: 'SUPER ADMIN',
      action: 'CUSTOM_ROLE_DELETED',
      targetRole: roleKey,
      details: `Deleted custom role '${roleKey}'`
    });

    refreshData();
    addToast('Custom role deleted', 'info');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Custom Roles Builder</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Extend default roles with specialized permissions for specialized personnel such as Nutritionists, Head Coaches, or Sales Managers.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} />
          <span>Create Custom Role</span>
        </button>
      </div>

      {/* Grid of System Roles vs Custom Roles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {/* System Roles overview */}
        {SYSTEM_ROLES.map(role => (
          <div key={role.key} className="glass-card" style={{ borderLeft: `4px solid ${role.badgeColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '800' }}>{role.name}</h4>
              <span className="badge badge-purple" style={{ fontSize: '10px' }}>System Default</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px' }}>
              {role.description}
            </p>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Scope: <strong>{role.scope}</strong> • Key: <code>{role.key}</code>
            </div>
          </div>
        ))}

        {/* Custom Roles list */}
        {customRoles.map(role => (
          <div key={role.key} className="glass-card" style={{ borderLeft: `4px solid ${role.badgeColor}`, background: 'rgba(255, 255, 255, 0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '800', color: role.badgeColor }}>{role.name}</h4>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span className="badge badge-warning" style={{ fontSize: '10px' }}>Custom Role</span>
                <button 
                  onClick={() => handleDelete(role.key)}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}
                  title="Delete Custom Role"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px' }}>
              {role.description}
            </p>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Base Template: <strong>{role.baseRole}</strong> • Key: <code>{role.key}</code>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Creating Custom Role */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Define New Custom Role</h2>
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
                  <label className="form-label">Role Title *</label>
                  <input 
                    type="text" 
                    className="form-input"
                    required
                    placeholder="e.g. Head Trainer, Nutrition Coach, Sales Lead"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role Description</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="Brief description of what this role does..."
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Base Permission Template</label>
                    <select 
                      className="form-select"
                      value={newRole.baseRole}
                      onChange={(e) => setNewRole({ ...newRole, baseRole: e.target.value })}
                    >
                      <option value="trainer">Trainer</option>
                      <option value="manager">Manager</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="owner">Owner</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Badge Color</label>
                    <select 
                      className="form-select"
                      value={newRole.badgeColor}
                      onChange={(e) => setNewRole({ ...newRole, badgeColor: e.target.value })}
                    >
                      <option value="#84cc16">Lime (#84cc16)</option>
                      <option value="#f97316">Orange (#f97316)</option>
                      <option value="#06b6d4">Cyan (#06b6d4)</option>
                      <option value="#ec4899">Pink (#ec4899)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Deploy Custom Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
