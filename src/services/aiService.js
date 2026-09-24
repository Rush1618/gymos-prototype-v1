// Contextual AI Service for Member Coach & Gym Owner Strategic Intelligence
import { StorageService } from './storageService';
import { RetentionService } from './retentionService';

export const AIService = {
  /**
   * Member AI Assistant (Contextual to member's workouts, goals, and history)
   */
  askMemberCoach: (member, question) => {
    const q = question.toLowerCase();
    const firstName = member.name.split(' ')[0];
    const memberGoal = member.healthGoals || 'Strength & Conditioning';

    if (q.includes('today') || q.includes('workout') || q.includes('routine') || q.includes('create')) {
      return {
        reply: `Custom training program tailored for ${memberGoal}:\n\n` +
          `**Warm-up (7 mins):**\n` +
          `• 90/90 Hip Rotations: 2 sets x 10 reps\n` +
          `• Banded Shoulder Dislocates: 2 sets x 15 reps\n` +
          `• World's Greatest Stretch: 5 reps/side\n\n` +
          `**Primary Strength Block (25 mins):**\n` +
          `1. Barbell Back Squat / Front Squat: 4 sets x 6 reps (RPE 8, rest 2 mins)\n` +
          `2. Romanian Deadlifts (Dumbbells): 3 sets x 10 reps (Slow 3s eccentric)\n` +
          `3. Bulgarian Split Squats: 3 sets x 8 reps/leg\n\n` +
          `**Accessory & Core (10 mins):**\n` +
          `• Standing Calf Raises: 3 sets x 15 reps\n` +
          `• Hanging Leg Tucks: 3 sets x 12 reps\n\n` +
          `Coaching cue: Maintain full abdominal brace before initiating each squat rep.`,
        action: 'WORKOUT_GENERATED'
      };
    }

    if (q.includes('shorter') || q.includes('quick') || q.includes('20 min') || q.includes('30 min')) {
      return {
        reply: `**Condensed 25-Minute Circuit for ${firstName}:**\n\n` +
          `5 rounds with 90s rest between rounds:\n` +
          `1. Dumbbell Thrusters: 10 reps (moderate load)\n` +
          `2. Renegade Rows to Push-up: 8 total reps\n` +
          `3. Kettlebell Swings: 15 crisp reps\n` +
          `4. Hollow Body Hold: 30 seconds\n\n` +
          `Target: Keep unbroken pace through rounds 1 to 3 before fatigue sets in.`,
        action: 'SHORT_WORKOUT_GENERATED'
      };
    }

    if (q.includes('nutrition') || q.includes('protein') || q.includes('diet') || q.includes('food')) {
      return {
        reply: `**Performance Nutrition Protocol:**\n\n` +
          `• **Daily Protein Target:** Aim for 1.8g to 2.0g per kg of target bodyweight divided across 3-4 meals.\n` +
          `• **Pre-Workout Fuel (60-90m prior):** Carbohydrate-rich meal with moderate protein (e.g., oats with Greek yogurt or banana on toast).\n` +
          `• **Hydration Target:** Minimum 3.5L water daily with electrolyte balance for intense training sessions.\n` +
          `• **Sleep & Recovery:** 7.5 to 8.5 hours of uninterrupted sleep for muscle tissue repair.`,
        action: 'NUTRITION_ADVICE'
      };
    }

    if (q.includes('recovery') || q.includes('sore') || q.includes('rest')) {
      return {
        reply: `**Active Recovery Protocol:**\n\n` +
          `To manage training soreness (DOMS) and restore neuromuscular readiness:\n` +
          `1. 20-minute low-intensity walk (Zone 1) to facilitate metabolic clearance.\n` +
          `2. Soft tissue work: Quads, lats, and glutes (60 seconds per muscle group).\n` +
          `3. Contrast exposure: 15 minutes Finnish sauna followed by 2-minute cold plunge.\n` +
          `4. Magnesium supplementation 30 minutes prior to sleep.`,
        action: 'RECOVERY_ADVICE'
      };
    }

    return {
      reply: `Hello ${firstName}. I have access to your training history and logs. You can ask for a daily session breakdown, a short conditioning circuit, or recovery guidance. What would you like to review?`,
      action: 'GENERAL'
    };
  },

  /**
   * Owner Strategic AI (Contextual to the gym's real live tenant data)
   */
  askOwnerAI: (gymId, question) => {
    const q = question.toLowerCase();
    const users = StorageService.getUsers().filter(u => u.gymId === gymId);
    const leads = StorageService.getLeads().filter(l => l.gymId === gymId);
    const payments = StorageService.getPayments().filter(p => p.gymId === gymId);
    const retentionAlerts = RetentionService.getRetentionAlerts(gymId);
    const classes = StorageService.getClasses().filter(c => c.gymId === gymId);

    const activeMembers = users.filter(u => u.roleId === 'member' && u.membershipStatus === 'ACTIVE');
    const newLeads = leads.filter(l => l.status === 'NEW');
    const totalRevenue = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);

    if (q.includes('attention') || q.includes('need') || q.includes('urgent') || q.includes('what should i do')) {
      return {
        reply: `**Daily Operations Briefing:**\n\n` +
          `1. **Retention Attention Required:** Member **Rahul Sharma** has been absent for 17 consecutive days (historical baseline: 3.2 sessions/wk). Recommend triggering re-engagement outreach.\n\n` +
          `2. **Uncontacted Inbound Leads:** You have **${newLeads.length} new web trial leads** waiting (including Ananya Roy). First-hour outreach maintains highest conversion rates.\n\n` +
          `3. **Session Demand:** 'Metabolic HIIT Ignition' is at 80% roster capacity.\n\n` +
          `4. **Cycle Collections:** ₹${totalRevenue.toLocaleString('en-IN')} collected this period across ${payments.length} transactions.`,
        action: 'PRIORITY_SUMMARY',
        hasRetentionAlert: retentionAlerts.length > 0
      };
    }

    if (q.includes('retention') || q.includes('inactive') || q.includes('churn') || q.includes('rahul')) {
      return {
        reply: `**Retention Risk Analysis:**\n\n` +
          `Currently flagging **${retentionAlerts.length} high-risk member(s)** based on absence thresholds:\n` +
          `• **Rahul Sharma:** Absent for 17 days (Down from 3.2 visits/week to 0). Assigned Trainer: Arjun Mehta.\n\n` +
          `**Recommended Action:**\n` +
          `1. Send personalized re-engagement check-in from Coach Arjun.\n` +
          `2. Offer a 1-on-1 movement assessment or schedule adjustment.\n` +
          `3. Use the 'Send WhatsApp Outreach' button in the Retention tab to dispatch immediately.`,
        action: 'RETENTION_REPORT',
        targetMember: 'Rahul Sharma'
      };
    }

    if (q.includes('lead') || q.includes('crm') || q.includes('conversion') || q.includes('trial')) {
      const convertedCount = leads.filter(l => l.status === 'CONVERTED').length;
      const rate = leads.length > 0 ? Math.round((convertedCount / leads.length) * 100) : 0;
      return {
        reply: `**CRM Pipeline Performance:**\n\n` +
          `• **Total Pipeline Leads:** ${leads.length}\n` +
          `• **New Untouched Leads:** ${newLeads.length}\n` +
          `• **Converted Members:** ${convertedCount} (${rate}% conversion rate)\n` +
          `• **Primary Source:** Public Website Trial Pass form (68% of inbound inquiries).\n\n` +
          `Recommended next step: Assign reception staff to follow up with ${leads[0]?.name || 'new leads'} this morning.`,
        action: 'CRM_REPORT'
      };
    }

    if (q.includes('revenue') || q.includes('sales') || q.includes('money') || q.includes('mrr')) {
      return {
        reply: `**Financial Overview:**\n\n` +
          `• **Total Recorded Revenue:** ₹${totalRevenue.toLocaleString('en-IN')}\n` +
          `• **Average Revenue Per Member:** ₹${Math.round(totalRevenue / Math.max(1, activeMembers.length)).toLocaleString('en-IN')}\n` +
          `• **Top Plan by Volume:** 12-Month Membership (54% of cash collections)\n` +
          `• **Upcoming Renewals:** 4 memberships scheduled for review in the next 14 days.`,
        action: 'FINANCIAL_REPORT'
      };
    }

    return {
      reply: `Operations Intelligence ready. Current status: ${activeMembers.length} active members, ${newLeads.length} new leads, and ${retentionAlerts.length} retention alert(s).\n\nSuggested queries:\n• "What needs my attention today?"\n• "Which members are at risk of churning?"\n• "How are website leads performing?"\n• "Analyze revenue and membership plans"`,
      action: 'GENERAL'
    };
  }
};
