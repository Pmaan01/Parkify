import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      toast.warn('⚠️ Please fill in all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      toast.warn('📧 Enter a valid email address.');
      return;
    }
    if (trimmedPassword.length < 6) {
      toast.warn('🔒 Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('https://parkify-5cf7.onrender.com/api/auth/signup', {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });

      toast.success(`🎉 Welcome aboard, ${trimmedName.split(' ')[0]}!`);
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.error || '❌ Signup failed. Try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in-up">
      <img src="/Parkify-logo.jpg" alt="Parkify Logo" className="logo" />
      
      <h2>🚀 Create your free account</h2>
      
      <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
        <input
          className="auth-input"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
        <input
          className="auth-input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        
        <button className="auth-button" onClick={handleSignup} disabled={loading}>
          {loading ? '⏳ Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}