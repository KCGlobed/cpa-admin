import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import './DynamicTable.css';

export default function DynamicTable({ columns, data }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Default size per page

  // Handle Sort Toggle
  const handleSort = (key, sortable) => {
    if (!sortable) return;
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // Filter & Sort Data
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          if (value == null) return false;
          return String(value).toLowerCase().includes(query);
        })
      );
    }

    // 2. Sort Logic
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, columns, searchQuery, sortConfig]);

  // Pagination Logic
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  const startItemIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItemIndex = Math.min(currentPage * pageSize, totalItems);

  // Sorting Indicators
  const renderSortIcon = (col) => {
    if (!col.sortable) return null;
    if (sortConfig.key !== col.key) {
      return <ChevronsUpDown size={14} className="sort-icon" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={14} className="sort-icon" style={{ color: 'var(--accent-primary)' }} />
    ) : (
      <ChevronDown size={14} className="sort-icon" style={{ color: 'var(--accent-primary)' }} />
    );
  };

  return (
    <div className="table-container glass-panel">
      {/* Search Controller */}
      <div className="table-controls">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Total items: {totalItems}
        </div>
      </div>

      {/* Responsive Table */}
      <div className="table-responsive">
        {paginatedData.length > 0 ? (
          <table className="custom-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key, col.sortable)}
                    style={{ width: col.width || 'auto', cursor: col.sortable ? 'pointer' : 'default' }}
                  >
                    <div className="th-content">
                      <span>{col.header}</span>
                      {renderSortIcon(col)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <Inbox size={48} className="empty-state-icon" />
            <p>No records found matching criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="table-pagination">
          <div>
            Showing {startItemIndex} to {endItemIndex} of {totalItems} entries
          </div>
          <div className="pagination-buttons">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <span>Next</span>
              <ChevronRight size={5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
