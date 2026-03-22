import { DollarSign, TrendingUp, Users, AlertCircle, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { saveData, loadData, generateId } from '../utils/adminData';

export default function TroopFinances() {
  const navigate = useNavigate();

  // Auth guard
  const [user, setUser] = useState(null);
  useEffect(() => {
    const stored = sessionStorage.getItem('loggedInUser');
    if (!stored) {
      navigate('/member-login');
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed.profile !== 'leader') {
        navigate('/member-login');
        return;
      }
    } catch {
      navigate('/member-login');
      return;
    }
  }, [navigate]);

  // State
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [dues, setDues] = useState(() => loadData('troopDues', []));
  const [payments, setPayments] = useState(() => loadData('troopPayments', []));
  const [scouts, setScouts] = useState(() => loadData('troopScouts', [
    { id: 1, name: 'John Smith', rank: 'Star Scout', email: 'john@example.com' },
    { id: 2, name: 'Mike Johnson', rank: 'Life Scout', email: 'mike@example.com' },
    { id: 3, name: 'Sarah Davis', rank: 'First Class', email: 'sarah@example.com' },
    { id: 4, name: 'Tom Wilson', rank: 'Tenderfoot', email: 'tom@example.com' },
    { id: 5, name: 'Lisa Brown', rank: 'Scout', email: 'lisa@example.com' }
  ]));

  const [newDueForm, setNewDueForm] = useState({ scoutId: '', amount: '', dueDate: '', description: '' });
  const [newPaymentForm, setNewPaymentForm] = useState({ scoutId: '', amount: '', paymentDate: '', method: 'cash', notes: '' });
  const [editingDue, setEditingDue] = useState(null);

  // Calculate statistics
  const totalDues = dues.reduce((sum, due) => sum + parseFloat(due.amount || 0), 0);
  const totalPaid = payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);
  const outstandingDues = totalDues - totalPaid;
  const scoutsWithDues = new Set(dues.map(d => d.scoutId)).size;
  const paidScouts = new Set(payments.map(p => p.scoutId)).size;

  // Get scout name by ID
  const getScoutName = (scoutId) => {
    const scout = scouts.find(s => s.id == scoutId);
    return scout ? scout.name : 'Unknown';
  };

  // Handlers
  const handleAddDue = () => {
    if (!newDueForm.scoutId || !newDueForm.amount || !newDueForm.dueDate) {
      alert('Please fill in all required fields');
      return;
    }
    const newDue = {
      id: generateId(),
      ...newDueForm,
      createdAt: new Date().toISOString()
    };
    const updated = [...dues, newDue];
    setDues(updated);
    saveData('troopDues', updated);
    setNewDueForm({ scoutId: '', amount: '', dueDate: '', description: '' });
  };

  const handleDeleteDue = (dueId) => {
    const updated = dues.filter(d => d.id !== dueId);
    setDues(updated);
    saveData('troopDues', updated);
  };

  const handleAddPayment = () => {
    if (!newPaymentForm.scoutId || !newPaymentForm.amount || !newPaymentForm.paymentDate) {
      alert('Please fill in all required fields');
      return;
    }
    const newPayment = {
      id: generateId(),
      ...newPaymentForm,
      createdAt: new Date().toISOString()
    };
    const updated = [...payments, newPayment];
    setPayments(updated);
    saveData('troopPayments', updated);
    setNewPaymentForm({ scoutId: '', amount: '', paymentDate: '', method: 'cash', notes: '' });
  };

  const handleDeletePayment = (paymentId) => {
    const updated = payments.filter(p => p.id !== paymentId);
    setPayments(updated);
    saveData('troopPayments', updated);
  };

  // Get dues for a scout
  const getScoutDues = (scoutId) => {
    return dues.filter(d => d.scoutId == scoutId);
  };

  // Get payments for a scout
  const getScoutPayments = (scoutId) => {
    return payments.filter(p => p.scoutId == scoutId);
  };

  // Calculate scout balance
  const getScoutBalance = (scoutId) => {
    const scoutDues = getScoutDues(scoutId);
    const scoutPayments = getScoutPayments(scoutId);
    const dueAmount = scoutDues.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
    const paidAmount = scoutPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    return dueAmount - paidAmount;
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: `1px solid var(--divider)`, padding: '16px 24px', marginBottom: 32 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <button
            onClick={() => navigate('/leader-dashboard')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: 'transparent',
              border: `1px solid var(--accent)`,
              color: 'var(--accent)',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
              marginBottom: 16,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 214, 143, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            <ArrowLeft size={20} />
            Back </button>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
              <DollarSign size={32} style={{ color: 'var(--accent)' }} />
              Troop 242 Finances
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: '8px 0 0 0', fontSize: '0.95rem' }}>
              Manage dues, payments, and financial records
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Dashboard Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            marginBottom: 48
          }}
        >
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <DollarSign size={24} style={{ color: 'var(--accent)' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Dues</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', margin: 0 }}>
              ${totalDues.toFixed(2)}
            </p>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <TrendingUp size={24} style={{ color: '#52b788' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Paid</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#52b788', margin: 0 }}>
              ${totalPaid.toFixed(2)}
            </p>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <AlertCircle size={24} style={{ color: '#d4a853' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Outstanding</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#d4a853', margin: 0 }}>
              ${outstandingDues.toFixed(2)}
            </p>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Users size={24} style={{ color: '#6496c8' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Scouts with Dues</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#6496c8', margin: 0 }}>
              {scoutsWithDues}
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, borderBottom: '1px solid var(--divider)', paddingBottom: 16, flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedTab('dashboard')}
            style={{
              padding: '10px 20px',
              background: selectedTab === 'dashboard' ? 'rgba(0, 214, 143, 0.2)' : 'transparent',
              border: selectedTab === 'dashboard' ? '1px solid var(--accent)' : '1px solid var(--divider)',
              color: selectedTab === 'dashboard' ? 'var(--accent)' : 'var(--text-muted)',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setSelectedTab('dues')}
            style={{
              padding: '10px 20px',
              background: selectedTab === 'dues' ? 'rgba(0, 214, 143, 0.2)' : 'transparent',
              border: selectedTab === 'dues' ? '1px solid var(--accent)' : '1px solid var(--divider)',
              color: selectedTab === 'dues' ? 'var(--accent)' : 'var(--text-muted)',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            📋 Dues ({dues.length})
          </button>
          <button
            onClick={() => setSelectedTab('payments')}
            style={{
              padding: '10px 20px',
              background: selectedTab === 'payments' ? 'rgba(0, 214, 143, 0.2)' : 'transparent',
              border: selectedTab === 'payments' ? '1px solid var(--accent)' : '1px solid var(--divider)',
              color: selectedTab === 'payments' ? 'var(--accent)' : 'var(--text-muted)',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            💳 Payments ({payments.length})
          </button>
          <button
            onClick={() => setSelectedTab('scouts')}
            style={{
              padding: '10px 20px',
              background: selectedTab === 'scouts' ? 'rgba(0, 214, 143, 0.2)' : 'transparent',
              border: selectedTab === 'scouts' ? '1px solid var(--accent)' : '1px solid var(--divider)',
              color: selectedTab === 'scouts' ? 'var(--accent)' : 'var(--text-muted)',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            👥 Scouts
          </button>
        </div>

        {/* DASHBOARD TAB */}
        {selectedTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24 }}>
              {/* Summary Cards */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>Financial Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--divider)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Total Dues Owed:</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '1.1rem' }}>${totalDues.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--divider)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Total Payments:</span>
                    <span style={{ color: '#52b788', fontWeight: 600, fontSize: '1.1rem' }}>${totalPaid.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Outstanding Balance:</span>
                    <span style={{ color: outstandingDues > 0 ? '#d4a853' : '#52b788', fontWeight: 600, fontSize: '1.1rem' }}>${outstandingDues.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Collection Rate */}
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>Collection Status</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Collection Rate</span>
                      <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                        {totalDues > 0 ? ((totalPaid / totalDues) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div style={{
                      height: 8,
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${totalDues > 0 ? (totalPaid / totalDues) * 100 : 0}%`,
                        background: 'linear-gradient(90deg, var(--accent), #52b788)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--divider)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Scouts Paid:</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{paidScouts}/{scoutsWithDues}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* DUES TAB */}
        {selectedTab === 'dues' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Add Due Form */}
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: 32, marginBottom: 32 }}
            >
              <h3 style={{ color: 'var(--text-primary)', marginBottom: 24, marginTop: 0 }}>➕ Add New Due</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
                <select
                  value={newDueForm.scoutId}
                  onChange={(e) => setNewDueForm({ ...newDueForm, scoutId: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--input-bg)',
                    border: `1px solid var(--input-border)`,
                    color: 'var(--text-primary)',
                    borderRadius: 8,
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="">Select Scout</option>
                  {scouts.map(scout => (
                    <option key={scout.id} value={scout.id} style={{ background: 'var(--bg-primary)' }}>
                      {scout.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={newDueForm.amount}
                  onChange={(e) => setNewDueForm({ ...newDueForm, amount: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--input-bg)',
                    border: `1px solid var(--input-border)`,
                    color: 'var(--text-primary)',
                    borderRadius: 8,
                    fontFamily: 'inherit'
                  }}
                />
                <input
                  type="date"
                  value={newDueForm.dueDate}
                  onChange={(e) => setNewDueForm({ ...newDueForm, dueDate: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--input-bg)',
                    border: `1px solid var(--input-border)`,
                    color: 'var(--text-primary)',
                    borderRadius: 8,
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <input
                type="text"
                placeholder="Description (optional)"
                value={newDueForm.description}
                onChange={(e) => setNewDueForm({ ...newDueForm, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--input-bg)',
                  border: `1px solid var(--input-border)`,
                  color: 'var(--text-primary)',
                  borderRadius: 8,
                  fontFamily: 'inherit',
                  marginBottom: 16
                }}
              />
              <button
                onClick={handleAddDue}
                style={{
                  padding: '12px 32px',
                  background: 'rgba(0, 214, 143, 0.2)',
                  color: 'var(--accent)',
                  border: `1px solid var(--accent)`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                ➕ Add Due
              </button>
            </motion.div>

            {/* Dues List */}
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 20 }}>All Dues</h3>
            {dues.length === 0 ? (
              <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>No dues created yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
                {dues.map((due) => (
                  <motion.div
                    key={due.id}
                    className="glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ padding: 24 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                      <div>
                        <h4 style={{ color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                          {getScoutName(due.scoutId)}
                        </h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                          Due: {new Date(due.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: 'var(--accent)', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
                          ${parseFloat(due.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {due.description && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 12px 0' }}>
                        {due.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleDeleteDue(due.id)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: 'rgba(255, 100, 100, 0.2)',
                          color: '#ff6464',
                          border: '1px solid rgba(255, 100, 100, 0.3)',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Trash2 size={14} style={{ marginRight: 4 }} /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* PAYMENTS TAB */}
        {selectedTab === 'payments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Add Payment Form */}
            <motion.div
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: 32, marginBottom: 32 }}
            >
              <h3 style={{ color: 'var(--text-primary)', marginBottom: 24, marginTop: 0 }}>➕ Record Payment</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
                <select
                  value={newPaymentForm.scoutId}
                  onChange={(e) => setNewPaymentForm({ ...newPaymentForm, scoutId: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--input-bg)',
                    border: `1px solid var(--input-border)`,
                    color: 'var(--text-primary)',
                    borderRadius: 8,
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="">Select Scout</option>
                  {scouts.map(scout => (
                    <option key={scout.id} value={scout.id} style={{ background: 'var(--bg-primary)' }}>
                      {scout.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Amount Paid"
                  value={newPaymentForm.amount}
                  onChange={(e) => setNewPaymentForm({ ...newPaymentForm, amount: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--input-bg)',
                    border: `1px solid var(--input-border)`,
                    color: 'var(--text-primary)',
                    borderRadius: 8,
                    fontFamily: 'inherit'
                  }}
                />
                <input
                  type="date"
                  value={newPaymentForm.paymentDate}
                  onChange={(e) => setNewPaymentForm({ ...newPaymentForm, paymentDate: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--input-bg)',
                    border: `1px solid var(--input-border)`,
                    color: 'var(--text-primary)',
                    borderRadius: 8,
                    fontFamily: 'inherit'
                  }}
                />
                <select
                  value={newPaymentForm.method}
                  onChange={(e) => setNewPaymentForm({ ...newPaymentForm, method: e.target.value })}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--input-bg)',
                    border: `1px solid var(--input-border)`,
                    color: 'var(--text-primary)',
                    borderRadius: 8,
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="cash" style={{ background: 'var(--bg-primary)' }}>Cash</option>
                  <option value="check" style={{ background: 'var(--bg-primary)' }}>Check</option>
                  <option value="paypal" style={{ background: 'var(--bg-primary)' }}>PayPal</option>
                  <option value="venmo" style={{ background: 'var(--bg-primary)' }}>Venmo</option>
                  <option value="other" style={{ background: 'var(--bg-primary)' }}>Other</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Notes (optional)"
                value={newPaymentForm.notes}
                onChange={(e) => setNewPaymentForm({ ...newPaymentForm, notes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--input-bg)',
                  border: `1px solid var(--input-border)`,
                  color: 'var(--text-primary)',
                  borderRadius: 8,
                  fontFamily: 'inherit',
                  marginBottom: 16
                }}
              />
              <button
                onClick={handleAddPayment}
                style={{
                  padding: '12px 32px',
                  background: 'rgba(0, 214, 143, 0.2)',
                  color: 'var(--accent)',
                  border: `1px solid var(--accent)`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                💳 Record Payment
              </button>
            </motion.div>

            {/* Payments List */}
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 20 }}>Payment History</h3>
            {payments.length === 0 ? (
              <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>No payments recorded yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
                {payments.map((payment) => (
                  <motion.div
                    key={payment.id}
                    className="glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ padding: 24 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                      <div>
                        <h4 style={{ color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                          {getScoutName(payment.scoutId)}
                        </h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 8px 0' }}>
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </p>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          background: 'rgba(82, 183, 136, 0.2)',
                          color: '#52b788',
                          borderRadius: 4,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }}>
                          {payment.method}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: '#52b788', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
                          +${parseFloat(payment.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {payment.notes && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 12px 0' }}>
                        {payment.notes}
                      </p>
                    )}
                    <button
                      onClick={() => handleDeletePayment(payment.id)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: 'rgba(255, 100, 100, 0.2)',
                        color: '#ff6464',
                        border: '1px solid rgba(255, 100, 100, 0.3)',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Trash2 size={14} style={{ marginRight: 4 }} /> Delete
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* SCOUTS TAB */}
        {selectedTab === 'scouts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 20 }}>Scout Balances</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
              {scouts.map((scout) => {
                const scoutBalance = getScoutBalance(scout.id);
                const scoutDuesAmount = getScoutDues(scout.id).reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
                const isPaid = scoutBalance <= 0;

                return (
                  <motion.div
                    key={scout.id}
                    className="glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: 24,
                      border: isPaid ? '2px solid #52b788' : '1px solid var(--divider)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                      <div>
                        <h4 style={{ color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                          {scout.name}
                        </h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                          {scout.rank}
                        </p>
                      </div>
                      <span style={{
                        padding: '6px 12px',
                        background: isPaid ? 'rgba(82, 183, 136, 0.2)' : 'rgba(212, 168, 83, 0.2)',
                        color: isPaid ? '#52b788' : '#d4a853',
                        borderRadius: 20,
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {isPaid ? '✓ Paid' : '⏳ Pending'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 12, borderTop: '1px solid var(--divider)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Dues Owed:</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          ${scoutDuesAmount.toFixed(2)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Paid:</span>
                        <span style={{ color: '#52b788', fontWeight: 600 }}>
                          ${(scoutDuesAmount - scoutBalance).toFixed(2)}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: 12,
                        borderTop: '1px solid var(--divider)'
                      }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Balance:</span>
                        <span style={{
                          color: scoutBalance > 0 ? '#d4a853' : '#52b788',
                          fontWeight: 700,
                          fontSize: '1.1rem'
                        }}>
                          {scoutBalance > 0 ? '+' : ''} ${scoutBalance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
