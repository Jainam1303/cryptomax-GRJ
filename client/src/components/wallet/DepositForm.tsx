import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, DollarSign } from 'lucide-react';
import { deposit } from '../../redux/thunks/walletThunks';
import { RootState, AppDispatch } from '../../redux/store';
import { isValidAmount } from '../../utils/validators';
import { Input } from '../ui/Input';
import Button from '../ui/button';
import { Alert } from '../ui/Alert';
import api from '../../services/api';

// Helper to ensure .jpg extension if missing
function ensureJpgExtension(url: string) {
  if (!url) return url;
  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) return url;
  return url + '.jpg';
}

const DepositForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.wallet);
  
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [formError, setFormError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [walletInfo, setWalletInfo] = useState<{ address: string; qrImageUrl: string } | null>(null);
  const [walletInfoLoading, setWalletInfoLoading] = useState(false);
  const [walletInfoError, setWalletInfoError] = useState<string | null>(null);
  const [txid, setTxid] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    const fetchWalletInfo = async () => {
      setWalletInfoLoading(true);
      setWalletInfoError(null);
      try {
        const res = await api.get('/api/crypto/deposit-wallets/usdt_trc20');
        setWalletInfo({ address: res.data.address, qrImageUrl: res.data.qrImageUrl });
      } catch (err: any) {
        setWalletInfo(null);
        setWalletInfoError('Deposit address not available. Please contact support.');
      } finally {
        setWalletInfoLoading(false);
      }
    };
    fetchWalletInfo();
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setFormError('');
    setSuccess(false);
  };
  
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };
  
  const handleAmountNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !isValidAmount(amount)) {
      setFormError('Please enter a valid amount');
      return;
    }
    const amountValue = parseFloat(amount);
    if (amountValue < 10) {
      setFormError('Minimum deposit amount is $10');
      return;
    }
    setFormError('');
    setStep(2);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!txid.trim()) {
      setFormError('Please enter your transaction hash (TXID)');
      return;
    }
    
    const amountValue = parseFloat(amount);
    
    const result = await dispatch(deposit({
      amount: amountValue,
      paymentMethod,
      txid
    }));
    
    if (deposit.fulfilled.match(result)) {
      setAmount('');
      setTxid('');
      setSuccess(true);
    }
  };

  const handleCopy = () => {
    if (walletInfo?.address) {
      navigator.clipboard.writeText(walletInfo.address);
    }
  };
  
  if (success) {
    return (
      <div>
        <Alert
          variant="default"
          className="mb-6"
        >
          <div className="font-semibold">Deposit Request Submitted</div>
          <div>Your deposit is being processed. Funds will be credited to your wallet shortly</div>
        </Alert>
        <Button
          onClick={() => {
            setSuccess(false);
            setAmount('');
            setTxid('');
            setStep(1);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Make Another Deposit
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deposit Funds</h3>
      {step === 1 && (
        <form onSubmit={handleAmountNext}>
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deposit Amount (USD)</label>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
              <Input
                type="number"
                name="amount"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                min="10"
                step="0.01"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Minimum deposit amount: $10
            </p>
          </div>
          {formError && (
            <Alert variant="destructive" className="mb-4">{formError}</Alert>
          )}
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white w-full">Continue</Button>
        </form>
      )}
      {step === 2 && (
        <>
          {/* Show deposit address and QR code */}
          <div className="mb-6">
            {walletInfoLoading ? (
              <div className="text-gray-500">Loading deposit address...</div>
            ) : walletInfoError ? (
              <div className="text-danger-500">{walletInfoError}</div>
            ) : walletInfo ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center">
                <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">Send exactly <b>${amount} USDT (TRC20)</b> to this address:</div>
                <div className="flex items-center mb-2">
                  <span className="font-mono text-base bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded select-all">{walletInfo.address}</span>
                  <Button size="sm" variant="outline" className="ml-2" type="button" onClick={handleCopy}>Copy</Button>
                </div>
                {walletInfo.qrImageUrl && (
                  <img src={`http://localhost:5000${ensureJpgExtension(walletInfo.qrImageUrl)}`} alt="USDT QR Code" className="w-40 h-40 object-contain border rounded mb-2" />
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Do not send any other coin. Deposits are credited after network confirmation and admin approval.</div>
              </div>
            ) : null}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="txid" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transaction Hash (TXID)</label>
              <Input
                type="text"
                name="txid"
                id="txid"
                value={txid}
                onChange={e => setTxid(e.target.value)}
                placeholder="Paste your transaction hash after sending USDT"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">After sending USDT, paste your transaction hash here for verification.</p>
            </div>
            {formError && (
              <Alert variant="destructive" className="mb-4">{formError}</Alert>
            )}
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full" disabled={loading}>Submit Deposit</Button>
            <Button type="button" variant="outline" className="w-full mt-2" onClick={() => setStep(1)}>Back</Button>
          </form>
        </>
      )}
    </div>
  );
};

export default DepositForm;