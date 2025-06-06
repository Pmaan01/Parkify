import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './auth.css';

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        if (!name || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/signup", {
                name,
                email,
                password,
            });
            alert("Signup successful!");
            navigate("/login");
        } catch (err) {
            alert("Signup failed. Email may already exist.");
        }
    };

    return (
        <div className="auth-container">
            <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />
            <h2>Sign up now and never circle the block again.</h2>

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleSignup}>Create Account</button>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}
