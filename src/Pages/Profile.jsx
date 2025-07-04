import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import { MdHome, MdCarRental, MdSettings, MdPerson } from "react-icons/md";

export default function Profile() {
  const [user, setUser] = useState({ name: '', email: '', phoneNumber: '', vehicleNumber: '' });
  const[isFirstLogin, setIsFirstLogin] = useState(true);
  const [showNavbar, setShowNavbar] = useState(false);
  const navigate = useNavigate();
  //const location = useLocation();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {

      try {

          // Decode token to get isFirstLogin
          const decoded = JSON.parse(atob(token.split('.')[1]));
          console.log("Decoded token:", decoded);
          const firstLogin = decoded.isFirstLogin !== undefined ? decoded.
          isFirstLogin : true;
          setIsFirstLogin(firstLogin);
          setShowNavbar(!firstLogin); // Show navbar if not first login

          //Fetch user profile
          axios.get('https://parkify-web-app-backend.onrender.com/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            console.log("Profile response:", res.data);
            setUser({ 
                name: res.data.name || '', 
                email: res.data.email || '', 
                phoneNumber: res.data.phoneNumber || '', 
                vehicleNumber: res.data.vehicleNumber || '' 
            });
        }).catch(err => {
            console.error('Error fetching profile:', err.response?.data || err.message);
            alert('Failed to load profile.');
            navigate('/login');
        });
      } catch (err) {
                console.error('Error decoding token:', err);
                alert('Invalid token. Please log in again.');
                navigate('/login');
            }
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
         await axios.put('https://parkify-web-app-backend.onrender.com/api/auth/profile', user, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Profile saved successfully!');
        if (isFirstLogin) {
          setShowNavbar(true); // Show navbar after saving
          setIsFirstLogin(false); // Update local state
        }
        navigate('/home'); // Redirect to StartParking after saving
      } catch (err) {
        console.error('Error saving profile:', err.response ? err.response.data : err.message);
        alert('Failed to save profile.');
      }
    } else {
      alert('No token found. Please log in.');
    }
  };

  // Handle navigation click
  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />
        <h2>{isFirstLogin ? "Your Profile is incomplete" : "Edit your profile"}</h2>
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


        {showNavbar &&(
        <div className="bottom-nav">
            <div className="nav-icon" onClick={() => handleNavClick("/home")}><MdHome size={50} /></div>
            <div className="nav-icon" onClick={() => handleNavClick("/status")}><MdCarRental size={50} /></div>
            <div className="nav-icon" onClick={() => handleNavClick("/settings")}><MdSettings size={50} /></div>
            <div className="nav-icon" onClick={() => handleNavClick("/profile")}><MdPerson size={50} /></div>
        </div>
        )}
    </div>
  );
}

