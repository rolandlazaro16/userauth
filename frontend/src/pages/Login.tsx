import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.login(formData);
      localStorage.setItem('token', res.token);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-container fade-in">
        <h2 className="text-center">Welcome Back</h2>
        <p className="text-center mb-6">Login to your account.</p>
        
        {error && <div className="server-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username, Email, or Phone</label>
            <input 
              className="form-input" 
              name="identifier" 
              value={formData.identifier} 
              onChange={handleChange} 
              placeholder="johndoe or email or phone" 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                className="form-input" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••" 
                style={{ paddingRight: '2.5rem' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button className="btn mt-4" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account? <Link to="/register" className="link">Register here</Link>
        </p>
      </div>
    </div>
  );
}
