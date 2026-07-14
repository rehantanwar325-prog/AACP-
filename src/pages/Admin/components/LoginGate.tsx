import React, { useState } from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoginGateProps {
  onLogin: () => void;
}

const LoginGate: React.FC<LoginGateProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'salim123') {
      setError(false);
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="login-overlay" style={{ display: 'flex' }}>
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-container">
            <ShieldAlert size={32} />
          </div>
          <h2>AACP Chicken</h2>
          <p>Admin Security Gate</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Admin Username</label>
            <input type="text" id="username" className="form-control" placeholder="E.g. admin" required autoComplete="off" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" className="form-control" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div className="error-message" style={{ display: 'block' }}>Invalid username or password!</div>}
          <button type="submit" className="btn btn-primary btn-full">Secure Login</button>
        </form>
        <div className="login-footer">
          <Link to="/"><ArrowLeft size={16} /> Return to Main Website</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginGate;
