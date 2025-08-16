import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createInvestment } from '../../redux/thunks/investmentThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { formatCurrency } from '../../utils/formatters';
import { isValidAmount } from '../../utils/validators';
import { Crypto } from '../../types';
import { Input } from '../ui/Input';
import Button from '../ui/button';
import { Alert, AlertDescription } from '../ui/Alert';

interface InvestmentFormProps {
  crypto: Crypto;
  onSuccess: () => void;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ crypto, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { wallet } = useSelector((state: RootState) => state.wallet);
  const { loading, error } = useSelector((state: RootState) => state.investment);
  
  const [amount, setAmount] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setFormError('');
  };
  
  const calculateQuantity = (amount: number) => {
    return amount / crypto.currentPrice;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !isValidAmount(amount)) {
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
    
    const result = await dispatch(createInvestment({
      cryptoId: crypto._id,
      amount: amountValue
    }));
    
    if (createInvestment.fulfilled.match(result)) {
      setAmount('');
      onSuccess();
    }
  };
  
  const estimatedQuantity = amount && isValidAmount(amount)
    ? calculateQuantity(parseFloat(amount))
    : 0;
  
  return (
    <div>
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <Input
            type="number"
            name="amount"
            id="amount"
            value={amount}
            onChange={handleChange}
            placeholder="Enter amount"
            min="10"
            step="0.01"
            required
          />
          
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Available balance: {formatCurrency(wallet?.balance || 0)}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Current Price:</span>
            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(crypto.currentPrice)}</span>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Estimated Quantity:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {estimatedQuantity.toFixed(8)} {crypto.symbol}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Investment:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(parseFloat(amount) || 0)}
            </span>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            disabled={!amount || !isValidAmount(amount) || parseFloat(amount) <= 0}
          >
            Confirm Investment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InvestmentForm;