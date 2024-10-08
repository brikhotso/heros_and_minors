import axiosInstance from '../axiosConfig';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import commonStyles from './CommonStyles.module.css'; // Import the common CSS module

function WishlistForm({ onWishCreated }) {
  const [wishData, setWishData] = useState({
    title: '',
    description: '',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setWishData({ ...wishData, [e.target.name]: e.target.value });
  };

  const handleCreateWish = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axiosInstance.post('/api/wishes', wishData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Wish created successfully!');
      setError(null); // Clear previous errors
      setWishData({
        title: '',
        description: '',
      });
      onWishCreated(); // Call the callback to refresh the wishlist
    } catch (err) {
      setError('Error creating wish');
      setMessage(null); // Clear previous success messages
      console.error(err);
    }
  };

  return (
    <div className={commonStyles.container}>
      <h2>🎉 Create a Wish 🎉</h2>
      <form onSubmit={handleCreateWish} className={commonStyles.form}>
        <input
          type="text"
          name="title"
          placeholder="Wish Title ✨"
          value={wishData.title}
          onChange={handleChange}
          required
          className={commonStyles.input}
        />
        <textarea
          name="description"
          placeholder="Wish Description 🌟"
          value={wishData.description}
          onChange={handleChange}
          className={commonStyles.textarea}
        />
        <button type="submit" className={commonStyles.button}>Create Wish 🎁</button>
      </form>
      {message && <p className={commonStyles.success}>{message}</p>}
      {error && <p className={commonStyles.error}>{error}</p>}
    </div>
  );
}

export default WishlistForm;
