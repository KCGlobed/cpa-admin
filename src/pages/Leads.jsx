import React from 'react';
import { TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react';
import DynamicTable from '../components/DynamicTable';
import './Pages.css';

export default function Leads() {
  // Mock data for leads
  const leadsData = [
    { id: 'LD-1001', name: 'Alice Johnson', email: 'alice.j@example.com', value: 12000, status: 'active', source: 'Google Ads', date: '2026-06-10' },
    { id: 'LD-1002', name: 'Bob Smith', email: 'bob.smith@example.com', value: 8500, status: 'contacted', source: 'LinkedIn Ref', date: '2026-06-11' },
    { id: 'LD-1003', name: 'Charlie Davis', email: 'charlie@example.com', value: 24000, status: 'active', source: 'Direct Traffic', date: '2026-06-12' },
    { id: 'LD-1004', name: 'David Miller', email: 'david.m@example.com', value: 5000, status: 'lost', source: 'Organic Search', date: '2026-06-12' },
    { id: 'LD-1005', name: 'Emma Watson', email: 'emma@example.com', value: 18500, status: 'active', source: 'Google Ads', date: '2026-06-13' },
    { id: 'LD-1006', name: 'Frank Harris', email: 'frank.h@example.com', value: 9800, status: 'contacted', source: 'Newsletter', date: '2026-06-14' },
    { id: 'LD-1007', name: 'Grace Lee', email: 'grace.l@example.com', value: 32000, status: 'active', source: 'LinkedIn Ref', date: '2026-06-14' },
  ];

  // Column definitions for the DynamicTable
  const columns = [
    {
      key: 'id',
      header: 'Lead ID',
      sortable: true,
      render: (val) => <span className="tag-pill">{val}</span>,
    },
    {
      key: 'name',
      header: 'Full Name',
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email Address',
      sortable: true,
    },
    {
      key: 'value',
      header: 'Estimated Value',
      sortable: true,
      render: (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val),
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
      key: 'source',
      header: 'Source Campaign',
      sortable: true,
    },
    {
      key: 'date',
      header: 'Date Created',
      sortable: true,
    },
  ];

  // Calculate statistics
  const totalLeads = leadsData.length;
  const activeLeads = leadsData.filter(l => l.status === 'active').length;
  const totalValue = leadsData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>Leads Overview</h1>
        <p>Track, manage, and engage with your recent marketing leads.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-info">
            <span className="stat-label">Total Leads</span>
            <span className="stat-value">{totalLeads}</span>
            <span className="stat-change positive">
              <TrendingUp size={14} />
              +12% this week
            </span>
          </div>
          <div className="stat-icon-wrapper">
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-info">
            <span className="stat-label">Active Leads</span>
            <span className="stat-value">{activeLeads}</span>
            <span className="stat-change positive">
              <CheckCircle size={14} />
              71.4% conversion
            </span>
          </div>
          <div className="stat-icon-wrapper">
            <CheckCircle size={24} style={{ color: 'var(--success)' }} />
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-info">
            <span className="stat-label">Total Potential Pipeline</span>
            <span className="stat-value">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalValue)}
            </span>
            <span className="stat-change positive">
              <TrendingUp size={14} />
              Strong pipeline
            </span>
          </div>
          <div className="stat-icon-wrapper">
            <TrendingUp size={24} style={{ color: 'var(--accent-secondary)' }} />
          </div>
        </div>
      </div>

      <DynamicTable columns={columns} data={leadsData} />
    </div>
  );
}
