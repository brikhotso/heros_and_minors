import axiosInstance from '../axiosConfig';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import DonationForm from './DonationForm';
import styles from './Donations.module.css';


function DonationList() {
  const [donations, setDonations] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [requestsByDonation, setRequestsByDonation] = useState({});
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/me', {
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
      const response = await axiosInstance.get('/api/donations');
      setDonations(response.data);
    } catch (err) {
      setError('Error fetching donations');
    }
  };

  // Request a donation
  const handleRequestDonation = async (donationId) => {
    try {
      const message = prompt('Enter a message describing why you want the donation:');
      const location = prompt('Enter your location:');
      const contactInfo = prompt('Enter how you can be reached:');

      if (!message || !location || !contactInfo) {
        setError('All fields are required.');
        return;
      }

      await axiosInstance.post(
        `/api/donations/${donationId}/request`,
        { message, location, contactInfo },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage('Request sent successfully!');
      fetchDonations();
    } catch (err) {
      console.error('Error requesting donation:', err.response ? err.response.data : err.message);
      setError('Error requesting donation');
    }
  };

  // Fetch requests
  const fetchRequests = async (donationId) => {
    try {
      const response = await axiosInstance.get(`/api/donations/${donationId}/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequestsByDonation((prevRequests) => ({
        ...prevRequests,
        [donationId]: response.data,
      }));
    } catch (err) {
      setError('Error fetching requests');
    }
  };

  const handleAcceptRequest = async (donationId, requestID) => { 
    const requests = requestsByDonation[donationId];
    if (requests && requests.length > 0) {
      const requestToAccept = requests.find(request => request._id === requestID);
      if (requestToAccept) {
        try {
          await axiosInstance.post(`/api/donations/${donationId}/accept-request/${requestID}`, {}, { 
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

  // Delete a donation
  const handleDeleteDonation = async (donationId) => {
    try {
      await axiosInstance.delete(`/api/donations/${donationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Donation deleted successfully');
      fetchDonations();
    } catch (err) {
      setError('Error deleting donation');
    }
  };

  // Navigate to edit donation form
  const handleEditDonation = (donation) => {
    navigate('/dashboard/donationform', { state: { donation } });
  };

  const handleMarkReceived = async (donationId) => {
    try {
      const response = await axiosInstance.post(`/api/donations/${donationId}/mark-received`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.msg); // Show success message
      fetchDonations(); // Refresh donations list
    } catch (err) {
      console.error('Error marking donation as received:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.msg : 'Error marking donation as received');
    }
  };

  return (
    <div className={styles.container}>
      <h2>📝 Donations List</h2>
      <button onClick={() => setIsModalOpen(true)} className={styles.createButton}>Create Donation ��</button>
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
                   <div key={request._id} className="request-card">
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
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DonationForm />
      </Modal>
    </div>
  );
}

export default DonationList;
