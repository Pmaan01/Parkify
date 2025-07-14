
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './component/BottomNav';
import './Wallet.css';

export default function Wallet() {
  const navigate = useNavigate();

  return (
    <div className="wallet-container">
      <div className="wallet-content">
        <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />
        <h2>Wallet</h2>
        <p>Your points and balance will be displayed here.</p>
        {/* Placeholder for points and cash-out functionality (to be implemented in point 6) */}
      </div>
      <BottomNav />
    </div>
  );
}
