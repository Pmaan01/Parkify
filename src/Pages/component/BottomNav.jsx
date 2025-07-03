// components/BottomNav.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdHome, MdCarRental, MdSettings, MdPerson } from 'react-icons/md';
import './BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      <div className="nav-icon" onClick={() => navigate("/home")}><MdHome size={50} /></div>
      <div className="nav-icon" onClick={() => navigate("/status")}><MdCarRental size={50} /></div>
      <div className="nav-icon" onClick={() => navigate("/settings")}><MdSettings size={50} /></div>
      <div className="nav-icon" onClick={() => navigate("/profile")}><MdPerson size={50} /></div>
    </div>
  );
};

export default BottomNav;
