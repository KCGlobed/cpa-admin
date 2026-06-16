import React, { useEffect, useState } from 'react';
import DynamicTable from '../components/DynamicTable';
import './Pages.css';
import { getPayments } from '../lib/apis';

export default function Payments({ category }) {
  const [paymentsData, setPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const source_form = category === 'cpa' ? 1 : 2;
        const queryFilters = { ...filters, source_form };
        const data = await getPayments(currentPage, pageSize, queryFilters);
        setPaymentsData(data.results || data.data || data || []);
        setTotalItems(data.count || data.total || data.results?.length || 0);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [currentPage, pageSize, category, filters]);

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

  const columns = [
    {
      key: 'full_name',
      header: 'Full Name',
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
      key: 'amount',
      header: 'Amount',
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (val) => {
        const normalizedVal = val ? String(val).toLowerCase() : '';
        return (
          <span className={`status-badge ${normalizedVal}`}>
            {val}
          </span>
        );
      },
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
      header: 'DATE',
      sortable: true,
      render: (val) => val ? new Date(val).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : '-'
    },
  ];

  return (
    <div className="page-container animate-fade-in">
      <DynamicTable 
        columns={columns} 
        data={paymentsData} 
        loading={loading} 
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onFilterChange={handleFilterChange}
        name="Payments"
        pills={['All', 'Success', 'Failed']}
      />
    </div>
  );
}
