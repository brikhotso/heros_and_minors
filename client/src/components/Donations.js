import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Donation() {
  const [donationData, setDonationData] = useState({
    title: '',
    description: '',
    type: 'item',
    condition: 'new',
  });
  const [donations, setDonations] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDonationId, setEditDonationId] = useState(null);
  const [requestsByDonation, setRequestsByDonation] = useState({}); // Store requests for each donation
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(response.data);
      } catch (err) {
        setError('Error fetching current user');
      }
    };

    fetchCurrentUser();
    fetchDonations();
  }, [token]);

  const fetchDonations = async () => {
    try {
      const response = await axios.get('/api/donations');
      setDonations(response.data);
    } catch (err) {
      setError('Error fetching donations');
    }
  };

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

      setDonations((prevDonations) => [...prevDonations, response.data]);
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

  const handleRequestDonation = async (donationId) => {
    try {
      await axios.post(`/api/donations/${donationId}/request`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Request sent successfully!');
      fetchDonations();
    } catch (err) {
      setError('Error requesting donation');
    }
  };

  const fetchRequests = async (donationId) => {
    try {
      const response = await axios.get(`/api/donations/${donationId}/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequestsByDonation((prevRequests) => ({
        ...prevRequests,
        [donationId]: response.data,
      }));
    } catch (err) {
      setError('Error fetching request');
    }
  };

  const handleAcceptRequest = async (donationId, requestID) => {
    const requests = requestsByDonation[donationId];
    if (requests && requests.length > 0) {
      const requestToAccept = requests.find(request => request._id === requestID);
      if (requestToAccept) {
        try {
          await axios.post(`/api/donations/${donationId}/accept-request/${requestID}`, {}, { 
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessage('Request accepted successfully!');
          fetchDonations();
	} catch (err) {
          console.error('Error accepting request:', err.response ? err.response.data : err.message);
          setError('Error accepting request');
	}
      } else {
        setError('No request found for this donation');
      }
    } else {
      setError('No requests found for this donation');
    }
  };

  const handleMarkReceived = async (donationId) => {
    const requests = requestsByDonation[donationId]; // Get requests from state
    const acceptedRequest = requests ? requests.find(request => request.status === 'accepted') : null;

    console.log('Donation ID:', donationId);
    console.log('Requests by Donation:', requestsByDonation); // Check the state of requests

    if (acceptedRequest) {
      try {
        await axios.put(`/api/donations/receive/${acceptedRequest._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
	});

        setMessage('Donation marked as received!');
        fetchDonations();
      } catch (err) {
        setError('Error marking donation as received');
        console.error(err);
      }
    } else {
      setError('No accepted request found for this donation');
    }
  };

  const handleDeleteDonation = async (donationId) => {
    try {
      await axios.delete(`/api/donations/${donationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Donation deleted successfully');
      fetchDonations();
    } catch (err) {
      setError('Error deleting donation');
    }
  };

  const handleEditDonation = (donation) => {
    setIsEditing(true);
    setEditDonationId(donation._id);
    setDonationData({
      title: donation.title,
      description: donation.description,
      type: donation.type,
      condition: donation.condition,
    });
  };

  const handleUpdateDonation = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/donations/${editDonationId}`, donationData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Donation updated successfully!');
      setIsEditing(false);
      fetchDonations();
    } catch (err) {
      setError('Error updating donation');
    }
  };

  return (
    <div>
      <h2>{isEditing ? 'Update Donation' : 'Create a Donation'}</h2>
      <form onSubmit={isEditing ? handleUpdateDonation : handleCreateDonation}>
        <input
          type="text"
          name="title"
          placeholder="Donation Title"
          value={donationData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Donation Description"
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
        <button type="submit">{isEditing ? 'Update Donation' : 'Create Donation'}</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Donations</h2>
      <ul>
        {donations.map((donation) => (
          <li key={donation._id}>
            <strong>{donation.title}</strong> - {donation.description} (Posted by: {donation.donor.name})
            <p>Type: {donation.type}</p>
            <p>Condition: {donation.condition}</p>
            <p>Status: {donation.status}</p>

            {/* Show Request button for available donations by non-donors */}
            {donation.status === 'available' && currentUser && currentUser._id !== donation.donor._id && (
              <button onClick={() => handleRequestDonation(donation._id)}>Request Donation</button>
            )}

            {/* Fetch requests and show Accept button for requested donations by the donor */}
            {donation.status === 'requested' && currentUser && currentUser._id === donation.donor._id && (
              <>
                <button onClick={() => fetchRequests(donation._id)}>View Requests</button>
                {requestsByDonation[donation._id] && requestsByDonation[donation._id].length > 0 && (
                  requestsByDonation[donation._id].map((request) => (
                    <button key={request._id} onClick={() => handleAcceptRequest(donation._id, request._id)}>
                      Accept Request from {request.interested_user?.name}
                    </button>
                  ))
                )}
              </>
            )}

            {/* Show Received button for accepted donations by the interested user */}
            {donation.status === 'accepted' && currentUser && currentUser._id === donation.interested_user && (
              <button onClick={() => handleMarkReceived(donation._id)}>Mark as Received</button>
            )}

            {/* Show Update/Delete buttons for the donor */}
            {currentUser && currentUser._id === donation.donor._id && (
              <>
                <button onClick={() => handleEditDonation(donation)}>Edit Donation</button>
                <button onClick={() => handleDeleteDonation(donation._id)}>Delete Donation</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Donation;
