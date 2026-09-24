import React from 'react';
import { useApp } from '../../store/AppContext';
import { PLATFORM_STATS } from '../../data/seedData';
import { BarChart3, TrendingUp, Users, Sparkles, Building2, Zap } from 'lucide-react';

export const AnalyticsView = () => {
  const { gyms } = useApp();

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Platform Fleet Analytics</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Section 35: Agency-wide metrics monitoring ARR velocity, feature utilization density, and aggregate health.
        </p>
      </div>

      {/* Fleet KPI Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Platform Gross ARR</span>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="stat-value">₹2.84 Cr</div>
          <div className="stat-meta positive">+22.4% vs last quarter</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Fleet Utilization Rate</span>
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <Zap size={18} />
            </div>
          </div>
          <div className="stat-value">84.2%</div>
          <div className="stat-meta positive">Avg. daily capacity utilized</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">AI Token Consumed</span>
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div className="stat-value">1.48M</div>
          <div className="stat-meta">Workouts + Strategic Reports</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Avg. Retention Signal Recovery</span>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="stat-value">68.5%</div>
          <div className="stat-meta positive">Recovered via 1-click outreach</div>
        </div>
      </div>

      {/* Breakdown Charts & Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px' }}>Tenant Plan Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>Enterprise (Multi-branch Chains)</span>
                <strong>42 Gyms (32%)</strong>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '32%', background: '#8b5cf6' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>Pro Performance (Single/Double Box)</span>
                <strong>68 Gyms (53%)</strong>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '53%', background: '#3b82f6' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span>Starter (Boutique Yoga & Studios)</span>
                <strong>18 Gyms (15%)</strong>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '15%', background: '#f59e0b' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px' }}>Feature Adoption Across Fleet</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'var(--bg-dark)', borderRadius: '4px' }}>
              <span>QR Pass & Scanner Kiosk</span>
              <strong style={{ color: 'var(--success)' }}>98% Adopted</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'var(--bg-dark)', borderRadius: '4px' }}>
              <span>CRM & Website Trial Pipeline</span>
              <strong style={{ color: 'var(--success)' }}>92% Adopted</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'var(--bg-dark)', borderRadius: '4px' }}>
              <span>AI Workout & Business Coach</span>
              <strong style={{ color: '#8b5cf6' }}>74% Adopted</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'var(--bg-dark)', borderRadius: '4px' }}>
              <span>Retention Risk Engine</span>
              <strong style={{ color: 'var(--primary)' }}>88% Adopted</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
