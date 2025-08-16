import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Wallet, Plus, Minus, ArrowLeft, TrendingUp, TrendingDown, DollarSign, Loader2 } from "lucide-react";
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import DepositForm from '../components/wallet/DepositForm';

const WalletPage = () => {
  const { wallet, transactions, loading, getWallet, getTransactions, deposit, withdraw } = useWallet();
  const { user, logout } = useAuth();
  
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [withdrawDetails, setWithdrawDetails] = useState('');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  useEffect(() => {
    getWallet();
    getTransactions();
    // Poll every 10 seconds for authentic data
    const interval = setInterval(() => {
      getWallet();
      getTransactions();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await deposit(Number(depositAmount), depositMethod);
      setDepositAmount('');
      setDepositMethod('');
      setIsDepositOpen(false);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(withdrawAmount) < 50) {
      alert('Minimum withdrawal amount is $50');
      return;
    }
    try {
      await withdraw(Number(withdrawAmount), withdrawMethod, { details: withdrawDetails });
      setWithdrawAmount('');
      setWithdrawMethod('');
      setWithdrawDetails('');
      setIsWithdrawOpen(false);
    } catch (error) {
      // Error handled in context
    }
  };

  // Add a unified refresh handler
  const handleRefresh = () => {
    getTransactions();
    getWallet();
  };

  // Calculate completed and pending deposits
  const completedDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'completed');
  const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
  const totalDeposited = completedDeposits.reduce((sum, t) => sum + t.amount, 0);
  const pendingDepositsAmount = pendingDeposits.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CM</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CryptoMax
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet</h1>
          <p className="text-gray-600">Manage your funds and view transaction history.</p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-gray-600">Available Balance</span>
              <DollarSign className="h-4 w-4 text-gray-600" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-gray-900">
                ${wallet?.balance?.toLocaleString() || '0.00'}
              </div>
              <p className="text-xs text-gray-600 mt-1">Ready to invest</p>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-gray-600">Total Deposited</span>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-green-600">
                ${totalDeposited.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">All time deposits (approved)</p>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-gray-600">Total Withdrawn</span>
              <TrendingDown className="h-4 w-4 text-gray-600" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-red-600">
                ${wallet?.totalWithdrawn?.toLocaleString() || '0.00'}
              </div>
              <p className="text-xs text-gray-600 mt-1">All time withdrawals</p>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-gray-600">Pending</span>
              <Wallet className="h-4 w-4 text-gray-600" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-yellow-600">
                ${(wallet?.pendingDeposits || 0) + (wallet?.pendingWithdrawals || 0)}
              </div>
              <p className="text-xs text-gray-600 mt-1">Pending transactions</p>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-gray-600">Pending Deposits</span>
              <TrendingUp className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-yellow-600">
                ${pendingDepositsAmount.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">Deposits awaiting approval</p>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                <Plus className="w-4 h-4 mr-2" />
                Deposit Funds
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deposit Funds</DialogTitle>
                <DialogDescription>
                  Add money to your CryptoMax wallet to start investing.
                </DialogDescription>
              </DialogHeader>
              <DepositForm />
            </DialogContent>
          </Dialog>

          <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                <Minus className="w-4 h-4 mr-2" />
                Withdraw Funds
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw Funds</DialogTitle>
                <DialogDescription>
                  Request a withdrawal from your CryptoMax wallet.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <Label htmlFor="withdraw-amount">Amount</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    min="50"
                    step="0.01"
                    max={wallet?.balance || 0}
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum withdrawal amount: $50<br />
                    Available: ${wallet?.balance?.toLocaleString() || '0.00'}
                  </p>
                </div>
                <div>
                  <Label htmlFor="withdraw-method">Withdrawal Method</Label>
                  <Select value={withdrawMethod} onValueChange={setWithdrawMethod} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select withdrawal method" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-900">
                      <SelectItem value="usdt_trc20">USDT (TRC20)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="withdraw-details">Payment Details</Label>
                  <Input
                    id="withdraw-details"
                    placeholder="Enter account details"
                    value={withdrawDetails}
                    onChange={(e) => setWithdrawDetails(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Request Withdrawal'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="flex items-center justify-between">
              Recent Transactions
              <Link to="/transactions">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </span>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-2">Refresh</Button>
          </div>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.slice(0, 10).map((transaction, index) => {
                // Icon, color, and sign logic
                let icon, iconBg, amountColor, sign;
                switch (transaction.type) {
                  case 'deposit':
                    icon = <TrendingUp className="w-4 h-4 text-green-600" />;
                    iconBg = 'bg-green-100';
                    amountColor = 'text-green-600';
                    sign = '+';
                    break;
                  case 'withdrawal':
                  case 'investment':
                    icon = <TrendingDown className="w-4 h-4 text-red-600" />;
                    iconBg = 'bg-red-100';
                    amountColor = 'text-red-600';
                    sign = '-';
                    break;
                  case 'profit':
                    icon = <TrendingUp className="w-4 h-4 text-green-600" />;
                    iconBg = 'bg-green-100';
                    amountColor = 'text-green-600';
                    sign = '+';
                    break;
                  case 'loss':
                    icon = <TrendingDown className="w-4 h-4 text-red-600" />;
                    iconBg = 'bg-red-100';
                    amountColor = 'text-red-600';
                    sign = '-';
                    break;
                  default:
                    icon = <TrendingDown className="w-4 h-4 text-gray-400" />;
                    iconBg = 'bg-gray-100';
                    amountColor = 'text-gray-600';
                    sign = '';
                }
                return (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
                        {icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 capitalize">
                          {transaction.type === 'profit' ? 'Profit' : transaction.type === 'loss' ? 'Loss' : transaction.type}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${amountColor}`}>
                        {sign}${(transaction.amount ?? 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No transactions yet. Make your first deposit to get started!</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WalletPage;