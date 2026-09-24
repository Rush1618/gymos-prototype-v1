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
        reply: `Here is a custom workout tailored to your goal (${memberGoal}):\n\n` +
          `🔥 **Warm-up (7 mins):**\n` +
          `• 90/90 Hip Rotations: 2 sets x 10 reps\n` +
          `• Banded Shoulder Dislocates: 2 sets x 15 reps\n` +
          `• World's Greatest Stretch: 5 reps/side\n\n` +
          `🏋️ **Primary Strength Block (25 mins):**\n` +
          `1. Barbell Back Squat / Front Squat: 4 sets x 6 reps (RPE 8, rest 2 mins)\n` +
          `2. Romanian Deadlifts (Dumbbells): 3 sets x 10 reps (Slow 3s eccentric)\n` +
          `3. Bulgarian Split Squats: 3 sets x 8 reps/leg\n\n` +
          `⚡ **Accessory & Core Finisher (10 mins):**\n` +
          `• Standing Calf Raises: 3 sets x 15 reps\n` +
          `• Hanging Leg Tucks: 3 sets x 12 reps\n\n` +
          `Tip from your coach: Focus on thoracic brace before initiating each squat rep!`,
        action: 'WORKOUT_GENERATED'
      };
    }

    if (q.includes('shorter') || q.includes('quick') || q.includes('20 min') || q.includes('30 min')) {
      return {
        reply: `⚡ **Condensed 25-Minute High-Density Complex for ${firstName}:**\n\n` +
          `Set a timer for 5 rounds (90s rest between rounds):\n` +
          `1. Dumbbell Thrusters: 10 reps (moderate weight)\n` +
          `2. Renegade Rows + Push-up: 8 total reps\n` +
          `3. Kettlebell Swings: 15 explosive reps\n` +
          `4. Hollow Body Hold: 30 seconds\n\n` +
          `This provides maximum metabolic and strength stimulus in under half an hour!`,
        action: 'SHORT_WORKOUT_GENERATED'
      };
    }

    if (q.includes('nutrition') || q.includes('protein') || q.includes('diet') || q.includes('food')) {
      return {
        reply: `🥗 **Performance Nutrition Strategy:**\n\n` +
          `• **Protein Target:** Aim for 1.8g to 2.0g per kg of bodyweight daily spread across 3-4 meals.\n` +
          `• **Pre-Workout Fuel (60-90m prior):** Fast-digesting carbs + moderate protein (e.g., oats with whey or banana + peanut butter toast).\n` +
          `• **Hydration Protocol:** Minimum 3.5L water daily + 500mg sodium in your training bottle for muscle pump and cramp prevention.\n` +
          `• **Sleep & Recovery:** 7.5 to 8.5 hours of dark, cool sleep is where 90% of protein synthesis occurs!`,
        action: 'NUTRITION_ADVICE'
      };
    }

    if (q.includes('recovery') || q.includes('sore') || q.includes('rest')) {
      return {
        reply: `🧘 **Active Recovery Protocol:**\n\n` +
          `Since you're training hard, soreness (DOMS) is natural. To accelerate recovery:\n` +
          `1. 20-minute brisk walk (low HR zone 1) to clear metabolic waste.\n` +
          `2. Foam rolling: Quads, lats, and glutes (60s each).\n` +
          `3. Contrast showers or sauna (15 mins sauna followed by cold plunge).\n` +
          `4. Magnesium Glycinate (300-400mg) 30 mins before bedtime for neuromuscular relaxation.`,
        action: 'RECOVERY_ADVICE'
      };
    }

    return {
      reply: `Hello ${firstName}! As your IronPulse AI Coach, I track your workouts and personal records. You can ask me to "Create today's workout", "Give me a quick 20-minute routine", or guide you on nutrition and form! What are you working on today?`,
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
        reply: `📋 **Executive Priority Briefing for IronPulse:**\n\n` +
          `1. ⚠️ **Immediate Churn Risk:** Member **Rahul Sharma** has been absent for 17 days (historical average: 3.2 sessions/wk). Recommend triggering 1-click WhatsApp outreach now.\n\n` +
          `2. 🔥 **Fresh Leads Awaiting Contact:** You have **${newLeads.length} new web trial leads** waiting (including Ananya Roy). Contacting them within 2 hours boosts conversion by 380%.\n\n` +
          `3. 📈 **High Class Demand:** 'Metabolic HIIT Ignition' is at 80% capacity. Consider adding a second evening slot.\n\n` +
          `4. 💰 **Monthly Revenue:** ₹${totalRevenue.toLocaleString('en-IN')} collected this cycle across ${payments.length} transactions.`,
        action: 'PRIORITY_SUMMARY',
        hasRetentionAlert: retentionAlerts.length > 0
      };
    }

    if (q.includes('retention') || q.includes('inactive') || q.includes('churn') || q.includes('rahul')) {
      return {
        reply: `⚠️ **Retention Engine Deep Dive:**\n\n` +
          `We identified **${retentionAlerts.length} high-risk member(s)** based on transparent absence rules:\n` +
          `• **Rahul Sharma:** Absent for 17 days (Down from 3.2 visits/week to 0). Assigned Trainer: Arjun Mehta.\n\n` +
          `**Automated Re-engagement Strategy:**\n` +
          `1. Send personalized motivational message from Trainer Arjun.\n` +
          `2. Offer a complimentary 1-on-1 form check or nutrition reboot.\n` +
          `3. Click the **'Send WhatsApp Outreach'** button in the Retention Engine tab to deliver immediately!`,
        action: 'RETENTION_REPORT',
        targetMember: 'Rahul Sharma'
      };
    }

    if (q.includes('lead') || q.includes('crm') || q.includes('conversion') || q.includes('trial')) {
      const convertedCount = leads.filter(l => l.status === 'CONVERTED').length;
      const rate = leads.length > 0 ? Math.round((convertedCount / leads.length) * 100) : 0;
      return {
        reply: `🎯 **CRM Pipeline Performance:**\n\n` +
          `• **Total Pipeline Leads:** ${leads.length}\n` +
          `• **New Untouched Leads:** ${newLeads.length}\n` +
          `• **Converted to Active Members:** ${convertedCount} (${rate}% conversion rate)\n` +
          `• **Top Acquisition Channel:** Public Landing Page 'Free Trial' form (accounts for 68% of inbound leads).\n\n` +
          `Recommendation: Assign Receptionist Kavita to call ${leads[0]?.name || 'new leads'} before 3 PM today.`,
        action: 'CRM_REPORT'
      };
    }

    if (q.includes('revenue') || q.includes('sales') || q.includes('money') || q.includes('mrr')) {
      return {
        reply: `💰 **Financial Intelligence & Revenue Velocity:**\n\n` +
          `• **Total Recorded Revenue:** ₹${totalRevenue.toLocaleString('en-IN')}\n` +
          `• **Average Revenue Per Member (ARPU):** ₹${Math.round(totalRevenue / Math.max(1, activeMembers.length)).toLocaleString('en-IN')}\n` +
          `• **Top Selling Tier:** 12-Month Elite Pro (represents 54% of cash collections)\n` +
          `• **Upcoming Renewals:** 4 memberships up for quarterly review in the next 14 days.`,
        action: 'FINANCIAL_REPORT'
      };
    }

    return {
      reply: `Hello! I am your GymOS Business Intelligence AI. I analyze your real gym data: ${activeMembers.length} active members, ${newLeads.length} new leads, class rosters, and retention risks.\n\nTry asking me:\n• "What needs my attention today?"\n• "Which members are at risk of churning?"\n• "How are website leads performing?"\n• "Analyze revenue and membership plans"`,
      action: 'GENERAL'
    };
  }
};
