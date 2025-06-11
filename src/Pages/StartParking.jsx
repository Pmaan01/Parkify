import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../StartParking.css";

const StartParking = () => {
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (!location) {
      alert("Please enter your location");
      return;
    }
    const selectedType = "paid";
    navigate(`/spots?location=${encodeURIComponent(location)}&type=${selectedType}`);
  };

  // Navigation button handlers
  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="start-container">
      <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />
      <h2 className="title">Start Parking</h2>
      <p className="subtitle">No more circling the block – your perfect spot is just a tap away.</p>

      <div className="location-input">
        <input
          type="text"
          placeholder="Enter your Location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={handleStart} className="search-btn">Search 🔎</button>
      </div>
      <div className="car">
        
      </div>

      <div className="bottom-nav">
        <div className="nav-icon" onClick={() => handleNavClick("/home")}>🏠</div>
        <div className="nav-icon" onClick={() => handleNavClick("/status")}>🚗</div>
        <div className="nav-icon" onClick={() => handleNavClick("/settings")}>⚙️</div>
        <div className="nav-icon" onClick={() => handleNavClick("/profile")}>👤</div>
      </div>
    </div>
  );
};

export default StartParking;
