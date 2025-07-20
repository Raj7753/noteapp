import React, { useState } from 'react';
import './AuthForm.css';

function AuthForm({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? '/login' : '/register';
    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(`http://localhost:5050/api/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);

        // Provide a simulated user object to App.js
        const userInfo = {
          name: data.user?.name || 'User',
          email: data.user?.email || formData.email,
        };

        onAuthSuccess(userInfo);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>{isLogin ? '🔐 Login' : '📝 Register'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p onClick={toggleForm} className="toggle">
        {isLogin ? '👤 New here? Register' : '🔑 Already have an account? Login'}
      </p>
    </div>
  );
}

export default AuthForm;