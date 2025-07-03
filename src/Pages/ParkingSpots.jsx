import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../ParkingSpots.css';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import parkifyLogo from '../assets/Parkify-logo.jpg';
import BottomNav from './component/BottomNav'; 
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
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [points, setPoints] = useState(0);
  const [reportedSpots, setReportedSpots] = useState({});
  const [inputVisible, setInputVisible] = useState({});
  const [freeCounts, setFreeCounts] = useState({});
  const [parkedSpotId, setParkedSpotId] = useState(null);
  const navigate = useNavigate();

  const query = new URLSearchParams(useLocation().search);
  const selectedArea = query.get("location") || "All";

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

  const fetchSpots = async () => {
    try {
      const res = await axios.get("https://parkify-web-app-backend.onrender.com/api/free-parking");
      setAllSpots(res.data);
    } catch (err) {
      console.error("Error fetching spots from DB", err);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  const filteredSpots = allSpots
    .filter((spot) => {
      if (!spot.latitude || !spot.longitude) return false;
      if (selectedArea === "All") return true;
      return (
        spot.area?.toLowerCase().includes(selectedArea.toLowerCase()) ||
        spot.address?.toLowerCase().includes(selectedArea.toLowerCase())
      );
    })
    .filter((spot) => {
      if (type === "All") return true;
      return type === "Paid" ? spot.paid : !spot.paid;
    })
    .filter((spot) => (onlyAvailable ? spot.hasSpots === true : true));

  const getMarkerIcon = (spot) => {
    return spot.hasSpots ? blueIcon : redIcon;
  };

  const handleReportSubmit = async (spotId) => {
    const num = parseInt(freeCounts[spotId]);
    if (!isNaN(num) && num >= 0) {
      try {
        await axios.put(`https://parkify-web-app-backend.onrender.com/api/free-parking/${spotId}`, {
          hasSpots: true,
          availableSpots: num,
        });
        await fetchSpots();
        setPoints((prev) => prev + num * 5);
        setReportedSpots((prev) => ({ ...prev, [spotId]: true }));
        alert(`Thanks! You earned ${num * 5} points.`);
      } catch (error) {
        console.error("Error updating spot:", error);
        alert("Failed to update spot.");
      }
    }
  };

  return (
    <div className="spots-container">
      <header className="top-header">
        <button className="back-btn" onClick={() => window.history.back()}>
            ←
          </button>
        <div className="header-title">
          <h2>Parking Spots in {selectedArea}</h2>
        </div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={availableIcon} alt="Available" style={{ width: '20px' }} />
          <span style={{ color: '#007bff', fontWeight: 500 }}>Available (Blue)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={unavailableIcon} alt="Unavailable" style={{ width: '20px' }} />
          <span style={{ color: '#d32f2f', fontWeight: 500 }}>Occupied (Red)</span>
        </div>
      </div>

      <div className="filter-tabs">
        {['All', 'Paid', 'Free'].map((tab) => (
          <button key={tab} className={type === tab ? 'active' : ''} onClick={() => setType(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="availability-filter">
        <label>
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={() => setOnlyAvailable(!onlyAvailable)}
          />
          <span className="checkmark"></span>
          Show only available spots
        </label>
      </div>

      <p style={{ textAlign: 'center', marginBottom: '10px', color: '#333', fontWeight: '500' }}>
        Showing <span style={{ color: '#ff5722' }}>{filteredSpots.length}</span> of <span style={{ color: '#ff5722' }}>{allSpots.length}</span> spots
      </p>

      <div style={{ height: '80vh', width: '100%' }}>
        <MapContainer
          center={userLocation ? [userLocation.lat, userLocation.lng] : [49.2827, -123.1207]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
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
              <Marker key={index} position={[spot.latitude, spot.longitude]} icon={getMarkerIcon(spot)}>
                <Popup>
                  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.5' }}>
                    <h4>{spot.name}</h4>
                    <p><strong>Type:</strong> {spot.type}</p>
                    <p><strong>Address:</strong> {(spot.address && spot.address.trim()) ? spot.address : (spot.area || 'Vancouver')}</p>
                    <p><strong>Rate:</strong> {spot.paid ? (spot.rate || 'Check signage') : 'Free'}</p>
                    <p><strong>Hours:</strong> {spot.paid ? (spot.hours || '9 AM – 10 PM') : (spot.hours || 'Unknown')}</p>
                    <p><strong>Notes:</strong> {spot.notes || 'None'}</p>
                    {!spot.paid && (
                      <p><strong>Free Spots:</strong> {spot.hasSpots ? `Yes (${spot.availableSpots})` : 'No'}</p>
                    )}

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => localStorage.setItem("navigatedSpot", JSON.stringify(spot))}
                    >
                      <button style={{ margin: "10px 0", padding: "8px 12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px", width: "100%", fontWeight: "bold", cursor: "pointer" }}>
                        Get Directions
                      </button>
                    </a>

                    <strong>Are you parking here?</strong>
                    <div style={{ marginTop: '6px' }}>
                      <button
                        onClick={() => {
                          setParkedSpotId(spot._id);
                          localStorage.setItem("navigatedSpot", JSON.stringify(spot));
                          navigate("/status", { state: { parkedSpot: spot } });
                        }}
                        style={{ backgroundColor: '#4CAF50', color: 'white', padding: '6px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
                      >
                        ✅ Yes, I'm parking here
                      </button>
                    </div>

                    {!reportedSpots[spot._id] ? (
                      <>
                        <strong>Report Status:</strong>
                        <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                          <button
                            onClick={async () => {
                              try {
                                await axios.put(`https://parkify-web-app-backend.onrender.com/api/free-parking/${spot._id}`, {
                                  hasSpots: true,
                                  availableSpots: 1,
                                });
                                await fetchSpots();
                                setPoints((prev) => prev + 5);
                                alert("Thanks! 1 spot marked as available. You earned 5 points.");
                                setInputVisible(prev => ({ ...prev, [spot._id]: true }));
                              } catch (error) {
                                console.error("Error marking spot available:", error);
                                alert("Failed to update. Please try again.");
                              }
                            }}
                            style={{ flex: 1, backgroundColor: "#4CAF50", color: "white", padding: "6px 10px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                          >
                            Spot Available
                          </button>

                          <button
                          onClick={async () => {
                            try {
                              await axios.put(`https://parkify-web-app-backend.onrender.com/api/free-parking/${spot._id}`, {
                                hasSpots: false,
                                availableSpots: 0,
                              });
                              await fetchSpots();
                              alert("Thanks! Marked as full.");
                              setReportedSpots((prev) => ({ ...prev, [spot._id]: true }));
                            } catch (error) {
                              console.error("Error marking full:", error);
                              alert("Failed to update spot.");
                            }
                          }}
                          style={{
                            flex: 1,
                            backgroundColor: "#f44336",
                            color: "white",
                            padding: "6px 10px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          All Full
                        </button>

                        </div>

                        {inputVisible[spot._id] && (
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '10px' }}>
                            <input
                              type="number"
                              placeholder="Spots"
                              min="0"
                              value={freeCounts[spot._id] || ''}
                              onChange={(e) => setFreeCounts(prev => ({ ...prev, [spot._id]: e.target.value }))}
                              style={{ width: "60px", padding: "4px", fontSize: "14px" }}
                            />
                            <button
                              onClick={() => handleReportSubmit(spot._id)}
                              style={{ backgroundColor: "#2196F3", color: "white", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer" }}
                            >
                              Submit
                            </button>
                            
                          </div>
                        )}
                      </>
                    ) : (
                      <p style={{ color: "#4CAF50", fontWeight: "500" }}>✔️ Thanks for your input!</p>
                    )}
                    
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
      <BottomNav />
    </div>
  );
};

export default ParkingSpots;
