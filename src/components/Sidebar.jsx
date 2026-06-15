import React from 'react';
import { LayoutDashboard, Users, CreditCard, LogOut, Menu, X } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ activeView, setActiveView, onLogout, user, mobileOpen, setMobileOpen }) {
  const menuItems = [
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];

  const handleNavClick = (id) => {
    setActiveView(id);
    setMobileOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <>
      {/* Mobile Top Header */}
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

      {/* Sidebar Panel */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <LayoutDashboard className="sidebar-logo-icon" size={24} />
            <span>CPA Admin</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeView === item.id;
            return (
              <a
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                <IconComponent size={20} className="sidebar-item-icon" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              {getInitials(user?.name || user?.email)}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Admin User'}</span>
              <span className="user-role">{user?.email || 'admin@gmail.com'}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
