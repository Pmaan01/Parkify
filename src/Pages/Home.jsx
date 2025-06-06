import { Link } from "react-router-dom";
import './auth.css';

export default function Home() {
    return (
        <div className="home-container">
            <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />
            <h1> Welcome to Parkify</h1>
            <p>Find your perfect parking spot without circling the block!</p>

            <img src="/Car.png" alt="Car Illustration" className="home-img" />

            <div className="home-buttons">
                <Link to="/signup"><button>Get Started</button></Link>
                <Link to="/login"><button className="outline">Login</button></Link>
            </div>
        </div>
    );
}
