import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Status.css';
import BottomNav from './component/BottomNav';

const Status = () => {
  const [history, setHistory] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get("https://parkify-web-app-backend.onrender.com/api/confirmed-parking", {
          params: { userId }
        });
        const allHistory = res.data;

        const confirmedSpotId = localStorage.getItem("confirmedSpotId");
        const startTime = localStorage.getItem(`parkingStart_${confirmedSpotId}`);

        let active = null;

        if (confirmedSpotId && startTime) {
          const activeMatch = allHistory.find(entry => entry.spotId === confirmedSpotId);
          if (activeMatch) {
            active = activeMatch;
            setActiveSession(activeMatch);
            setRemainingTime(null); // Reset timer before interval starts
          }
        }

        const filteredHistory = active
          ? allHistory.filter(entry => entry._id !== active._id)
          : allHistory;

        setHistory(filteredHistory);

        console.log("✅ Fetching history for user:", userId);
        console.log("📦 Received records:", allHistory);

      } catch (err) {
        console.error("Failed to load history", err);
      }
    };

    // ✅ Handle Stripe redirect confirmation
    const handleStripeSuccess = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("success") === "true") {
        // Give time for localStorage to update
        setTimeout(async () => {
          const pending = localStorage.getItem("pendingStripeSpot");
          if (pending) {
            const spot = JSON.parse(pending);
            const storageKey = `parkingStart_${spot._id}`;

            localStorage.setItem("confirmedSpotId", spot._id);
            localStorage.setItem(storageKey, Date.now().toString());

            setActiveSession({
              userId: localStorage.getItem("userId"), spotId: spot._id,
              spotName: spot.name,
              address: spot.address,
              latitude: spot.latitude,
              longitude: spot.longitude,
              duration: 3600,

            });

            try {
              await axios.post("https://parkify-web-app-backend.onrender.com/api/confirmed-parking", {
                userId: localStorage.getItem("userId"),
                spotId: spot._id,
                spotName: spot.name,
                address: spot.address,
                latitude: spot.latitude,
                longitude: spot.longitude,
                duration: 3600,
              });
            } catch (err) {
              console.error("❌ Failed to save confirmed session after Stripe", err);
            }

            localStorage.removeItem("pendingStripeSpot");
            window.history.replaceState({}, document.title, "/status");
          }
        }, 500); // ⏳ Wait 0.5 seconds
      }
    };


    handleStripeSuccess();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!activeSession) return;

    const confirmedSpotId = localStorage.getItem("confirmedSpotId");
    const startTime = localStorage.getItem(`parkingStart_${confirmedSpotId}`);
    if (!startTime) return;

    const duration = activeSession.duration || 3600;

    const updateRemaining = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - Number(startTime)) / 1000);
      const remaining = Math.max(duration - elapsed, 0);
      setRemainingTime(remaining);

      if (remaining === 0) {
        clearInterval(timer);
        localStorage.removeItem("confirmedSpotId");
        localStorage.removeItem(`parkingStart_${confirmedSpotId}`);
        setActiveSession(null);
      }
    };

    updateRemaining(); // Run once immediately
    const timer = setInterval(updateRemaining, 1000);

    return () => clearInterval(timer);
  }, [activeSession]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndParking = async () => {
    const confirmedSpotId = localStorage.getItem("confirmedSpotId");

    if (!confirmedSpotId || !activeSession) return;

    try {

      await axios.put(`https://parkify-web-app-backend.onrender.com/api/free-parking/${confirmedSpotId}`, {
        hasSpots: true,
        availableSpots: 1
      });

      localStorage.removeItem("confirmedSpotId");
      localStorage.removeItem(`parkingStart_${confirmedSpotId}`);

      setActiveSession(null);
      setRemainingTime(null);

      try {
        const res = await axios.get("https://parkify-web-app-backend.onrender.com/api/confirmed-parking", {
          params: { userId: localStorage.getItem("userId") }
          
        });
        setHistory(res.data);
      } catch (err) {
        console.error("❌ Failed to reload history after ending session", err);
      }

    } catch (err) {
      console.error("Failed to end parking and update spot", err);
      alert("Something went wrong while ending your parking session.");
    }
  };

  return (
    <div className="status-container">
      <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />
      <h2 className="title">Parking Status</h2>

      {activeSession ? (
        <div className="active-session">
          <h3>🚗 Currently Parked At</h3>
          <p><strong>{activeSession.spotName}</strong></p>
          <p>{activeSession.address}</p>
          <p>⏳ Time Remaining: <strong>{formatTime(remainingTime || 0)}</strong></p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activeSession.latitude},${activeSession.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1 }}
            >
              <button className="direction-btn">🧭 Get Directions</button>
            </a>
            <button
              className="end-btn"
              onClick={handleEndParking}
              style={{ flex: 1 }}
            >
              ❌ End Parking
            </button>
          </div>
        </div>
      ) : (
        <p className="no-parking">You are not currently parked.</p>
      )}

      <h3 className="history-title">Parking History</h3>
      {history.length === 0 ? (
        <p className="no-history">No parking history available.</p>
      ) : (
        <ul className="history-list">
          {history.map((entry) => (
            <li key={entry._id} className="history-item">
              <strong>{entry.spotName}</strong><br />
              {entry.address}<br />
              Parked on: {new Date(entry.confirmedAt).toLocaleString()}<br />
              Duration: {Math.floor(entry.duration / 60)} mins
            </li>
          ))}
        </ul>
      )}

      <BottomNav />
    </div>
  );
};

export default Status;
