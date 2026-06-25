import React from 'react';
import { TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react';
import DynamicTable from '../components/DynamicTable';
import './Pages.css';
import { useEffect, useState } from "react";
import { getLeads, exportExcel } from "../lib/apis";

export default function Leads({ category }) {
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({});

  // Column definitions for the DynamicTable matching screenshot
  const columns = [
    {
      key: 'created_at',
      header: 'DATE',
      sortable: true,
      render: (val) => val ? new Date(val).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : '-'
    },
    {
      key: 'full_name',
      header: 'Full NAME',
      sortable: true,
    },
    {
      key: 'email',
      header: 'EMAIL',
      sortable: true,
    },
    {
      key: 'phone',
      header: 'PHONE',
      sortable: true,
    },
    {
      key: 'city',
      header: 'CITY',
      sortable: true,
    },
    {
      key: 'state',
      header: 'STATE',
      sortable: true,
    },
  ];

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const source_form = category === 'cpa' ? 1 : 2;
      const queryFilters = { ...filters, source_form };

      const data = await getLeads(currentPage, pageSize, queryFilters);

      setLeadsData(data.results || data.data || data || []);
      setTotalItems(data.count || data.total || data.results?.length || 0);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [currentPage, pageSize, category, filters]);

  const handleExport = async () => {
    try {
      const data = await exportExcel(
        "/api/careers/career_excel_report/",
        {
          ...filters,
          source: category === "cpa" ? 1 : 2,
        }
      );

      if (data && data.data && data.data[0] && data.data[0].report_url) {
        const reportUrl = data.data[0].report_url;
        const link = document.createElement("a");
        link.href = reportUrl;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error("No report URL found in response:", data);
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="page-container animate-fade-in">
      <DynamicTable
        columns={columns}
        data={leadsData}
        loading={loading}
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onFilterChange={handleFilterChange}
        name={"Leads"}
        onRefresh={fetchLeads}
        onExport={handleExport}
      />
    </div>
  );
}
