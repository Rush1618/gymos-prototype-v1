import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { AuditService } from '../../services/auditService';
import { PERMISSION_DEFINITIONS, PERMISSION_LAYERS } from '../../config/permissions';
import { SYSTEM_ROLES } from '../../config/roles';
import { 
  KeyRound, 
  Save, 
  RotateCcw, 
  Filter, 
  ShieldCheck, 
  Layers, 
  Check, 
  X,
  Info
} from 'lucide-react';

export const PermissionMatrix = () => {
  const { activeUser, refreshData, addToast } = useApp();
  const [rolePermissions, setRolePermissions] = useState(() => StorageService.getRolePermissions());
  const [activeLayerFilter, setActiveLayerFilter] = useState('ALL'); // 'ALL' | 'PAGE' | 'FEATURE' | 'ACTION'
  const [searchQuery, setSearchQuery] = useState('');
  const [dirtyChanges, setDirtyChanges] = useState({});

  // Roles to display in the matrix (excluding super_admin which has platform master bypass)
  const matrixRoles = SYSTEM_ROLES.filter(r => r.key !== 'super_admin');

  // Filter definitions based on layer & search
  const filteredDefinitions = PERMISSION_DEFINITIONS.filter(def => {
    const matchLayer = activeLayerFilter === 'ALL' || def.layer === activeLayerFilter;
    const matchSearch = def.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        def.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        def.group.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLayer && matchSearch;
  });

  const handleToggle = (roleKey, permKey) => {
    const currentVal = Boolean(rolePermissions[roleKey]?.[permKey]);
    const nextVal = !currentVal;

    const updated = {
      ...rolePermissions,
      [roleKey]: {
        ...(rolePermissions[roleKey] || {}),
        [permKey]: nextVal
      }
    };

    setRolePermissions(updated);
    setDirtyChanges(prev => ({
      ...prev,
      [`${roleKey}::${permKey}`]: { roleKey, permKey, beforeVal: currentVal, afterVal: nextVal }
    }));
  };

  const handleSaveChanges = () => {
    StorageService.saveRolePermissions(rolePermissions);

    // Record audit log for every change made
    const changeCount = Object.keys(dirtyChanges).length;
    Object.values(dirtyChanges).forEach(ch => {
      AuditService.log({
        actorName: activeUser.name,
        actorRole: 'SUPER ADMIN',
        action: 'ROLE_PERMISSION_UPDATED',
        targetRole: ch.roleKey,
        permissionKey: ch.permKey,
        beforeValue: String(ch.beforeVal).toUpperCase(),
        afterValue: String(ch.afterVal).toUpperCase(),
        details: `Updated role permission for '${ch.roleKey}' on key '${ch.permKey}'`
      });
    });

    setDirtyChanges({});
    refreshData();
    addToast(`Saved ${changeCount} permission rules and logged to audit trail!`, 'success');
  };

  const handleReset = () => {
    setRolePermissions(StorageService.getRolePermissions());
    setDirtyChanges({});
    addToast('Discarded unsaved matrix changes', 'info');
  };

  return (
    <div>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>3-Layer Permission Matrix</h2>
            <span style={{ fontSize: '10px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
              PAGE • FEATURE • ACTION
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Super Admin remote controls who sees each page, what features appear, and which actions can be performed.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {Object.keys(dirtyChanges).length > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={handleReset}>
              <RotateCcw size={14} />
              <span>Discard ({Object.keys(dirtyChanges).length})</span>
            </button>
          )}

          <button 
            className="btn btn-primary"
            onClick={handleSaveChanges}
            disabled={Object.keys(dirtyChanges).length === 0}
            style={{ opacity: Object.keys(dirtyChanges).length === 0 ? 0.6 : 1 }}
          >
            <Save size={16} />
            <span>Save Matrix ({Object.keys(dirtyChanges).length} Pending)</span>
          </button>
        </div>
      </div>

      {/* Layer Filter Pills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'ALL', label: 'All Layers (35)' },
            { id: PERMISSION_LAYERS.PAGE, label: 'Layer 1: Pages' },
            { id: PERMISSION_LAYERS.FEATURE, label: 'Layer 2: Features' },
            { id: PERMISSION_LAYERS.ACTION, label: 'Layer 3: Actions' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`btn btn-sm ${activeLayerFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveLayerFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <input 
          type="text"
          className="form-input"
          style={{ width: '260px', padding: '6px 12px', fontSize: '12px' }}
          placeholder="Filter permission keys..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Permission Table Matrix */}
      <div className="table-container">
        <table className="permission-matrix-table data-table">
          <thead>
            <tr>
              <th style={{ minWidth: '240px' }}>Permission Key & Layer</th>
              <th>Group</th>
              {matrixRoles.map(role => (
                <th key={role.key} style={{ textAlign: 'center', minWidth: '110px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <span style={{ color: role.badgeColor, fontWeight: '800' }}>{role.name}</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{role.key}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredDefinitions.map(def => {
              const layerBadgeClass = 
                def.layer === PERMISSION_LAYERS.PAGE ? 'badge-purple' :
                def.layer === PERMISSION_LAYERS.FEATURE ? 'badge-info' : 'badge-warning';

              return (
                <tr key={def.key}>
                  <td>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge ${layerBadgeClass}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                          {def.layer}
                        </span>
                        <strong>{def.label}</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>
                        {def.key}
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{def.group}</span>
                  </td>

                  {matrixRoles.map(role => {
                    const isChecked = Boolean(rolePermissions[role.key]?.[def.key]);
                    const isDirty = dirtyChanges[`${role.key}::${def.key}`] !== undefined;

                    return (
                      <td key={role.key} style={{ textAlign: 'center', background: isDirty ? 'rgba(255, 87, 34, 0.08)' : 'transparent' }}>
                        <input 
                          type="checkbox"
                          className="perm-checkbox"
                          checked={isChecked}
                          onChange={() => handleToggle(role.key, def.key)}
                          title={`${role.name}: ${def.label} is ${isChecked ? 'ALLOWED' : 'DENIED'}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
