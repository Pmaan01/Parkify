import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdHome, MdCarRental, MdAccountBalanceWallet, MdPerson } from "react-icons/md";
import './BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Floating Trophy Button */}
      <div className="fab-container" onClick={() => navigate("/scoreboard")}>
        <div className="fab-glow" />
        <div className="fab-btn">
          <span className="fab-icon">🏆</span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div
          className={`nav-icon ${isActive("/home") ? "active" : ""}`}
          onClick={() => navigate("/home")}
        >
          <MdHome size={24} />
        </div>
        <div
          className={`nav-icon ${isActive("/status") ? "active" : ""}`}
          onClick={() => navigate("/status")}
        >
          <MdCarRental size={24} />
        </div>

        <div className="nav-icon spacer" /> {/* Empty middle spacer for FAB */}

        <div
          className={`nav-icon ${isActive("/Wallet") ? "active" : ""}`}
          onClick={() => navigate("/Wallet")}
        >
          <MdAccountBalanceWallet size={24} />
        </div>
        <div
          className={`nav-icon ${isActive("/profile") ? "active" : ""}`}
          onClick={() => navigate("/profile")}
        >
          <MdPerson size={24} />
        </div>
      </div>
    </>
  );
};

export default BottomNav;
