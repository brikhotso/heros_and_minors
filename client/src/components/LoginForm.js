import React, { useState } from 'react';
import axios from 'axios';
import styles from './Auth.module.css';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      setMessage('User logged in successfully!');
      setError(null);
      localStorage.setItem('token', response.data.token);
      navigate('/home');  // Redirect to dashboard/home
    } catch (err) {
      setError(err.response?.data?.msg || 'Error during login');
      setMessage(null);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>🚀 Login 🚀</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email 📧"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password 🔒"
          value={formData.password}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Login 🎮</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default LoginForm;
