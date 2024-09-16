import React, { useState } from 'react';
import axios from 'axios';
import './Donations.css';

function DonationForm() {
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

  const handleChange = (e) => {
    setDonationData({ ...donationData, [e.target.name]: e.target.value });
  };

  const handleCreateDonation = async (e) => {
    e.preventDefault();
    try {
      const newDonationData = { ...donationData, status: 'available' };
      const response = await axios.post('/api/donations', newDonationData, {
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
    } catch (err) {
      setError('Error creating donation');
    }
  };

  const handleUpdateDonation = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/donations/${editDonationId}`, donationData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Donation updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Error updating donation');
    }
  };

  return (
    <div>
      <h2>{isEditing ? '✏️ Update Donation' : '🎁 Create a Donation'}</h2>
      <form onSubmit={isEditing ? handleUpdateDonation : handleCreateDonation}>
        <input
          type="text"
          name="title"
          placeholder="Donation Title 🎨"
          value={donationData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Donation Description 🌟"
          value={donationData.description}
          onChange={handleChange}
        />
        <select name="type" value={donationData.type} onChange={handleChange}>
          <option value="item">Item</option>
          <option value="service">Service</option>
        </select>
        <select name="condition" value={donationData.condition} onChange={handleChange}>
          <option value="new">New</option>
          <option value="gently used">Gently Used</option>
          <option value="used">Used</option>
        </select>
        <button type="submit">{isEditing ? 'Update Donation' : 'Create Donation'} 🎁</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default DonationForm;
