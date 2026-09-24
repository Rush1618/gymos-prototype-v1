import React from 'react';
import { useApp } from '../../store/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Calendar, 
  Dumbbell, 
  CreditCard, 
  QrCode, 
  BarChart3, 
  ShieldAlert, 
  Sparkles, 
  Settings,
  Building2,
  KeyRound,
  Sliders,
  Palette,
  Layers,
  FileText,
  BadgeAlert,
  ChevronRight
} from 'lucide-react';

export const Sidebar = () => {
  const { 
    activeSurface, 
    activeTab, 
    setActiveTab, 
    activeGym, 
    activeUser, 
    canAccessPage 
  } = useApp();

  // Super Admin Navigation Items (Section 5)
  const superAdminNav = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, section: 'Platform Control' },
    { id: 'gyms', label: 'Gyms & Tenants', icon: Building2, section: 'Platform Control' },
    { id: 'users', label: 'Users & Staff', icon: Users, section: 'Platform Control' },
    { id: 'permissions', label: 'Roles & Permissions', icon: KeyRound, section: 'Control Engine' },
    { id: 'custom_roles', label: 'Custom Roles', icon: Sliders, section: 'Control Engine' },
    { id: 'simulator', label: 'Access Simulator', icon: Sparkles, section: 'Control Engine' },
    { id: 'features', label: 'Feature Flags', icon: Layers, section: 'Control Engine' },
    { id: 'branding', label: 'Brand Templates', icon: Palette, section: 'Customization' },
    { id: 'subscriptions', label: 'SaaS Subscriptions', icon: CreditCard, section: 'Revenue' },
    { id: 'analytics', label: 'Platform Analytics', icon: BarChart3, section: 'Reports' },
    { id: 'audit_logs', label: 'Audit Logs', icon: FileText, section: 'Security' }
  ];

  // Gym OS Navigation Items (Filtered dynamically by canAccessPage!)
  const gymOsCandidateNav = [
    { id: 'dashboard', pageKey: 'page.dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Operations' },
    { id: 'members', pageKey: 'page.members', label: 'Members', icon: Users, section: 'Operations' },
    { id: 'leads', pageKey: 'page.leads', label: 'Leads & CRM', icon: UserPlus, section: 'Operations', badge: 'New' },
    { id: 'classes', pageKey: 'page.classes', label: 'Class Schedule', icon: Calendar, section: 'Operations' },
    { id: 'trainers', pageKey: 'page.trainers', label: 'Trainers', icon: Dumbbell, section: 'Operations' },
    { id: 'payments', pageKey: 'page.payments', label: 'Payments & Billing', icon: CreditCard, section: 'Financial' },
    { id: 'attendance', pageKey: 'page.attendance', label: 'Attendance & QR', icon: QrCode, section: 'Front Desk' },
    { id: 'retention', pageKey: 'page.retention', label: 'Retention Engine', icon: ShieldAlert, section: 'Retention', badgeAlert: '1 Risk' },
    { id: 'ai', pageKey: 'page.ai', label: 'Owner AI Insights', icon: Sparkles, section: 'Intelligence' },
    { id: 'analytics', pageKey: 'page.analytics', label: 'Analytics & Reports', icon: BarChart3, section: 'Reports' },
    { id: 'settings', pageKey: 'page.settings', label: 'Tenant Settings', icon: Settings, section: 'Settings' }
  ];

  // Dynamically filter GymOS navigation based on the user's evaluated permissions!
  const gymOsNav = gymOsCandidateNav.filter(item => canAccessPage(item.pageKey));

  const items = activeSurface === 'superadmin' ? superAdminNav : gymOsNav;

  // Group items by section
  const sections = {};
  items.forEach(item => {
    if (!sections[item.section]) sections[item.section] = [];
    sections[item.section].push(item);
  });

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        {/* Active Tenant Branding Card */}
        {activeSurface !== 'superadmin' && activeGym && (
          <div className="tenant-brand-card">
            <div className="tenant-logo-box">
              {activeGym.logo || '⚡'}
            </div>
            <div className="tenant-details">
              <h3>{activeGym.name}</h3>
              <span>{activeGym.city} • {activeGym.platformPlan}</span>
            </div>
          </div>
        )}

        {activeSurface === 'superadmin' && (
          <div className="tenant-brand-card" style={{ borderColor: 'rgba(236, 72, 153, 0.4)' }}>
            <div className="tenant-logo-box" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
              🛡️
            </div>
            <div className="tenant-details">
              <h3>Super Admin Control</h3>
              <span>Agency HQ • Multi-Tenant</span>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="sidebar-nav">
          {Object.entries(sections).map(([sectionTitle, secItems]) => (
            <div key={sectionTitle}>
              <div className="nav-section-title">{sectionTitle}</div>
              {secItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    className={`nav-item-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <div className="nav-item-left">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && <span className="nav-badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>{item.badge}</span>}
                    {item.badgeAlert && <span className="nav-badge alert">{item.badgeAlert}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* User Context Footer in Sidebar */}
      <div style={{
        padding: '12px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--surface-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <img 
          src={activeUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
          alt={activeUser.name} 
          style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeUser.name}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Role: <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{activeUser.roleId?.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
