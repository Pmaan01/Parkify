import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import BottomNav from './component/BottomNav';

export default function Profile() {
  const [user, setUser] = useState({ name: '', email: '', phoneNumber: '', vehicleNumber: '' });
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user profile
      axios
        .get('https://parkify-web-app-backend.onrender.com/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const userData = res.data.data;
          console.log('Profile response:', userData);

          setUser({
            name: userData.name || '',
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            vehicleNumber: userData.vehicleNumber || '',
          });

          const firstLogin = userData.isFirstLogin !== undefined ? userData.isFirstLogin : true;
          setIsFirstLogin(firstLogin);
          setShowNavbar(!firstLogin || (userData.phoneNumber && userData.vehicleNumber));
          setLoading(false); 
        })
        .catch((err) => {
          console.error('Error fetching profile:', err.response?.data || err.message);
          alert('Failed to load profile.');
          setLoading(false);  
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSave = async () => {
    if (isFirstLogin && (!user.phoneNumber || !user.vehicleNumber)) {
      alert('Please fill in Phone Number and Vehicle Number to complete your profile.');
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.put(
          'https://parkify-web-app-backend.onrender.com/api/auth/profile',
          user,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Profile update response:', res.data);
        alert('Profile saved successfully!');

        setIsFirstLogin(false);
        setShowNavbar(true);

        const returnTo = localStorage.getItem('returnTo') || '/home';
        localStorage.removeItem('returnTo');
        navigate(returnTo);
      } catch (err) {
        console.error('Error saving profile:', err.response ? err.response.data : err.message);
        alert('Failed to save profile.');
      }
    } else {
      alert('No token found. Please log in.');
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-content">
          <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />
        <h2>Edit Your Profile</h2>
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
          disabled 
          readOnly
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

      {showNavbar && <BottomNav />}
    </div>
  );
}
