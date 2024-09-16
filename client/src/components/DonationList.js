import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Donations.css';

function DonationList() {
  const [donations, setDonations] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [requestsByDonation, setRequestsByDonation] = useState({});

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
    const requests = requestsByDonation[donationId];
    const acceptedRequest = requests ? requests.find(request => request.status === 'accepted') : null;

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
    // This function can be used to navigate to the DonationForm component with the donation data
  };

  return (
    <div>
      <h2>📝 Donations List</h2>
      <ul>
        {donations.map((donation) => (
          <li key={donation._id}>
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
                    <button key={request._id} onClick={() => handleAcceptRequest(donation._id, request._id)}>
                      Accept Request from {request.interested_user?.name} 🎉
                    </button>
                  ))
                )}
              </>
            )}

            {donation.status === 'accepted' && currentUser && currentUser._id === donation.donor._id && (
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
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default DonationList;
