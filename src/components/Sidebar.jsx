import React, { useState } from 'react';
import { LayoutDashboard, Users, CreditCard, LogOut, Menu, X, ChevronDown, ChevronRight, Briefcase, FileText } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ activeView, setActiveView, onLogout, user, mobileOpen, setMobileOpen, collapsed, setCollapsed }) {
  const [openDropdown, setOpenDropdown] = useState('cpa');

  const handleNavClick = (id) => {
    setActiveView(id);
    setMobileOpen(false);
  };

  const toggleDropdown = (dropdown) => {
    if (collapsed) {
      setCollapsed(false); // Auto expand if they click a dropdown while collapsed
    }
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const renderSubMenu = (category, items) => {
    const isOpen = openDropdown === category && !collapsed;
    
    return (
      <div className="sidebar-group">
        <div 
          className={`sidebar-group-header ${isOpen ? 'open' : ''}`} 
          onClick={() => toggleDropdown(category)}
          title={category === 'cpa' ? 'CPA' : 'EA Taxation'}
        >
          <div className="sidebar-group-title">
            {category === 'cpa' ? <Briefcase size={20} className="sidebar-item-icon" /> : <FileText size={20} className="sidebar-item-icon" />}
            {!collapsed && <span>{category === 'cpa' ? 'CPA' : 'EA Taxation'}</span>}
          </div>
          {!collapsed && (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
        </div>
        
        <div className={`sidebar-group-content ${isOpen ? 'open' : ''}`}>
          {items.map((item) => {
            const IconComponent = item.icon;
            const id = `${category}-${item.id}`;
            const isActive = activeView === id;
            return (
              <a
                key={id}
                onClick={() => handleNavClick(id)}
                className={`sidebar-item sub-item ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <IconComponent size={18} className="sidebar-item-icon" />
                {!collapsed && <span>{item.label}</span>}
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  const subItems = [
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'payment', label: 'Payments', icon: CreditCard },
  ];

  return (
    <>
      <header className="mobile-header">
        <div className="sidebar-logo">
          <LayoutDashboard className="sidebar-logo-icon" size={24} />
          <span>CPA Admin</span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <aside className={`sidebar ${mobileOpen ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header" style={{ justifyContent: collapsed ? 'center' : 'space-between' }}>
          {!collapsed && (
            <div className="sidebar-logo">
              <LayoutDashboard className="sidebar-logo-icon" size={24} />
              <span>CPA Admin</span>
            </div>
          )}
          <button 
            className="collapse-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle Sidebar"
          >
            <Menu size={24} style={{ color: '#8b008b' }} />
          </button>
        </div>

        <nav className="sidebar-menu">
          {renderSubMenu('cpa', subItems)}
          {renderSubMenu('ea', subItems)}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar" title={user?.name || user?.email}>
              {getInitials(user?.name || user?.email)}
            </div>
            {!collapsed && (
              <div className="user-details">
                <span className="user-name">{user?.name || 'Admin User'}</span>
                <span className="user-role">{user?.email || 'admin@gmail.com'}</span>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={onLogout} title="Logout">
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
