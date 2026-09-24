// System Role Configurations and Custom Role Definitions
export const SYSTEM_ROLES = [
  {
    key: 'super_admin',
    name: 'Super Admin',
    description: 'Agency control tower with platform-wide administrative privileges across all gyms',
    badgeColor: '#ec4899',
    scope: 'PLATFORM',
    isSystem: true
  },
  {
    key: 'owner',
    name: 'Gym Owner',
    description: 'Complete operational and financial control over their specific gym tenant',
    badgeColor: '#f59e0b',
    scope: 'TENANT',
    isSystem: true
  },
  {
    key: 'manager',
    name: 'General Manager',
    description: 'Day-to-day operations lead: members, leads, classes, attendance, and team management',
    badgeColor: '#3b82f6',
    scope: 'TENANT',
    isSystem: true
  },
  {
    key: 'trainer',
    name: 'Fitness Trainer',
    description: 'Assigned members, workout logging, class rosters, and personal progress tracking (no billing by default)',
    badgeColor: '#10b981',
    scope: 'TENANT',
    isSystem: true
  },
  {
    key: 'receptionist',
    name: 'Front Desk / Reception',
    description: 'Check-in scanning, walk-in trial registration, bookings, and fee collection',
    badgeColor: '#8b5cf6',
    scope: 'TENANT',
    isSystem: true
  },
  {
    key: 'member',
    name: 'Gym Member',
    description: 'Individual self-service portal: workout tracking, QR check-in, class booking, AI coach',
    badgeColor: '#06b6d4',
    scope: 'SELF',
    isSystem: true
  }
];

// Seed initial custom roles that can be modified or extended
export const INITIAL_CUSTOM_ROLES = [
  {
    key: 'custom_nutritionist',
    name: 'Nutrition Coach',
    description: 'Dietary guidance specialist with access to member fitness profiles and notes',
    badgeColor: '#84cc16',
    scope: 'TENANT',
    isSystem: false,
    baseRole: 'trainer',
    permissions: {
      'page.dashboard': true,
      'page.members': true,
      'page.leads': false,
      'page.classes': false,
      'page.trainers': false,
      'page.payments': false,
      'page.attendance': false,
      'page.analytics': false,
      'page.retention': false,
      'page.ai': false,
      'page.settings': false,
      'member.viewPayments': false,
      'member.viewProgress': true,
      'member.viewNotes': true,
      'member.viewWorkout': true
    }
  },
  {
    key: 'custom_sales_lead',
    name: 'Sales Manager',
    description: 'Focuses on pipeline velocity, website trial conversion, and membership enrollments',
    badgeColor: '#f97316',
    scope: 'TENANT',
    isSystem: false,
    baseRole: 'manager',
    permissions: {
      'page.dashboard': true,
      'page.members': true,
      'page.leads': true,
      'page.classes': false,
      'page.trainers': false,
      'page.payments': true,
      'page.attendance': false,
      'page.analytics': true,
      'page.retention': true,
      'page.ai': true,
      'page.settings': false,
      'lead.viewContactInfo': true,
      'lead.viewNotes': true,
      'lead.create': true,
      'lead.editStatus': true,
      'lead.convert': true,
      'member.create': true,
      'member.edit': true
    }
  }
];
