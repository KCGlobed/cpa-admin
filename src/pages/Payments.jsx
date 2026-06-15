import React, { useEffect, useState } from 'react';
import { DollarSign, CheckCircle2, RefreshCw, XCircle } from 'lucide-react';
import DynamicTable from '../components/DynamicTable';
import './Pages.css';
import { getPayments } from '../lib/apis';

export default function Payments() {

  const [paymentsData, setPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPayments(1, 10);

        console.log("Payments API Response:", data);

        setPaymentsData(data.results || data.data || data || []);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);




  const columns = [
    {
      key: 'id',
      header: 'Transaction ID',
      sortable: true,
      render: (val) => <span className="tag-pill">{val}</span>,
    },
    {
      key: 'full_name',
      header: 'Full Name',
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      // render: (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val),
    },
    {
      key: 'phone',
      header: 'Phone',
      sortable: true,
    },
    {
      key: 'city',
      header: 'City',
      sortable: true,
    },
    {
      key: 'state',
      header: 'State',
      sortable: true,
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (val) => (
        <span className={`status-badge ${val}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'currency',
      header: 'Currency',
      sortable: true,
    },
    {
      key: 'razorpay_order_id',
      header: 'Razorpay Order Id',
      sortable: true,
    },
    {
      key: 'razorpay_payment_id',
      header: 'Razorpay Payment Id',
      sortable: true,
    },
    {
      key: 'razorpay_signature',
      header: 'Razorpay Signature',
      sortable: true,
    },
    {
      key: 'updated_at',
      header: 'Updated At',
      sortable: true
    },
    {
      key: 'created_at',
      header: 'Created At',
      sortable: true
    },

  ];

  // Calculate statistics
  const totalReceived = paymentsData
    .filter(p => p.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingAmount = paymentsData
    .filter(p => p.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const failedCount = paymentsData.filter(p => p.status === 'failed').length;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>Payment Ledger</h1>
        <p>Monitor transactions, gateway channels, and invoicing records.</p>
      </div>

      {/* <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-info">
            <span className="stat-label">Total Revenue Collected</span>
            <span className="stat-value">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalReceived)}
            </span>
            <span className="stat-change positive">
              <CheckCircle2 size={14} />
              Cleared payouts
            </span>
          </div>
          <div className="stat-icon-wrapper">
            <DollarSign size={24} style={{ color: 'var(--success)' }} />
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-info">
            <span className="stat-label">Pending Invoices</span>
            <span className="stat-value">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(pendingAmount)}
            </span>
            <span className="stat-change">
              <RefreshCw size={14} className="spinner" style={{ animationDuration: '3s' }} />
              Awaiting processing
            </span>
          </div>
          <div className="stat-icon-wrapper">
            <RefreshCw size={24} style={{ color: 'var(--warning)' }} />
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-info">
            <span className="stat-label">Failed Transactions</span>
            <span className="stat-value">{failedCount}</span>
            <span className="stat-change negative">
              <XCircle size={14} />
              Needs attention
            </span>
          </div>
          <div className="stat-icon-wrapper">
            <XCircle size={24} style={{ color: 'var(--danger)' }} />
          </div>
        </div>
      </div> */}

      <DynamicTable columns={columns} data={paymentsData} loading={loading} />
    </div>
  );
}
