import React, { useState } from 'react';
import axios from 'axios';

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
      const response = await axios.post('/api/auth/register', formData);
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
      const response = await axios.post('/api/auth/login', {
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
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
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
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="kid">Kid</option>
          <option value="parent">Parent</option>
          <option value="wish-granter">Wish Granter</option>
          <option value="user">User</option>
        </select>
        <button type="submit">Register</button>
      </form>

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>

      {/* Display message or error */}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Auth;
