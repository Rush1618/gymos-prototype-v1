// Comprehensive Seed Data for GymOS Prototype
import { DEFAULT_ROLE_PERMISSIONS } from '../config/permissions';
import { DEFAULT_GYM_FEATURES } from '../config/features';

export const INITIAL_GYMS = [
  {
    id: 'gym_ironpulse',
    name: 'IronPulse Fitness',
    slug: 'ironpulse',
    ownerName: 'Vikram Patel',
    ownerEmail: 'vikram@ironpulse.in',
    city: 'Mumbai',
    area: 'Bandra West, Hill Road',
    phone: '+91 98201 54321',
    timezone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
    gymType: 'Strength & Functional Hybrid',
    platformPlan: 'ENTERPRISE',
    status: 'ACTIVE',
    logo: '⚡',
    createdAt: '2025-11-10',
    theme: {
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
      heroHeadline: 'Forge Elite Strength. Redefine Your Peak.',
      heroSubheadline: 'Bandra’s premier high-performance strength sanctuary with Olympic platforms, metabolic conditioning, and world-class biomechanics.'
    },
    metrics: {
      membersCount: 420,
      activeMembers: 382,
      mrr: 720000,
      todayCheckins: 84,
      openLeads: 18,
      retentionAlerts: 3
    }
  },
  {
    id: 'gym_apex',
    name: 'Apex Athletics',
    slug: 'apex-athletics',
    ownerName: 'Rajesh Kannan',
    ownerEmail: 'rajesh@apexathletics.in',
    city: 'Bengaluru',
    area: 'Indiranagar 100ft Road',
    phone: '+91 98801 87654',
    timezone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
    gymType: 'CrossFit & Conditioning Box',
    platformPlan: 'PRO',
    status: 'ACTIVE',
    logo: '🔺',
    createdAt: '2026-01-15',
    theme: {
      primaryColor: '#00e5ff',
      primaryHover: '#00b4d8',
      secondaryColor: '#3b82f6',
      accentColor: '#10b981',
      bgDark: '#080c14',
      bgCard: '#101726',
      bgSurface: '#192238',
      textMain: '#f8fafc',
      textMuted: '#94a3b8',
      borderColor: 'rgba(0, 229, 255, 0.25)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      heroHeadline: 'Human Performance Engineered For The Relentless.',
      heroSubheadline: 'Bengaluru’s highest calibrated barbell lab and tactical training facility.'
    },
    metrics: {
      membersCount: 290,
      activeMembers: 265,
      mrr: 485000,
      todayCheckins: 62,
      openLeads: 12,
      retentionAlerts: 2
    }
  },
  {
    id: 'gym_zenflow',
    name: 'ZenFlow Studio',
    slug: 'zenflow',
    ownerName: 'Meera Kapoor',
    ownerEmail: 'meera@zenflow.in',
    city: 'New Delhi',
    area: 'Greater Kailash II',
    phone: '+91 98112 34987',
    timezone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
    gymType: 'Pilates, Yoga & Mindful Movement',
    platformPlan: 'STARTER',
    status: 'ACTIVE',
    logo: '🌿',
    createdAt: '2026-02-01',
    theme: {
      primaryColor: '#10b981',
      primaryHover: '#059669',
      secondaryColor: '#d97706',
      accentColor: '#6ee7b7',
      bgDark: '#0a120e',
      bgCard: '#122019',
      bgSurface: '#192e24',
      textMain: '#f0fdf4',
      textMuted: '#a7f3d0',
      borderColor: 'rgba(16, 185, 129, 0.25)',
      fontFamily: "'Syne', sans-serif",
      heroHeadline: 'Conscious Movement. Sculpted Core. Inner Stillness.',
      heroSubheadline: 'Classical Reformer Pilates, dynamic Ashtanga Vinyasa, and restorative sound healing in Delhi.'
    },
    metrics: {
      membersCount: 175,
      activeMembers: 160,
      mrr: 310000,
      todayCheckins: 41,
      openLeads: 9,
      retentionAlerts: 1
    }
  },
  {
    id: 'gym_titan_pune',
    name: 'Titan Barbell Club',
    slug: 'titan-barbell',
    ownerName: 'Sanjay Kulkarni',
    ownerEmail: 'sanjay@titanbarbell.in',
    city: 'Pune',
    area: 'Koregaon Park',
    phone: '+91 99221 11223',
    timezone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
    gymType: 'Powerlifting & Strongman Hub',
    platformPlan: 'PRO',
    status: 'TRIAL',
    logo: '🛡️',
    createdAt: '2026-03-01',
    theme: {
      primaryColor: '#f59e0b',
      primaryHover: '#d97706',
      secondaryColor: '#ef4444',
      accentColor: '#10b981',
      bgDark: '#0d0d10',
      bgCard: '#18181f',
      bgSurface: '#22222c',
      textMain: '#f8fafc',
      textMuted: '#94a3b8',
      borderColor: 'rgba(245, 158, 11, 0.25)',
      fontFamily: "'Outfit', sans-serif",
      heroHeadline: 'Uncompromising Powerlifting & Concrete Strength.',
      heroSubheadline: 'Calibrated Eleiko plates, Monolifts, and elite competitive coaching.'
    },
    metrics: {
      membersCount: 95,
      activeMembers: 91,
      mrr: 155000,
      todayCheckins: 28,
      openLeads: 14,
      retentionAlerts: 0
    }
  },
  {
    id: 'gym_metro_hyd',
    name: 'MetroFlex Fitness',
    slug: 'metroflex-hyd',
    ownerName: 'Ravi Teja',
    ownerEmail: 'ravi@metroflex.in',
    city: 'Hyderabad',
    area: 'Jubilee Hills',
    phone: '+91 97000 88990',
    timezone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
    gymType: '24/7 Commercial Gym',
    platformPlan: 'ENTERPRISE',
    status: 'SUSPENDED',
    logo: '⚡',
    createdAt: '2025-08-10',
    theme: {
      primaryColor: '#ec4899',
      primaryHover: '#db2777',
      secondaryColor: '#8b5cf6',
      accentColor: '#06b6d4',
      bgDark: '#0e0b12',
      bgCard: '#181320',
      bgSurface: '#241d30',
      textMain: '#fdf2f8',
      textMuted: '#f472b6',
      borderColor: 'rgba(236, 72, 153, 0.25)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      heroHeadline: '24/7 High-Voltage Gym & Wellness Matrix.',
      heroSubheadline: 'Round-the-clock biometric access, luxury recovery spa, and steam rooms.'
    },
    metrics: {
      membersCount: 510,
      activeMembers: 0,
      mrr: 0,
      todayCheckins: 0,
      openLeads: 0,
      retentionAlerts: 14
    }
  }
];

// Generate platform summary mock data totaling 128 Gyms (116 Active, 7 Trial, 3 Suspended, 2 Onboarding)
export const PLATFORM_STATS = {
  totalGyms: 128,
  activeGyms: 116,
  trialGyms: 7,
  suspendedGyms: 3,
  onboardingGyms: 2,
  totalPlatformMembers: 48920,
  platformARR: 28400000, // ₹2.84 Cr ARR
  platformMRR: 2366666,
  aiQueriesThisMonth: 14280,
  activeImpersonations: 0
};

// Seed Users across IronPulse Gym
export const INITIAL_USERS = [
  {
    id: 'user_superadmin',
    name: 'Rushabh (Agency Director)',
    email: 'rushabh@gymos-agency.io',
    phone: '+91 99999 00000',
    roleId: 'super_admin',
    gymId: 'all',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    status: 'ACTIVE'
  },
  {
    id: 'user_owner_ironpulse',
    name: 'Vikram Patel',
    email: 'vikram@ironpulse.in',
    phone: '+91 98201 54321',
    roleId: 'owner',
    gymId: 'gym_ironpulse',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: 'ACTIVE'
  },
  {
    id: 'user_manager_ironpulse',
    name: "Sarah D'Souza",
    email: 'sarah@ironpulse.in',
    phone: '+91 98202 65432',
    roleId: 'manager',
    gymId: 'gym_ironpulse',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    status: 'ACTIVE'
  },
  {
    id: 'user_trainer_arjun',
    name: 'Arjun Mehta',
    email: 'arjun@ironpulse.in',
    phone: '+91 98203 76543',
    roleId: 'trainer',
    gymId: 'gym_ironpulse',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    status: 'ACTIVE',
    specialization: 'Functional Strength & Olympic Lifts',
    experienceYears: 6,
    assignedClientsCount: 14
  },
  {
    id: 'user_trainer_rohan',
    name: 'Rohan Deshmukh',
    email: 'rohan@ironpulse.in',
    phone: '+91 98204 87654',
    roleId: 'trainer',
    gymId: 'gym_ironpulse',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    status: 'ACTIVE',
    specialization: 'Hypertrophy & Powerbuilding',
    experienceYears: 4,
    assignedClientsCount: 11
  },
  {
    id: 'user_reception_kavita',
    name: 'Kavita Nair',
    email: 'kavita@ironpulse.in',
    phone: '+91 98205 98765',
    roleId: 'receptionist',
    gymId: 'gym_ironpulse',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    status: 'ACTIVE'
  },
  {
    id: 'user_member_rahul',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '+91 98206 11223',
    roleId: 'member',
    gymId: 'gym_ironpulse',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    status: 'ACTIVE',
    membershipPlan: 'Annual Elite Pro',
    membershipStatus: 'ACTIVE',
    joinedDate: '2025-06-15',
    lastVisitDaysAgo: 17, // Matches prompt Section 34: Inactive > 14 days, high historical visits!
    historicalVisitsPerWeek: 3.2,
    currentVisitsThisWeek: 0,
    retentionRisk: 'HIGH_RISK',
    assignedTrainerId: 'user_trainer_arjun',
    passId: 'PASS-IP-7821'
  },
  {
    id: 'user_member_priya',
    name: 'Priya Sen',
    email: 'priya.sen@outlook.com',
    phone: '+91 98207 22334',
    roleId: 'member',
    gymId: 'gym_ironpulse',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    status: 'ACTIVE',
    membershipPlan: 'Half-Yearly Unlimited',
    membershipStatus: 'ACTIVE',
    joinedDate: '2025-09-01',
    lastVisitDaysAgo: 1,
    historicalVisitsPerWeek: 4.5,
    currentVisitsThisWeek: 3,
    retentionRisk: 'HEALTHY',
    assignedTrainerId: 'user_trainer_arjun',
    passId: 'PASS-IP-9042'
  },
  {
    id: 'user_member_devika',
    name: 'Devika Rao',
    email: 'devika.rao@yahoo.com',
    phone: '+91 98208 33445',
    roleId: 'member',
    gymId: 'gym_ironpulse',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    status: 'ACTIVE',
    membershipPlan: 'Quarterly Peak',
    membershipStatus: 'ACTIVE',
    joinedDate: '2026-01-10',
    lastVisitDaysAgo: 3,
    historicalVisitsPerWeek: 3.0,
    currentVisitsThisWeek: 2,
    retentionRisk: 'HEALTHY',
    assignedTrainerId: 'user_trainer_rohan',
    passId: 'PASS-IP-3420'
  }
];

// User Overrides (Prompt section 12: Arjun Mehta has analytics.view = true override!)
export const INITIAL_USER_OVERRIDES = {
  user_trainer_arjun: {
    'page.analytics': true // Arjun has explicit override granted by Super Admin
  }
};

// Gym Tenant Feature Flags state
export const INITIAL_GYM_FEATURES = {
  gym_ironpulse: { ...DEFAULT_GYM_FEATURES, 'feature.nutrition': true },
  gym_apex: { ...DEFAULT_GYM_FEATURES, 'feature.nutrition': false },
  gym_zenflow: { ...DEFAULT_GYM_FEATURES, 'feature.workouts': false, 'feature.nutrition': true },
  gym_titan_pune: { ...DEFAULT_GYM_FEATURES, 'feature.aiCoach': false },
  gym_metro_hyd: { ...DEFAULT_GYM_FEATURES }
};

// Seed Membership Plans for IronPulse
export const INITIAL_PLANS = [
  {
    id: 'plan_starter_monthly',
    gymId: 'gym_ironpulse',
    name: '1-Month Standard',
    price: 3500,
    durationMonths: 1,
    popular: false,
    description: 'Full floor access, steam, shower and general training orientation',
    features: ['Unlimited Gym Floor Access', 'Locker & Steam Room', '1 Fitness Assessment', 'Member Mobile Pass']
  },
  {
    id: 'plan_quarterly_peak',
    gymId: 'gym_ironpulse',
    name: '3-Month Peak Velocity',
    price: 9000,
    durationMonths: 3,
    popular: false,
    description: 'Complete strength & conditioning conditioning with 2 group classes per week',
    features: ['Unlimited Floor Access', '8 Group Class Passes/mo', '1 Personal Training Session', 'Mobile Pass & QR Check-in', 'AI Workout Logger']
  },
  {
    id: 'plan_annual_elite',
    gymId: 'gym_ironpulse',
    name: '12-Month Elite Pro',
    price: 24000,
    durationMonths: 12,
    popular: true,
    description: 'Full VIP tier with all classes, nutrition consultations, and personal trainer onboarding',
    features: ['All Group Classes Included', '4 Personal Training Consults', 'AI Member Coach 24/7', 'Priority Class Booking', 'Guest Passes (2/mo)', 'Complimentary Locker']
  }
];

// Seed Classes for IronPulse
export const INITIAL_CLASSES = [
  {
    id: 'class_hiit_morning',
    gymId: 'gym_ironpulse',
    title: 'Metabolic HIIT Ignition',
    trainerId: 'user_trainer_arjun',
    trainerName: 'Arjun Mehta',
    category: 'Cardio & Conditioning',
    time: '07:00 AM - 07:45 AM',
    date: '2026-09-25',
    room: 'Studio A (Main Turf)',
    capacity: 20,
    bookedCount: 16,
    attendees: ['user_member_priya', 'user_member_devika']
  },
  {
    id: 'class_powerlifting_eve',
    gymId: 'gym_ironpulse',
    title: 'Olympic Barbell & Deadlift Clinic',
    trainerId: 'user_trainer_rohan',
    trainerName: 'Rohan Deshmukh',
    category: 'Strength & Technique',
    time: '06:00 PM - 07:00 PM',
    date: '2026-09-25',
    room: 'Platform Room 2',
    capacity: 12,
    bookedCount: 9,
    attendees: ['user_member_priya']
  },
  {
    id: 'class_mobility_flow',
    gymId: 'gym_ironpulse',
    title: 'Spinal Mobility & Decompression Flow',
    trainerId: 'user_trainer_arjun',
    trainerName: 'Arjun Mehta',
    category: 'Recovery & Flexibility',
    time: '08:30 AM - 09:15 AM',
    date: '2026-09-26',
    room: 'Studio B (Zen Deck)',
    capacity: 15,
    bookedCount: 11,
    attendees: ['user_member_devika']
  }
];

// Seed CRM Leads (Pipeline: NEW -> CONTACTED -> TRIAL_BOOKED -> TRIAL_COMPLETED -> CONVERTED -> LOST)
export const INITIAL_LEADS = [
  {
    id: 'lead_101',
    gymId: 'gym_ironpulse',
    name: 'Ananya Roy',
    phone: '+91 98209 44556',
    email: 'ananya.roy@gmail.com',
    goal: 'Weight Loss & Toning',
    source: 'Website Free Trial',
    status: 'NEW',
    assignedStaff: 'Sarah D\'Souza',
    notes: 'Requested trial via website landing page. Prefers morning batch.',
    nextFollowUp: 'Today, 2:00 PM',
    createdAt: '2026-09-24T18:40:00Z'
  },
  {
    id: 'lead_102',
    gymId: 'gym_ironpulse',
    name: 'Kabir Kapoor',
    phone: '+91 98210 55667',
    email: 'kabir.k@gmail.com',
    goal: 'Hypertrophy & Muscle Gain',
    source: 'Website Free Trial',
    status: 'CONTACTED',
    assignedStaff: 'Arjun Mehta',
    notes: 'Spoke over WhatsApp. Interested in Annual membership. Scheduling trial for Saturday.',
    nextFollowUp: 'Tomorrow, 11:00 AM',
    createdAt: '2026-09-23T14:15:00Z'
  },
  {
    id: 'lead_103',
    gymId: 'gym_ironpulse',
    name: 'Ritu Agarwal',
    phone: '+91 98211 66778',
    email: 'ritu.agarwal@outlook.com',
    goal: 'Functional Endurance',
    source: 'Walk-in',
    status: 'TRIAL_BOOKED',
    assignedStaff: 'Kavita Nair',
    notes: 'Free trial booked for tomorrow 7:00 AM HIIT class.',
    nextFollowUp: '2026-09-26, 6:30 AM',
    createdAt: '2026-09-22T10:00:00Z'
  },
  {
    id: 'lead_104',
    gymId: 'gym_ironpulse',
    name: 'Sameer Joshi',
    phone: '+91 98212 77889',
    email: 'sameer.j@gmail.com',
    goal: 'Posture Correction & Strength',
    source: 'Instagram Ad',
    status: 'TRIAL_COMPLETED',
    assignedStaff: 'Sarah D\'Souza',
    notes: 'Loved the barbell clinic session. Ready to convert, offered 10% early bird on Annual.',
    nextFollowUp: 'Today, 5:00 PM',
    createdAt: '2026-09-20T11:20:00Z'
  },
  {
    id: 'lead_105',
    gymId: 'gym_ironpulse',
    name: 'Varun Khanna',
    phone: '+91 98213 88990',
    email: 'varun.k@corporate.com',
    goal: 'General Health',
    source: 'Referral',
    status: 'CONVERTED',
    assignedStaff: 'Vikram Patel',
    notes: 'Enrolled on Annual Elite Pro! Assigned to trainer Arjun.',
    nextFollowUp: 'Completed',
    createdAt: '2026-09-18T09:00:00Z'
  }
];

// Seed Member Workouts
export const INITIAL_WORKOUTS = [
  {
    id: 'wo_1',
    memberId: 'user_member_rahul',
    gymId: 'gym_ironpulse',
    name: 'Heavy Push Day (Chest & Delts)',
    date: '17 days ago',
    durationMinutes: 55,
    exercises: [
      { name: 'Barbell Flat Bench Press', sets: 4, reps: '8, 8, 6, 5', weightKg: 85, isPR: false },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10, 10, 8', weightKg: 28, isPR: false },
      { name: 'Dumbbell Lateral Raises', sets: 4, reps: '15, 12, 12, 12', weightKg: 12, isPR: false },
      { name: 'Overhead Tricep Rope Extension', sets: 3, reps: '12, 12, 10', weightKg: 30, isPR: false }
    ]
  },
  {
    id: 'wo_2',
    memberId: 'user_member_priya',
    gymId: 'gym_ironpulse',
    name: 'Deadlift & Posterior Chain Focus',
    date: 'Yesterday',
    durationMinutes: 62,
    exercises: [
      { name: 'Conventional Barbell Deadlift', sets: 5, reps: '5, 5, 3, 3, 1', weightKg: 110, isPR: true },
      { name: 'Bulgarian Split Squats', sets: 3, reps: '10, 10, 10', weightKg: 18, isPR: false },
      { name: 'Weighted Pull-Ups', sets: 4, reps: '6, 6, 5, 5', weightKg: 10, isPR: true },
      { name: 'Hanging Leg Raises', sets: 3, reps: '15, 15, 12', weightKg: 0, isPR: false }
    ]
  }
];

// Seed Attendance Records
export const INITIAL_ATTENDANCE = [
  {
    id: 'att_1',
    gymId: 'gym_ironpulse',
    memberId: 'user_member_priya',
    memberName: 'Priya Sen',
    passId: 'PASS-IP-9042',
    date: '2026-09-25',
    time: '06:45 AM',
    checkInMethod: 'QR',
    verified: true,
    status: 'ACTIVE_IN_GYM'
  },
  {
    id: 'att_2',
    gymId: 'gym_ironpulse',
    memberId: 'user_member_devika',
    memberName: 'Devika Rao',
    passId: 'PASS-IP-3420',
    date: '2026-09-25',
    time: '07:10 AM',
    checkInMethod: 'QR',
    verified: true,
    status: 'ACTIVE_IN_GYM'
  },
  {
    id: 'att_3',
    gymId: 'gym_ironpulse',
    memberId: 'user_member_priya',
    memberName: 'Priya Sen',
    passId: 'PASS-IP-9042',
    date: '2026-09-24',
    time: '06:50 AM',
    checkInMethod: 'QR',
    verified: true,
    status: 'COMPLETED'
  }
];

// Seed Payments
export const INITIAL_PAYMENTS = [
  {
    id: 'pay_901',
    gymId: 'gym_ironpulse',
    memberId: 'user_member_priya',
    memberName: 'Priya Sen',
    amount: 14000,
    planName: 'Half-Yearly Unlimited',
    method: 'UPI',
    status: 'PAID',
    invoiceNo: 'INV-IP-2026-091',
    date: '2026-09-01'
  },
  {
    id: 'pay_902',
    gymId: 'gym_ironpulse',
    memberId: 'user_member_devika',
    memberName: 'Devika Rao',
    amount: 9000,
    planName: '3-Month Peak Velocity',
    method: 'CARD',
    status: 'PAID',
    invoiceNo: 'INV-IP-2026-088',
    date: '2026-01-10'
  },
  {
    id: 'pay_903',
    gymId: 'gym_ironpulse',
    memberId: 'user_member_rahul',
    memberName: 'Rahul Sharma',
    amount: 24000,
    planName: '12-Month Elite Pro',
    method: 'BANK_TRANSFER',
    status: 'PAID',
    invoiceNo: 'INV-IP-2025-412',
    date: '2025-06-15'
  }
];

// Seed Audit Logs (Prompt Section 37: Who, What, When, Which Gym, Which Role, Which User, Before, After)
export const INITIAL_AUDIT_LOGS = [
  {
    id: 'audit_01',
    timestamp: '2026-09-24 19:30:15',
    actorName: 'Rushabh (Agency Director)',
    actorRole: 'SUPER ADMIN',
    action: 'USER_PERMISSION_OVERRIDE_GRANTED',
    gymId: 'gym_ironpulse',
    gymName: 'IronPulse Fitness',
    targetRole: 'trainer',
    targetUser: 'Arjun Mehta',
    permissionKey: 'page.analytics',
    beforeValue: 'FALSE',
    afterValue: 'TRUE',
    details: 'Super Admin granted analytics view override to Trainer Arjun Mehta'
  },
  {
    id: 'audit_02',
    timestamp: '2026-09-24 16:10:00',
    actorName: 'Rushabh (Agency Director)',
    actorRole: 'SUPER ADMIN',
    action: 'GYM_FEATURE_TOGGLE',
    gymId: 'gym_ironpulse',
    gymName: 'IronPulse Fitness',
    targetRole: 'ALL',
    targetUser: 'N/A',
    permissionKey: 'feature.nutrition',
    beforeValue: 'FALSE',
    afterValue: 'TRUE',
    details: 'Enabled Nutrition & Meal Plans feature flag for IronPulse Fitness'
  },
  {
    id: 'audit_03',
    timestamp: '2026-09-23 11:20:45',
    actorName: 'Rushabh (Agency Director)',
    actorRole: 'SUPER ADMIN',
    action: 'ROLE_PERMISSION_UPDATED',
    gymId: 'gym_ironpulse',
    gymName: 'IronPulse Fitness',
    targetRole: 'receptionist',
    targetUser: 'ALL_RECEPTIONISTS',
    permissionKey: 'lead.convert',
    beforeValue: 'FALSE',
    afterValue: 'TRUE',
    details: 'Allowed front desk receptionists to execute 1-click lead to member conversion'
  }
];

// Seed Notifications
export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    gymId: 'gym_ironpulse',
    title: '⚠️ Retention Signal: Rahul Sharma',
    message: 'Rahul has not visited in 17 days (historical average: 3.2 visits/wk). High churn risk. 1-click re-engagement message ready.',
    type: 'RETENTION_SIGNAL',
    isRead: false,
    timestamp: '2 hours ago'
  },
  {
    id: 'notif_2',
    gymId: 'gym_ironpulse',
    title: '🔥 New Free Trial Lead from Website',
    message: 'Ananya Roy submitted a Free Trial request for morning functional training.',
    type: 'NEW_LEAD',
    isRead: false,
    timestamp: '5 hours ago'
  },
  {
    id: 'notif_3',
    gymId: 'gym_ironpulse',
    title: '💪 Class High Attendance Alert',
    message: 'Metabolic HIIT Ignition reached 80% booked capacity for tomorrow.',
    type: 'CLASS_ALERT',
    isRead: true,
    timestamp: '1 day ago'
  }
];
