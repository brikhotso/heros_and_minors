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
      setError(null)
      setMessage(null)
      await axiosInstance.put(`/api/donations/${editDonationId}`, donationData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Donation updated successfully!');
      setIsEditing(false);
      onDonationCreatedOrUpdated(); // Call the callback to refresh the donation list
    } catch (err) {
        setMessage(null);
        setError('Error updating donation');
    }
  };

  return (
    <div className={commonStyles.container}>
      <h2>📝 Donations List</h2>
      <button onClick={() => {
        if (!token) {
          navigate('/login');
        } else {
          setIsModalOpen(true);
        }
      }} className={commonStyles.createButton}>Create Donation 🎁</button>
      <ul>
        {donations.map((donation) => (
          <li key={donation._id} className={commonStyles.listItem}>
            <strong>{donation.title} 🎈</strong> - {donation.description} (Posted by: {donation.donor.name})
            <p>Type: {donation.type}</p>
            <p>Condition: {donation.condition}</p>
            <p>Status: {donation.status}</p>

            {donation.status === 'available' && currentUser && currentUser._id !== donation.donor._id && (
              <button onClick={() => handleRequestDonation(donation._id)}>Request Donation 🎁</button>
            )}

            {donation.status === 'requested' && currentUser && currentUser._id === donation.donor._id && (
              <>
                <button onClick={() => fetchRequests(donation._id)}>View Requests 👀</button>
                {requestsByDonation[donation._id] && requestsByDonation[donation._id].length > 0 && (
                  requestsByDonation[donation._id].map((request) => (
                    <div key={request._id} className={commonStyles.requestCard}>
                      <p><strong>Message:</strong> {request.message}</p>
                      <p><strong>Location:</strong> {request.location}</p>
                      <p><strong>Contact Info:</strong> {request.contactInfo}</p>
                      <button onClick={() => handleAcceptRequest(donation._id, request._id)}>
                        Accept Request from {request.interested_user.name} 🎉
                      </button>
                    </div>
                  ))
                )}
              </>
            )}

            {donation.status === 'accepted' &&
              requestsByDonation[donation._id] &&
              requestsByDonation[donation._id].some(request =>
                request.status === 'accepted' &&
                request.interested_user._id === currentUser._id
              ) && (
                <button onClick={() => handleMarkReceived(donation._id)}>Mark as Received ✅</button>
              )}

            {currentUser && currentUser._id === donation.donor._id && (
              <>
                <button onClick={() => handleEditDonation(donation)}>✏️ Edit Donation</button>
                <button onClick={() => handleDeleteDonation(donation._id)}>❌ Delete Donation</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {message && <p className={commonStyles.success}>{message}</p>}
      {error && <p className={commonStyles.error}>{error}</p>}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DonationForm onDonationCreatedOrUpdated={handleDonationCreatedOrUpdated} />
      </Modal>
    </div>
  );
}

export default DonationList;
