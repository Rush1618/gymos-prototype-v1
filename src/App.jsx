import React from 'react';
import { useApp } from './store/AppContext';

// Layout Components
import { MasterBar } from './components/layout/MasterBar';
import { ImpersonationBanner } from './components/layout/ImpersonationBanner';
import { Sidebar } from './components/layout/Sidebar';
import { AppHeader } from './components/layout/AppHeader';

// Super Admin Components
import { SuperAdminOverview } from './features/superadmin/SuperAdminOverview';
import { GymManagement } from './features/superadmin/GymManagement';
import { UserManagement } from './features/superadmin/UserManagement';
import { PermissionMatrix } from './features/superadmin/PermissionMatrix';
import { PermissionSimulator } from './features/superadmin/PermissionSimulator';
import { CustomRoles } from './features/superadmin/CustomRoles';
import { FeatureCatalog } from './features/superadmin/FeatureCatalog';
import { TenantBranding } from './features/superadmin/TenantBranding';
import { Subscriptions } from './features/superadmin/Subscriptions';
import { AnalyticsView } from './features/superadmin/AnalyticsView';
import { AuditLogsView } from './features/superadmin/AuditLogsView';

// Public Website Component
import { PublicWebsitePage } from './features/public/PublicWebsitePage';

// Gym OS Components
import { OwnerDashboard } from './features/owner/OwnerDashboard';
import { CRMLeads } from './features/owner/CRMLeads';
import { MemberList } from './features/owner/MemberList';
import { ClassSchedule } from './features/owner/ClassSchedule';
import { TrainerList } from './features/owner/TrainerList';
import { PaymentsView } from './features/owner/PaymentsView';
import { AttendanceScanner } from './features/owner/AttendanceScanner';
import { RetentionEngineView } from './features/owner/RetentionEngineView';
import { OwnerAICoach } from './features/owner/OwnerAICoach';
import { OwnerAnalytics } from './features/owner/OwnerAnalytics';
import { TenantSettings } from './features/owner/TenantSettings';

// Member Portal Component
import { MemberPortal } from './features/member/MemberPortal';

export function AppContent() {
  const { activeSurface, activeTab, activeGym, toasts } = useApp();

  // 1. PUBLIC WEBSITE SURFACE
  if (activeSurface === 'public') {
    return (
      <div className="app-viewport">
        <MasterBar />
        <ImpersonationBanner />
        <PublicWebsitePage />
        <ToastContainer toasts={toasts} />
      </div>
    );
  }

  // 2. MEMBER PORTAL SURFACE
  if (activeSurface === 'member') {
    return (
      <div className="app-viewport">
        <MasterBar />
        <ImpersonationBanner />
        <main style={{ padding: '28px 20px', minHeight: 'calc(100vh - 50px)' }}>
          <MemberPortal />
        </main>
        <ToastContainer toasts={toasts} />
      </div>
    );
  }

  // 3. SUPER ADMIN PLATFORM OR 4. GYM OPERATING SYSTEM
  return (
    <div className="app-viewport">
      <MasterBar />
      <ImpersonationBanner />

      <div className="dashboard-shell">
        <Sidebar />

        <div className="dashboard-main">
          <AppHeader 
            title={
              activeSurface === 'superadmin' 
                ? 'Super Admin Control Tower' 
                : `${activeGym.name} Operating System`
            }
            subtitle={
              activeSurface === 'superadmin'
                ? 'Agency-wide multi-tenant fleet command'
                : `${activeGym.city} (${activeGym.area}) • Status: ${activeGym.status}`
            }
          />

          <main className="content-body">
            {/* SUPER ADMIN ROUTING */}
            {activeSurface === 'superadmin' && (
              <>
                {activeTab === 'overview' && <SuperAdminOverview />}
                {activeTab === 'gyms' && <GymManagement />}
                {activeTab === 'users' && <UserManagement />}
                {activeTab === 'permissions' && <PermissionMatrix />}
                {activeTab === 'custom_roles' && <CustomRoles />}
                {activeTab === 'simulator' && <PermissionSimulator />}
                {activeTab === 'features' && <FeatureCatalog />}
                {activeTab === 'branding' && <TenantBranding />}
                {activeTab === 'subscriptions' && <Subscriptions />}
                {activeTab === 'analytics' && <AnalyticsView />}
                {activeTab === 'audit_logs' && <AuditLogsView />}
              </>
            )}

            {/* GYM OPERATING SYSTEM ROUTING */}
            {activeSurface === 'gymos' && (
              <>
                {activeTab === 'dashboard' && <OwnerDashboard />}
                {activeTab === 'members' && <MemberList />}
                {activeTab === 'leads' && <CRMLeads />}
                {activeTab === 'classes' && <ClassSchedule />}
                {activeTab === 'trainers' && <TrainerList />}
                {activeTab === 'payments' && <PaymentsView />}
                {activeTab === 'attendance' && <AttendanceScanner />}
                {activeTab === 'retention' && <RetentionEngineView />}
                {activeTab === 'ai' && <OwnerAICoach />}
                {activeTab === 'analytics' && <OwnerAnalytics />}
                {activeTab === 'settings' && <TenantSettings />}
              </>
            )}
          </main>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

function ToastContainer({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <aside className="toast-container" aria-label="Notifications" role="status">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </aside>
  );
}

export default function App() {
  return <AppContent />;
}
