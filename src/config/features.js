// Gym Tenant-level Feature Flags Catalog
export const FEATURE_CATALOG = [
  {
    key: 'feature.aiCoach',
    name: 'AI Member Coach',
    category: 'AI & Experience',
    description: 'Context-aware AI coach providing member workout generation, exercise tips, and recovery advice',
    icon: 'Bot',
    defaultEnabled: true
  },
  {
    key: 'feature.ownerAI',
    name: 'Owner Strategic AI',
    category: 'AI & Experience',
    description: 'Business intelligence assistant analyzing churn risks, revenue patterns, and operational bottlenecks',
    icon: 'Sparkles',
    defaultEnabled: true
  },
  {
    key: 'feature.crm',
    name: 'CRM & Lead Pipeline',
    category: 'Operations',
    description: 'Visual Kanban pipeline tracking website trial leads to converted gym members',
    icon: 'Kanban',
    defaultEnabled: true
  },
  {
    key: 'feature.qrCheckin',
    name: 'QR Pass & Kiosk Check-In',
    category: 'Operations',
    description: 'Instant digital pass with live QR code and reception desk scanner validation',
    icon: 'QrCode',
    defaultEnabled: true
  },
  {
    key: 'feature.retentionEngine',
    name: 'Automated Retention Engine',
    category: 'Operations',
    description: 'Transparent rule-based churn detection (>14 days absence) with 1-click re-engagement message creator',
    icon: 'ShieldAlert',
    defaultEnabled: true
  },
  {
    key: 'feature.workouts',
    name: 'Member Workout & PR Tracker',
    category: 'Fitness',
    description: 'Sets, reps, weights, PR detection and workout history tracking for members and trainers',
    icon: 'Dumbbell',
    defaultEnabled: true
  },
  {
    key: 'feature.advancedAnalytics',
    name: 'Advanced Business Analytics',
    category: 'Reports',
    description: 'Cohort retention, class utilization heatmaps, trainer performance, and revenue velocity',
    icon: 'BarChart3',
    defaultEnabled: true
  },
  {
    key: 'feature.nutrition',
    name: 'Nutrition & Meal Plans',
    category: 'Fitness',
    description: 'Dietary guidance, calorie tracking macros, and nutrition coach assignment',
    icon: 'Apple',
    defaultEnabled: false
  },
  {
    key: 'feature.marketing',
    name: 'Automated Outreach & Campaigns',
    category: 'Marketing',
    description: 'SMS/WhatsApp campaign blasts and trial expiration sequences',
    icon: 'Megaphone',
    defaultEnabled: true
  }
];

// Default gym features enabled mapping
export const DEFAULT_GYM_FEATURES = FEATURE_CATALOG.reduce((acc, feat) => {
  acc[feat.key] = feat.defaultEnabled;
  return acc;
}, {});
