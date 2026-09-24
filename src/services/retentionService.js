// Transparent Rule-based Retention Engine
// Logic: Last visit > 14 days + Historical average >= 2 visits/wk = High Retention Risk Alert
import { StorageService } from './storageService';
import { AuditService } from './auditService';

export const RetentionService = {
  /**
   * Evaluates all members in a gym and identifies retention risks
   */
  getRetentionAlerts: (gymId) => {
    const users = StorageService.getUsers();
    const members = users.filter(u => u.roleId === 'member' && u.gymId === gymId);

    const alerts = [];

    members.forEach(member => {
      const daysAbsent = member.lastVisitDaysAgo !== undefined ? member.lastVisitDaysAgo : 0;
      const historicalRate = member.historicalVisitsPerWeek || 0;
      const currentRate = member.currentVisitsThisWeek || 0;

      // Transparent Rule Condition
      const isAtRisk = daysAbsent >= 14 && historicalRate >= 2.0;

      if (isAtRisk) {
        alerts.push({
          memberId: member.id,
          memberName: member.name,
          phone: member.phone,
          email: member.email,
          membershipPlan: member.membershipPlan,
          daysAbsent,
          historicalRate,
          currentRate,
          assignedTrainer: member.assignedTrainerId || 'General Trainer',
          suggestedMessage: `Hey ${member.name.split(' ')[0]}! 💪 We noticed you haven't visited IronPulse in ${daysAbsent} days. Your coach Arjun noticed your bench press milestone last month and we saved a spot for you tomorrow! Need help resetting your split? Drop by this evening!`
        });
      }
    });

    return alerts;
  },

  /**
   * Generates tailored re-engagement copy for an at-risk member
   */
  generateReengagementMessage: (member, tone = 'MOTIVATIONAL') => {
    const firstName = member.memberName ? member.memberName.split(' ')[0] : member.name.split(' ')[0];
    const days = member.daysAbsent || member.lastVisitDaysAgo || 17;

    switch (tone) {
      case 'CASUAL_FRIENDLY':
        return `Hey ${firstName}! 👋 Hope everything is smooth. We haven't seen you at the gym in ${days} days and missed your energy! When are you crushing your next session?`;
      case 'GOAL_FOCUSED':
        return `Hi ${firstName}, consistency is where all physical adaptation happens! You were crushing ${member.historicalRate || 3} sessions a week before this ${days}-day pause. Let's schedule a 15-min form check-in with your trainer this week!`;
      case 'MOTIVATIONAL':
      default:
        return `Hey ${firstName}! 💪 Your strength gains are waiting for you at the gym! It's been ${days} days since your last session. Your coach saved an open rack for you tomorrow morning. Ready to jump back in?`;
    }
  },

  /**
   * Send or log outreach communication
   */
  logOutreach: (gymId, memberId, memberName, message, channel = 'WhatsApp', currentActor) => {
    AuditService.log({
      actorName: currentActor?.name || 'Staff',
      actorRole: currentActor?.roleId?.toUpperCase() || 'STAFF',
      action: 'RETENTION_OUTREACH_SENT',
      gymId,
      targetUser: memberName,
      details: `Triggered ${channel} re-engagement outreach to ${memberName}`
    });

    // Also add to gym notifications
    const notifs = StorageService.getNotifications();
    const newNotif = {
      id: `notif_${Date.now()}`,
      gymId,
      title: `✉️ Retention Outreach Sent: ${memberName}`,
      message: `Sent re-engagement message via ${channel} to ${memberName}.`,
      type: 'RETENTION_ACTION',
      isRead: true,
      timestamp: 'Just now'
    };
    StorageService.saveNotifications([newNotif, ...notifs]);

    return true;
  }
};
