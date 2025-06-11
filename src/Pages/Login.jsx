import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './auth.css';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email, password
            });
            alert("Login successful!");
            navigate("/home");
        } catch (err) {
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="auth-container">
            <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />
            <h2>Welcome back, park without stress.</h2>

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

            <button onClick={handleLogin}>Login</button>
            <p>New here? <Link to="/signup">Create an account</Link></p>
        </div>
    );
}
