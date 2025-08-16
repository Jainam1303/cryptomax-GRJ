import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, DollarSign, Clock, ArrowUp } from 'lucide-react';
import { getDashboardData } from '../../redux/thunks/adminThunks';
import type { RootState, AppDispatch } from '../../redux/store';
import { formatCurrency } from '../../utils/formatters';
import Card from '../ui/card';
import Spinner from '../ui/Spinner';
import type { Transaction } from '../../types';

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboardData, loading, error } = useSelector((state: RootState) => state.admin);

  // All hooks must be called before any return
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');

  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-danger-500">{error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No dashboard data available.</p>
      </div>
    );
  }
  const data = dashboardData;
  
  // Use correct paths for financials
  const financials = data.financials || {};
  const recentTransactions = data.recentTransactions || [];

  // Filtered transactions
  const filteredTransactions = recentTransactions.filter((tx: any) => {
    const matchesSearch =
      searchTerm === '' ||
      (tx.user && tx.user.name && tx.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.type && tx.type.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesType;
  });
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Users</span>
            <Users className="stat-card-icon" />
          </div>
          <p className="stat-card-value">{data.userCount}</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Deposits</span>
            <DollarSign className="stat-card-icon" style={{ color: '#059669' }} />
          </div>
          <p className="stat-card-value">{formatCurrency(financials.totalDeposits)}</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Withdrawals</span>
            <DollarSign className="stat-card-icon" style={{ color: '#dc2626' }} />
          </div>
          <p className="stat-card-value">{formatCurrency(financials.totalWithdrawals)}</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Pending Withdrawals</span>
            <Clock className="stat-card-icon" style={{ color: '#d97706' }} />
          </div>
          <p className="stat-card-value">{financials.pendingWithdrawals}</p>
        </div>
      </div>

      {/* Investment and Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="card-header">
            <div className="flex items-center">
              <ArrowUp className="h-6 w-6 mr-3" style={{ color: '#d97706' }} />
              <h3 className="card-title">Investment Overview</h3>
            </div>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Investments:</span>
                <span className="font-medium">{financials.activeInvestments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Investment Amount:</span>
                <span className="font-medium">{formatCurrency(financials.totalInvestmentAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Investment:</span>
                <span className="font-medium">{financials.averageInvestment ?? '-'}</span>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="card-header">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 mr-3" style={{ color: '#2563eb' }} />
              <h3 className="card-title">Financial Summary</h3>
            </div>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Revenue:</span>
                <span className="font-medium">{financials.totalRevenue !== undefined ? formatCurrency(financials.totalRevenue) : '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Payouts:</span>
                <span className="font-medium">{financials.totalPayouts !== undefined ? formatCurrency(financials.totalPayouts) : '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Net Balance:</span>
                <span className={`font-medium ${financials.netBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>{financials.netBalance !== undefined ? formatCurrency(financials.netBalance) : '-'}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions Search/Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2 mt-6">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by user or type..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">All Types</option>
            <option value="investment">Investment</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="profit">Profit</option>
            <option value="loss">Loss</option>
          </select>
        </div>
        {/* Future: Add a button to fetch all transactions */}
        {/* <button className="btn btn-outline btn-sm">View All Transactions</button> */}
      </div>

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No recent transactions</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction: Transaction) => (
                  <tr key={transaction._id}>
                    <td>{typeof transaction.user === 'object' ? transaction.user.name : 'Unknown'}</td>
                    <td>
                      <span className={`status-badge ${
                        transaction.type === 'deposit' || transaction.type === 'profit'
                          ? 'status-approved'
                          : transaction.type === 'withdrawal' || transaction.type === 'loss'
                          ? 'status-rejected'
                          : 'status-pending'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td>{formatCurrency(transaction.amount)}</td>
                    <td>
                      <span className={`status-badge ${
                        transaction.status === 'completed'
                          ? 'status-approved'
                          : transaction.status === 'pending'
                          ? 'status-pending'
                          : 'status-rejected'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
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

export default AdminDashboard; 