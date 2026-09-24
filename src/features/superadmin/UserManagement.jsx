import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { AuditService } from '../../services/auditService';
import { PERMISSION_DEFINITIONS } from '../../config/permissions';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  Sliders, 
  Check, 
  X, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

export const UserManagement = () => {
  const { users, activeUser, refreshData, addToast } = useApp();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOverrides, setUserOverrides] = useState(() => StorageService.getUserOverrides());
  const [filterRole, setFilterRole] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'ALL' || u.roleId === filterRole;
    return matchSearch && matchRole;
  });

  const handleToggleOverride = (userId, permKey) => {
    const currentOverrides = userOverrides[userId] || {};
    const currentVal = currentOverrides[permKey];
    
    // Cycle: undefined -> true -> false -> undefined (delete override)
    let nextVal;
    if (currentVal === undefined) nextVal = true;
    else if (currentVal === true) nextVal = false;
    else nextVal = undefined;

    const updatedUserOverrides = { ...currentOverrides };
    if (nextVal === undefined) {
      delete updatedUserOverrides[permKey];
    } else {
      updatedUserOverrides[permKey] = nextVal;
    }

    const updatedMap = {
      ...userOverrides,
      [userId]: updatedUserOverrides
    };

    setUserOverrides(updatedMap);
    StorageService.saveUserOverrides(updatedMap);

    AuditService.log({
      actorName: activeUser.name,
      actorRole: 'SUPER ADMIN',
      action: 'USER_PERMISSION_OVERRIDE_CHANGED',
      targetUser: selectedUser?.name || userId,
      permissionKey: permKey,
      beforeValue: String(currentVal),
      afterValue: String(nextVal),
      details: `Super Admin set user override on '${permKey}' for ${selectedUser?.name}`
    });

    refreshData();
    addToast(`Updated user override for ${selectedUser?.name}`, 'success');
  };

  return (
    <div>
      {/* Overview Card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--surface-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Platform Users & User Overrides</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '650px', marginTop: '4px' }}>
            Section 12: When standard role permissions aren't enough, Super Admin can set explicit user overrides 
            (e.g., granting Trainer Arjun Mehta access to Analytics).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-purple" style={{ padding: '6px 12px' }}>
            {Object.keys(userOverrides).length} Active User Overrides
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            style={{ paddingLeft: '36px' }}
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'owner', 'manager', 'trainer', 'receptionist', 'member'].map(role => (
            <button
              key={role}
              className={`btn btn-sm ${filterRole === role ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterRole(role)}
            >
              {role.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User Name & Contact</th>
              <th>Role</th>
              <th>Tenant Gym</th>
              <th>Active Overrides</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => {
              const overrides = userOverrides[user.id] || {};
              const overrideKeys = Object.keys(overrides);
              const isArjunSpecial = user.id === 'user_trainer_arjun';

              return (
                <tr key={user.id} style={{ background: isArjunSpecial ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'} 
                        alt={user.name} 
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <strong>{user.name}</strong>
                        {isArjunSpecial && (
                          <span style={{ marginLeft: '6px', fontSize: '10px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                            Section 12 Demo User
                          </span>
                        )}
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.email} • {user.phone}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-info">{user.roleId?.replace('_', ' ')}</span>
                  </td>

                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.gymId}</span>
                  </td>

                  <td>
                    {overrideKeys.length > 0 ? (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {overrideKeys.map(k => (
                          <span key={k} className="badge badge-warning" style={{ fontSize: '10px' }}>
                            {k}: {overrides[k] ? 'ALLOW' : 'DENY'}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Standard Role Rules</span>
                    )}
                  </td>

                  <td>
                    <span className="badge badge-success">{user.status}</span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Sliders size={12} />
                      <span>Manage Overrides</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* User Overrides Modal / Drawer */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div>
                <h2>User Permission Overrides</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Override role permissions specifically for <strong>{selectedUser.name}</strong> ({selectedUser.roleId})
                </p>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <div style={{ padding: '12px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Evaluation Pipeline:</span><br />
                <code>Platform Rules ➔ Gym Feature Flag ➔ Role Permissions ➔ <strong>User Override</strong> ➔ Final Access</code>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {PERMISSION_DEFINITIONS.map(def => {
                  const userSpecificOverrides = userOverrides[selectedUser.id] || {};
                  const overrideState = userSpecificOverrides[def.key]; // undefined, true, or false

                  return (
                    <div 
                      key={def.key} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: overrideState !== undefined ? '1px solid var(--warning)' : '1px solid var(--surface-border)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="badge badge-info" style={{ fontSize: '9px' }}>{def.layer}</span>
                          <strong>{def.label}</strong>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {def.key}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {overrideState === undefined ? 'Follows Role' : overrideState ? 'Explicit ALLOW' : 'Explicit DENY'}
                        </span>
                        <button 
                          type="button"
                          className={`btn btn-sm ${overrideState === true ? 'btn-primary' : overrideState === false ? 'btn-danger' : 'btn-secondary'}`}
                          onClick={() => handleToggleOverride(selectedUser.id, def.key)}
                        >
                          {overrideState === true ? 'ALLOW' : overrideState === false ? 'DENY' : 'DEFAULT'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setSelectedUser(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
