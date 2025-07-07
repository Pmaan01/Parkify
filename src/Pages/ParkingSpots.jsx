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
  const [lastAction, setLastAction] = useState({});
  const [successMessage, setSuccessMessage] = useState({});
  const [confirmedSpots, setConfirmedSpots] = useState({});
  const [timer, setTimer] = useState({});
  const [activeSpotId, setActiveSpotId] = useState(null);




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
                    <Marker
                      key={spot._id}
                      position={[spot.latitude, spot.longitude]}
                      icon={getMarkerIcon(spot)}
                      eventHandlers={{
                        click: () => setActiveSpotId(spot._id),
                      }}
                    >
                    <Popup
                      autoClose={false}
                      autoPan={false}
                      closeOnClick={false}
                      onClose={() => setActiveSpotId(null)}a
                    >
                      <div style={{ display: activeSpotId === spot._id ? 'block' : 'none' }}>
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

                            {confirmedSpots[spot._id] ? (
                        <button
                          disabled
                          style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '6px 10px',
                            border: 'none',
                            borderRadius: '4px',
                            width: '100%',
                            fontWeight: 'bold',
                            marginTop: '8px',
                          }}
                        >
                          ⏳ Parking confirmed: {Math.floor(timer[spot._id] / 60)}:
                          {(timer[spot._id] % 60).toString().padStart(2, '0')}
                        </button>
                      ) : (
                        <div style={{ marginTop: '6px' }}>
                          <strong>Are you parking here?</strong>
                          <button
                            onClick={() => {
                              setConfirmedSpots(prev => ({ ...prev, [spot._id]: true }));
                              setTimer(prev => ({ ...prev, [spot._id]: 3600 })); // 1 hour (in seconds)

                              // Start timer
                              const interval = setInterval(() => {
                                setTimer(prev => {
                                  const updated = { ...prev };
                                  if (updated[spot._id] > 0) {
                                    updated[spot._id] -= 1;
                                  } else {
                                    clearInterval(interval);
                                  }
                                  return updated;
                                });
                              }, 1000);

                              // Redirect to Stripe (open in new tab for now)
                              window.open("https://your-stripe-checkout-url.com", "_blank");
                            }}
                            style={{
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              padding: '6px 10px',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              width: '100%',
                            }}
                          >
                            Yes, I’m parking here
                          </button>
                        </div>
                      )}




                    {!reportedSpots[spot._id] ? (
                                      <>
                        {successMessage[spot._id] && (
                    <p style={{ color: "#4CAF50", fontWeight: "bold", margin: "6px 0" }}>
                      {successMessage[spot._id]}
                    </p>
                  )}

                  <strong>Report Status:</strong>
                  <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                    {lastAction[spot._id] !== "available" && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await axios.put(`https://parkify-web-app-backend.onrender.com/api/free-parking/${spot._id}`, {
                              hasSpots: true,
                              availableSpots: 1,
                            });
                            await fetchSpots();
                            setPoints((prev) => prev + 5);
                            setInputVisible(prev => ({ ...prev, [spot._id]: true }));
                            setLastAction(prev => ({ ...prev, [spot._id]: "available" }));
                            setSuccessMessage(prev => ({
                              ...prev,
                              [spot._id]: `🟢 Spot marked available! You earned 5 points.`,
                            }));
                            setTimeout(() => {
                              setSuccessMessage(prev => ({ ...prev, [spot._id]: null }));
                            }, 4000);
                          } catch (error) {
                            console.error("Error marking spot available:", error);
                            setSuccessMessage(prev => ({
                              ...prev,
                              [spot._id]: "❌ Could not mark as available. Try again.",
                            }));
                          }
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: "#4CAF50",
                          color: "white",
                          padding: "6px 10px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        Spot Available
                      </button>
                    )}

                    {lastAction[spot._id] !== "full" && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await axios.put(`https://parkify-web-app-backend.onrender.com/api/free-parking/${spot._id}`, {
                              hasSpots: false,
                              availableSpots: 0,
                            });
                            await fetchSpots();
                            setLastAction(prev => ({ ...prev, [spot._id]: "full" }));
                            setSuccessMessage(prev => ({
                              ...prev,
                              [spot._id]: "🔴 Spot marked as full.",
                            }));
                            setTimeout(() => {
                              setSuccessMessage(prev => ({ ...prev, [spot._id]: null }));
                            }, 4000);
                          } catch (error) {
                            console.error("Error marking full:", error);
                            setSuccessMessage(prev => ({
                              ...prev,
                              [spot._id]: "❌ Could not mark full. Try again.",
                            }));
                          }
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: "#f44336",
                          color: "white",
                          padding: "6px 10px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        All Full
                      </button>
                    )}
                  </div>

                  {inputVisible[spot._id] && (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '10px' }}>
                      <input
                        type="number"
                        placeholder="Spots"
                        min="0"
                        value={freeCounts[spot._id] || ''}
                        onChange={(e) =>
                          setFreeCounts(prev => ({ ...prev, [spot._id]: e.target.value }))
                        }
                        style={{ width: "60px", padding: "4px", fontSize: "14px" }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReportSubmit(spot._id);
                          setSuccessMessage(prev => ({
                            ...prev,
                            [spot._id]: `✅ You submitted ${freeCounts[spot._id]} spot(s). Keep helping!`,
                          }));
                          setTimeout(() => {
                            setSuccessMessage(prev => ({ ...prev, [spot._id]: null }));
                          }, 4000);
                        }}
                        style={{
                          backgroundColor: "#2196F3",
                          color: "white",
                          border: "none",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
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
