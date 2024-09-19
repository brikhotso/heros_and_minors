import axiosInstance from './axiosConfig';
import React, { useState } from 'react';
import axios from 'axios';
import styles from './Auth.module.css';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'kid',
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/register', formData);
      setMessage('User registered successfully!');
      setError(null);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error during registration');
      setMessage(null);
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

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default RegisterForm;
