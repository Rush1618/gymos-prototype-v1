// Attendance & Check-in Verification Service (QR & Manual)
import { StorageService } from './storageService';
import { AuditService } from './auditService';

export const AttendanceService = {
  getAttendanceByGym: (gymId) => {
    const attendance = StorageService.getAttendance();
    return attendance.filter(a => a.gymId === gymId);
  },

  /**
   * QR Check-in: Validates member pass ID, updates member last visit, records entry log
   */
  processQRScan: (gymId, passId, currentActor) => {
    const users = StorageService.getUsers();
    const member = users.find(u => u.passId === passId && u.gymId === gymId);

    if (!member) {
      return {
        success: false,
        message: `Invalid Pass ID '${passId}'. No active member registered with this pass for this gym.`,
        member: null
      };
    }

    if (member.status !== 'ACTIVE' || member.membershipStatus === 'EXPIRED') {
      return {
        success: false,
        message: `Check-in Denied: ${member.name}'s membership is ${member.membershipStatus || 'INACTIVE'}. Please renew.`,
        member
      };
    }

    // Check if already checked in in the last 60 minutes
    const attendanceRecords = StorageService.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    const existingToday = attendanceRecords.find(
      a => a.memberId === member.id && a.date === today && a.gymId === gymId
    );

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newAttendance = {
      id: `att_${Date.now()}`,
      gymId,
      memberId: member.id,
      memberName: member.name,
      passId,
      date: today,
      time: timeStr,
      checkInMethod: 'QR',
      verified: true,
      status: 'ACTIVE_IN_GYM'
    };

    StorageService.saveAttendance([newAttendance, ...attendanceRecords]);

    // Update member's last visit metrics and clear retention risk!
    member.lastVisitDaysAgo = 0;
    member.currentVisitsThisWeek = (member.currentVisitsThisWeek || 0) + 1;
    if (member.retentionRisk === 'HIGH_RISK') {
      member.retentionRisk = 'HEALTHY';
    }
    StorageService.saveUsers(users);

    // Audit log
    AuditService.log({
      actorName: currentActor?.name || 'Reception Scanner',
      actorRole: currentActor?.roleId?.toUpperCase() || 'SYSTEM',
      action: 'QR_CHECKIN_VERIFIED',
      gymId,
      targetUser: member.name,
      details: `Successful QR scan check-in for ${member.name} (${passId}) at ${timeStr}`
    });

    return {
      success: true,
      message: `Access Granted! Welcome to the gym, ${member.name}.`,
      member,
      attendance: newAttendance,
      isReEngagement: existingToday ? false : true
    };
  },

  /**
   * Manual staff check-in override
   */
  processManualCheckin: (gymId, memberId, currentActor) => {
    const users = StorageService.getUsers();
    const member = users.find(u => u.id === memberId);
    if (!member) throw new Error('Member not found');

    const attendanceRecords = StorageService.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newAttendance = {
      id: `att_${Date.now()}`,
      gymId,
      memberId: member.id,
      memberName: member.name,
      passId: member.passId || 'MANUAL-ENTRY',
      date: today,
      time: timeStr,
      checkInMethod: 'MANUAL',
      verified: true,
      status: 'ACTIVE_IN_GYM'
    };

    StorageService.saveAttendance([newAttendance, ...attendanceRecords]);

    // Update member visit stats
    member.lastVisitDaysAgo = 0;
    member.currentVisitsThisWeek = (member.currentVisitsThisWeek || 0) + 1;
    member.retentionRisk = 'HEALTHY';
    StorageService.saveUsers(users);

    AuditService.log({
      actorName: currentActor?.name || 'Staff',
      actorRole: currentActor?.roleId?.toUpperCase() || 'STAFF',
      action: 'MANUAL_CHECKIN_RECORDED',
      gymId,
      targetUser: member.name,
      details: `Manual check-in logged for ${member.name}`
    });

    return newAttendance;
  }
};
