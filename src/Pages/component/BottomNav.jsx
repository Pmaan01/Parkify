// components/BottomNav.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdHome, MdCarRental, MdAccountBalanceWallet, MdPerson } from 'react-icons/md';
import './BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      <div className="nav-icon" onClick={() => navigate("/home")}><MdHome size={50} /></div>
      <div className="nav-icon" onClick={() => navigate("/status")}><MdCarRental size={50} /></div>
      <div className="nav-icon" onClick={() => navigate("/scoreboard")}> <span style={{ fontSize: 50 }}>🏆</span> </div>
      <div className="nav-icon" onClick={() => navigate("/Wallet")}><MdAccountBalanceWallet size={50} /></div>
      <div className="nav-icon" onClick={() => navigate("/profile")}><MdPerson size={50} /></div>
    </div>
  );
};

export default BottomNav;
