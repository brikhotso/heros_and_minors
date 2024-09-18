const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Donation = require('../models/Donation');
const Request = require('../models/Request'); // Import the Request model  
const router = express.Router();

// Create a new donation
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, type, condition } = req.body;

  try {
    const newDonation = new Donation({
      donor: req.user.id,
      title,
      description,
      type,
      condition
    });

    const donation = await newDonation.save();
    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all donations
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().populate('donor', 'name email');
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get donation by ID
router.get('/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('donor', 'name email');
    if (!donation) return res.status(404).json({ msg: 'Donation not found' });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a donation
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, type, condition } = req.body;

  try {
    let donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ msg: 'Donation not found' });

    if (donation.donor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    donation.title = title || donation.title;
    donation.description = description || donation.description;
    donation.type = type || donation.type;
    donation.condition = condition || donation.condition;

    await donation.save();
    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a donation
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ msg: 'Donation not found' });
    }

    // Optional: Check if the user is authorized to delete the donation
    if (donation.donor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Donation.findByIdAndDelete(req.params.id);  // Use findByIdAndDelete
    res.json({ msg: 'Donation removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Make a request for a donation
router.post('/:donationId/request', authMiddleware, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.donationId);
    if (!donation) return res.status(404).json({ msg: 'Donation not found' });

    // Prevent donor from requesting their own donation
    if (donation.donor.toString() === req.user.id) {
      return res.status(403).json({ msg: 'Cannot request your own donation' });
    }

    // Check if the user has already requested this donation
    const existingRequest = await Request.findOne({
      donation: donation._id,
      interested_user: req.user.id,
    });

    if (existingRequest) {
      return res.status(400).json({ msg: 'You have already requested this donation' });
    }

    // Create a new request for the donation
    const newRequest = new Request({
      donation: donation._id,
      interested_user: req.user.id,
      message: req.body.message,        // Added message field
      location: req.body.location,      // Added location field
      contactInfo: req.body.contactInfo, // Added contactInfo field
    });

    await newRequest.save();

    // Optionally, update donation status if it's the first request
    if (donation.status === 'available') {
      donation.status = 'requested'; 
      await donation.save();
    }

    res.json({ msg: 'Request made successfully', request: newRequest });
  } catch (err) {
    console.error('Error making request:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch all requests for a donation
router.get('/:donationId/requests', authMiddleware, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.donationId);
    if (!donation) return res.status(404).json({ msg: 'Donation not found' });

    console.log('Donation:', donation);

    if (donation.donor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized access to requests' });
    }

    const requests = await Request.find({ donation: donation._id }).populate('interested_user', 'name email');

    console.log('Requests:', requests);

    res.json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


//Accept request
router.post('/:donationId/accept-request/:requestId', authMiddleware, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.donationId);
    const request = await Request.findById(req.params.requestId);
    
    if (!donation || !request) {
      return res.status(404).send('Donation or request not found');
    }

    // Ensure the request can be accepted
    if (request.status !== 'requested') {
      return res.status(400).send('Request cannot be accepted');
    }

    // Update the donation
    donation.interested_user = request.interested_user._id;
    donation.status = 'accepted';
    await donation.save();

    // Update the request
    request.status = 'accepted';
    await request.save();

    res.status(200).send(donation);
  } catch (err) {
    console.error('Error in accept request:', err);
    res.status(500).send('Error accepting request');
  }
});


router.post('/:donationId/mark-received', authMiddleware, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.donationId);
    if (!donation) return res.status(404).json({ msg: 'Donation not found' });

    // Only the donor can mark the donation as received
    if (donation.donor.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized to mark as received' });
    }

    donation.status = 'received';
    await donation.save();

    res.json({ msg: 'Donation marked as received successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
