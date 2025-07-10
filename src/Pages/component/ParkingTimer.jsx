import React, { useEffect, useState } from 'react';

const ParkingTimer = ({ spotId, duration = 3600, onTimerEnd }) => {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    const storageKey = `parkingStart_${spotId}`;
    const storedStartTime = localStorage.getItem(storageKey);

    // 🟡 Exit early if no valid start time exists
    if (!storedStartTime) {
      console.warn("No parking start time found for", spotId);
      return;
    }

    const startTime = Number(storedStartTime);

    const updateRemaining = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const timeLeft = Math.max(duration - elapsed, 0);
      setRemaining(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);
        localStorage.removeItem(storageKey);
        if (onTimerEnd) onTimerEnd();
      }
    };

    updateRemaining(); // run immediately
    const interval = setInterval(updateRemaining, 1000);

    return () => clearInterval(interval);
  }, [spotId, duration, onTimerEnd]);

  const formatTime = (total) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (remaining === null) return null; // Don't render if timer is not ready

  return (
    <div style={{
      marginTop: '10px',
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '8px',
      borderRadius: '4px',
      textAlign: 'center',
      fontWeight: 'bold'
    }}>
      ⏳ Parking confirmed: {formatTime(remaining)}
    </div>
  );
};

export default ParkingTimer;
