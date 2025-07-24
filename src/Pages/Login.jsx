import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading page

    if (!email || !password) {
      toast.warn('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('https://parkify-5cf7.onrender.com/api/auth/login', {
        email: email.toLowerCase(),
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.data.id);
      localStorage.setItem('email', res.data.data.email);
      localStorage.setItem('username', res.data.data.name);

      toast.success(`🎉 Welcome back, ${res.data.data.name.split(' ')[0]}!`, {
        position: 'top-right',
        autoClose: 3000,
      });

      navigate('/home');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in-up">
      <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />
      <h2>Welcome back, park without stress.</h2>

      <form className="auth-form" onSubmit={handleLogin}>
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : '🔐 Login'}
        </button>
      </form>

      <p className="auth-footer">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}
