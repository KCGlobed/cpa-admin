import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Inbox, Loader2, Filter, RefreshCw, Download, Columns } from 'lucide-react';
import './DynamicTable.css';

export default function DynamicTable({ 
  columns, 
  data, 
  loading, 
  totalItems = 0, 
  currentPage = 1, 
  pageSize = 20, 
  onPageChange, 
  onPageSizeChange,
  onSearch,
  onSort,
  name,
  pills = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState(pills[0] || 'All');

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSort = (key, sortable) => {
    if (!sortable) return;
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    if (onSort) {
      onSort(key, direction);
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startItemIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItemIndex = Math.min(currentPage * pageSize, totalItems);

  const renderSortIcon = (col) => {
    if (!col.sortable) return null;
    if (sortConfig.key !== col.key) {
      return <ChevronsUpDown size={14} className="sort-icon" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={14} className="sort-icon" style={{ color: '#ffffff' }} />
    ) : (
      <ChevronDown size={14} className="sort-icon" style={{ color: '#ffffff' }} />
    );
  };

  // Prepend S.NO column automatically
  const finalColumns = [
    ...columns
  ];

  return (
    <div className="table-container">
      {/* TOP ACTION BAR */}
      <div className="table-top-bar">
        <div className="table-top-left">
          <h2 className="table-title">{name}</h2>
          <div style={{ position: 'relative' }}>
            <button className="custom-date-btn" onClick={() => setShowDateDropdown(!showDateDropdown)}>
              Custom Date <ChevronDown size={16} />
            </button>
            {showDateDropdown && (
              <div className="date-dropdown-menu">
                <div className="date-dropdown-item" onClick={() => setShowDateDropdown(false)}>Today</div>
                <div className="date-dropdown-item" onClick={() => setShowDateDropdown(false)}>This Week</div>
                <div className="date-dropdown-item" onClick={() => setShowDateDropdown(false)}>Last Week</div>
                <div className="date-dropdown-item" onClick={() => setShowDateDropdown(false)}>This Month</div>
                <div className="date-dropdown-item" onClick={() => setShowDateDropdown(false)}>Last Month</div>
                <div className="date-dropdown-item" onClick={() => setShowDateDropdown(false)}>Custom Date</div>
              </div>
            )}
          </div>
          <span className="date-range-text">(01 Feb - 14 Jun)</span>
        </div>
        
        <div className="table-top-right">
          {/* Filter Button & Popover */}
          <div style={{ position: 'relative' }}>
            <button 
              className="action-btn" 
              onClick={() => setShowFilterPopover(!showFilterPopover)}
            >
              <Filter size={16} /> Search & Filter <ChevronDown size={16} />
            </button>
            
            {showFilterPopover && (
              <div className="filter-popover">
                <div style={{  }}>
                  <Search size={16} className="filter-search-icon" />
                  <input 
                    type="text" 
                    className="filter-search-input" 
                    placeholder="Search Name, Email, Phone..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <h3 className="filter-heading">Filter</h3>
                
                <div className="filter-inputs">
                  <input type="text" className="filter-input" placeholder="Name" />
                  <input type="text" className="filter-input" placeholder="Email" />
                  <input type="text" className="filter-input" placeholder="Mobile" />
                </div>
                
                <div className="filter-actions">
                  <button className="clear-btn" onClick={() => setShowFilterPopover(false)}>Clear All</button>
                  <button className="apply-btn" onClick={() => setShowFilterPopover(false)}>Apply</button>
                </div>
              </div>
            )}
          </div>

          {pills && pills.length > 0 && (
            <div className="pills-container">
              {pills.map((pill) => (
                <button 
                  key={pill}
                  className={`pill-btn ${activeTab === pill ? 'active' : ''}`}
                  onClick={() => setActiveTab(pill)}
                >
                  {pill}
                </button>
              ))}
            </div>
          )}

          <button className="action-btn">
            Export 
          </button>
        
          <button className="icon-btn">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* RESPONSIVE TABLE */}
      <div className="table-responsive">
        {loading ? (
          <div className="loading-state">
            <Loader2 size={32} className="spinner" style={{ color: '#8b008b' }} />
            <span>Loading records...</span>
          </div>
        ) : data.length > 0 ? (
          <table className="custom-table">
            <thead>
              <tr>
                {finalColumns.map((col) => (
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
              {data.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {finalColumns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row, rowIndex) : row[col.key] || '-'}
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

      {/* PAGINATION FOOTER */}
      <div className="table-pagination">
        <div className="pagination-left">
          <div className="rows-selector">
            <span>Rows per page</span>
            <select 
              value={pageSize} 
              onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
              className="rows-dropdown"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
          <div>
            Total Result : <span>{totalItems}</span>
          </div>
        </div>
        
        <div className="pagination-right">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="pagination-buttons">
            <button
              className="pagination-btn"
              disabled={currentPage <= 1}
              onClick={() => onPageChange && onPageChange(1)}
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              className="pagination-btn"
              disabled={currentPage <= 1}
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="pagination-btn"
              disabled={currentPage >= totalPages || totalItems === 0}
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
            <button
              className="pagination-btn"
              disabled={currentPage >= totalPages || totalItems === 0}
              onClick={() => onPageChange && onPageChange(totalPages)}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
