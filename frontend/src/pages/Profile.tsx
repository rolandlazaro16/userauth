import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const data = await api.getProfile(token);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile.');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="glass-container fade-in">
        <h2 className="text-center">Your Profile</h2>
        <p className="text-center mb-6">Welcome, {profile?.username}!</p>

        {error && <div className="server-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Email</label>
          <div className="form-input" style={{ opacity: 0.8 }}>{profile?.email}</div>
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <div className="form-input" style={{ opacity: 0.8 }}>{profile?.phone}</div>
        </div>

        <button className="btn mt-4" onClick={handleLogout} style={{ backgroundColor: 'var(--error-color)' }}>
          Logout
        </button>
      </div>
    </div>
  );
}
