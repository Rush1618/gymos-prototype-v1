// CRM Lead Service: Visitor Free Trial -> Lead -> Pipeline -> Conversion to Member
import { StorageService } from './storageService';
import { AuditService } from './auditService';

export const LeadService = {
  getLeadsByGym: (gymId) => {
    const leads = StorageService.getLeads();
    return leads.filter(l => l.gymId === gymId);
  },

  createLeadFromPublicWebsite: ({ gymId, name, phone, email, goal, source = 'Website Free Trial' }) => {
    const leads = StorageService.getLeads();
    const newLead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 3)}`,
      gymId,
      name,
      phone,
      email,
      goal: goal || 'General Fitness & Energy',
      source,
      status: 'NEW',
      assignedStaff: 'Front Desk',
      notes: `Captured via public landing page free trial form on ${new Date().toLocaleDateString()}`,
      nextFollowUp: 'Today, within 2 hours',
      createdAt: new Date().toISOString()
    };

    StorageService.saveLeads([newLead, ...leads]);

    // Create notification for the gym staff
    const notifs = StorageService.getNotifications();
    const newNotif = {
      id: `notif_${Date.now()}`,
      gymId,
      title: `🔥 New Free Trial Lead: ${name}`,
      message: `${name} (${phone}) requested a Free Trial for '${newLead.goal}'.`,
      type: 'NEW_LEAD',
      isRead: false,
      timestamp: 'Just now'
    };
    StorageService.saveNotifications([newNotif, ...notifs]);

    return newLead;
  },

  updateLeadStatus: (leadId, newStatus, currentActor) => {
    const leads = StorageService.getLeads();
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return null;

    const oldStatus = lead.status;
    lead.status = newStatus;
    StorageService.saveLeads(leads);

    AuditService.log({
      actorName: currentActor?.name || 'Staff',
      actorRole: currentActor?.roleId?.toUpperCase() || 'STAFF',
      action: 'LEAD_STATUS_CHANGED',
      gymId: lead.gymId,
      details: `Moved lead ${lead.name} from '${oldStatus}' to '${newStatus}'`
    });

    return lead;
  },

  /**
   * 1-Click Conversion: Converts a qualified CRM Lead into an Active Gym Member!
   */
  convertLeadToMember: (leadId, planId, trainerId, currentActor) => {
    const leads = StorageService.getLeads();
    const lead = leads.find(l => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    lead.status = 'CONVERTED';
    StorageService.saveLeads(leads);

    // Fetch plan details
    const plans = StorageService.getPlans();
    const plan = plans.find(p => p.id === planId) || plans[0];

    // Create new Member User
    const users = StorageService.getUsers();
    const randomPassNum = Math.floor(1000 + Math.random() * 9000);
    const newMemberId = `user_member_${Date.now().toString().slice(-6)}`;
    
    const newMember = {
      id: newMemberId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      roleId: 'member',
      gymId: lead.gymId,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      status: 'ACTIVE',
      membershipPlan: plan ? plan.name : '1-Month Standard',
      membershipStatus: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
      lastVisitDaysAgo: 0,
      historicalVisitsPerWeek: 3.0,
      currentVisitsThisWeek: 0,
      retentionRisk: 'HEALTHY',
      assignedTrainerId: trainerId || 'user_trainer_arjun',
      passId: `PASS-IP-${randomPassNum}`,
      healthGoals: lead.goal
    };

    StorageService.saveUsers([newMember, ...users]);

    // Record initial membership payment
    const payments = StorageService.getPayments();
    const newPayment = {
      id: `pay_${Date.now()}`,
      gymId: lead.gymId,
      memberId: newMemberId,
      memberName: lead.name,
      amount: plan ? plan.price : 3500,
      planName: plan ? plan.name : '1-Month Standard',
      method: 'UPI',
      status: 'PAID',
      invoiceNo: `INV-IP-${new Date().getFullYear()}-${randomPassNum}`,
      date: new Date().toISOString().split('T')[0]
    };
    StorageService.savePayments([newPayment, ...payments]);

    // Audit log
    AuditService.log({
      actorName: currentActor?.name || 'Owner/Staff',
      actorRole: currentActor?.roleId?.toUpperCase() || 'STAFF',
      action: 'LEAD_CONVERTED_TO_MEMBER',
      gymId: lead.gymId,
      targetUser: newMember.name,
      details: `Converted lead ${lead.name} into full active member enrolled in ${plan?.name || 'Standard'} (Pass: ${newMember.passId})`
    });

    return { lead, member: newMember, payment: newPayment };
  }
};
