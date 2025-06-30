import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdHome, MdCarRental, MdSettings, MdPerson } from "react-icons/md";

export default function EditProfile() {
  const navigate = useNavigate();

  // Handle navigation click
  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-content">
        {/* Empty content for now */}
        <h2>Edit Profile</h2>
      </div>

        <div className="bottom-nav">
            <div className="nav-icon" onClick={() => handleNavClick("/home")}><MdHome size={50} /></div>
            <div className="nav-icon" onClick={() => handleNavClick("/status")}><MdCarRental size={50} /></div>
            <div className="nav-icon" onClick={() => handleNavClick("/settings")}><MdSettings size={50} /></div>
            <div className="nav-icon" onClick={() => handleNavClick("/profile")}><MdPerson size={50} /></div>
        </div>
    </div>
  );
}
