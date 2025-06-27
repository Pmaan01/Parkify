import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import StartParking from "./Pages/StartParking";
import ParkingSpots from "./Pages/ParkingSpots";
import Scoreboard from "./Pages/Scoreboard";
import React from 'react';
import Profile from './Pages/Profile'; // adjust path based on location





function App() {
  return (
    <Routes>
      <Route path="/home" element={<StartParking />} />
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/spots" element={<ParkingSpots />} />
      <Route path="profile" element={<Profile />} />
      <Route path="/scoreboard" element={<Scoreboard />} />

    </Routes>
  );
}

export default App;
