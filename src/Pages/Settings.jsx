import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import { MdHome, MdCarRental, MdSettings, MdPerson } from "react-icons/md";

export default function Settings() {
  const navigate = useNavigate();

  // Handle navigation click
  const handleNavClick = (path) => {
    navigate(path);
  };

  // Array of settings options (only 'Edit Profile' has a path right now)
  const settingsOptions = [
    { label: 'Edit Profile', path: '/profile' }, // Updated to /profile
    { label: 'Change Password', path: null },
    { label: 'Delete Account', path: null },
    { label: 'Notifications', path: null },
    { label: 'Privacy Settings', path: null },
    { label: 'Wallet', path: null },
    { label: 'Support', path: null },
    { label: 'Logout', path: null },
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
              onClick={() => option.path && navigate(option.path)} // Navigate if path exists
              disabled={!option.path} // Disable button if no path
              className={option.path ? '' : 'disabled'} // Apply class for disabled styling
            >
              {option.label}
            </button>
          ))}
        </div>
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