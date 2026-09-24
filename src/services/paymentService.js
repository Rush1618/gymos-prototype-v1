// Simulated Payment and Billing Service
import { StorageService } from './storageService';
import { AuditService } from './auditService';

export const PaymentService = {
  getPaymentsByGym: (gymId) => {
    const payments = StorageService.getPayments();
    return payments.filter(p => p.gymId === gymId);
  },

  recordPayment: (paymentData, currentActor) => {
    const payments = StorageService.getPayments();
    const invoiceNum = `INV-${paymentData.gymId?.substring(4, 6)?.toUpperCase() || 'IP'}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newPayment = {
      id: `pay_${Date.now()}`,
      gymId: paymentData.gymId,
      memberId: paymentData.memberId,
      memberName: paymentData.memberName,
      amount: parseFloat(paymentData.amount) || 0,
      planName: paymentData.planName || 'Gym Membership',
      method: paymentData.method || 'UPI',
      status: paymentData.status || 'PAID',
      invoiceNo: invoiceNum,
      date: new Date().toISOString().split('T')[0]
    };

    StorageService.savePayments([newPayment, ...payments]);

    AuditService.log({
      actorName: currentActor?.name || 'Staff',
      actorRole: currentActor?.roleId?.toUpperCase() || 'STAFF',
      action: 'PAYMENT_RECORDED',
      gymId: paymentData.gymId,
      details: `Collected ${newPayment.amount} via ${newPayment.method} from ${newPayment.memberName} (Inv: ${invoiceNum})`
    });

    return newPayment;
  },

  refundPayment: (paymentId, currentActor) => {
    const payments = StorageService.getPayments();
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) throw new Error('Payment not found');

    payment.status = 'REFUNDED';
    StorageService.savePayments(payments);

    AuditService.log({
      actorName: currentActor?.name || 'Owner',
      actorRole: currentActor?.roleId?.toUpperCase() || 'OWNER',
      action: 'PAYMENT_REFUNDED',
      gymId: payment.gymId,
      details: `Refunded invoice ${payment.invoiceNo} (₹${payment.amount}) for ${payment.memberName}`
    });

    return payment;
  }
};
