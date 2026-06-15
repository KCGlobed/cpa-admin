import React from 'react';
import { TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react';
import DynamicTable from '../components/DynamicTable';
import './Pages.css';
import { useEffect, useState } from "react";
import { getLeads } from "../lib/apis";

export default function Leads() {



  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Column definitions for the DynamicTable
  const columns = [
    {
      key: 'id',
      header: 'Lead ID',
      sortable: true,
      render: (val) => <span className="tag-pill">{val}</span>,
    },
    {
      key: 'full_name',
      header: 'Name',
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
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
      key: 'created_at',
      header: 'Created at',
      sortable: true,
    },
  ];


  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getLeads(1, 10);

        console.log("API Response:", data);
        setLeadsData(data.results || data.data || data || []);

      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // const totalLeads = leadsData.length;
  // const activeLeads = leadsData.filter(l => l.status === 'active').length;
  // const totalValue = leadsData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>Leads Overview</h1>
        <p>Track, manage, and engage with your recent marketing leads.</p>
      </div>

      {/* <div className="stats-grid">
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
      </div> */}

      <DynamicTable columns={columns} data={leadsData} loading={loading} />
    </div>
  );
}
