import React, { useState } from 'react';
import axios from 'axios';
import './Wishlist.css';

function WishlistForm() {
  const [wishData, setWishData] = useState({
    title: '',
    description: '',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setWishData({ ...wishData, [e.target.name]: e.target.value });
  };

  const handleCreateWish = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/wishes', wishData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Wish created successfully!');
      setError(null); // Clear previous errors
      setWishData({
        title: '',
        description: '',
      });
    } catch (err) {
      setError('Error creating wish');
      setMessage(null); // Clear previous success messages
      console.error(err);
    }
  };

  return (
    <div>
      <h2>🎉 Create a Wish 🎉</h2>
      <form onSubmit={handleCreateWish}>
        <input
          type="text"
          name="title"
          placeholder="Wish Title ✨"
          value={wishData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Wish Description 🌟"
          value={wishData.description}
          onChange={handleChange}
        />
        <button type="submit">Create Wish 🎁</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default WishlistForm;
