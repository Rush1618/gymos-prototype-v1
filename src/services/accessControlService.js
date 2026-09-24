// Access Control & Permission Engine
// Hierarchy: Platform Rules -> Gym Feature Rules -> Role Permissions -> User Override -> Final Access
import { StorageService } from './storageService';

// Mapping of permission keys to required tenant feature flag (if applicable)
const FEATURE_DEPENDENCIES = {
  'page.leads': 'feature.crm',
  'lead.create': 'feature.crm',
  'lead.editStatus': 'feature.crm',
  'lead.convert': 'feature.crm',
  'attendance.scanQR': 'feature.qrCheckin',
  'page.retention': 'feature.retentionEngine',
  'retention.triggerOutreach': 'feature.retentionEngine',
  'member.viewWorkout': 'feature.workouts',
  'page.analytics': 'feature.advancedAnalytics',
  'payment.viewRevenueSummary': 'feature.advancedAnalytics',
  'page.ai': 'feature.ownerAI',
  'ai.businessInsights': 'feature.ownerAI',
  'ai.generateMessages': 'feature.ownerAI'
};

export const AccessControlService = {
  /**
   * Evaluates whether a user can access a specific key (Page, Feature, or Action)
   * @param {Object} user Current active user
   * @param {string} gymId Target gym ID
   * @param {string} permissionKey The permission key to evaluate
   * @returns {{ allowed: boolean, reason: string, layer: string }}
   */
  evaluateAccess: (user, gymId, permissionKey) => {
    if (!user) {
      return { allowed: false, reason: 'Unauthenticated', layer: 'PLATFORM' };
    }

    // 1. PLATFORM LEVEL RULE: Super Admin has platform-wide master override
    if (user.roleId === 'super_admin') {
      return { allowed: true, reason: 'Super Admin platform privilege', layer: 'PLATFORM_SUPER_ADMIN' };
    }

    // 2. TENANT ISOLATION CHECK: User cannot access a gym they do not belong to
    if (user.gymId !== 'all' && user.gymId !== gymId) {
      return { allowed: false, reason: `Tenant isolation: user belongs to ${user.gymId}, not ${gymId}`, layer: 'TENANT_ISOLATION' };
    }

    // 3. GYM FEATURE FLAG CHECK: Does this gym have this feature turned ON?
    const gymFeaturesMap = StorageService.getGymFeatures();
    const gymFeatures = gymFeaturesMap[gymId] || {};
    const requiredFeature = FEATURE_DEPENDENCIES[permissionKey];

    if (requiredFeature && gymFeatures[requiredFeature] === false) {
      return {
        allowed: false,
        reason: `Tenant feature flag '${requiredFeature}' is disabled for this gym`,
        layer: 'GYM_FEATURE_FLAG'
      };
    }

    // 4. USER SPECIFIC OVERRIDE CHECK (Highest priority over role defaults)
    const userOverridesMap = StorageService.getUserOverrides();
    const userOverrides = userOverridesMap[user.id] || {};

    if (userOverrides[permissionKey] !== undefined) {
      const isGranted = Boolean(userOverrides[permissionKey]);
      return {
        allowed: isGranted,
        reason: isGranted
          ? `Granted via explicit Super Admin user override for ${user.name}`
          : `Denied via explicit Super Admin user override for ${user.name}`,
        layer: 'USER_OVERRIDE'
      };
    }

    // 5. ROLE PERMISSION CHECK
    const rolePermissionsMap = StorageService.getRolePermissions();
    const rolePerms = rolePermissionsMap[user.roleId] || {};

    // Check if user has a custom role with embedded permissions
    if (user.roleId.startsWith('custom_')) {
      const customRoles = StorageService.getCustomRoles();
      const customRole = customRoles.find(r => r.key === user.roleId);
      if (customRole && customRole.permissions && customRole.permissions[permissionKey] !== undefined) {
        const allowed = Boolean(customRole.permissions[permissionKey]);
        return {
          allowed,
          reason: allowed ? `Allowed by custom role '${customRole.name}'` : `Denied by custom role '${customRole.name}'`,
          layer: 'CUSTOM_ROLE_PERMISSION'
        };
      }
    }

    const roleAllowed = Boolean(rolePerms[permissionKey]);
    return {
      allowed: roleAllowed,
      reason: roleAllowed ? `Allowed by default '${user.roleId}' role policy` : `Denied by default '${user.roleId}' role policy`,
      layer: 'ROLE_PERMISSION'
    };
  },

  /**
   * Helper to quickly check if user can view a page
   */
  canAccessPage: (user, gymId, pageKey) => {
    return AccessControlService.evaluateAccess(user, gymId, pageKey).allowed;
  },

  /**
   * Helper to quickly check if user can perform an action
   */
  canPerformAction: (user, gymId, actionKey) => {
    return AccessControlService.evaluateAccess(user, gymId, actionKey).allowed;
  },

  /**
   * Helper to check feature visibility inside a view
   */
  canViewFeature: (user, gymId, featureKey) => {
    return AccessControlService.evaluateAccess(user, gymId, featureKey).allowed;
  }
};
