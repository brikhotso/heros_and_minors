import axiosInstance from './axiosConfig';
import React, { useState } from 'react';
import axios from 'axios';

function RequestForm({ donationId, onRequestSent }) {
  const [message, setMessage] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log the form data to ensure it's correct before submitting
    console.log('Submitting request with data:', {
      message,
      contactDetails,
      location
    });

    try {
      // Sending the request
      const response = await axios.post(`/api/donations/${donationId}/request`, {
        message,
        contact_details: contactDetails,
        location,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Request sent successfully:', response.data);

      onRequestSent(); // Notify parent component of successful submission
    } catch (err) {
      // Improved error logging
      setError(err.response?.data?.msg || 'Error sending request');
      console.error('Error sending request:', err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <input
        type="text"
        value={contactDetails}
        onChange={(e) => setContactDetails(e.target.value)}
        placeholder="Enter contact details"
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
      />
      <button type="submit">Send Request</button>
    </form>
  );
}

export default RequestForm;
