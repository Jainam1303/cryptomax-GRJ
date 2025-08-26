import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Search, TrendingUp, TrendingDown, DollarSign, Wallet, Filter, Loader2 } from "lucide-react";
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';

const TransactionsPage = () => {
  const { transactions, loading, getTransactions } = useWallet();
  const { user, logout } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    getTransactions();
  }, []);

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTransactionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'deposit':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'withdrawal':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'investment':
        return <DollarSign className="w-4 h-4 text-blue-600" />;
      default:
        return <Wallet className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getAmountColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'deposit':
      case 'sale':
      case 'profit':
        return 'text-green-600';
      case 'withdrawal':
      case 'investment':
      case 'loss':
        return 'text-red-600';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      {/* Navigation */}
      <nav className="bg-neutral-900/60 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <img src="/logos/CMlogo.svg" alt="CryptoMax" className="w-12 h-12 rounded-lg" />
                <span className="text-xl font-bold gradient-text">
                  CryptoMax
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-foreground">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Transactions</h1>
          <p className="text-muted-foreground">Complete history of all your transactions and activities.</p>
        </div>

        {/* Filters */}
        <Card className="bg-neutral-900/60 border border-neutral-800 rounded-xl mb-8 shadow-sm">
          <div className="flex items-center justify-between p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              <Filter className="w-5 h-5 mr-2" />
              Filters & Search
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 pb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-md bg-neutral-900/60 border border-neutral-800 text-neutral-100 placeholder-neutral-500"
              />
            </div>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="rounded-md bg-neutral-900/60 border border-neutral-800 text-neutral-100">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="investment">Investments</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="rounded-md bg-neutral-900/60 border border-neutral-800 text-neutral-100">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
              }}
              className="rounded-md border-neutral-800 bg-neutral-900 text-neutral-100 hover:bg-neutral-800 hover:text-neutral-100"
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Transaction Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Transactions</h3>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {filteredTransactions.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredTransactions.length !== transactions.length && `Filtered from ${transactions.length}`}
            </p>
          </Card>

          <Card className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Deposited</h3>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              ${filteredTransactions
                .filter(t => t.type === 'deposit' && t.status === 'completed')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Completed deposits</p>
          </Card>

          <Card className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Withdrawn</h3>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-red-600">
              ${filteredTransactions
                .filter(t => t.type === 'withdrawal' && t.status === 'completed')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Completed withdrawals</p>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <h3 className="text-2xl font-bold text-foreground mb-2 px-6 pt-6">Transaction History</h3>
          <div className="overflow-x-auto rounded-lg m-6 mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredTransactions.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-neutral-800/50 border-b border-neutral-800">
                    <th className="py-4 px-6 font-medium text-sm text-muted-foreground text-left" style={{width: '40%'}}>Transaction</th>
                    <th className="py-4 px-6 font-medium text-sm text-muted-foreground text-left" style={{width: '25%'}}>Date</th>
                    <th className="py-4 px-6 font-medium text-sm text-muted-foreground text-right" style={{width: '20%'}}>Amount</th>
                    <th className="py-4 px-6 font-medium text-sm text-muted-foreground text-center" style={{width: '15%'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <tr key={transaction._id || index} className="hover:bg-neutral-800/40 transition-colors">
                      {/* Transaction column */}
                      <td className="py-4 px-6 text-left">
                        <div className="flex items-center gap-4">
                          <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full
                            ${['profit', 'deposit'].includes(transaction.type) ? 'bg-success-bg' : ''}
                            ${['withdrawal', 'loss', 'investment'].includes(transaction.type) ? 'bg-danger-bg' : ''}
                            ${!['profit', 'deposit', 'withdrawal', 'loss', 'investment'].includes(transaction.type) ? 'bg-muted' : ''}
                          `}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                            <div className="text-sm font-medium text-foreground capitalize">
                        {transaction.type}
                        {transaction.description && (
                                <span className="font-normal text-muted-foreground ml-2">
                            - {transaction.description}
                          </span>
                        )}
                      </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {transaction.reference && (
                                <>Ref: {transaction.reference}</>
                              )}
                            </div>
                            {transaction.type === 'withdrawal' && transaction.status === 'failed' && (transaction as any).failureReason && (
                              <div className="text-xs text-danger mt-1 font-medium">
                                {(transaction as any).failureReason}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Date column */}
                      <td className="py-4 px-6 text-left">
                        <div className="text-sm text-foreground font-mono">
                          {new Date(transaction.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      </td>
                      {/* Amount column */}
                      <td className="py-4 px-6 text-right">
                        <div className={`text-sm font-medium font-mono ${getAmountColor(transaction.type)}`}>{
                      transaction.type === 'deposit' || transaction.type === 'profit'
                        ? `+${(transaction.amount ?? 0).toLocaleString()}`
                        : transaction.type === 'loss' || transaction.type === 'withdrawal' || transaction.type === 'investment'
                          ? `-${(transaction.amount ?? 0).toLocaleString()}`
                          : (transaction.amount ?? 0).toLocaleString()
                    }</div>
                        <div className="text-xs text-muted-foreground">{transaction.currency}</div>
                      </td>
                      {/* Status column */}
                      <td className="py-4 px-6 text-center">
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Transactions Found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
                    ? 'No transactions match your current filters.' 
                    : 'Start by making a deposit to see your transactions here.'
                  }
                </p>
                {!searchTerm && filterType === 'all' && filterStatus === 'all' && (
                  <Link to="/wallet">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      Make First Deposit
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsPage;