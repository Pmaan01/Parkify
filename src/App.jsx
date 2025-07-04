import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import StartParking from "./Pages/StartParking";
import ParkingSpots from "./Pages/ParkingSpots";
import Profile from './Pages/Profile';
import Status from './Pages/Status'; 
import MobileContainer from './Pages/MobileContainer'; 
import Scoreboard from "./Pages/Scoreboard";
import Settings from './Pages/Settings';



function App() {
  return (
    <MobileContainer>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<StartParking />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/spots" element={<ParkingSpots />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/status" element={<Status />} /> 
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="/settings" element={<Settings />} />
        

      </Routes>
    </MobileContainer>
  );
}

export default App;
