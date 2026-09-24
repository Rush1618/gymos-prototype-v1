// Gym Tenant Management Service
import { StorageService } from './storageService';
import { AuditService } from './auditService';
import { DEFAULT_GYM_FEATURES } from '../config/features';

export const GymService = {
  getAllGyms: () => {
    return StorageService.getGyms();
  },

  getGymById: (gymId) => {
    const gyms = StorageService.getGyms();
    return gyms.find(g => g.id === gymId) || gyms[0];
  },

  createGym: (gymData, currentActor) => {
    const gyms = StorageService.getGyms();
    const gymId = `gym_${gymData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`;
    
    const newGym = {
      id: gymId,
      name: gymData.name,
      slug: gymData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      ownerName: gymData.ownerName,
      ownerEmail: gymData.ownerEmail,
      city: gymData.city,
      area: gymData.area || 'Central District',
      phone: gymData.phone || '+91 98000 00000',
      timezone: gymData.timezone || 'Asia/Kolkata (IST)',
      currency: gymData.currency || 'INR (₹)',
      gymType: gymData.gymType || 'Strength & Conditioning',
      platformPlan: gymData.platformPlan || 'PRO',
      status: 'ACTIVE',
      logo: gymData.logo || '⚡',
      createdAt: new Date().toISOString().split('T')[0],
      theme: gymData.theme || {
        primaryColor: '#ff5722',
        primaryHover: '#f4511e',
        secondaryColor: '#ff9800',
        accentColor: '#ffd600',
        bgDark: '#0d0f12',
        bgCard: '#151921',
        bgSurface: '#1e2430',
        textMain: '#ffffff',
        textMuted: '#94a3b8',
        borderColor: 'rgba(255, 87, 34, 0.25)',
        fontFamily: "'Outfit', sans-serif",
        heroHeadline: `Welcome to ${gymData.name}`,
        heroSubheadline: 'Engineered for high performance and results.'
      },
      metrics: {
        membersCount: 1,
        activeMembers: 1,
        mrr: 0,
        todayCheckins: 0,
        openLeads: 0,
        retentionAlerts: 0
      }
    };

    const updatedGyms = [newGym, ...gyms];
    StorageService.saveGyms(updatedGyms);

    // Initialize feature flags for the new gym
    const allGymFeatures = StorageService.getGymFeatures();
    allGymFeatures[gymId] = { ...DEFAULT_GYM_FEATURES };
    StorageService.saveGymFeatures(allGymFeatures);

    // Create the initial Owner user for this gym
    const users = StorageService.getUsers();
    const ownerUser = {
      id: `user_owner_${gymId}`,
      name: gymData.ownerName,
      email: gymData.ownerEmail,
      phone: gymData.phone || '+91 98000 00000',
      roleId: 'owner',
      gymId: gymId,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      status: 'ACTIVE'
    };
    StorageService.saveUsers([ownerUser, ...users]);

    // Audit log
    AuditService.log({
      actorName: currentActor?.name || 'Super Admin',
      actorRole: 'SUPER ADMIN',
      action: 'GYM_CREATED',
      gymId: newGym.id,
      gymName: newGym.name,
      details: `Created new gym tenant '${newGym.name}' in ${newGym.city} with plan ${newGym.platformPlan}`
    });

    return newGym;
  },

  updateGym: (gymId, updates, currentActor) => {
    const gyms = StorageService.getGyms();
    const index = gyms.findIndex(g => g.id === gymId);
    if (index === -1) return null;

    const oldGym = gyms[index];
    const updated = { ...oldGym, ...updates };
    gyms[index] = updated;
    StorageService.saveGyms(gyms);

    AuditService.log({
      actorName: currentActor?.name || 'Super Admin',
      actorRole: 'SUPER ADMIN',
      action: 'GYM_UPDATED',
      gymId,
      gymName: updated.name,
      details: `Updated gym settings and details for ${updated.name}`
    });

    return updated;
  },

  toggleGymStatus: (gymId, newStatus, currentActor) => {
    const gyms = StorageService.getGyms();
    const gym = gyms.find(g => g.id === gymId);
    if (!gym) return null;

    const prevStatus = gym.status;
    gym.status = newStatus;
    StorageService.saveGyms(gyms);

    AuditService.log({
      actorName: currentActor?.name || 'Super Admin',
      actorRole: 'SUPER ADMIN',
      action: 'GYM_STATUS_CHANGE',
      gymId,
      gymName: gym.name,
      beforeValue: prevStatus,
      afterValue: newStatus,
      details: `Changed tenant status of ${gym.name} from ${prevStatus} to ${newStatus}`
    });

    return gym;
  },

  toggleGymFeature: (gymId, featureKey, enabled, currentActor) => {
    const featuresMap = StorageService.getGymFeatures();
    const gymFeatures = featuresMap[gymId] || { ...DEFAULT_GYM_FEATURES };
    const beforeVal = gymFeatures[featureKey] !== undefined ? gymFeatures[featureKey] : true;
    gymFeatures[featureKey] = enabled;
    featuresMap[gymId] = gymFeatures;
    StorageService.saveGymFeatures(featuresMap);

    const gyms = StorageService.getGyms();
    const gym = gyms.find(g => g.id === gymId);

    AuditService.log({
      actorName: currentActor?.name || 'Super Admin',
      actorRole: 'SUPER ADMIN',
      action: 'GYM_FEATURE_TOGGLE',
      gymId,
      gymName: gym?.name || gymId,
      permissionKey: featureKey,
      beforeValue: String(beforeVal).toUpperCase(),
      afterValue: String(enabled).toUpperCase(),
      details: `Toggled feature flag '${featureKey}' to ${enabled ? 'ENABLED' : 'DISABLED'} for ${gym?.name || gymId}`
    });

    return gymFeatures;
  }
};
