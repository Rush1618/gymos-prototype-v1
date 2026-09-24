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

  // Theme Mode: 'light' (White Palette) | 'dark' (Dark Palette) - Default to 'light' per user request
  const [themeMode, setThemeModeState] = useState(() => StorageService.getThemeMode() || 'light');

  const setThemeMode = useCallback((mode) => {
    setThemeModeState(mode);
    StorageService.saveThemeMode(mode);
  }, []);

  const toggleThemeMode = useCallback(() => {
    setThemeModeState(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      StorageService.saveThemeMode(next);
      return next;
    });
  }, []);

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

  // Apply Dynamic White-Label Brand Theme & White/Dark Palette to document CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);

    if (!activeGym || !activeGym.theme) return;
    const theme = activeGym.theme;

    root.style.setProperty('--primary', theme.primaryColor || '#ff5722');
    root.style.setProperty('--primary-hover', theme.primaryHover || '#f4511e');
    root.style.setProperty('--secondary', theme.secondaryColor || '#ff9800');
    root.style.setProperty('--accent', theme.accentColor || '#ffd600');
    root.style.setProperty('--brand-font', theme.fontFamily || "'Outfit', sans-serif");

    if (themeMode === 'light') {
      root.style.setProperty('--bg-app', '#f8fafc');
      root.style.setProperty('--bg-dark', '#f1f5f9');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--bg-surface', '#f8fafc');
      root.style.setProperty('--text-main', '#0f172a');
      root.style.setProperty('--text-muted', '#64748b');
      root.style.setProperty('--surface-border', '#e2e8f0');
      root.style.setProperty('--surface-border-hover', '#cbd5e1');
      root.style.setProperty('--brand-border', 'rgba(255, 87, 34, 0.22)');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.94)');
      root.style.setProperty('--shadow-sm', '0 1px 2px rgba(15, 23, 42, 0.05)');
      root.style.setProperty('--shadow-md', '0 4px 12px rgba(15, 23, 42, 0.07)');
      root.style.setProperty('--shadow-lg', '0 12px 28px rgba(15, 23, 42, 0.1)');
    } else {
      root.style.setProperty('--bg-app', '#080a0d');
      root.style.setProperty('--bg-dark', theme.bgDark || '#0d0f12');
      root.style.setProperty('--bg-card', theme.bgCard || '#151921');
      root.style.setProperty('--bg-surface', theme.bgSurface || '#1e2430');
      root.style.setProperty('--text-main', theme.textMain || '#ffffff');
      root.style.setProperty('--text-muted', theme.textMuted || '#94a3b8');
      root.style.setProperty('--surface-border', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--surface-border-hover', 'rgba(255, 255, 255, 0.16)');
      root.style.setProperty('--brand-border', theme.borderColor || 'rgba(255, 87, 34, 0.25)');
      root.style.setProperty('--glass-bg', 'rgba(21, 25, 33, 0.75)');
      root.style.setProperty('--shadow-sm', '0 1px 2px rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--shadow-md', '0 4px 12px rgba(0, 0, 0, 0.25)');
      root.style.setProperty('--shadow-lg', '0 12px 28px rgba(0, 0, 0, 0.35)');
    }
  }, [activeGym, themeMode]);

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
    themeMode,
    setThemeMode,
    toggleThemeMode,
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
