// Workout & Exercise Tracking Service
import { StorageService } from './storageService';
import { AuditService } from './auditService';

export const WorkoutService = {
  getWorkoutsByMember: (memberId) => {
    const workouts = StorageService.getWorkouts();
    return workouts.filter(w => w.memberId === memberId);
  },

  logWorkout: (workoutData, currentActor) => {
    const workouts = StorageService.getWorkouts();
    const newWorkout = {
      id: `wo_${Date.now()}`,
      memberId: workoutData.memberId,
      gymId: workoutData.gymId,
      name: workoutData.name || 'Strength & Hypertrophy Session',
      date: 'Today',
      durationMinutes: parseInt(workoutData.durationMinutes, 10) || 45,
      exercises: workoutData.exercises || []
    };

    StorageService.saveWorkouts([newWorkout, ...workouts]);

    AuditService.log({
      actorName: currentActor?.name || 'Member',
      actorRole: currentActor?.roleId?.toUpperCase() || 'MEMBER',
      action: 'WORKOUT_LOGGED',
      gymId: workoutData.gymId,
      details: `Logged workout '${newWorkout.name}' with ${newWorkout.exercises.length} exercises`
    });

    return newWorkout;
  }
};
