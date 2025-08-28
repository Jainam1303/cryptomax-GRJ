import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Edit, 
  CheckCircle, 
  RefreshCw
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import Button from '../ui/button';
import { Input } from '../ui/Input';
import Card from '../ui/card';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../services/api';

interface SubscriptionInvestment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  crypto: {
    _id: string;
    name: string;
    symbol: string;
  };
  investmentPlan: {
    _id: string;
    name: string;
    dailyReturnPercentage: number;
    duration: number;
  };
  amount: number;
  dailyReturnPercentage: number;
  totalReturnPercentage: number;
  duration: number;
  startDate: string;
  endDate: string;
  dailyEarnings: number;
  totalEarnings: number;
  status: string;
  daysElapsed: number;
  daysRemaining: number;
  currentEarnings: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  isActive: boolean;
  isCompleted: boolean;
  createdAt: string;
  // Manual adjustment fields
  manualAdjustment?: {
    amount: number;
    reason: string;
    appliedAt: string | null;
    isActive: boolean;
  };
}

const SubscriptionInvestments: React.FC = () => {
  const [investments, setInvestments] = useState<SubscriptionInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState<SubscriptionInvestment | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Form states
  const [dailyReturnPercentage, setDailyReturnPercentage] = useState('');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      console.log('Fetching subscription investments...');
      const response = await api.get('/api/admin/subscription-investments');
      console.log('Fetched investments:', response.data);
      setInvestments(response.data);
    } catch (error: any) {
      console.error('Error fetching subscription investments:', error);
      alert('Error fetching investments: ' + (error.response?.data?.msg || error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEditDailyReturn = async () => {
    if (!selectedInvestment || !dailyReturnPercentage) {
      console.log('Missing data:', { selectedInvestment: !!selectedInvestment, dailyReturnPercentage });
      return;
    }

    try {
      console.log('Updating daily return for investment:', selectedInvestment._id, 'to:', dailyReturnPercentage);
      
      const response = await api.put(`/api/admin/subscription-investments/${selectedInvestment._id}/daily-return`, {
        dailyReturnPercentage: parseFloat(dailyReturnPercentage)
      });

      console.log('API response:', response.data);

      if (response.data.success) {
        await fetchInvestments();
        setIsEditModalOpen(false);
        setSelectedInvestment(null);
        setDailyReturnPercentage('');
        alert('Daily return updated successfully!');
      } else {
        alert('Failed to update daily return: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Error updating daily return:', error);
      alert('Error updating daily return: ' + (error.response?.data?.msg || error.message || 'Unknown error'));
    }
  };

  const handleManualAdjustment = async () => {
    if (!selectedInvestment || !adjustmentAmount) {
      console.log('Missing data:', { selectedInvestment: !!selectedInvestment, adjustmentAmount });
      return;
    }

    try {
      console.log('Adjusting profit for investment:', selectedInvestment._id, 'amount:', adjustmentAmount);
      
      // Use the new endpoint that doesn't create transaction records
      const response = await api.put(`/api/admin/investments/${selectedInvestment._id}/manual-adjust`, {
        amount: parseFloat(adjustmentAmount),
        reason: adjustmentReason,
        isActive: true // Enable manual adjustment
      });

      console.log('API response:', response.data);

      if (response.data.success) {
        await fetchInvestments();
        setIsAdjustmentModalOpen(false);
        setSelectedInvestment(null);
        setAdjustmentAmount('');
        setAdjustmentReason('');
        alert('Manual profit adjustment applied successfully! (No transaction record created)');
      } else {
        alert('Failed to adjust profit: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Error adjusting profit:', error);
      alert('Error adjusting profit: ' + (error.response?.data?.msg || error.message || 'Unknown error'));
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedInvestment || !newStatus) {
      console.log('Missing data:', { selectedInvestment: !!selectedInvestment, newStatus });
      return;
    }

    try {
      console.log('Updating status for investment:', selectedInvestment._id, 'to:', newStatus);
      
      const response = await api.put(`/api/admin/subscription-investments/${selectedInvestment._id}/status`, {
        status: newStatus,
        adminNotes
      });

      console.log('API response:', response.data);

      if (response.data.success) {
        await fetchInvestments();
        setIsStatusModalOpen(false);
        setSelectedInvestment(null);
        setNewStatus('');
        setAdminNotes('');
        alert('Investment status updated successfully!');
      } else {
        alert('Failed to update status: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert('Error updating status: ' + (error.response?.data?.msg || error.message || 'Unknown error'));
    }
  };

  const handleResetAdjustment = async (investmentId: string) => {
    try {
      console.log('Resetting adjustment for investment:', investmentId);
      
      // Use the new endpoint to disable manual adjustment
      const response = await api.put(`/api/admin/investments/${investmentId}/manual-adjust`, {
        amount: 0,
        reason: 'Reset to calculated values',
        isActive: false // Disable manual adjustment
      });

      console.log('Reset adjustment response:', response.data);

      if (response.data.success) {
        await fetchInvestments();
        alert('Manual adjustment reset successfully! Investment now uses calculated earnings.');
      } else {
        alert('Failed to reset adjustment');
      }
    } catch (error: any) {
      console.error('Error resetting adjustment:', error);
      alert('Error resetting adjustment: ' + (error.response?.data?.msg || error.message || 'Unknown error'));
    }
  };

  const openEditModal = (investment: SubscriptionInvestment) => {
    console.log('Opening edit modal for investment:', investment._id);
    setSelectedInvestment(investment);
    setDailyReturnPercentage(investment.dailyReturnPercentage.toString());
    setIsEditModalOpen(true);
    console.log('Modal state set to true, isEditModalOpen should be true now');
  };

  const openAdjustmentModal = (investment: SubscriptionInvestment) => {
    console.log('Opening adjustment modal for investment:', investment._id);
    setSelectedInvestment(investment);
    setAdjustmentAmount('');
    setAdjustmentReason('');
    setIsAdjustmentModalOpen(true);
  };

  const openStatusModal = (investment: SubscriptionInvestment) => {
    console.log('Opening status modal for investment:', investment._id);
    setSelectedInvestment(investment);
    setNewStatus(investment.status);
    setAdminNotes('');
    setIsStatusModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700">Completed</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-700">Paused</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
    }
  };

  const filteredInvestments = investments.filter(investment => {
    const userName = (investment.user?.name || '').toLowerCase();
    const userEmail = (investment.user?.email || '').toLowerCase();
    const cryptoName = (investment.crypto?.name || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      userName.includes(query) ||
      userEmail.includes(query) ||
      cryptoName.includes(query);
    
    const matchesStatus = statusFilter === 'all' || investment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedInvestments = [...filteredInvestments].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'profitLoss':
        aValue = a.profitLoss;
        bValue = b.profitLoss;
        break;
      case 'dailyReturn':
        aValue = a.dailyReturnPercentage;
        bValue = b.dailyReturnPercentage;
        break;
      case 'createdAt':
      default:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
    }
    
    	return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Show loader while fetching data
  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-6 flex items-center justify-center">
          <LoadingSpinner />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <Input
            placeholder="Search by user or crypto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="createdAt">Date Created</option>
            <option value="amount">Investment Amount</option>
            <option value="profitLoss">Profit/Loss</option>
            <option value="dailyReturn">Daily Return</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </Card>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Investments</p>
            <p className="text-2xl font-bold">{investments.length}</p>
          </div>
          <DollarSign className="w-8 h-8 text-blue-600" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Investments</p>
            <p className="text-2xl font-bold">{investments.filter(i => i.status === 'active').length}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-600" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Invested</p>
            <p className="text-2xl font-bold">${investments.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</p>
          </div>
          <DollarSign className="w-8 h-8 text-purple-600" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Profit</p>
            <p className="text-2xl font-bold text-green-600">${investments.reduce((sum, i) => sum + i.profitLoss, 0).toLocaleString()}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-600" />
        </div>
      </Card>
    </div>

    {/* Investments Table */}
    <Card className="overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Return</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedInvestments.map((investment) => (
              <tr key={investment._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{investment.user?.name || 'Unknown User'}</div>
                    <div className="text-sm text-gray-500">{investment.user?.email || '—'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{investment.crypto?.name || '—'}</div>
                    <div className="text-sm text-gray-500">{investment.investmentPlan?.name || '—'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${investment.amount.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{investment.dailyReturnPercentage}%</div>
                  <div className="text-sm text-gray-500">{investment.daysElapsed} days elapsed</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${investment.currentValue.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {(() => {
                    const isProfit = investment.profitLoss >= 0;
                    const amount = Math.abs(investment.profitLoss).toLocaleString();
                    const pct = Math.abs(investment.profitLossPercentage).toFixed(2);
                    const color = isProfit ? 'text-green-600' : 'text-red-600';
                    return (
                      <>
                        <div className={`text-sm font-medium ${color}`}>{isProfit ? '+' : '-'}${amount}</div>
                        <div className={`text-sm ${color}`}>{isProfit ? '+' : '-'}{pct}%</div>
                        {investment.manualAdjustment?.isActive && (
                          <div className="text-xs text-orange-600 font-medium mt-1">
                            🔧 Manual Adjustment Active
                          </div>
                        )}
                      </>
                    );
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(investment.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log('Edit button clicked for investment:', investment._id);
                        openEditModal(investment);
                      }}
                      className="flex items-center gap-1 hover:bg-blue-50"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log('Adjust button clicked for investment:', investment._id);
                        openAdjustmentModal(investment);
                      }}
                      className="flex items-center gap-1 hover:bg-green-50"
                    >
                      <DollarSign className="w-3 h-3" />
                      Adjust
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log('Status button clicked for investment:', investment._id);
                        openStatusModal(investment);
                      }}
                      className="flex items-center gap-1 hover:bg-purple-50"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Status
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log('Reset button clicked for investment:', investment._id);
                        handleResetAdjustment(investment._id);
                      }}
                      className="flex items-center gap-1 hover:bg-orange-50"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reset
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

      {/* Edit Daily Return Modal */}
      {isEditModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>Edit Daily Return</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
            
            {/* debug panel removed */}
            
            {selectedInvestment && (
              <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Investment Details</h4>
                <p style={{ margin: '0 0 5px 0' }}><strong>User:</strong> {selectedInvestment.user.name}</p>
                <p style={{ margin: '0 0 5px 0' }}><strong>Crypto:</strong> {selectedInvestment.crypto.name}</p>
                <p style={{ margin: '0 0 5px 0' }}><strong>Current Daily Return:</strong> {selectedInvestment.dailyReturnPercentage}%</p>
                <p style={{ margin: 0 }}><strong>Investment Amount:</strong> ${selectedInvestment.amount.toLocaleString()}</p>
              </div>
            )}
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                New Daily Return Percentage
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={dailyReturnPercentage}
                onChange={(e) => setDailyReturnPercentage(e.target.value)}
                placeholder="Enter new daily return percentage"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  backgroundColor: 'white',
                  color: '#374151',
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleEditDailyReturn}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Update Daily Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Adjustment Modal */}
      {isAdjustmentModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setIsAdjustmentModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>Manual Profit Adjustment</h3>
              <button 
                onClick={() => setIsAdjustmentModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
            
            {selectedInvestment && (
              <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Investment Details</h4>
                <p style={{ margin: '0 0 5px 0' }}><strong>User:</strong> {selectedInvestment.user.name}</p>
                <p style={{ margin: '0 0 5px 0' }}><strong>Current Profit:</strong> ${selectedInvestment.profitLoss.toLocaleString()}</p>
                <p style={{ margin: 0 }}><strong>Current Value:</strong> ${selectedInvestment.currentValue.toLocaleString()}</p>
                {selectedInvestment.manualAdjustment?.isActive && (
                  <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#fef3c7', borderRadius: '4px', border: '1px solid #f59e0b' }}>
                    <p style={{ margin: 0, color: '#92400e', fontSize: '12px' }}>
                      ⚠️ Manual adjustment is currently active. This will override calculated earnings.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#dbeafe', borderRadius: '4px', border: '1px solid #3b82f6' }}>
              <p style={{ margin: 0, color: '#1e40af', fontSize: '12px' }}>
                💡 <strong>Note:</strong> Manual adjustments do not create transaction records in the user's history. 
                This allows for admin corrections without affecting user transaction logs.
              </p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Adjustment Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
                placeholder="Enter adjustment amount (positive or negative)"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Reason
              </label>
              <input
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                placeholder="Enter reason for adjustment"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsAdjustmentModalOpen(false)}
                style={{
                  backgroundColor: 'white',
                  color: '#374151',
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleManualAdjustment}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Apply Manual Adjustment (No Transaction Record)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {isStatusModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setIsStatusModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>Update Investment Status</h3>
              <button 
                onClick={() => setIsStatusModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
            
            {selectedInvestment && (
              <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Investment Details</h4>
                <p style={{ margin: '0 0 5px 0' }}><strong>User:</strong> {selectedInvestment.user.name}</p>
                <p style={{ margin: '0 0 5px 0' }}><strong>Current Status:</strong> {selectedInvestment.status}</p>
                <p style={{ margin: 0 }}><strong>Investment Amount:</strong> ${selectedInvestment.amount.toLocaleString()}</p>
              </div>
            )}
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Admin Notes
              </label>
              <input
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Enter admin notes (optional)"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                style={{
                  backgroundColor: 'white',
                  color: '#374151',
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                style={{
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionInvestments; 