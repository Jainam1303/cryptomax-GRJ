import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Wallet</h1>
          <p className="text-muted-foreground">Manage your funds and view transaction history.</p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-neutral-900/60 border border-neutral-800">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-muted-foreground">Available Balance</span>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-foreground">
                ${wallet?.balance?.toLocaleString() || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Ready to invest</p>
            </div>
          </Card>

          <Card className="bg-neutral-900/60 border border-neutral-800">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-muted-foreground">Total Deposited</span>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-green-600">
                ${totalDeposited.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">All time deposits (approved)</p>
            </div>
          </Card>

          <Card className="bg-neutral-900/60 border border-neutral-800">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-muted-foreground">Total Withdrawn</span>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-red-600">
                ${wallet?.totalWithdrawn?.toLocaleString() || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">All time withdrawals</p>
            </div>
          </Card>

          <Card className="bg-neutral-900/60 border border-neutral-800">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-muted-foreground">Pending</span>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-yellow-600">
                ${(wallet?.pendingDeposits || 0) + (wallet?.pendingWithdrawals || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Pending transactions</p>
            </div>
          </Card>

          <Card className="bg-neutral-900/60 border border-neutral-800">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <span className="text-sm font-medium text-muted-foreground">Pending Deposits</span>
              <TrendingUp className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="px-6 pb-6">
              <div className="text-2xl font-bold text-yellow-600">
                ${pendingDepositsAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Deposits awaiting approval</p>
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
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum withdrawal amount: $50<br />
                    Available: ${wallet?.balance?.toLocaleString() || '0.00'}
                  </p>
                </div>
                <div>
                  <Label htmlFor="withdraw-method">Withdrawal Method</Label>
                  <Select value={withdrawMethod} onValueChange={setWithdrawMethod} required>
                    <SelectTrigger className="bg-neutral-900/60 border border-neutral-800 text-neutral-100">
                      <SelectValue placeholder="Select withdrawal method" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover text-popover-foreground">
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
                    className="bg-neutral-900/60 border border-neutral-800 text-neutral-100 placeholder-neutral-500"
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
        <Card className="bg-neutral-900/60 border border-neutral-800">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Recent Transactions</h2>
              <Link to="/transactions" className="text-sm text-primary hover:underline">View all</Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-muted-foreground">No transactions yet.</p>
            ) : (
              <div className="divide-y divide-neutral-800">
                {transactions.slice(0, 5).map((t) => (
                  <div key={t._id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${(t.type === 'deposit' || t.type === 'profit') ? 'bg-green-500/15 text-green-500' : 'bg-red-500/15 text-red-500'}`}>
                        {t.type === 'profit' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : t.type === 'deposit' ? (
                          <Plus className="w-4 h-4" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground capitalize">{t.type}</div>
                        <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          t.status === 'completed'
                            ? 'bg-green-500/15 text-green-500'
                            : t.status === 'pending'
                            ? 'bg-yellow-500/15 text-yellow-500'
                            : 'bg-red-500/15 text-red-500'
                        }
                      >
                        {t.status}
                      </Badge>
                      <div className={`text-sm font-semibold ${(t.type === 'deposit' || t.type === 'profit') ? 'text-green-500' : 'text-red-500'}`}>
                        {(t.type === 'deposit' || t.type === 'profit') ? '+' : '-'}${t.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WalletPage;