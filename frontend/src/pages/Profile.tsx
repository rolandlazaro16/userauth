import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, ShieldCheck, LogOut, Camera } from 'lucide-react';
import { api } from '../lib/api';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');

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
        const name = encodeURIComponent(data?.username || 'User');
        setAvatarUrl(`https://ui-avatars.com/api/?name=${name}&background=3b82f6&color=fff&size=150&bold=true&rounded=true`);
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setAvatarUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="text-center" style={{ color: 'var(--text-secondary)' }}>Loading profile...</div>
      </div>
    );
  }

  const createdDate = profile?.createdAt 
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="app-container">
      <div className="glass-container fade-in" style={{ maxWidth: '480px' }}>
        <div className="text-center mb-6">
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              padding: '3px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
              margin: '0 auto'
            }}>
              <img 
                src={avatarUrl} 
                alt="Profile Avatar" 
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <label 
              htmlFor="avatar-input" 
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                backgroundColor: 'var(--accent-color)',
                color: '#fff',
                borderRadius: '50%',
                padding: '0.4rem',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s'
              }}
              title="Change Profile Picture"
            >
              <Camera size={16} />
              <input 
                id="avatar-input" 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <h2>{profile?.username}</h2>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.3rem', 
            fontSize: '0.85rem', 
            color: 'var(--success-color)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            marginTop: '0.25rem'
          }}>
            <ShieldCheck size={14} /> Verified Member
          </div>
        </div>

        {error && <div className="server-error">{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} color="var(--accent-color)" /> Username
            </label>
            <div className="form-input" style={{ opacity: 0.9, backgroundColor: 'rgba(0,0,0,0.3)' }}>
              {profile?.username}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} color="var(--accent-color)" /> Email Address
            </label>
            <div className="form-input" style={{ opacity: 0.9, backgroundColor: 'rgba(0,0,0,0.3)' }}>
              {profile?.email}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} color="var(--accent-color)" /> Phone Number
            </label>
            <div className="form-input" style={{ opacity: 0.9, backgroundColor: 'rgba(0,0,0,0.3)' }}>
              {profile?.phone}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} color="var(--accent-color)" /> Member Since
            </label>
            <div className="form-input" style={{ opacity: 0.9, backgroundColor: 'rgba(0,0,0,0.3)' }}>
              {createdDate}
            </div>
          </div>
        </div>

        <button 
          className="btn mt-4" 
          onClick={handleLogout} 
          style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.85)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem',
            marginTop: '1.75rem'
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
