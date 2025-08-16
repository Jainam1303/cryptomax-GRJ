import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createInvestment } from '../../redux/thunks/investmentThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { formatCurrency } from '../../utils/formatters';
import { Crypto } from '../../types';
import { Input } from '../ui/Input';
import Button from '../ui/button';
import { Alert, AlertDescription } from '../ui/Alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/Badge';
import { Check, Star, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import api from '../../services/api';

interface InvestmentPlan {
  _id: string;
  name: string;
  crypto: Crypto;
  minAmount: number;
  maxAmount: number;
  dailyReturnPercentage: number;
  duration: number;
  totalReturnPercentage: number;
  description: string;
  features: string[];
}

interface InvestmentPlansModalProps {
  crypto: Crypto;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const InvestmentPlansModal: React.FC<InvestmentPlansModalProps> = ({
  crypto,
  isOpen,
  onClose,
  onSuccess
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { wallet } = useSelector((state: RootState) => state.wallet);
  const { loading, error } = useSelector((state: RootState) => state.investment);
  
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [plansLoading, setPlansLoading] = useState(true);
  
  // Fetch investment plans for this crypto
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        const response = await api.get(`/api/investment-plans?cryptoId=${crypto._id}`);
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching investment plans:', error);
      } finally {
        setPlansLoading(false);
      }
    };
    
    if (isOpen && crypto._id) {
      fetchPlans();
    }
  }, [isOpen, crypto._id]);
  
  const handlePlanSelect = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setAmount(plan.minAmount.toString());
    setFormError('');
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    setFormError('');
    
    // Validate amount against selected plan
    if (selectedPlan) {
      const numAmount = parseFloat(value);
      if (numAmount < selectedPlan.minAmount) {
        setFormError(`Minimum amount is $${selectedPlan.minAmount}`);
      } else if (numAmount > selectedPlan.maxAmount) {
        setFormError(`Maximum amount is $${selectedPlan.maxAmount}`);
      }
    }
  };
  
  const calculateDailyEarnings = (amount: number, dailyReturn: number) => {
    return (amount * dailyReturn) / 100;
  };
  
  const calculateTotalEarnings = (amount: number, totalReturn: number) => {
    return (amount * totalReturn) / 100;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      setFormError('Please select an investment plan');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setFormError('Please enter a valid amount');
      return;
    }
    
    const amountValue = parseFloat(amount);
    
    if (!wallet) {
      setFormError('Wallet not found');
      return;
    }
    
    if (amountValue > wallet.balance) {
      setFormError('Insufficient balance');
      return;
    }
    
    if (amountValue < selectedPlan.minAmount || amountValue > selectedPlan.maxAmount) {
      setFormError(`Amount must be between $${selectedPlan.minAmount} and $${selectedPlan.maxAmount}`);
      return;
    }
    
    try {
      const result = await dispatch(createInvestment({
        cryptoId: crypto._id,
        amount: amountValue,
        planId: selectedPlan._id
      }));
      
      if (createInvestment.fulfilled.match(result)) {
        setAmount('');
        setSelectedPlan(null);
        onSuccess();
        onClose();
      }
    } catch (error) {
      // Error handled in thunk
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <DialogHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            {crypto.image ? (
              <img src={crypto.image} alt={crypto.symbol} className="w-16 h-16 rounded-full mr-4" />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-xl">{crypto.symbol[0]}</span>
              </div>
            )}
            <div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Investment Plans - {crypto.name} ({crypto.symbol})
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-600 mt-2">
                Choose a subscription-based investment plan with guaranteed daily returns
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {plansLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No investment plans available for this cryptocurrency.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Investment Plans Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {plans.map((plan, index) => (
                <div
                  key={plan._id}
                  className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    selectedPlan?._id === plan._id
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-200'
                      : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow-lg'
                  }`}
                  onClick={() => handlePlanSelect(plan)}
                >
                  {/* Popular Badge */}
                  {index === 2 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 text-xs font-bold">
                        MOST POPULAR
                      </Badge>
                    </div>
                  )}
                  
                  {/* Plan Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-gray-900">{plan.name}</h3>
                    {selectedPlan?._id === plan._id && (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Daily Return - Highlighted */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 mb-4 text-white">
                    <div className="flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 mr-2" />
                      <span className="text-2xl font-bold">{plan.dailyReturnPercentage}%</span>
                    </div>
                    <p className="text-center text-sm opacity-90">Daily Return</p>
                  </div>
                  
                  {/* Plan Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="font-semibold">{plan.duration} days</span>
                      <span className="text-gray-500 ml-1">duration</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-yellow-600" />
                      <span className="font-semibold">{plan.totalReturnPercentage}%</span>
                      <span className="text-gray-500 ml-1">total return</span>
                    </div>
                  </div>
                  
                  {/* Investment Range */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-gray-700">
                      Investment Range: ${plan.minAmount.toLocaleString()} - ${plan.maxAmount.toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    {plan.description}
                  </p>
                  
                  {/* Features */}
                  {plan.features.length > 0 && (
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-xs">
                          <Check className="w-3 h-3 mr-2 text-green-600 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Investment Form */}
            {selectedPlan && (
              <div className="border-t border-gray-200 pt-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-2xl font-bold mb-6 text-center">Ready to Invest?</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-lg font-semibold mb-3 text-gray-700">
                        Investment Amount (USD)
                      </label>
                      <Input
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder={`Enter amount (${selectedPlan.minAmount} - ${selectedPlan.maxAmount})`}
                        min={selectedPlan.minAmount}
                        max={selectedPlan.maxAmount}
                        step="0.01"
                        required
                        className="text-lg p-4"
                      />
                      {formError && (
                        <p className="text-red-500 text-sm mt-2">{formError}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        Available balance: <span className="font-semibold text-green-600">{formatCurrency(wallet?.balance || 0)}</span>
                      </p>
                    </div>
                    
                    {/* Investment Summary */}
                    {amount && parseFloat(amount) > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4">
                        <h4 className="font-bold text-lg text-gray-900">Investment Summary</h4>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(calculateDailyEarnings(parseFloat(amount), selectedPlan.dailyReturnPercentage))}
                            </div>
                            <div className="text-sm text-gray-600">Daily Earnings</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatCurrency(calculateTotalEarnings(parseFloat(amount), selectedPlan.totalReturnPercentage))}
                            </div>
                            <div className="text-sm text-gray-600">Total Earnings</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {selectedPlan.duration}
                            </div>
                            <div className="text-sm text-gray-600">Days</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {selectedPlan.totalReturnPercentage}%
                            </div>
                            <div className="text-sm text-gray-600">Total Return</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={loading}
                      disabled={!selectedPlan || !amount || parseFloat(amount) <= 0 || !!formError}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      {loading ? 'Processing Investment...' : `🚀 Invest $${amount || '0'} Now`}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentPlansModal; 