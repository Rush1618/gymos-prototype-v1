import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { PaymentService } from '../../services/paymentService';
import { CreditCard, Plus, Search, RotateCcw, Check, X, ShieldAlert } from 'lucide-react';

export const PaymentsView = () => {
  const { activeGym, activeUser, canPerformAction, canViewFeature, refreshData, addToast } = useApp();
  const [payments, setPayments] = useState(() => PaymentService.getPaymentsByGym(activeGym.id));
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [search, setSearch] = useState('');

  const members = StorageService.getUsers().filter(u => u.roleId === 'member' && u.gymId === activeGym.id);

  const [form, setForm] = useState({
    memberId: members[0]?.id || '',
    amount: 3500,
    planName: '1-Month Standard',
    method: 'UPI',
    status: 'PAID'
  });

  const canRefund = canPerformAction('payment.refund');
  const canSeeTotals = canViewFeature('payment.viewRevenueSummary');

  const totalCollected = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);

  const handleRecordSubmit = (e) => {
    e.preventDefault();
    const mem = members.find(m => m.id === form.memberId) || members[0];

    PaymentService.recordPayment({
      gymId: activeGym.id,
      memberId: mem?.id || 'guest',
      memberName: mem?.name || 'Walk-in Guest',
      amount: form.amount,
      planName: form.planName,
      method: form.method,
      status: form.status
    }, activeUser);

    setPayments(PaymentService.getPaymentsByGym(activeGym.id));
    refreshData();
    setShowRecordModal(false);
    addToast('Payment recorded successfully', 'success');
  };

  const handleRefund = (paymentId) => {
    if (!canRefund) {
      addToast('Permission Denied: Your role is not authorized to issue refunds.', 'danger');
      return;
    }

    if (window.confirm('Issue full refund for this transaction?')) {
      PaymentService.refundPayment(paymentId, activeUser);
      setPayments(PaymentService.getPaymentsByGym(activeGym.id));
      refreshData();
      addToast('Payment marked as REFUNDED', 'info');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Invoices & Billing Transactions</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Track member subscription payments, record transactions, and process role-authorized refunds across UPI, Card, and Net Banking.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowRecordModal(true)}>
          <Plus size={16} />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* Revenue Card if permitted */}
      {canSeeTotals && (
        <div className="stat-card" style={{ maxWidth: '340px', marginBottom: '24px' }}>
          <div className="stat-header">
            <span className="stat-title">Total Cash Collected</span>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div className="stat-value">₹{totalCollected.toLocaleString('en-IN')}</div>
          <div className="stat-meta positive">
            <span>Across {payments.length} billing records</span>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice # & Date</th>
              <th>Member Name</th>
              <th>Plan Description</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td>
                  <strong>{p.invoiceNo}</strong>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.date}</div>
                </td>

                <td>
                  <strong>{p.memberName}</strong>
                </td>

                <td>{p.planName}</td>

                <td>
                  <span className="badge badge-info">{p.method}</span>
                </td>

                <td>
                  <strong>₹{p.amount.toLocaleString('en-IN')}</strong>
                </td>

                <td>
                  <span className={`badge ${p.status === 'PAID' ? 'badge-success' : p.status === 'REFUNDED' ? 'badge-danger' : 'badge-warning'}`}>
                    {p.status}
                  </span>
                </td>

                <td style={{ textAlign: 'right' }}>
                  {p.status === 'PAID' && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleRefund(p.id)}
                      disabled={!canRefund}
                      title={!canRefund ? 'Refund action denied by permissions' : 'Process Refund'}
                      style={{ opacity: !canRefund ? 0.5 : 1, fontSize: '11px', padding: '4px 8px' }}
                    >
                      <RotateCcw size={12} />
                      <span>Refund</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      {showRecordModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Record Membership Payment</h2>
              <button onClick={() => setShowRecordModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRecordSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Member</label>
                  <select 
                    className="form-select"
                    value={form.memberId}
                    onChange={(e) => setForm({ ...form, memberId: e.target.value })}
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.phone})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Amount (₹)</label>
                    <input 
                      type="number" 
                      className="form-input"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Payment Mode</label>
                    <select 
                      className="form-select"
                      value={form.method}
                      onChange={(e) => setForm({ ...form, method: e.target.value })}
                    >
                      <option value="UPI">UPI (Google Pay / PhonePe)</option>
                      <option value="CARD">Credit / Debit Card</option>
                      <option value="CASH">Cash Over Counter</option>
                      <option value="BANK_TRANSFER">Bank IMPS / NEFT</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Membership Tier</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={form.planName}
                    onChange={(e) => setForm({ ...form, planName: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRecordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
