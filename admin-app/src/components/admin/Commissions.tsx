import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

interface UserLite {
  name?: string;
  email?: string;
  referralCode?: string;
}

interface InvestmentLite {
  _id: string;
  amount?: number;
  createdAt?: string;
}

interface CommissionItem {
  _id: string;
  referrer?: UserLite;
  referee?: UserLite;
  investment?: InvestmentLite;
  investmentAmount: number;
  rate: number;
  amount: number;
  status: 'pending' | 'paid';
  createdAt?: string;
  paidAt?: string;
}

interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

const numberFmt = (n?: number) => (typeof n === 'number' ? n.toFixed(2) : '-');
const dateFmt = (d?: string) => (d ? new Date(d).toLocaleString() : '-');

const Commissions: React.FC = () => {
  const [items, setItems] = useState<CommissionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [status, setStatus] = useState<'all' | 'pending' | 'paid'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => {
    const p: Record<string, string | number> = { page, limit };
    if (status !== 'all') p.status = status;
    return p;
  }, [page, limit, status]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<PagedResponse<CommissionItem>>('/api/admin/commissions', { params });
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (e: any) {
      setError(e?.response?.data?.msg || e?.message || 'Failed to load commissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.limit, params.status]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const markPaid = async (id: string) => {
    try {
      await api.put(`/api/admin/commissions/${id}/pay`);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.msg || e?.message || 'Failed to mark as paid');
    }
  };

  const exportCsv = async () => {
    try {
      const res = await api.get('/api/admin/commissions/export.csv', {
        params: status !== 'all' ? { status } : {},
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'commissions.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e?.response?.data?.msg || e?.message || 'Failed to export CSV');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Affiliate Commissions</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value as any); }}
            className="select"
            aria-label="Filter status"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
          <button className="btn" onClick={exportCsv}>Export CSV</button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Referrer</th>
              <th>Referee</th>
              <th>Investment</th>
              <th>Rate</th>
              <th>Commission</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={8}>No commissions found.</td></tr>
            ) : (
              items.map((c) => (
                <tr key={c._id}>
                  <td>{dateFmt(c.createdAt)}</td>
                  <td>
                    <div>{c.referrer?.name || '-'}</div>
                    <div className="text-xs text-muted">{c.referrer?.email || '-'}</div>
                    <div className="text-xs">Code: {c.referrer?.referralCode || '-'}</div>
                  </td>
                  <td>
                    <div>{c.referee?.name || '-'}</div>
                    <div className="text-xs text-muted">{c.referee?.email || '-'}</div>
                  </td>
                  <td>
                    <div>${numberFmt(c.investmentAmount ?? c.investment?.amount)}</div>
                    <div className="text-xs text-muted">{c.investment?._id ?? '-'}</div>
                  </td>
                  <td>{c.rate}%</td>
                  <td>${numberFmt(c.amount)}</td>
                  <td>
                    <span className={`badge ${c.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    {c.status === 'pending' ? (
                      <button className="btn btn-sm" onClick={() => markPaid(c._id)}>Mark Paid</button>
                    ) : (
                      <span className="text-xs">Paid {dateFmt(c.paidAt)}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="card-footer flex items-center justify-between">
        <div>Page {page} of {totalPages} • Total {total}</div>
        <div className="flex gap-2">
          <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          <button className="btn btn-sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Commissions;
