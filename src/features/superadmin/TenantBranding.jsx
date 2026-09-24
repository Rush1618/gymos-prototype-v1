import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { BRAND_TEMPLATES } from '../../config/brandingTemplates';
import { GymService } from '../../services/gymService';
import { Palette, Sparkles, Check, Save, RotateCcw } from 'lucide-react';

export const TenantBranding = () => {
  const { gyms, activeGymId, setActiveGymId, activeGym, activeUser, refreshData, addToast } = useApp();
  const [theme, setTheme] = useState(() => ({ ...activeGym.theme }));

  const handleApplyPreset = (preset) => {
    const updatedTheme = {
      ...theme,
      primaryColor: preset.primaryColor,
      primaryHover: preset.primaryHover,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      bgDark: preset.bgDark,
      bgCard: preset.bgCard,
      bgSurface: preset.bgSurface,
      textMain: preset.textMain,
      textMuted: preset.textMuted,
      borderColor: preset.borderColor,
      fontFamily: preset.fontFamily,
      heroSubheadline: preset.tagline
    };
    setTheme(updatedTheme);
    addToast(`Applied '${preset.name}' brand preset!`, 'info');
  };

  const handleSaveTheme = () => {
    GymService.updateGym(activeGymId, { theme }, activeUser);
    refreshData();
    addToast(`Saved white-label branding for ${activeGym.name}!`, 'success');
  };

  return (
    <div>
      {/* Header and Tenant Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>White-Label Tenant Branding</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Section 15: Same product + Tenant configuration. Changes CSS variables & typography dynamically across website and dashboards.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Target Gym:</span>
          <select 
            className="control-select"
            value={activeGymId}
            onChange={(e) => {
              setActiveGymId(e.target.value);
              const target = gyms.find(g => g.id === e.target.value);
              if (target) setTheme({ ...target.theme });
            }}
          >
            {gyms.map(g => (
              <option key={g.id} value={g.id}>{g.name} ({g.city})</option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={handleSaveTheme}>
            <Save size={16} />
            <span>Publish Brand</span>
          </button>
        </div>
      </div>

      {/* Agency Brand Template Presets */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} style={{ color: 'var(--primary)' }} />
          <span>Agency Pre-designed Themes (1-Click Deployment)</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {BRAND_TEMPLATES.map(preset => (
            <div 
              key={preset.id}
              className="glass-card"
              style={{
                cursor: 'pointer',
                border: '1px solid var(--surface-border)',
                background: preset.bgCard
              }}
              onClick={() => handleApplyPreset(preset)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: preset.primaryColor }}>{preset.name}</h4>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: preset.primaryColor }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: preset.secondaryColor }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: preset.accentColor }} />
                </div>
              </div>
              <p style={{ fontSize: '11px', color: preset.textMuted, fontStyle: 'italic', marginBottom: '10px' }}>
                "{preset.tagline}"
              </p>
              <button 
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', fontSize: '11px', padding: '4px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleApplyPreset(preset);
                }}
              >
                Apply Preset
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Configuration Form & Live Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Form Controls */}
        <div className="glass-card">
          <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Custom Palette & Typography</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Primary Brand Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={theme.primaryColor || '#ff5722'}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value, primaryHover: e.target.value })}
                  style={{ width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                />
                <input 
                  type="text" 
                  className="form-input" 
                  value={theme.primaryColor || '#ff5722'}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value, primaryHover: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Secondary Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={theme.secondaryColor || '#ff9800'}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  style={{ width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                />
                <input 
                  type="text" 
                  className="form-input" 
                  value={theme.secondaryColor || '#ff9800'}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Font Family</label>
            <select 
              className="form-select"
              value={theme.fontFamily || "'Outfit', sans-serif"}
              onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
            >
              <option value="'Outfit', sans-serif">Outfit (Modern High-Energy Geometric)</option>
              <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Athletic & Technical)</option>
              <option value="'Syne', sans-serif">Syne (Conscious Studio & Editorial)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Website Hero Headline</label>
            <input 
              type="text" 
              className="form-input" 
              value={theme.heroHeadline || ''}
              onChange={(e) => setTheme({ ...theme, heroHeadline: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Website Hero Subheadline / Tagline</label>
            <textarea 
              className="form-textarea" 
              rows={3}
              value={theme.heroSubheadline || ''}
              onChange={(e) => setTheme({ ...theme, heroSubheadline: e.target.value })}
            />
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="glass-card" style={{ background: theme.bgDark || '#0d0f12', border: `2px solid ${theme.primaryColor || '#ff5722'}` }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Live White-Label Preview
          </span>

          <div style={{ marginTop: '20px', padding: '24px', background: theme.bgCard || '#151921', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', background: theme.primaryColor, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px' }}>
                {activeGym.logo || '⚡'}
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '800', color: theme.textMain, fontFamily: theme.fontFamily }}>{activeGym.name}</h4>
                <span style={{ fontSize: '11px', color: theme.textMuted }}>{activeGym.city}</span>
              </div>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: '900', color: theme.textMain, fontFamily: theme.fontFamily, lineHeight: '1.2', marginBottom: '8px' }}>
              {theme.heroHeadline || 'Transform Your Peak State'}
            </h3>

            <p style={{ fontSize: '13px', color: theme.textMuted, lineHeight: '1.4', marginBottom: '16px', fontFamily: theme.fontFamily }}>
              {theme.heroSubheadline || 'World-class facilities and coaching.'}
            </p>

            <button 
              className="btn btn-primary"
              style={{ background: theme.primaryColor, borderColor: theme.primaryColor, fontFamily: theme.fontFamily }}
            >
              Claim Free 3-Day Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
