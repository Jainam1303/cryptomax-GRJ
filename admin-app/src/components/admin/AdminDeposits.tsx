import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Card from '../ui/card';
import Spinner from '../ui/Spinner';
import Button from '../ui/button';
import { Input } from '../ui/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AdminDeposits: React.FC = () => {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [coinFilter, setCoinFilter] = useState('');
  
  // Get user from auth context
  const { user } = useAuth();

  const fetchDeposits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/admin/deposit-requests');
      setDeposits(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setDeposits([]);
      setError(err.response?.data?.msg || 'Failed to fetch deposits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDeposits();
    } else {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
    }
  }, [user]);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading(id + status);
    try {
      await api.put(`/api/admin/deposit-requests/${id}`, { status });
      setDeposits((prev) => prev.filter((d) => d._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  // Unique coins for filter dropdown
  const coins = useMemo(() => {
    const set = new Set(deposits.map((d) => d.currency || 'USDT'));
    return Array.from(set);
  }, [deposits]);

  // Defensive: always use array for filtering/mapping
  const filteredDeposits = useMemo(() => {
    const arr = Array.isArray(deposits) ? deposits : [];
    return arr.filter((tx) => {
      const searchText = search.toLowerCase();
      const matchesSearch =
        tx.user?.name?.toLowerCase().includes(searchText) ||
        tx.user?.email?.toLowerCase().includes(searchText) ||
        (tx.txid || '').toLowerCase().includes(searchText) ||
        (tx.currency || 'USDT').toLowerCase().includes(searchText);
      const matchesCoin = !coinFilter || (tx.currency || 'USDT') === coinFilter;
      return matchesSearch && matchesCoin;
    });
  }, [deposits, search, coinFilter]);

  return (
    <div className="space-y-6">
      <Card title="Pending Deposits">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by user, email, TXID, coin..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="sm:w-48">
            <select
              className="select-field"
              value={coinFilter}
              onChange={e => setCoinFilter(e.target.value)}
            >
              <option value="">All Coins</option>
              {coins.map((coin) => (
                <option key={coin} value={coin}>{coin}</option>
              ))}
            </select>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-danger-500">{error}</p>
            {error.includes('Access denied') && (
              <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
                <p className="text-yellow-800 text-sm">
                  <strong>To set admin role:</strong> Open browser console and run:
                  <br />
                  <code className="bg-gray-200 px-2 py-1 rounded">
                    let user = JSON.parse(localStorage.getItem('user')); user.role = 'admin'; localStorage.setItem('user', JSON.stringify(user)); location.reload();
                  </code>
                </p>
              </div>
            )}
          </div>
        ) : filteredDeposits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No pending deposits</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Coin</th>
                  <th>TXID</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeposits.map((tx) => (
                  <tr key={tx._id}>
                    <td>{tx.user?.name || 'Unknown'}</td>
                    <td>{tx.user?.email || ''}</td>
                    <td>{formatCurrency(tx.amount)}</td>
                    <td>{tx.currency || 'USDT'}</td>
                    <td>{tx.txid || '-'}</td>
                    <td>{formatDate(tx.createdAt, true)}</td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          size="sm"
                          variant="success"
                          disabled={!!actionLoading}
                          onClick={() => handleAction(tx._id, 'approved')}
                        >
                          {actionLoading === tx._id + 'approved' ? 'Approving...' : 'Approve'}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          disabled={!!actionLoading}
                          onClick={() => handleAction(tx._id, 'rejected')}
                        >
                          {actionLoading === tx._id + 'rejected' ? 'Rejecting...' : 'Reject'}
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
    </div>
  );
};

export default AdminDeposits; 