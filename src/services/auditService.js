// Audit Log Service: records all platform and tenant mutations
import { StorageService } from './storageService';

export const AuditService = {
  getLogs: () => {
    return StorageService.getAuditLogs();
  },

  log: ({
    actorName = 'Super Admin',
    actorRole = 'SUPER ADMIN',
    action,
    gymId = 'all',
    gymName = 'Platform Wide',
    targetRole = 'N/A',
    targetUser = 'N/A',
    permissionKey = 'N/A',
    beforeValue = 'N/A',
    afterValue = 'N/A',
    details = ''
  }) => {
    const logs = StorageService.getAuditLogs();
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

    const newEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp,
      actorName,
      actorRole,
      action,
      gymId,
      gymName,
      targetRole,
      targetUser,
      permissionKey,
      beforeValue: String(beforeValue),
      afterValue: String(afterValue),
      details
    };

    const updated = [newEntry, ...logs];
    StorageService.saveAuditLogs(updated);
    return newEntry;
  }
};
