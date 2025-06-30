import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import './EditProfile.css';
import { MdHome, MdCarRental, MdSettings, MdPerson } from "react-icons/md";
import { MdArrowBack } from "react-icons/md";

export default function EditProfile() {
  const [user, setUser] = useState({ name: '', email: '', phoneNumber: '', vehicleNumber: '' });
  const navigate = useNavigate();

  // Handle navigation click
  const handleNavClick = (path) => {
    navigate(path);
  };

  // Fetch user profile on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('https://parkify-web-app-backend.onrender.com/api/auth/profile', {
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
        alert('Failed to load profile.');
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Handle profile update
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in.');
      return;
    }

    try {
      await axios.put('https://parkify-web-app-backend.onrender.com/api/auth/profile', user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated successfully!');
      navigate('/settings');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-content">
        <button className="back-btn" onClick={() => navigate('/settings')}>
          <MdArrowBack size={28} />
        </button>
        <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />
        <h2>Edit Profile</h2>
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
            <div className="nav-icon" onClick={() => handleNavClick("/home")}><MdHome size={50} /></div>
            <div className="nav-icon" onClick={() => handleNavClick("/status")}><MdCarRental size={50} /></div>
            <div className="nav-icon" onClick={() => handleNavClick("/settings")}><MdSettings size={50} /></div>
            <div className="nav-icon" onClick={() => handleNavClick("/profile")}><MdPerson size={50} /></div>
        </div>
    </div>
  );
}



