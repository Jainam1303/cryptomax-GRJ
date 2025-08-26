import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DollarSign, AlertCircle } from 'lucide-react';
import { withdraw } from '../../redux/thunks/walletThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { isValidWithdrawalAmount } from '../../utils/validators';
import { formatCurrency } from '../../utils/formatters';
import { Input } from '../ui/Input';
import { Label } from '../ui/label';
import Button from '../ui/button';
import { Alert } from '../ui/Alert';

const WithdrawalForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { wallet, loading, error } = useSelector((state: RootState) => state.wallet);

  const [amount, setAmount] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setFormError('');
    setSuccess(false);
  };

  const handlePaymentDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentDetails(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet) {
      setFormError('Wallet not found');
      return;
    }

    if (!amount || !isValidWithdrawalAmount(amount, wallet.balance)) {
      setFormError('Please enter a valid amount');
      return;
    }

    const amountValue = parseFloat(amount);

    if (amountValue < 10) {
      setFormError('Minimum withdrawal amount is $10');
      return;
    }

    if (!paymentDetails || paymentDetails.trim() === '') {
      setFormError('Please enter your USDT TRC20 wallet address');
      return;
    }

    // Debug log
    console.log('Submitting withdrawal with paymentDetails:', paymentDetails);

    const result = await dispatch(withdraw({
      amount: amountValue,
      paymentMethod: 'usdt_trc20',
      paymentDetails: paymentDetails
    }));

    if (withdraw.fulfilled.match(result)) {
      setAmount('');
      setPaymentDetails('');
      setSuccess(true);
    }
  };

  const renderPaymentDetailsFields = () => {
    return (
      <div className="space-y-2">
        <Label htmlFor="walletAddress">USDT TRC20 Wallet Address</Label>
        <Input
          type="text"
          name="walletAddress"
          id="walletAddress"
          value={paymentDetails}
          onChange={handlePaymentDetailsChange}
          placeholder="Enter your USDT TRC20 wallet address"
          required
        />
      </div>
    );
  };

  if (success) {
    return (
      <div>
        <Alert
          variant="default"
          className="mb-6"
        >
          <AlertCircle className="h-4 w-4" />
          <div>
            <h4 className="font-medium">Withdrawal Request Submitted</h4>
            <p className="text-sm">Your withdrawal request has been submitted successfully. It will be processed within 1-3 business days.</p>
          </div>
        </Alert>
        <Button
          variant="primary"
          onClick={() => {
            setSuccess(false);
            setAmount('');
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Make Another Withdrawal
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Withdraw Funds</h3>
      {error && (
        <Alert
          variant="destructive"
          className="mb-4"
        >
          <AlertCircle className="h-4 w-4" />
          <div>
            <p className="text-sm">{error}</p>
          </div>
        </Alert>
      )}
      {formError && (
        <Alert
          variant="destructive"
          className="mb-4"
        >
          <AlertCircle className="h-4 w-4" />
          <div>
            <p className="text-sm">{formError}</p>
          </div>
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <Label htmlFor="amount">Withdrawal Amount (USD)</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="number"
              name="amount"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="pl-10"
              min="10"
              step="0.01"
              required
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Minimum withdrawal: $10
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Available balance: {formatCurrency(wallet?.balance || 0)}
            </span>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Withdrawal Method
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                id="usdt_trc20"
                value="usdt_trc20"
                checked={true}
                readOnly
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
              />
              <label htmlFor="usdt_trc20" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                USDT (TRC20)
              </label>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            Payment Details
          </h4>
          {renderPaymentDetailsFields()}
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-warning-500 mr-2" />
            <h4 className="text-base font-medium text-gray-900 dark:text-white">Important Notice</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Withdrawal requests are processed within 1-3 business days. A confirmation email will be sent once your request is approved.
          </p>
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!amount || !isValidWithdrawalAmount(amount, wallet?.balance || 0) || parseFloat(amount) < 10 || loading}
          className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Request Withdrawal'}
        </Button>
      </form>
    </div>
  );
};

export default WithdrawalForm;