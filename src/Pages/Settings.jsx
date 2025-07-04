import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';
import './Settings.css';
import { MdHome, MdCarRental, MdSettings, MdPerson } from "react-icons/md";

export default function Settings() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Handle navigation click
  const handleNavClick = (path) => {
    navigate(path);
  };

  // Handle logout
  const handleLogout = () => {
    try {
      // Clear token from localStorage
      localStorage.removeItem('token');

      // Redirect to login page
      navigate('/login');
      alert('Successfully logged out!');
    } catch (err) {
      console.error('Error during logout:', err);
      alert('Failed to log out. Please try again.');
    }
  };

  // Array of settings options
  const settingsOptions = [
    //{ label: 'Edit Profile', path: '/profile' }, // Updated to /profile
    { label: 'Change Password', path: null },
    { label: 'Delete Account', path: null },
    { label: 'Notifications', path: null },
    { label: 'Privacy Settings', path: null },
    { label: 'Wallet', path: null },
    { label: 'Support', path: null },
    { label: 'Logout',
      path: null,
      action: () => setShowLogoutConfirm(true), // Show confirmation dialog
    },
  ];

  return (
    <div className="settings-container">
      <div className="settings-content">
        <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />
        <h2>Settings</h2>

        {/* List of settings buttons */}
        <div className="settings-list">
          {settingsOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                if (option.action) {
                  option.action(); //Trigger custom action (e.g., logout confirmation)
                } else if (option.path) {
                  navigate(option.path); //Navigate if path exists
                }
              }}
              disabled={!option.path && !option.action} //Disable if no path or action
              className={option.path || option.action ? '' : 'disabled'} 
              >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="logout-confirm-overlay">
          <div className="logout-confirm-dialog">
            <h3>Are you sure you want to logout?</h3>
            <div className="logout-confirm-buttons">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button onClick={handleLogout} className="ok-btn">
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bottom-nav">
            <div className="nav-icon" onClick={() => handleNavClick("/home")}><MdHome size={50} /></div>
            <div className="nav-icon" onClick={() => handleNavClick("/status")}><MdCarRental size={50} /></div>
            <div className="nav-icon" onClick={() => handleNavClick("/settings")}><MdSettings size={50} /></div>
            <div className="nav-icon" onClick={() => handleNavClick("/profile")}><MdPerson size={50} /></div>
        </div>
    </div>
  );
}