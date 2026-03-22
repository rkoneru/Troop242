import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import '../styles/UserProfile.css';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    rank: '',
    status: '',
    joinDate: ''
  });

  // Load user profile on mount
  useEffect(() => {
    if (!user || !profile) return;

    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      role: profile.role || '',
      rank: profile.rank || '',
      status: profile.status || 'pending',
      joinDate: profile.joinDate || new Date().toISOString().split('T')[0]
    });
  }, [user, profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      if (!user) throw new Error('User not authenticated');

      // Only update editable fields
      await updateDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        phone: formData.phone
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/member-login');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
    }
  };

  if (loading) {
    return (
      <section className="page-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </section>
    );
  }

  const initials = formData.name?.[0]?.toUpperCase() || '?';
  const roleColor = {
    scout: '#00d68f',
    leader: '#52b788',
    admin: '#d4a853'
  }[formData.role] || '#999';

  const statusColor = {
    approved: '#4ade80',
    pending: '#facc15',
    rejected: '#ef4444'
  }[formData.status] || '#999';

  return (
    <section className="profile-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-card"
        >
          <div className="profile-header">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-title-group">
              <h1>My Profile</h1>
              <p className="profile-email">{formData.email}</p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="alert alert-error"
            >
              ✕ {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="alert alert-success"
            >
              ✓ {success}
            </motion.div>
          )}

          <div className="profile-info">
            <div className="profile-field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-input"
              />
            </div>

            <div className="profile-field">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="profile-input profile-input--disabled"
              />
              <small style={{ color: 'var(--text-muted)' }}>Email cannot be changed</small>
            </div>

            <div className="profile-field">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-input"
                placeholder="(XXX) XXX-XXXX"
              />
            </div>

            {isEditing && formData.role === 'scout' && (
              <div className="profile-field">
                <label>Scout Rank</label>
                <select
                  name="rank"
                  value={formData.rank}
                  onChange={handleInputChange}
                  className="profile-input"
                >
                  <option value="">Select a rank</option>
                  <option value="Scout">Scout</option>
                  <option value="Tenderfoot">Tenderfoot</option>
                  <option value="2nd Class">2nd Class</option>
                  <option value="1st Class">1st Class</option>
                  <option value="Star">Star</option>
                  <option value="Life">Life</option>
                  <option value="Eagle">Eagle Scout</option>
                </select>
              </div>
            )}

            <div className="profile-badges">
              <div className="profile-badge">
                <span className="badge-label">Role</span>
                <span className="badge" style={{ background: roleColor }}>
                  {formData.role?.charAt(0).toUpperCase() + formData.role?.slice(1)}
                </span>
              </div>

              <div className="profile-badge">
                <span className="badge-label">Status</span>
                <span className="badge" style={{ background: statusColor }}>
                  {formData.status?.charAt(0).toUpperCase() + formData.status?.slice(1)}
                </span>
              </div>

              {formData.rank && (
                <div className="profile-badge">
                  <span className="badge-label">Rank</span>
                  <span className="badge" style={{ background: 'var(--accent)' }}>
                    {formData.rank}
                  </span>
                </div>
              )}

              <div className="profile-badge">
                <span className="badge-label">Member Since</span>
                <span className="badge" style={{ background: 'var(--bg-secondary)' }}>
                  {new Date(formData.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                ✎ Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? '💾 Saving...' : '💾 Save Changes'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  ✕ Cancel
                </button>
              </>
            )}
          </div>

          <div className="profile-danger-zone">
            <h3>Danger Zone</h3>
            <button
              className="btn btn-danger"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
