import React from 'react';
import { useApp } from '../../store/AppContext';
import { CreditCard, Check, Sparkles, TrendingUp, Building2 } from 'lucide-react';

export const Subscriptions = () => {
  const { gyms, setActiveGymId, setActiveTab } = useApp();

  const plans = [
    {
      id: 'STARTER',
      name: 'Starter Plan',
      price: '₹14,999 / mo',
      badge: 'Boutique Studios',
      features: [
        'Up to 200 Members',
        'Group Class Scheduling',
        'Front Desk Attendance',
        'Basic Financial Reports',
        'Single Location'
      ]
    },
    {
      id: 'PRO',
      name: 'Pro Performance',
      price: '₹29,999 / mo',
      badge: 'High Growth Boxes',
      popular: true,
      features: [
        'Up to 600 Members',
        'Full CRM & Website Trial Capture',
        'QR Pass & Scanner Kiosk',
        'Rule-based Retention Engine',
        'AI Member Workout Coach',
        'Advanced Utilization Analytics'
      ]
    },
    {
      id: 'ENTERPRISE',
      name: 'Agency Enterprise',
      price: '₹59,999 / mo',
      badge: 'Multi-Location Chains',
      features: [
        'Unlimited Active Members',
        'Owner Strategic AI Inferences',
        'Custom Roles & Granular Overrides',
        'Full White-Label Domain & Branding',
        'Dedicated SLA & 24/7 Priority Support'
      ]
    }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800' }}>SaaS Subscription Tiers & Billing</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Manage recurring subscription tiers, plan entitlements, and tenant billing cycles.
        </p>
      </div>

      {/* Plan Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {plans.map(p => {
          const tenantCount = gyms.filter(g => g.platformPlan === p.id).length;

          return (
            <div 
              key={p.id}
              className="glass-card"
              style={{
                border: p.popular ? '2px solid var(--primary)' : '1px solid var(--surface-border)',
                background: p.popular ? 'linear-gradient(180deg, rgba(255, 87, 34, 0.08) 0%, var(--bg-card) 100%)' : 'var(--bg-card)'
              }}
            >
              {p.popular && (
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span className="badge badge-purple" style={{ fontSize: '10px' }}>Most Deployed</span>
                </div>
              )}

              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>
                {p.badge}
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px', marginBottom: '8px' }}>{p.name}</h3>
              <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '16px' }}>
                {p.price}
              </div>

              <div style={{ padding: '8px 12px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '12px' }}>
                Active Tenants on Plan: <strong>{tenantCount} Gyms</strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={14} style={{ color: 'var(--success)' }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tenant Plan Mapping Table */}
      <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '14px' }}>Tenant Subscription Allocation</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Gym Tenant</th>
              <th>Current Tier</th>
              <th>Status</th>
              <th>Est. Monthly Revenue</th>
            </tr>
          </thead>
          <tbody>
            {gyms.map(gym => (
              <tr key={gym.id}>
                <td>
                  <strong>{gym.name}</strong> ({gym.city})
                </td>
                <td>
                  <span className={`badge ${gym.platformPlan === 'ENTERPRISE' ? 'badge-purple' : gym.platformPlan === 'PRO' ? 'badge-info' : 'badge-warning'}`}>
                    {gym.platformPlan}
                  </span>
                </td>
                <td>
                  <span className={`badge ${gym.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                    {gym.status}
                  </span>
                </td>
                <td>
                  <strong style={{ color: 'var(--success)' }}>
                    ₹{gym.platformPlan === 'ENTERPRISE' ? '59,999' : gym.platformPlan === 'PRO' ? '29,999' : '14,999'} / mo
                  </strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
