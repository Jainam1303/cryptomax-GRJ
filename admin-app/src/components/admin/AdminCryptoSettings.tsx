import React, { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import Card from '../ui/card';
import Spinner from '../ui/Spinner';
import Button from '../ui/button';
import { Input } from '../ui/Input';

interface Crypto {
  _id: string;
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  minChangePct: number;
  maxChangePct: number;
  adminFluctuationEnabled: boolean;
  direction?: 'up' | 'down' | 'random';
}

const AdminCryptoSettings: React.FC = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Deposit Wallet State
  const [usdtWallet, setUsdtWallet] = useState<{ address: string; qrImageUrl: string } | null>(null);
  const [usdtLoading, setUsdtLoading] = useState(false);
  const [usdtError, setUsdtError] = useState<string | null>(null);
  const [usdtSuccess, setUsdtSuccess] = useState<string | null>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCryptos();
    fetchUsdtWallet();
  }, []);

  const fetchCryptos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/cryptos');
      setCryptos(res.data);
    } catch (err: any) {
      setError('Failed to load cryptos');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsdtWallet = async () => {
    setUsdtLoading(true);
    setUsdtError(null);
    try {
      const res = await api.get('/api/crypto/deposit-wallets/usdt_trc20');
      setUsdtWallet({ address: res.data.address, qrImageUrl: res.data.qrImageUrl });
    } catch (err: any) {
      setUsdtWallet(null);
      setUsdtError('No USDT TRC20 deposit wallet set yet.');
    } finally {
      setUsdtLoading(false);
    }
  };

  const handleChange = (id: string, field: keyof Crypto, value: any) => {
    setCryptos(cryptos => cryptos.map(c => c._id === id ? { ...c, [field]: value } : c));
  };

  const handleDirection = async (id: string, direction: 'up' | 'down' | 'random') => {
    setCryptos(cryptos => cryptos.map(c => c._id === id ? { ...c, direction } : c));
    try {
      await api.put(`/api/cryptos/${id}`, { direction });
    } catch (err) {
      setError('Failed to update direction');
      setCryptos(cryptos => cryptos.map(c => c._id === id ? { ...c, direction: 'random' } : c));
    }
  };

  const handleUsdtWalletChange = (field: 'address' | 'qrImageUrl', value: string) => {
    setUsdtWallet(w => w ? { ...w, [field]: value } : { address: '', qrImageUrl: '' });
  };

  const handleUsdtWalletSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsdtLoading(true);
    setUsdtError(null);
    setUsdtSuccess(null);
    try {
      await api.put('/api/admin/deposit-wallets/usdt_trc20', usdtWallet);
      setUsdtSuccess('USDT TRC20 deposit wallet updated successfully!');
      fetchUsdtWallet();
    } catch (err: any) {
      setUsdtError('Failed to update USDT TRC20 deposit wallet.');
    } finally {
      setUsdtLoading(false);
    }
  };

  const handleUsdtQrFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('qr', file);
    setUsdtLoading(true);
    setUsdtError(null);
    try {
      const res = await api.post('/api/admin/deposit-wallets/usdt_trc20/qr-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleUsdtWalletChange('qrImageUrl', res.data.qrImageUrl);
    } catch (err: any) {
      setUsdtError('Failed to upload QR code image.');
    } finally {
      setUsdtLoading(false);
    }
  };

  const handleSave = async (crypto: Crypto) => {
    setSavingId(crypto._id);
    setError(null);
    try {
      await api.put(`/api/cryptos/${crypto._id}`, {
        currentPrice: crypto.currentPrice,
        minPrice: crypto.minPrice,
        maxPrice: crypto.maxPrice,
        minChangePct: crypto.minChangePct,
        maxChangePct: crypto.maxChangePct,
        adminFluctuationEnabled: crypto.adminFluctuationEnabled
      });
      await fetchCryptos();
    } catch (err: any) {
      setError('Failed to save changes');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Card title="Crypto Settings">
        {error && <div className="text-danger-500 mb-4">{error}</div>}
        <div className="admin-table-container">
          <table className="admin-table" style={{ fontSize: '0.875rem' }}>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Image</th>
                <th style={{ width: '120px' }}>Name</th>
                <th style={{ width: '80px' }}>Symbol</th>
                <th style={{ width: '100px' }}>Current Price</th>
                <th style={{ width: '80px' }}>Min Price</th>
                <th style={{ width: '80px' }}>Max Price</th>
                <th style={{ width: '60px' }}>Min %</th>
                <th style={{ width: '60px' }}>Max %</th>
                <th style={{ width: '80px' }}>Fluctuation</th>
                <th style={{ width: '120px' }}>Direction</th>
                <th style={{ width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cryptos.map(crypto => (
                <tr key={crypto._id}>
                  <td>
                    <img src={crypto.image} alt={crypto.symbol} style={{ width: '24px', height: '24px' }} />
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{crypto.name}</td>
                  <td style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{crypto.symbol}</td>
                  <td>
                    <input
                      type="number"
                      value={crypto.currentPrice}
                      onChange={e => handleChange(crypto._id, 'currentPrice', parseFloat(e.target.value))}
                      style={{
                        width: '80px',
                        padding: '2px 4px',
                        fontSize: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '3px'
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={crypto.minPrice}
                      onChange={e => handleChange(crypto._id, 'minPrice', parseFloat(e.target.value))}
                      style={{
                        width: '60px',
                        padding: '2px 4px',
                        fontSize: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '3px'
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={crypto.maxPrice}
                      onChange={e => handleChange(crypto._id, 'maxPrice', parseFloat(e.target.value))}
                      style={{
                        width: '60px',
                        padding: '2px 4px',
                        fontSize: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '3px'
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={crypto.minChangePct}
                      onChange={e => handleChange(crypto._id, 'minChangePct', parseFloat(e.target.value))}
                      style={{
                        width: '40px',
                        padding: '2px 4px',
                        fontSize: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '3px'
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={crypto.maxChangePct}
                      onChange={e => handleChange(crypto._id, 'maxChangePct', parseFloat(e.target.value))}
                      style={{
                        width: '40px',
                        padding: '2px 4px',
                        fontSize: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '3px'
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={crypto.adminFluctuationEnabled}
                      onChange={e => handleChange(crypto._id, 'adminFluctuationEnabled', e.target.checked)}
                      style={{ transform: 'scale(0.8)' }}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        <button
                          onClick={() => handleDirection(crypto._id, 'up')}
                          style={{
                            padding: '1px 4px',
                            fontSize: '0.6rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '2px',
                            cursor: 'pointer'
                          }}
                        >
                          Up
                        </button>
                        <button
                          onClick={() => handleDirection(crypto._id, 'down')}
                          style={{
                            padding: '1px 4px',
                            fontSize: '0.6rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '2px',
                            cursor: 'pointer'
                          }}
                        >
                          Down
                        </button>
                        <button
                          onClick={() => handleDirection(crypto._id, 'random')}
                          style={{
                            padding: '1px 4px',
                            fontSize: '0.6rem',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '2px',
                            cursor: 'pointer'
                          }}
                        >
                          Reset
                        </button>
                      </div>
                      <div style={{ fontSize: '0.6rem', color: '#6b7280', textAlign: 'center' }}>
                        {crypto.direction ? crypto.direction.toUpperCase() : 'RANDOM'}
                      </div>
                    </div>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => handleSave(crypto)}
                      disabled={savingId === crypto._id}
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.7rem'
                      }}
                    >
                      {savingId === crypto._id ? 'Saving...' : 'Save'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* USDT TRC20 Deposit Wallet Admin Form */}
      <Card title="USDT TRC20 Deposit Wallet" className="mt-4">
        {usdtError && <div className="text-danger-500 mb-2">{usdtError}</div>}
        {usdtSuccess && <div className="text-green-600 mb-2">{usdtSuccess}</div>}
        <form onSubmit={handleUsdtWalletSave} style={{ maxWidth: '400px' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <label className="input-label" style={{ fontSize: '0.875rem' }}>Wallet Address</label>
            <Input
              type="text"
              value={usdtWallet?.address || ''}
              onChange={e => handleUsdtWalletChange('address', e.target.value)}
              placeholder="Enter USDT TRC20 wallet address"
              required
              style={{ fontSize: '0.875rem', padding: '0.375rem' }}
            />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label className="input-label" style={{ fontSize: '0.875rem' }}>QR Code Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUsdtQrFileChange}
              style={{ marginBottom: '0.25rem', fontSize: '0.75rem' }}
            />
            <Input
              type="text"
              value={usdtWallet?.qrImageUrl || ''}
              onChange={e => handleUsdtWalletChange('qrImageUrl', e.target.value)}
              placeholder="Paste QR code image URL or upload"
              ref={qrInputRef}
              required
              style={{ fontSize: '0.875rem', padding: '0.375rem' }}
            />
            {usdtWallet?.qrImageUrl && (
              <img src={usdtWallet.qrImageUrl} alt="USDT QR Code" style={{ marginTop: '0.5rem', width: '80px', height: '80px', objectFit: 'contain', border: '1px solid #d1d5db', borderRadius: '4px' }} />
            )}
          </div>
          <Button type="submit" disabled={usdtLoading} variant="primary" style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}>
            {usdtLoading ? 'Saving...' : 'Save Wallet Info'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminCryptoSettings; 