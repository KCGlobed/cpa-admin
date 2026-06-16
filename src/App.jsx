import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Leads from './pages/Leads';
import Payments from './pages/Payments';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!(localStorage.getItem('accessToken') || localStorage.getItem('cpa_token'));
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('cpa_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [activeView, setActiveView] = useState('cpa-leads'); // e.g. 'cpa-leads', 'ea-payment'
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Check login state on load to keep state in sync
  useEffect(() => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('cpa_token');
    const storedUser = localStorage.getItem('cpa_user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const handleLoginSuccess = (loginData) => {
    setIsAuthenticated(true);
    const storedUser = localStorage.getItem('cpa_user');
    setUser(storedUser ? JSON.parse(storedUser) : { email: 'admin@gmail.com', name: 'Administrator' });
  };

  const handleLogout = () => {
    localStorage.removeItem('cpa_token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('cpa_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Parse category and page from activeView
  const [category, page] = activeView.split('-');

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
        user={user}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <main className="main-content">
        {page === 'leads' ? <Leads category={category} /> : <Payments category={category} />}
      </main>
    </div>
  );
}

export default App;
