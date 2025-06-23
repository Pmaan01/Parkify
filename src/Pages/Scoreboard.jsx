import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Scoreboard.css';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';

export default function Scoreboard() {
    const [scores, setScores] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://parkify-web-app-backend.onrender.com/api/score/top")
            .then(res => setScores(res.data))
            .catch(err => console.error("Error fetching scores", err));
    }, []);

    return (
        <div className="scoreboard-container">
            <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />

            <div className="back-arrow" onClick={() => navigate("/home")}>
                <MdArrowBack size={28} color="white" />
            </div>

            <h2>🏆 Top Parkify Users</h2>

            <ul>
                {scores.map((user, index) => (
                    <li key={user._id} className={index < 3 ? "top-three" : ""}>
                        <span>{index + 1}. {user.displayName}</span>
                        <span>{user.score} pts</span>
                        {index < 3 && <span className="badge">⭐</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
}
