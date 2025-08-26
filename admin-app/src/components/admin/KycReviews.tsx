import React, { useEffect, useState } from 'react';
import Card from '../ui/card';
import Button from '../ui/button';
import { Badge } from '../ui/Badge';
import Spinner from '../ui/Spinner';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

interface KycUser {
  _id: string;
  name: string;
  email: string;
  kyc?: {
    status: 'not_submitted' | 'pending' | 'approved' | 'rejected';
    submittedAt?: string;
    reviewedAt?: string;
    adminNotes?: string;
  };
}

const KycReviews: React.FC = () => {
  const [users, setUsers] = useState<KycUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [targetAction, setTargetAction] = useState<'approve' | 'reject' | null>(null);
  const [notesError, setNotesError] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/kyc/pending');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setUsers([]);
      setError(err.response?.data?.msg || 'Failed to fetch pending KYC users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const openNotesModal = (userId: string, action: 'approve' | 'reject') => {
    setTargetUserId(userId);
    setTargetAction(action);
    setNotes('');
    setNotesError(null);
    setShowNotesModal(true);
  };

  const submitAction = async () => {
    if (!targetUserId || !targetAction) return;
    // Notes are optional; allow empty
    setActionLoading(`${targetAction}-${targetUserId}`);
    try {
      const endpoint = targetAction === 'approve' ? `/api/admin/kyc/${targetUserId}/approve` : `/api/admin/kyc/${targetUserId}/reject`;
      await api.post(endpoint, { adminNotes: notes.trim() || undefined });
      // Update list locally by removing processed user
      setUsers(prev => prev.filter(u => u._id !== targetUserId));
      setShowNotesModal(false);
      setTargetUserId(null);
      setTargetAction(null);
      setNotes('');
      setNotesError(null);
    } catch (err: any) {
      setNotesError(err.response?.data?.msg || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Card title="KYC Reviews">
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <button
              onClick={fetchPending}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">No pending KYC submissions</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.kyc?.submittedAt ? formatDate(user.kyc.submittedAt) : '—'}</td>
                    <td>
                      <Badge variant="warning">{user.kyc?.status || 'pending'}</Badge>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          size="sm"
                          variant="success"
                          disabled={!!actionLoading}
                          onClick={() => openNotesModal(user._id, 'approve')}
                        >
                          {actionLoading === `approve-${user._id}` ? 'Approving...' : 'Approve'}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          disabled={!!actionLoading}
                          onClick={() => openNotesModal(user._id, 'reject')}
                        >
                          {actionLoading === `reject-${user._id}` ? 'Rejecting...' : 'Reject'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showNotesModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: 'white', padding: 32, borderRadius: 8, minWidth: 350, maxWidth: 420 }}>
            <h2 style={{ marginBottom: 16 }}>{targetAction === 'approve' ? 'Approve KYC' : 'Reject KYC'}</h2>
            <label htmlFor="kyc-notes" style={{ display: 'block', marginBottom: 8 }}>Admin notes (optional):</label>
            <textarea
              id="kyc-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', marginBottom: 8 }}
              placeholder="Add any notes for the user record"
              disabled={!!actionLoading}
            />
            {notesError && <div style={{ color: 'red', marginBottom: 8 }}>{notesError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => { setShowNotesModal(false); setTargetUserId(null); setTargetAction(null); setNotes(''); setNotesError(null); }}
                style={{ padding: '0.5rem 1rem', borderRadius: 4, border: 'none', background: '#e5e7eb', color: '#111', cursor: 'pointer' }}
                disabled={!!actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                style={{ padding: '0.5rem 1rem', borderRadius: 4, border: 'none', background: targetAction === 'approve' ? '#16a34a' : '#ef4444', color: 'white', cursor: 'pointer' }}
                disabled={!!actionLoading}
              >
                {actionLoading ? (targetAction === 'approve' ? 'Approving...' : 'Rejecting...') : (targetAction === 'approve' ? 'Approve' : 'Reject')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KycReviews;
