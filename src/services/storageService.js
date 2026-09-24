// Local Storage Persistence Layer with Seed Fallbacks
import {
  INITIAL_GYMS,
  INITIAL_USERS,
  INITIAL_PLANS,
  INITIAL_CLASSES,
  INITIAL_LEADS,
  INITIAL_WORKOUTS,
  INITIAL_ATTENDANCE,
  INITIAL_PAYMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER_OVERRIDES,
  INITIAL_GYM_FEATURES
} from '../data/seedData';
import { DEFAULT_ROLE_PERMISSIONS } from '../config/permissions';
import { INITIAL_CUSTOM_ROLES } from '../config/roles';

const STORAGE_KEYS = {
  GYMS: 'gymos_gyms',
  USERS: 'gymos_users',
  ROLES: 'gymos_roles',
  ROLE_PERMISSIONS: 'gymos_role_permissions',
  USER_OVERRIDES: 'gymos_user_overrides',
  GYM_FEATURES: 'gymos_gym_features',
  PLANS: 'gymos_plans',
  CLASSES: 'gymos_classes',
  LEADS: 'gymos_leads',
  WORKOUTS: 'gymos_workouts',
  ATTENDANCE: 'gymos_attendance',
  PAYMENTS: 'gymos_payments',
  AUDIT_LOGS: 'gymos_audit_logs',
  NOTIFICATIONS: 'gymos_notifications',
  ACTIVE_GYM_ID: 'gymos_active_gym_id',
  ACTIVE_USER_ID: 'gymos_active_user_id',
  IMPERSONATED_ROLE: 'gymos_impersonated_role'
};

function getStorageItem(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading key ${key} from localStorage:`, err);
    return fallback;
  }
}

function setStorageItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error setting key ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  getGyms: () => getStorageItem(STORAGE_KEYS.GYMS, INITIAL_GYMS),
  saveGyms: (gyms) => setStorageItem(STORAGE_KEYS.GYMS, gyms),

  getUsers: () => getStorageItem(STORAGE_KEYS.USERS, INITIAL_USERS),
  saveUsers: (users) => setStorageItem(STORAGE_KEYS.USERS, users),

  getCustomRoles: () => getStorageItem(STORAGE_KEYS.ROLES, INITIAL_CUSTOM_ROLES),
  saveCustomRoles: (roles) => setStorageItem(STORAGE_KEYS.ROLES, roles),

  getRolePermissions: () => getStorageItem(STORAGE_KEYS.ROLE_PERMISSIONS, DEFAULT_ROLE_PERMISSIONS),
  saveRolePermissions: (perms) => setStorageItem(STORAGE_KEYS.ROLE_PERMISSIONS, perms),

  getUserOverrides: () => getStorageItem(STORAGE_KEYS.USER_OVERRIDES, INITIAL_USER_OVERRIDES),
  saveUserOverrides: (overrides) => setStorageItem(STORAGE_KEYS.USER_OVERRIDES, overrides),

  getGymFeatures: () => getStorageItem(STORAGE_KEYS.GYM_FEATURES, INITIAL_GYM_FEATURES),
  saveGymFeatures: (features) => setStorageItem(STORAGE_KEYS.GYM_FEATURES, features),

  getPlans: () => getStorageItem(STORAGE_KEYS.PLANS, INITIAL_PLANS),
  savePlans: (plans) => setStorageItem(STORAGE_KEYS.PLANS, plans),

  getClasses: () => getStorageItem(STORAGE_KEYS.CLASSES, INITIAL_CLASSES),
  saveClasses: (classes) => setStorageItem(STORAGE_KEYS.CLASSES, classes),

  getLeads: () => getStorageItem(STORAGE_KEYS.LEADS, INITIAL_LEADS),
  saveLeads: (leads) => setStorageItem(STORAGE_KEYS.LEADS, leads),

  getWorkouts: () => getStorageItem(STORAGE_KEYS.WORKOUTS, INITIAL_WORKOUTS),
  saveWorkouts: (workouts) => setStorageItem(STORAGE_KEYS.WORKOUTS, workouts),

  getAttendance: () => getStorageItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE),
  saveAttendance: (att) => setStorageItem(STORAGE_KEYS.ATTENDANCE, att),

  getPayments: () => getStorageItem(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS),
  savePayments: (payments) => setStorageItem(STORAGE_KEYS.PAYMENTS, payments),

  getAuditLogs: () => getStorageItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS),
  saveAuditLogs: (logs) => setStorageItem(STORAGE_KEYS.AUDIT_LOGS, logs),

  getNotifications: () => getStorageItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (notifs) => setStorageItem(STORAGE_KEYS.NOTIFICATIONS, notifs),

  resetToDefaults: () => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    window.location.reload();
  }
};
