import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Wishlist.css';

function Wishlist() {
  const [wishData, setWishData] = useState({
    title: '',
    description: '',
  });
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // State to store the current user ID
  const token = localStorage.getItem('token'); // Get token from local storage

  // Fetch the current user ID using the /me route when the component mounts
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Fetch the current logged-in user using /me route
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUserId(response.data._id); // Set the current user ID
      console.log('Current User:', response.data); // Log user data for debugging
    } catch (err) {
      setError('Error fetching current user');
      console.error(err);
    }
  };

  // Fetch the wishlist when the component mounts
  useEffect(() => {
    if (currentUserId) {
      fetchWishlist();
    }
  }, [currentUserId]);

  // Function to fetch the current wishlist
  const fetchWishlist = async () => {
    try {
      const response = await axios.get('/api/wishes'); // No auth needed
      setWishlist(response.data); // Update the wishlist state with data from the server
      console.log('Wishlist Data:', response.data); // Log wishlist data for debugging
    } catch (err) {
      setError('Error fetching wishlist');
      console.error(err);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setWishData({ ...wishData, [e.target.name]: e.target.value });
  };

  // Handle wish creation
  const handleCreateWish = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/wishes', wishData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Wish created successfully!');
      setError(null); // Clear previous errors
      fetchWishlist(); // Fetch updated wishlist
    } catch (err) {
      setError('Error creating wish');
      setMessage(null); // Clear previous success messages
      console.error(err);
    }
  };

  // Handle wish update
  const handleUpdateWish = async (wishId) => {
    const updatedTitle = prompt('Enter new title:');
    const updatedDescription = prompt('Enter new description:');
    if (updatedTitle || updatedDescription) {
      try {
        await axios.put(
          `/api/wishes/${wishId}`,
          { title: updatedTitle, description: updatedDescription },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage('Wish updated successfully!');
        setError(null); // Clear previous errors
        fetchWishlist();
      } catch (err) {
        setError('Error updating wish');
        console.error(err);
      }
    }
  };

  // Handle wish deletion
  const handleDeleteWish = async (wishId) => {
    if (window.confirm('Are you sure you want to delete this wish?')) {
      try {
        await axios.delete(`/api/wishes/${wishId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Wish deleted successfully!');
        setError(null); // Clear previous errors
        fetchWishlist();
      } catch (err) {
        setError('Error deleting wish');
        console.error(err);
      }
    }
  };

  // Handle granting a wish
  const handleGrantWish = async (wishId) => {
    try {
      await axios.post(
        `/api/wishes/${wishId}/grant`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Wish granted successfully!');
      setError(null); // Clear previous errors
      fetchWishlist();
    } catch (err) {
      setError('Error granting wish');
      console.error(err);
    }
  };

  // Handle fulfilling a wish
  const handleFulfillWish = async (wishId) => {
    try {
      await axios.put(
        `/api/wishes/${wishId}/fulfill`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Wish fulfilled successfully!');
      setError(null); // Clear previous errors
      fetchWishlist();
    } catch (err) {
      setError('Error fulfilling wish');
      console.error(err);
    }
  };

  return (
  <div className="wishlist-container">
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

    {/* Display success or error message */}
    {message && <p className="success">{message}</p>}
    {error && <p className="error">{error}</p>}

    <h2>🌈 Your Wishlist 🌈</h2>
    {/* Display the wishlist */}
    <ul>
      {wishlist.map((wish) => (
        <li key={wish._id}>
          <strong>{wish.title} 🎈</strong> - {wish.description} (Posted by: {wish.posted_by.name})

          {/* Conditionally render buttons based on the wish's status and the current user */}
          {wish.status === 'pending' && (
            <>
              {wish.posted_by._id.toString() === currentUserId ? (
                <>
                  <button onClick={() => handleUpdateWish(wish._id)}>✏️ Edit</button>
                  <button onClick={() => handleDeleteWish(wish._id)}>❌ Delete</button>
                </>
              ) : (
                <button onClick={() => handleGrantWish(wish._id)}>🌟 Grant</button>
              )}
            </>
          )}

          {wish.status === 'granted' && wish.posted_by._id.toString() === currentUserId && (
            <button onClick={() => handleFulfillWish(wish._id)}>✅ Mark as Fulfilled</button>
          )}

          <p>Status: {wish.status}</p>
        </li>
      ))}
    </ul>
  </div>
 );
}
export default Wishlist;
