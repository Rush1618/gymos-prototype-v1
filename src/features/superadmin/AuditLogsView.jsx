import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { FileText, Search, Clock, ShieldCheck, Filter } from 'lucide-react';

export const AuditLogsView = () => {
  const { activeUser } = useApp();
  const [logs, setLogs] = useState(() => StorageService.getAuditLogs());
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.details.toLowerCase().includes(search.toLowerCase()) ||
                        log.actorName.toLowerCase().includes(search.toLowerCase()) ||
                        (log.gymName && log.gymName.toLowerCase().includes(search.toLowerCase())) ||
                        (log.targetUser && log.targetUser.toLowerCase().includes(search.toLowerCase()));
    const matchAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Platform Audit Trail</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Section 37: Full forensic record of Who, What, When, Gym, Role, User, Before, and After state.
          </p>
        </div>

        <span className="badge badge-purple" style={{ padding: '6px 12px' }}>
          {logs.length} Immutable Event Logs
        </span>
      </div>

      {/* Filter and Search */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            style={{ paddingLeft: '36px' }}
            placeholder="Search audit trail by actor, gym, user, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select 
          className="form-select"
          style={{ width: '220px' }}
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          <option value="ALL">All Event Types</option>
          <option value="ROLE_PERMISSION_UPDATED">Role Permission Updated</option>
          <option value="USER_PERMISSION_OVERRIDE_CHANGED">User Override Changed</option>
          <option value="GYM_FEATURE_TOGGLE">Gym Feature Flag</option>
          <option value="LEAD_CONVERTED_TO_MEMBER">Lead Converted</option>
          <option value="QR_CHECKIN_VERIFIED">QR Check-in</option>
        </select>
      </div>

      {/* Audit Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp & Actor</th>
              <th>Action & Gym</th>
              <th>Target & Subject</th>
              <th>Before ➔ After</th>
              <th>Event Narrative</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    {log.timestamp}
                  </div>
                  <strong style={{ fontSize: '12px', display: 'block', marginTop: '2px' }}>{log.actorName}</strong>
                  <span className="badge badge-purple" style={{ fontSize: '9px', padding: '1px 5px' }}>{log.actorRole}</span>
                </td>

                <td>
                  <span className="badge badge-info" style={{ fontSize: '10px' }}>{log.action}</span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Gym: <strong>{log.gymName || log.gymId}</strong>
                  </div>
                </td>

                <td>
                  <div style={{ fontSize: '12px' }}>
                    Role: <strong>{log.targetRole || 'N/A'}</strong>
                  </div>
                  {log.targetUser && log.targetUser !== 'N/A' && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      User: <strong>{log.targetUser}</strong>
                    </div>
                  )}
                  {log.permissionKey && log.permissionKey !== 'N/A' && (
                    <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--primary)' }}>
                      {log.permissionKey}
                    </div>
                  )}
                </td>

                <td>
                  {log.beforeValue !== 'N/A' || log.afterValue !== 'N/A' ? (
                    <div style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                      <span style={{ color: 'var(--danger)' }}>{log.beforeValue}</span>
                      <span style={{ margin: '0 4px', color: 'var(--text-muted)' }}>➔</span>
                      <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{log.afterValue}</span>
                    </div>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>—</span>
                  )}
                </td>

                <td>
                  <div style={{ fontSize: '12px', lineHeight: '1.4', maxWidth: '320px' }}>
                    {log.details}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
