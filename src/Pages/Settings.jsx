import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import { MdHome, MdCarRental, MdSettings, MdPerson } from "react-icons/md";

export default function Settings() {
  const navigate = useNavigate();

  // Array of settings options (only 'Edit Profile' has a path right now)
  const settingsOptions = [
    { label: 'Edit Profile', path: '/edit-profile' },
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

        <div className="settings-list">
          {settingsOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => option.path && navigate(option.path)}
              disabled={!option.path}
              className={option.path ? '' : 'disabled'}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bottom-navbar">
        <div className="nav-icon" onClick={() => navigate("/home")}><MdHome size={50} /></div>
        <div className="nav-icon" onClick={() => navigate("/status")}><MdCarRental size={50} /></div>
        <div className="nav-icon active" onClick={() => navigate("/settings")}><MdSettings size={50} /></div>
        <div className="nav-icon" onClick={() => navigate("/profile")}><MdPerson size={50} /></div>
      </div>
    </div>
  );
}