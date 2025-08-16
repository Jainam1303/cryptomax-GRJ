import React, { useEffect, useState } from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../ui/card';
import Button from '../ui/button';
import { Badge } from '../ui/Badge';
import Spinner from '../ui/Spinner';
import { Copy, Check } from 'lucide-react';
import api from '../../services/api';

const WithdrawalRequests: React.FC = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectError, setRejectError] = useState<string | null>(null);
  
  const fetchWithdrawalRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/withdrawal-requests');
      setWithdrawalRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setWithdrawalRequests([]);
      setError(err.response?.data?.msg || 'Failed to fetch withdrawal requests');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchWithdrawalRequests();
  }, []);

  const handleAction = async (id: string, status: 'approved' | 'rejected' | 'completed') => {
    setActionLoading(id + status);
    try {
      await api.put(`/api/admin/withdrawal-requests/${id}`, { status });
      setWithdrawalRequests((prev) => 
        prev.map((w) => 
          w._id === id ? { ...w, status } : w
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };
  
  const handleReject = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
    setRejectError(null);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      setRejectError('Rejection reason is required.');
      return;
    }
    setActionLoading(rejectingId + 'rejected');
    try {
      await api.put(`/api/admin/withdrawal-requests/${rejectingId}`, { status: 'rejected', adminNotes: rejectReason });
      setWithdrawalRequests((prev) =>
        prev.map((w) =>
          w._id === rejectingId ? { ...w, status: 'rejected', rejectReason } : w
        )
      );
      setShowRejectModal(false);
      setRejectingId(null);
      setRejectReason('');
      setRejectError(null);
    } catch (err: any) {
      setRejectError(err.response?.data?.msg || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'approved':
        return <Badge variant="primary">Approved</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const getAddressText = (request: any) => {
    return typeof request.paymentDetails === 'string'
      ? request.paymentDetails
      : request.paymentDetails?.details ||
        request.paymentDetails?.address ||
        request.paymentDetails?.withdrawalAddress ||
        request.paymentDetails?.walletAddress ||
        request.paymentDetails?.email ||
        request.paymentDetails?.accountNumber ||
        'N/A';
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
      <Card title="Withdrawal Requests">
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <button 
              onClick={fetchWithdrawalRequests}
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
        
        {withdrawalRequests?.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">No withdrawal requests found</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Withdrawal Address</th>
                  <th>Status</th>
                  <th>Requested At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalRequests?.map((request) => (
                  <tr key={request._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-name">
                          {typeof request.user === 'object' ? request.user.name : 'Unknown'}
                        </div>
                        <div className="user-email">
                          {typeof request.user === 'object' ? request.user.email : ''}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="amount">
                        {formatCurrency(request.amount)}
                      </div>
                    </td>
                    <td>
                      <div className="payment-method">
                        {request.paymentMethod.replace('_', ' ')}
                      </div>
                    </td>
                    <td>
                      <div className="address-container">
                        <div className="address-cell">
                          {getAddressText(request)}
                        </div>
                        {getAddressText(request) !== 'N/A' && (
                          <button
                            className="copy-btn"
                            onClick={() => handleCopyAddress(getAddressText(request))}
                          >
                            {copiedAddress === getAddressText(request) ? (
                              <Check className="copy-icon" />
                            ) : (
                              <Copy className="copy-icon" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(request.status)}
                    </td>
                    <td>
                      <div className="date">
                        {formatDate(request.requestedAt)}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              disabled={!!actionLoading}
                              onClick={() => handleAction(request._id, 'approved')}
                            >
                              {actionLoading === request._id + 'approved' ? 'Approving...' : 'Approve'}
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              disabled={!!actionLoading}
                              onClick={() => handleReject(request._id)}
                            >
                              {actionLoading === request._id + 'rejected' ? 'Rejecting...' : 'Reject'}
                            </Button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="primary"
                            disabled={!!actionLoading}
                            onClick={() => handleAction(request._id, 'completed')}
                          >
                            {actionLoading === request._id + 'completed' ? 'Completing...' : 'Complete'}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {/* Modal for rejection reason (simple inline version) */}
      {showRejectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ background: 'white', padding: 32, borderRadius: 8, minWidth: 350, maxWidth: 400 }}>
            <h2 style={{ marginBottom: 16 }}>Reject Withdrawal Request</h2>
            <label htmlFor="reject-reason" style={{ display: 'block', marginBottom: 8 }}>Reason for rejection:</label>
            <textarea
              id="reject-reason"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', marginBottom: 8 }}
              placeholder="Enter reason..."
              disabled={!!actionLoading}
            />
            {rejectError && <div style={{ color: 'red', marginBottom: 8 }}>{rejectError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => { setShowRejectModal(false); setRejectingId(null); setRejectReason(''); setRejectError(null); }}
                style={{ padding: '0.5rem 1rem', borderRadius: 4, border: 'none', background: '#e5e7eb', color: '#111', cursor: 'pointer' }}
                disabled={!!actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                style={{ padding: '0.5rem 1rem', borderRadius: 4, border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer' }}
                disabled={!!actionLoading}
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalRequests; 