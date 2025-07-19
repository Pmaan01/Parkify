
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BottomNav from './component/BottomNav';
import './Wallet.css';



export default function Wallet() {
  const [userScore, setUserScore] = useState(null);
  const [username, setUsername] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

const POINT_TO_DOLLAR = 0.001;

  useEffect(() => {
    const email = localStorage.getItem('email');
    console.log('🧠 Retrieved email from localStorage:', email);

    if (!email) {
      console.warn('⚠️ No email found in localStorage. Cannot fetch score.');
      return;
    }

    const url = `https://parkify-5cf7.onrender.com/api/score/user/${email}`;
    console.log('📤 Sending request to:', url);

    axios
      .get(url)
      .then((res) => {
        console.log('✅ Score API Response:', res.data);
        setUserScore(res.data.score);
        setUsername(res.data.username || 'User');
      })
      .catch((err) => {
        console.error('❌ Error fetching user score:', err.message);
        if (err.response) {
          console.error('🔎 Full error response:', err.response);
        }
      });
  }, []);

  const handleWithdraw = () => {
    if (userScore < 5000) {
      alert('⚠️ You need at least 5,000 points to withdraw $5.');
      return;
    }

    const confirmWithdraw = window.confirm(
      `Are you sure you want to withdraw $5 (5,000 points)?`
    );

    if (confirmWithdraw) {
      setIsProcessing(true);
      // Simulate a delay
      setTimeout(() => {
        setUserScore((prev) => prev - 5000);
        setIsProcessing(false);
        alert('✅ $5 withdrawal successful! (Simulated)');
        // Later: POST to /api/withdraws
      }, 2000);
    }
  };

  const moneyValue =
    userScore !== null ? (userScore * POINT_TO_DOLLAR).toFixed(2) : '0.00';

  return (
    <div className="wallet-container">
      <div className="wallet-content">
        <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />
        <h2>Wallet</h2>

        {userScore !== null ? (
          <div>
            <p>
              <strong>{username}'s Points:</strong> {userScore} pts
            </p>
            <p>
              <strong>Cash Value:</strong> ${moneyValue}
            </p>

            <button
              className="withdraw-button"
              onClick={handleWithdraw}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Withdraw $5'}
            </button>
          </div>
        ) : (
          <p>Loading your points...</p>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
