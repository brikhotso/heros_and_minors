import axiosInstance from '../axiosConfig';
import React, { useState } from 'react';  // Don't forget to import useState
import styles from './Auth.module.css';

function Auth() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'kid', // Default role
  });

  const [message, setMessage] = useState(null);  // State for notifications
  const [error, setError] = useState(null);      // State for error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/register', formData);
      setMessage('User registered successfully!');
      setError(null);  // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.msg || 'Error during registration');
      setMessage(null);  // Clear any success messages
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      setMessage('User logged in successfully!');
      setError(null);  // Clear any previous errors
      localStorage.setItem('token', response.data.token);  // Store token if login is successful
    } catch (err) {
      setError(err.response?.data?.msg || 'Error during login');
      setMessage(null);  // Clear any success messages
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>🦸‍♀️ Register 🦸‍♂</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Enter your name 🎨"
          value={formData.name}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Your email ✉️"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Create password 🔒"
          value={formData.password}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="kid">Kid 👧</option>
          <option value="parent">Parent 👩‍👦</option>
          <option value="wish-granter">Wish Granter 🎁</option>
          <option value="user">User 😄</option>
        </select>
        <button type="submit" className={styles.button}>Sign Up 💫</button>
      </form>

      <h2>�� Login 🚀</h2>
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
          placeholder="Enter your password ��"
          value={formData.password}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Login 🎮</button>
      </form>

      {/* Display message or error */}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Auth;
