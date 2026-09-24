// Class Management and Booking Service
import { StorageService } from './storageService';
import { AuditService } from './auditService';

export const ClassService = {
  getClassesByGym: (gymId) => {
    const classes = StorageService.getClasses();
    return classes.filter(c => c.gymId === gymId);
  },

  createClass: (classData, currentActor) => {
    const classes = StorageService.getClasses();
    const newClass = {
      id: `class_${Date.now()}_${Math.random().toString(36).substr(2, 3)}`,
      gymId: classData.gymId,
      title: classData.title,
      trainerId: classData.trainerId,
      trainerName: classData.trainerName,
      category: classData.category || 'Strength & Conditioning',
      time: classData.time,
      date: classData.date,
      room: classData.room || 'Main Studio',
      capacity: parseInt(classData.capacity, 10) || 20,
      bookedCount: 0,
      attendees: []
    };

    StorageService.saveClasses([newClass, ...classes]);

    AuditService.log({
      actorName: currentActor?.name || 'Staff',
      actorRole: currentActor?.roleId?.toUpperCase() || 'STAFF',
      action: 'CLASS_CREATED',
      gymId: classData.gymId,
      details: `Created new class '${newClass.title}' scheduled for ${newClass.date} at ${newClass.time}`
    });

    return newClass;
  },

  bookClass: (classId, memberId, currentActor) => {
    const classes = StorageService.getClasses();
    const cls = classes.find(c => c.id === classId);
    if (!cls) throw new Error('Class not found');

    if (cls.attendees.includes(memberId)) {
      throw new Error('Member is already booked for this class');
    }

    if (cls.bookedCount >= cls.capacity) {
      throw new Error('Class is already at maximum capacity');
    }

    cls.attendees.push(memberId);
    cls.bookedCount += 1;
    StorageService.saveClasses(classes);

    AuditService.log({
      actorName: currentActor?.name || 'Member',
      actorRole: currentActor?.roleId?.toUpperCase() || 'MEMBER',
      action: 'CLASS_BOOKED',
      gymId: cls.gymId,
      details: `Member booked slot in '${cls.title}' (${cls.bookedCount}/${cls.capacity} filled)`
    });

    return cls;
  },

  cancelBooking: (classId, memberId, currentActor) => {
    const classes = StorageService.getClasses();
    const cls = classes.find(c => c.id === classId);
    if (!cls) throw new Error('Class not found');

    cls.attendees = cls.attendees.filter(id => id !== memberId);
    cls.bookedCount = Math.max(0, cls.bookedCount - 1);
    StorageService.saveClasses(classes);

    AuditService.log({
      actorName: currentActor?.name || 'Member',
      actorRole: currentActor?.roleId?.toUpperCase() || 'MEMBER',
      action: 'CLASS_BOOKING_CANCELLED',
      gymId: cls.gymId,
      details: `Cancelled booking for slot in '${cls.title}'`
    });

    return cls;
  },

  cancelClass: (classId, currentActor) => {
    const classes = StorageService.getClasses();
    const filtered = classes.filter(c => c.id !== classId);
    StorageService.saveClasses(filtered);

    AuditService.log({
      actorName: currentActor?.name || 'Staff',
      actorRole: currentActor?.roleId?.toUpperCase() || 'STAFF',
      action: 'CLASS_CANCELLED',
      details: `Class ${classId} cancelled by management`
    });

    return filtered;
  }
};
