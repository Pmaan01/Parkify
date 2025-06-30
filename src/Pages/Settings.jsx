import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdHome, MdCarRental, MdSettings, MdPerson } from "react-icons/md";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      <div className="bottom-navbar">
        <div className="nav-icon" onClick={() => navigate("/home")}><MdHome size={50} /></div>
        <div className="nav-icon" onClick={() => navigate("/status")}><MdCarRental size={50} /></div>
        <div className="nav-icon active" onClick={() => navigate("/settings")}><MdSettings size={50} /></div>
        <div className="nav-icon" onClick={() => navigate("/profile")}><MdPerson size={50} /></div>
      </div>
    </div>
  );
}
