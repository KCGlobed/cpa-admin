import React from 'react';
import { DollarSign, CheckCircle2, RefreshCw, XCircle } from 'lucide-react';
import DynamicTable from '../components/DynamicTable';
import './Pages.css';

export default function Payments() {
  // Mock data for payments
  const paymentsData = [
    { id: 'TX-9901', client: 'Alice Johnson', amount: 1250, method: 'Stripe Credit Card', date: '2026-06-12', status: 'paid' },
    { id: 'TX-9902', client: 'Bob Smith', amount: 450, method: 'PayPal', date: '2026-06-12', status: 'pending' },
    { id: 'TX-9903', client: 'Charlie Davis', amount: 3500, method: 'Wire Transfer', date: '2026-06-13', status: 'paid' },
    { id: 'TX-9904', client: 'David Miller', amount: 150, method: 'Stripe Credit Card', date: '2026-06-13', status: 'failed' },
    { id: 'TX-9905', client: 'Emma Watson', amount: 950, method: 'Apple Pay', date: '2026-06-14', status: 'paid' },
    { id: 'TX-9906', client: 'Frank Harris', amount: 220, method: 'PayPal', date: '2026-06-14', status: 'pending' },
    { id: 'TX-9907', client: 'Grace Lee', amount: 5100, method: 'Wire Transfer', date: '2026-06-15', status: 'paid' },
    { id: 'TX-9908', client: 'Hannah Abbott', amount: 670, method: 'Stripe Credit Card', date: '2026-06-15', status: 'paid' },
  ];

  // Column definitions for the DynamicTable
  const columns = [
    {
      key: 'id',
      header: 'Transaction ID',
      sortable: true,
      render: (val) => <span className="tag-pill">{val}</span>,
    },
    {
      key: 'client',
      header: 'Client / Customer',
      sortable: true,
    },
    {
      key: 'amount',
      header: 'Amount Paid',
      sortable: true,
      render: (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val),
    },
    {
      key: 'method',
      header: 'Payment Gateway',
      sortable: true,
    },
    {
      key: 'date',
      header: 'Payment Date',
      sortable: true,
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

      <div className="stats-grid">
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
      </div>

      <DynamicTable columns={columns} data={paymentsData} />
    </div>
  );
}
