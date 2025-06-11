import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../ParkingSpots.css';

const ParkingSpots = () => {
  const [spots, setSpots] = useState([]);
  const [type, setType] = useState("All");

  const query = new URLSearchParams(useLocation().search);
  const location = query.get("location") || "Vancouver";

  useEffect(() => {
    axios
      .get(
        `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/parking-meters/records?where=geo_local_area%20LIKE%20%27%25${encodeURIComponent(
          location
        )}%25%27&limit=50`
      )
      .then((res) => {
        setSpots(res.data.results);
      })
      .catch(() => setSpots([]));
  }, [location]);

  const filteredSpots = type === "All"
    ? spots
    : spots.filter((spot) => {
        const rates = [
          spot.r_mf_9a_6p, spot.r_mf_6p_10, spot.r_sa_9a_6p,
          spot.r_sa_6p_10, spot.r_su_9a_6p, spot.r_su_6p_10, spot.rate_misc
        ];
        const isPaid = rates.some(r => r && r.trim() !== "$0.00");
        return type === "Paid" ? isPaid : !isPaid;
      });

  return (
    <div className="spots-container">
      <header className="top-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => window.history.back()}>
            ←
          </button>
        </div>
        <div className="header-title">
          <h2>Your Perfect Spot Awaits</h2>
        </div>
      </header>

      <div className="filter-tabs">
        {["All", "Paid", "Free"].map((tab) => (
          <button key={tab} className={type === tab ? "active" : ""} onClick={() => setType(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="spot-list">
        {filteredSpots.length === 0 ? (
          <p>No {type.toLowerCase()} parking spots found in {location}.</p>
        ) : (
          filteredSpots.map((spot, index) => {
            const rate =
              spot.r_mf_9a_6p ||
              spot.r_mf_6p_10 ||
              spot.r_sa_9a_6p ||
              spot.r_sa_6p_10 ||
              spot.r_su_9a_6p ||
              spot.r_su_6p_10 ||
              spot.rate_misc ||
              "$0.00";

            return (
              <div className="spot-card" key={index}>
                <h4>Meter {spot.meterid || "N/A"}</h4>
                <div className="spot-details">
                  <p><b>Rate:</b> {rate.trim() === "$0.00" ? "Free" : rate}</p>
                  <p><b>Time Limit:</b> {spot.t_mf_9a_6p || spot.time_misc || "Unknown"}</p>
                  <p><b>Area:</b> {spot.geo_local_area || "Unknown"}</p>
                  <p><b>Credit Card:</b> {spot.creditcard === "Yes" ? "✅" : "❌"}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ParkingSpots;
