import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

export default function Profile() {
  const [user, setUser] = useState({ name: '', email: '', phoneNumber: '', vehicleNumber: '' });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token on mount:', token);
    if (token) {
      axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setUser({ 
          name: res.data.name || '', 
          email: res.data.email || '', 
          phoneNumber: res.data.phoneNumber || '', 
          vehicleNumber: res.data.vehicleNumber || '' 
        });
      }).catch(err => {
        console.error('Error fetching profile:', err);
      });
    }
  }, []);

   const handleSave = async () => {
    console.log('Saving user data:', user);
    const token = localStorage.getItem('token');
    console.log('Token during save:', token);
    if (token) {
      try {
        const response = await axios.put('http://localhost:5000/api/auth/profile', user, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Save response:', response.data);
        alert('Profile saved successfully!');
      } catch (err) {
        console.error('Error saving profile:', err.response ? err.response.data : err.message);
        alert('Failed to save profile.');
      }
    } else {
      alert('No token found. Please log in.');
    }
  };


  return (
    <div className="auth-container">
      <div className="profile-content">
        <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />
        <h2>My Profile</h2>
        <input
          type="text"
          placeholder="Name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={user.phoneNumber}
          onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
        />
        <input
          type="text"
          placeholder="Vehicle Number"
          value={user.vehicleNumber}
          onChange={(e) => setUser({ ...user, vehicleNumber: e.target.value })}
        />
        <button onClick={handleSave}>Save</button>
      </div>

      <div className="bottom-nav">
        <div className="nav-icon" onClick={() => navigate('/home')}>🏠</div>
        <div className="nav-icon" onClick={() => navigate('/status')}>🚗</div>
        <div className="nav-icon" onClick={() => navigate('/settings')}>⚙️</div>
        <div className="nav-icon active" onClick={() => navigate('/profile')}>👤</div>
      </div>
    </div>
  );
}
