import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { AccessControlService } from '../../services/accessControlService';
import { PERMISSION_DEFINITIONS } from '../../config/permissions';
import { SoundEngine } from '../../utils/audio';
import { 
  KeyRound, 
  Play, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ShieldAlert, 
  Layers, 
  Sliders, 
  Building2, 
  UserCheck 
} from 'lucide-react';

export const PermissionSimulator = () => {
  const { gyms, users, activeGymId, setActiveGymId } = useApp();
  
  const [simGymId, setSimGymId] = useState(activeGymId);
  const [simUserId, setSimUserId] = useState('user_trainer_arjun');
  const [simPermKey, setSimPermKey] = useState('page.analytics');
  const [traceResult, setTraceResult] = useState(null);

  const targetGym = gyms.find(g => g.id === simGymId) || gyms[0];
  const targetUser = users.find(u => u.id === simUserId) || users[0];
  const targetPerm = PERMISSION_DEFINITIONS.find(p => p.key === simPermKey) || PERMISSION_DEFINITIONS[0];

  const handleSimulate = () => {
    SoundEngine.playClickPop();
    const evaluation = AccessControlService.evaluateAccess(targetUser, simGymId, simPermKey);
    
    // Build the step-by-step diagnostic trace
    const gymFeatures = StorageService.getGymFeatures()[simGymId] || {};
    const userOverrides = StorageService.getUserOverrides()[targetUser.id] || {};
    const rolePermissions = StorageService.getRolePermissions()[targetUser.roleId] || {};

    const steps = [
      {
        name: 'Step 1: Platform Scope Check',
        desc: targetUser.roleId === 'super_admin' ? 'User is Super Admin (Platform Master Bypass)' : 'Standard User (Proceed to tenant isolation check)',
        pass: true,
        triggered: targetUser.roleId === 'super_admin'
      },
      {
        name: 'Step 2: Tenant Isolation Check',
        desc: targetUser.gymId === 'all' || targetUser.gymId === simGymId ? `User belongs to tenant '${simGymId}'` : `Isolation Violation: User belongs to '${targetUser.gymId}', attempted '${simGymId}'`,
        pass: targetUser.gymId === 'all' || targetUser.gymId === simGymId,
        triggered: !(targetUser.gymId === 'all' || targetUser.gymId === simGymId)
      },
      {
        name: 'Step 3: Gym Feature Flag Check',
        desc: `Tenant feature flag for this category is ${evaluation.layer === 'GYM_FEATURE_FLAG' ? 'DISABLED' : 'ENABLED'} on ${targetGym.name}`,
        pass: evaluation.layer !== 'GYM_FEATURE_FLAG',
        triggered: evaluation.layer === 'GYM_FEATURE_FLAG'
      },
      {
        name: 'Step 4: User-Specific Override Check',
        desc: userOverrides[simPermKey] !== undefined 
          ? `Explicit Super Admin override found for ${targetUser.name}: ${userOverrides[simPermKey] ? 'ALLOW' : 'DENY'}`
          : 'No specific user override exists (Proceed to role permissions)',
        pass: userOverrides[simPermKey] !== false,
        triggered: userOverrides[simPermKey] !== undefined
      },
      {
        name: 'Step 5: Role Permission Matrix Evaluation',
        desc: `Role '${targetUser.roleId}' baseline permission on this key is: ${rolePermissions[simPermKey] ? 'ALLOW' : 'DENY'}`,
        pass: Boolean(rolePermissions[simPermKey]),
        triggered: userOverrides[simPermKey] === undefined
      }
    ];

    setTraceResult({
      evaluation,
      steps
    });

    if (evaluation.allowed) {
      SoundEngine.playSuccessChime();
    } else {
      SoundEngine.playDenyBuzz();
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <KeyRound size={20} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Permission & Access Control Simulator</h2>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Section 5: Interactive test bench. Inspect the exact evaluation pipeline for any gym, user, and permission key.
        </p>
      </div>

      {/* Simulator Inputs Card */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px' }}>Simulation Parameters</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">1. Target Gym Tenant</label>
            <select 
              className="form-select"
              value={simGymId}
              onChange={(e) => setSimGymId(e.target.value)}
            >
              {gyms.map(g => (
                <option key={g.id} value={g.id}>{g.name} ({g.city})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">2. Target User / Role</label>
            <select 
              className="form-select"
              value={simUserId}
              onChange={(e) => setSimUserId(e.target.value)}
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} — Role: {u.roleId} ({u.gymId})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">3. Permission Key to Evaluate</label>
            <select 
              className="form-select"
              value={simPermKey}
              onChange={(e) => setSimPermKey(e.target.value)}
            >
              {PERMISSION_DEFINITIONS.map(p => (
                <option key={p.key} value={p.key}>
                  [{p.layer}] {p.label} ({p.key})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn btn-primary btn-lg" onClick={handleSimulate}>
          <Play size={16} />
          <span>Execute Simulation Trace</span>
        </button>
      </div>

      {/* Simulation Result Trace */}
      {traceResult && (
        <div className="glass-card" style={{ border: `2px solid ${traceResult.evaluation.allowed ? 'var(--success)' : 'var(--danger)'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Simulation Verdict
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                {traceResult.evaluation.allowed ? (
                  <CheckCircle2 size={24} color="#10b981" />
                ) : (
                  <XCircle size={24} color="#ef4444" />
                )}
                <h3 style={{ fontSize: '20px', fontWeight: '900', color: traceResult.evaluation.allowed ? '#10b981' : '#ef4444' }}>
                  {traceResult.evaluation.allowed ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                </h3>
              </div>
            </div>

            <span className="badge badge-info" style={{ padding: '6px 12px' }}>
              Deciding Layer: {traceResult.evaluation.layer}
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-main)', background: 'var(--bg-dark)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
            <strong>Engine Reasoning:</strong> {traceResult.evaluation.reason}
          </p>

          {/* Visual Step-by-Step Glowing Pipeline */}
          <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px' }}>Evaluation Stage Progression</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {traceResult.steps.map((st, i) => (
              <div 
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: st.triggered ? 'rgba(255, 87, 34, 0.08)' : 'var(--bg-surface)',
                  border: st.triggered ? '1px solid var(--primary)' : '1px solid var(--surface-border)'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700' }}>{st.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{st.desc}</div>
                </div>

                {st.triggered && (
                  <span className="badge badge-warning" style={{ fontSize: '9px' }}>DECISION ANCHOR</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
