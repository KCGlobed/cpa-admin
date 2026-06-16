import React, { useState } from 'react';
import { Mail, Lock, ShieldAlert, LogIn, User } from 'lucide-react';
import './Login.css';
// import { useNavigate } from 'react-router-dom';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('superadmin');
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://cpa-prod-738131651355.asia-south1.run.app/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.detail || 'Login failed. Please verify your credentials.');
      }

      const accessToken = data.data?.token?.access || data.token || data.access 

      localStorage.setItem('cpa_token', accessToken);
      localStorage.setItem('accessToken', accessToken); 
      localStorage.setItem('cpa_user', JSON.stringify({
        email: email,
        name: data.data?.name || data.name,
        role: data.data?.user_role || data.role || role
      }));

      onLoginSuccess(data);
      // navigate("/leads");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card animate-fade-in">
        <div className="login-header">
          <div className="login-logo">
            <LogIn size={28} />
          </div>
          <h1>CPA Admin</h1>
          <p>Sign in to access your portal</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-banner">
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              <Mail size={18} className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
             Password
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <Lock size={18} className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">
              <User size={14} /> Account Role
            </label>
            <div className="input-wrapper">
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
                required
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="user">User</option>
              </select>
              <User size={18} className="input-icon" />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
