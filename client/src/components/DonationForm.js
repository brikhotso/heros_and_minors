import axiosInstance from '../axiosConfig';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import commonStyles from './CommonStyles.module.css'; // Import the common CSS module

function DonationForm({ onDonationCreatedOrUpdated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [donationData, setDonationData] = useState({
    title: '',
    description: '',
    type: 'item',
    condition: 'new',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDonationId, setEditDonationId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (location.state && location.state.donation) {
      const { donation } = location.state;
      setDonationData({
        title: donation.title,
        description: donation.description,
        type: donation.type,
        condition: donation.condition,
      });
      setIsEditing(true);
      setEditDonationId(donation._id);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setDonationData({ ...donationData, [e.target.name]: e.target.value });
  };

  const handleCreateDonation = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const newDonationData = { ...donationData, status: 'available' };
      await axiosInstance.post('/api/donations', newDonationData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Donation created successfully!');
      setError(null);

      setDonationData({
        title: '',
        description: '',
        type: 'item',
        condition: 'new',
      });

      onDonationCreatedOrUpdated(); // Call the callback to refresh the donation list
    } catch (err) {
	setError('Error creating donation');
    }
  };

  const handleUpdateDonation = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axiosInstance.put(`/api/donations/${editDonationId}`, donationData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Donation updated successfully!');
      setError(null);
      setIsEditing(false);
      onDonationCreatedOrUpdated(); // Call the callback to refresh the donation list
    } catch (err) {
      setError('Error updating donation');
      setMessage(null);
    }
  };

  return (
    <div className={commonStyles.container}>
      <h2>{isEditing ? '✏️ Update Donation' : '🎁 Create a Donation'}</h2>
      <form onSubmit={isEditing ? handleUpdateDonation : handleCreateDonation} className={commonStyles.form}>
        <input
          type="text"
          name="title"
          placeholder="Donation Title 🎨"
          value={donationData.title}
          onChange={handleChange}
          required
          className={commonStyles.input}
        />
        <textarea
          name="description"
          placeholder="Donation Description 🌟"
          value={donationData.description}
          onChange={handleChange}
          className={commonStyles.textarea}
        />
        <select name="type" value={donationData.type} onChange={handleChange} className={commonStyles.select}>
          <option value="item">Item</option>
          <option value="service">Service</option>
        </select>
        <select name="condition" value={donationData.condition} onChange={handleChange} className={commonStyles.select}>
          <option value="new">New</option>
          <option value="gently used">Gently Used</option>
          <option value="used">Used</option>
        </select>
        <button type="submit" className={commonStyles.button}>{isEditing ? 'Update Donation' : 'Create Donation'} 🎁</button>
      </form>
      {message && <p className={commonStyles.success}>{message}</p>}
      {error && <p className={commonStyles.error}>{error}</p>}
    </div>
  );
}

export default DonationForm;
