// WishlistList.js
import axiosInstance from '../axiosConfig';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CommonStyles.module.css';
import Modal from './Modal';
import WishlistForm from './WishlistForm';

function WishlistList() {
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchWishlist();
    }
  }, [currentUserId]);

  const fetchCurrentUser = async () => {
    if (!token) return;
    try {
      const response = await axiosInstance.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUserId(response.data._id);
      console.log('Current User:', response.data);
    } catch (err) {
      setError('Error fetching current user');
      console.error(err);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await axiosInstance.get('/api/wishes');
      setWishlist(response.data);
      console.log('Wishlist Data:', response.data);
    } catch (err) {
      setError('Error fetching wishlist');
      console.error(err);
    }
  };

  const handleUpdateWish = async (wishId) => {
    if (!token) {
      navigate('/login');
      return;
    }
    const updatedTitle = prompt('Enter new title:');
    const updatedDescription = prompt('Enter new description:');
    if (updatedTitle || updatedDescription) {
      try {
        await axiosInstance.put(
          `/api/wishes/${wishId}`,
          { title: updatedTitle, description: updatedDescription },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage('Wish updated successfully!');
        setError(null);
        fetchWishlist();
      } catch (err) {
        setError('Error updating wish');
        console.error(err);
      }
    }
  };

  const handleDeleteWish = async (wishId) => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (window.confirm('Are you sure you want to delete this wish?')) {
      try {
        await axiosInstance.delete(`/api/wishes/${wishId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Wish deleted successfully!');
        setError(null);
        fetchWishlist();
      } catch (err) {
        setError('Error deleting wish');
        console.error(err);
      }
    }
  };

  const handleGrantWish = async (wishId) => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axiosInstance.post(
        `/api/wishes/${wishId}/grant`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Wish granted successfully!');
      setError(null);
      fetchWishlist();
    } catch (err) {
      setError('Error granting wish');
      console.error(err);
    }
  };

  const handleFulfillWish = async (wishId) => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axiosInstance.put(
        `/api/wishes/${wishId}/fulfill`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Wish fulfilled successfully!');
      setError(null);
      fetchWishlist();
    } catch (err) {
      setError('Error fulfilling wish');
      console.error(err);
    }
  };

  const handleWishCreated = () => {
    fetchWishlist();
    setIsModalOpen(false); // Close the modal after creating a wish
  };

  return (
    <div className={commonStyles.container}>
      <h2>🌈 Your Wishlist 🌈</h2>
      <button onClick={() => {
        if (!token) {
          navigate('/login');
        } else {
          setIsModalOpen(true);
        }
      }} className={commonStyles.createButton}>Create Wish 🎁</button>
      <ul>
        {wishlist.map((wish) => (
          <li key={wish._id} className={commonStyles.listItem}>
            <strong>{wish.title} 🎈</strong> - {wish.description} (Posted by: {wish.posted_by.name})

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
      {message && <p className={commonStyles.success}>{message}</p>}
      {error && <p className={commonStyles.error}>{error}</p>}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <WishlistForm onWishCreated={handleWishCreated} />
      </Modal>
    </div>
  );
}

export default WishlistList;
