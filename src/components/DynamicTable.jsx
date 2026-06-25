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
  onSort,
  name,
  pills = [],
  onFilterChange,
  onRefresh
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  // const [filterPassword, setFilterPassword] = useState('');
  const [filterMobile, setFilterMobile] = useState('');
  // const [filterCity, setFilterCity] = useState('');
  // const [filterState, setFilterState] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateLabel, setDateLabel] = useState('Custom Date');

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState(pills[0] || 'All');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  const handleApplyFilters = () => {
    setShowFilterPopover(false);
    if (onFilterChange) {
      onFilterChange({
        search: searchQuery,
        full_name: filterName,
        name: filterName,
        email: filterEmail,
        // password: filterPassword,
        phone: filterMobile,
        mobile: filterMobile,
        start_date: startDate,
        end_date: endDate,
        status: activeTab.toLowerCase() === 'all' ? '' : activeTab.toLowerCase()
      });
    }
  };

  const handleClearFilters = () => {
    setFilterName('');
    setFilterEmail('');
    // setFilterPassword('');
    setFilterMobile('');
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setDateLabel('Custom Date');
    setShowFilterPopover(false);
    if (onFilterChange) {
      onFilterChange({
        search: '',
        full_name: '',
        name: '',
        email: '',
        // password: '',
        phone: '',
        mobile: '',
        start_date: '',
        end_date: '',
        status: activeTab.toLowerCase() === 'all' ? '' : activeTab.toLowerCase()
      });
    }
  };

  const handleTabChange = (pill) => {
    setActiveTab(pill);
    if (onFilterChange) {
      onFilterChange({
        search: searchQuery,
        full_name: filterName,
        name: filterName,
        email: filterEmail,
        // password: filterPassword,
        phone: filterMobile,
        mobile: filterMobile,
        start_date: startDate,
        end_date: endDate,
        status: pill.toLowerCase() === "all" ? '' : pill.toLowerCase()
      });
    }
  };

  const handleDatePreset = (preset) => {
    const today = new Date();
    let start = null;
    let end = today;

    if (preset === 'Today') {
      start = today;
      end = today;
    } else if (preset === 'This Week') {
      const dayOfWeek = today.getDay();
      start = new Date(today);
      start.setDate(today.getDate() - dayOfWeek);
    } else if (preset === 'Last Week') {
      const startOfThisWeek = new Date(today);
      startOfThisWeek.setDate(today.getDate() - today.getDay());
      start = new Date(startOfThisWeek);
      start.setDate(startOfThisWeek.getDate() - 7);
      end = new Date(startOfThisWeek);
      end.setDate(startOfThisWeek.getDate() - 1);
    } else if (preset === 'This Month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (preset === 'Last Month') {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
    }

    const formatDate = (date) => {
      if (!date) return '';
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const startStr = formatDate(start);
    const endStr = formatDate(end);
    setStartDate(startStr);
    setEndDate(endStr);
    setDateLabel(preset);
    setShowDateDropdown(false);

    if (onFilterChange) {
      onFilterChange({
        search: searchQuery,
        full_name: filterName,
        name: filterName,
        email: filterEmail,
        // password: filterPassword,
        phone: filterMobile,
        mobile: filterMobile,
        start_date: startStr,
        end_date: endStr,
        status: activeTab.toLowerCase() === 'all' ? '' : activeTab.toLowerCase()
      });
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
              {dateLabel} <ChevronDown size={16} />
            </button>
            {showDateDropdown && (
              <div className="date-dropdown-menu">
                <div className="date-dropdown-item" onClick={() => handleDatePreset('Today')}>Today</div>
                <div className="date-dropdown-item" onClick={() => handleDatePreset('This Week')}>This Week</div>
                <div className="date-dropdown-item" onClick={() => handleDatePreset('Last Week')}>Last Week</div>
                <div className="date-dropdown-item" onClick={() => handleDatePreset('This Month')}>This Month</div>
                <div className="date-dropdown-item" onClick={() => handleDatePreset('Last Month')}>Last Month</div>
                <div style={{ borderTop: '1px solid #e5e7eb', margin: '4px 0' }} />
                <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563' }}>Custom Dates</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <button
                    onClick={() => {
                      setDateLabel('Custom Date');
                      setShowDateDropdown(false);
                      if (onFilterChange) {
                        onFilterChange({
                          search: searchQuery,
                          full_name: filterName,
                          name: filterName,
                          email: filterEmail,
                          // password: filterPassword,
                          phone: filterMobile,
                          mobile: filterMobile,
                          start_date: startDate,
                          end_date: endDate,
                          status: activeTab.toLowerCase() === 'all' ? '' : activeTab.toLowerCase()
                        });
                      }
                    }}
                    style={{
                      background: '#8b008b',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Apply Custom
                  </button>
                </div>
              </div>
            )}
          </div>
          <span className="date-range-text">
            {startDate && endDate ? `(${startDate} to ${endDate})` : ''}
          </span>
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
                <div style={{ position: 'relative' }}>
                  <Search size={16} className="filter-search-icon" style={{ top: '12px', left: '12px' }} />
                  <input
                    type="text"
                    className="filter-search-input"
                    placeholder="Search Name, Email, Phone..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyPress}
                    style={{ paddingLeft: '36px' }}
                  />
                </div>

                <h3 className="filter-heading">Filter</h3>

                <div className="filter-inputs">
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Name"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Email"
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  {/* <input
                    type="text"
                    className="filter-input"
                    placeholder="Password"
                    value={filterPassword}
                    onChange={(e) => setFilterPassword(e.target.value)}
                    onKeyDown={handleKeyPress}
                  /> */}
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Mobile"
                    value={filterMobile}
                    onChange={(e) => setFilterMobile(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>

                <div className="filter-actions">
                  <button className="clear-btn" onClick={handleClearFilters}>Clear All</button>
                  <button className="apply-btn" onClick={handleApplyFilters}>Apply</button>
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
                  onClick={() => handleTabChange(pill)}
                >
                  {pill}
                </button>
              ))}
            </div>
          )}

          <button className="action-btn">
            Export
          </button>

          <button onClick={onRefresh} className="icon-btn">
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
