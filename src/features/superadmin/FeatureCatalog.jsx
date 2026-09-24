import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { FEATURE_CATALOG } from '../../config/features';
import { StorageService } from '../../services/storageService';
import { GymService } from '../../services/gymService';
import { Layers, Bot, Sparkles, Kanban, QrCode, ShieldAlert, Dumbbell, BarChart3, Apple, Megaphone, Check, X } from 'lucide-react';

const ICON_MAP = {
  Bot,
  Sparkles,
  Kanban,
  QrCode,
  ShieldAlert,
  Dumbbell,
  BarChart3,
  Apple,
  Megaphone
};

export const FeatureCatalog = () => {
  const { gyms, activeGymId, setActiveGymId, activeUser, refreshData, addToast } = useApp();
  const [gymFeatures, setGymFeatures] = useState(() => StorageService.getGymFeatures());

  const currentGymFeatures = gymFeatures[activeGymId] || {};
  const currentGym = gyms.find(g => g.id === activeGymId) || gyms[0];

  const handleToggle = (featureKey) => {
    const currentEnabled = currentGymFeatures[featureKey] !== false; // default true
    const nextEnabled = !currentEnabled;

    const updatedFeatures = GymService.toggleGymFeature(activeGymId, featureKey, nextEnabled, activeUser);
    setGymFeatures(StorageService.getGymFeatures());
    refreshData();
    addToast(`Toggled ${featureKey} to ${nextEnabled ? 'ENABLED' : 'DISABLED'} for ${currentGym.name}`, 'info');
  };

  return (
    <div>
      {/* Header and Tenant Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Tenant Feature Flags</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Section 13: Feature flags control whether a feature exists for a specific gym tenant.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Target Gym:</span>
          <select 
            className="control-select"
            value={activeGymId}
            onChange={(e) => setActiveGymId(e.target.value)}
          >
            {gyms.map(g => (
              <option key={g.id} value={g.id}>{g.name} ({g.city})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Feature Catalog Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {FEATURE_CATALOG.map(feature => {
          const Icon = ICON_MAP[feature.icon] || Layers;
          const isEnabled = currentGymFeatures[feature.key] !== false;

          return (
            <div 
              key={feature.key}
              className="glass-card"
              style={{
                borderColor: isEnabled ? 'var(--brand-border)' : 'var(--surface-border)',
                opacity: isEnabled ? 1 : 0.75
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    background: isEnabled ? 'rgba(255, 87, 34, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    color: isEnabled ? 'var(--primary)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '800' }}>{feature.name}</h4>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {feature.category}
                    </span>
                  </div>
                </div>

                <button 
                  className={`btn btn-sm ${isEnabled ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleToggle(feature.key)}
                  style={{ minWidth: '80px' }}
                >
                  {isEnabled ? (
                    <>
                      <Check size={12} /> ON
                    </>
                  ) : (
                    <>
                      <X size={12} /> OFF
                    </>
                  )}
                </button>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.4' }}>
                {feature.description}
              </p>

              <div style={{
                padding: '8px 10px',
                background: 'var(--bg-dark)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: isEnabled ? 'var(--success)' : 'var(--text-muted)',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>flag: {feature.key}</span>
                <span>{isEnabled ? 'ENABLED FOR TENANT' : 'DISABLED'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
