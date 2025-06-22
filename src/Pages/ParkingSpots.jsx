import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../ParkingSpots.css';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import availableIcon from '../assets/location.png';
import unavailableIcon from '../assets/placeholder.png';
import currentIcon from '../assets/pin.png';

const blueIcon = new L.Icon({
  iconUrl: availableIcon,
  shadowUrl: markerShadow,
  iconSize: [30, 41],
  iconAnchor: [15, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: unavailableIcon,
  shadowUrl: markerShadow,
  iconSize: [30, 41],
  iconAnchor: [15, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: currentIcon,
  shadowUrl: markerShadow,
  iconSize: [30, 41],
  iconAnchor: [15, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ParkingSpots = () => {
  const [allSpots, setAllSpots] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [type, setType] = useState("All");
  const [points, setPoints] = useState(0);
  const navigate = useNavigate();

  const query = new URLSearchParams(useLocation().search);
  const location = query.get("location") || "Vancouver";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
          setUserLocation(null);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const res = await axios.get("https://parkify-web-app-backend.onrender.com/api/free-parking");
        const filtered = res.data.filter((spot) => {
          const loc = location.toLowerCase();
          return loc === "vancouver"
            ? spot.area?.toLowerCase().includes("vancouver") || spot.address?.toLowerCase().includes("vancouver")
            : spot.area?.toLowerCase().includes(loc) || spot.address?.toLowerCase().includes(loc);
        });
        setAllSpots(filtered);
      } catch (err) {
        console.error("Error fetching spots from DB", err);
      }
    };

    fetchSpots();
  }, [location]);

  useEffect(() => {
    const lastSpot = localStorage.getItem("navigatedSpot");
    if (lastSpot) {
      setTimeout(() => {
        if (window.confirm("Are you parking here?")) {
          const spot = JSON.parse(lastSpot);
          localStorage.removeItem("navigatedSpot");

          const report = window.prompt("Can you see more free spots around? (Enter number)");
          const num = parseInt(report);
          if (!isNaN(num) && num >= 0) {
            setPoints(points + num * 5);
            alert(`Thanks! You earned ${num * 5} points.`);
          }
          navigate("/status", { state: { parkedSpot: spot } });
        } else {
          localStorage.removeItem("navigatedSpot");
          navigate(`/spots?location=${location}`);
        }
      }, 1500);
    }
  }, []);

  const filteredSpots = type === "All"
    ? allSpots.filter((spot) => spot.latitude && spot.longitude)
    : allSpots.filter((spot) => type === "Paid" ? spot.paid : !spot.paid);

  const getMarkerIcon = (spot) => {
    return spot.hasSpots ? blueIcon : redIcon;
  };

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
        { ["All", "Paid", "Free"].map((tab) => (
          <button key={tab} className={type === tab ? "active" : ""} onClick={() => setType(tab)}>
            {tab}
          </button>
        )) }
      </div>

      <p style={{ textAlign: 'center', marginBottom: '10px', color: '#333', fontWeight: '500' }}>
        Showing <span style={{ color: '#ff5722' }}>{filteredSpots.length}</span> of <span style={{ color: '#ff5722' }}>{allSpots.length}</span> spots
      </p>

      {filteredSpots.length > 1000 && (
        <p style={{ textAlign: 'center', color: 'gray' }}>
          Zoom in to see individual markers. Too many spots clustered.
        </p>
      )}

      <div style={{ height: "80vh", width: "100%" }}>
        <MapContainer
          center={userLocation ? [userLocation.lat, userLocation.lng] : [49.2827, -123.1207]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          <MarkerClusterGroup chunkedLoading iconCreateFunction={(cluster) => {
            return L.divIcon({
              html: `<div style="background:#007bff;color:#fff;font-size:13px;font-weight:bold;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">${cluster.getChildCount()}</div>`
            });
          }}>
            {filteredSpots.map((spot, index) => (
              spot.latitude && spot.longitude && (
                <Marker
                  key={index}
                  position={[spot.latitude, spot.longitude]}
                  icon={getMarkerIcon(spot)}
                >
                  <Popup>
                    <h4>{spot.name}</h4>
                    <p><b>Type:</b> {spot.type}</p>
                    <p><b>Address:</b> {spot.address || 'Unknown'}</p>
                    <p><b>Rate:</b> {spot.paid ? (spot.rate || 'Check signage') : 'Free'}</p>
                    <p><b>Hours:</b> {spot.paid ? (spot.hours || '9 AM – 10 PM') : (spot.hours || 'Unknown')}</p>
                    <p><b>Notes:</b> {spot.paid ? (spot.notes || 'Standard meter info') : (spot.notes || 'None')}</p>
                    {!spot.paid && (
                      <p><b>Free Spots:</b> {spot.hasSpots ? `Yes (${spot.availableSpots})` : 'No'}</p>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => localStorage.setItem("navigatedSpot", JSON.stringify(spot))}
                    >
                      <button
                        style={{
                          marginTop: "8px",
                          padding: "6px 12px",
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "500",
                          cursor: "pointer",
                          width: "100%",
                          display: "block"
                        }}
                      >
                        Get Directions
                      </button>
                    </a>
                  </Popup>
                </Marker>
              )
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
};

export default ParkingSpots;
