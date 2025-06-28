import React, { useEffect, useState } from 'react';
import './Status.css';
import { useNavigate } from 'react-router-dom';

const StatusPage = () => {
  const [spot, setSpot] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('navigatedSpot');
    if (saved) {
      setSpot(JSON.parse(saved));
    }
  }, []);

  if (!spot) {
    return (
      <div className="status-container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2>No parking spot saved yet.</h2>
        <p>Please select a spot from the map first.</p>
      </div>
    );
  }

  return (
    <div className="status-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2>📍 You're parked here</h2>
      <div className="status-card">
        <h3>{spot.name || 'Unnamed Spot'}</h3>
        <p><strong>Address:</strong> {spot.address || 'Unknown'}</p>
        <p><strong>Type:</strong> {spot.paid ? 'Paid' : 'Free'}</p>
        <p><strong>Available:</strong> {spot.hasSpots ? `Yes (${spot.availableSpots})` : 'No'}</p>
        <p><strong>Latitude:</strong> {spot.latitude}</p>
        <p><strong>Longitude:</strong> {spot.longitude}</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="status-button"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
};

export default StatusPage;
