import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storageService';
import { AccessControlService } from '../services/accessControlService';
import { AuditService } from '../services/auditService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Master State
  const [gyms, setGyms] = useState(() => StorageService.getGyms());
  const [users, setUsers] = useState(() => StorageService.getUsers());
  const [activeGymId, setActiveGymIdState] = useState('gym_ironpulse');
  const [activeUserId, setActiveUserIdState] = useState('user_superadmin');
  
  // Impersonation ("View As") State
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedRole, setImpersonatedRole] = useState(null); // 'owner' | 'manager' | 'trainer' | 'receptionist' | 'member' | custom
  const [impersonatedUser, setImpersonatedUser] = useState(null);

  // Active Product Surface: 'superadmin' | 'gymos' | 'public' | 'member'
  const [activeSurface, setActiveSurface] = useState('superadmin');

  // Active Navigation Tab inside GymOS or SuperAdmin
  const [activeTab, setActiveTab] = useState('overview');

  // UI Toast notifications
  const [toasts, setToasts] = useState([]);

  // Data version counter to trigger reactive component refreshes
  const [dataVersion, setDataVersion] = useState(0);

  const refreshData = useCallback(() => {
    setGyms(StorageService.getGyms());
    setUsers(StorageService.getUsers());
    setDataVersion(v => v + 1);
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 3)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  // Current active gym object
  const activeGym = gyms.find(g => g.id === activeGymId) || gyms[0];

  // Resolve effective active user:
  // If impersonating, use the impersonated user (or create a synthetic user for that role)
  const baseUser = users.find(u => u.id === activeUserId) || users[0];
  const effectiveUser = isImpersonating ? impersonatedUser : baseUser;

  // Apply Dynamic White-Label Brand Theme to document CSS Variables
  useEffect(() => {
    if (!activeGym || !activeGym.theme) return;
    const root = document.documentElement;
    const theme = activeGym.theme;

    root.style.setProperty('--primary', theme.primaryColor || '#ff5722');
    root.style.setProperty('--primary-hover', theme.primaryHover || '#f4511e');
    root.style.setProperty('--secondary', theme.secondaryColor || '#ff9800');
    root.style.setProperty('--accent', theme.accentColor || '#ffd600');
    root.style.setProperty('--bg-dark', theme.bgDark || '#0d0f12');
    root.style.setProperty('--bg-card', theme.bgCard || '#151921');
    root.style.setProperty('--bg-surface', theme.bgSurface || '#1e2430');
    root.style.setProperty('--text-main', theme.textMain || '#ffffff');
    root.style.setProperty('--text-muted', theme.textMuted || '#94a3b8');
    root.style.setProperty('--brand-border', theme.borderColor || 'rgba(255, 87, 34, 0.25)');
    root.style.setProperty('--brand-font', theme.fontFamily || "'Outfit', sans-serif");
  }, [activeGym]);

  // Start "View As" Impersonation
  const startViewAs = useCallback((roleKey, targetUser = null) => {
    let userToUse = targetUser;
    if (!userToUse) {
      // Find default user for this gym and role
      const found = users.find(u => u.roleId === roleKey && u.gymId === activeGymId);
      if (found) {
        userToUse = found;
      } else {
        // Fallback synthetic user
        userToUse = {
          id: `view_as_${roleKey}_${activeGymId}`,
          name: `Viewing As ${roleKey.replace('_', ' ').toUpperCase()}`,
          email: `${roleKey}@${activeGym?.slug || 'gymos'}.com`,
          roleId: roleKey,
          gymId: activeGymId,
          status: 'ACTIVE'
        };
      }
    }

    setIsImpersonating(true);
    setImpersonatedRole(roleKey);
    setImpersonatedUser(userToUse);

    // Automatically navigate to the appropriate surface
    if (roleKey === 'member') {
      setActiveSurface('member');
      setActiveTab('dashboard');
    } else {
      setActiveSurface('gymos');
      setActiveTab('dashboard');
    }

    AuditService.log({
      actorName: baseUser.name,
      actorRole: 'SUPER ADMIN',
      action: 'VIEW_AS_STARTED',
      gymId: activeGymId,
      gymName: activeGym?.name,
      targetRole: roleKey,
      targetUser: userToUse.name,
      details: `Super Admin started impersonation session as ${roleKey.toUpperCase()} (${userToUse.name}) for ${activeGym?.name}`
    });

    addToast(`Now viewing as ${roleKey.toUpperCase()} (${userToUse.name})`, 'info');
  }, [activeGym, activeGymId, baseUser, users, addToast]);

  // Exit Impersonation
  const exitViewAs = useCallback(() => {
    setIsImpersonating(false);
    setImpersonatedRole(null);
    setImpersonatedUser(null);
    setActiveSurface('superadmin');
    setActiveTab('overview');

    AuditService.log({
      actorName: baseUser.name,
      actorRole: 'SUPER ADMIN',
      action: 'VIEW_AS_EXITED',
      details: 'Super Admin exited view-as impersonation mode and returned to Super Admin tower'
    });

    addToast('Exited View-As mode. Back in Super Admin Tower.', 'success');
  }, [baseUser, addToast]);

  // Switch Active Gym
  const setActiveGymId = useCallback((newGymId) => {
    setActiveGymIdState(newGymId);
    // If currently impersonating, re-bind to the corresponding user in the newly selected gym
    if (isImpersonating && impersonatedRole) {
      const match = users.find(u => u.roleId === impersonatedRole && u.gymId === newGymId);
      if (match) {
        setImpersonatedUser(match);
      }
    }
  }, [isImpersonating, impersonatedRole, users]);

  // Permission Evaluation Helpers
  const canAccessPage = useCallback((pageKey) => {
    return AccessControlService.canAccessPage(effectiveUser, activeGymId, pageKey);
  }, [effectiveUser, activeGymId]);

  const canViewFeature = useCallback((featureKey) => {
    return AccessControlService.canViewFeature(effectiveUser, activeGymId, featureKey);
  }, [effectiveUser, activeGymId]);

  const canPerformAction = useCallback((actionKey) => {
    return AccessControlService.canPerformAction(effectiveUser, activeGymId, actionKey);
  }, [effectiveUser, activeGymId]);

  const value = {
    gyms,
    users,
    activeGym,
    activeGymId,
    setActiveGymId,
    activeUser: effectiveUser,
    realUser: baseUser,
    isImpersonating,
    impersonatedRole,
    startViewAs,
    exitViewAs,
    activeSurface,
    setActiveSurface,
    activeTab,
    setActiveTab,
    toasts,
    addToast,
    refreshData,
    dataVersion,
    canAccessPage,
    canViewFeature,
    canPerformAction
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
