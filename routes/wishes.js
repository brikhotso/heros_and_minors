const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Wish = require('../models/Wish');

// Create a new wish
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newWish = new Wish({
      title: req.body.title,
      description: req.body.description,
      posted_by: req.user._id, // assuming you store the user's id on req.user after authentication
      status: 'pending',
    });

    const wish = await newWish.save();
    res.json(wish);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all wishes
router.get('/', async (req, res) => {
  try {
    const wishes = await Wish.find().populate('posted_by', 'name');
    res.json(wishes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a wish
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedWish = await Wish.findOneAndUpdate(
      { _id: req.params.id, posted_by: req.user._id },
      { title: req.body.title, description: req.body.description },
      { new: true }
    );
    
    if (!updatedWish) {
      return res.status(404).json({ msg: 'Wish not found or not authorized' });
    }

    res.json(updatedWish);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a wish
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const wish = await Wish.findOneAndDelete({ _id: req.params.id, posted_by: req.user._id });

    if (!wish) {
      return res.status(404).json({ msg: 'Wish not found or not authorized' });
    }

    res.json({ msg: 'Wish deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Grant a wish
router.post('/:id/grant', authMiddleware, async (req, res) => {
  try {
    const wish = await Wish.findById(req.params.id);
    if (!wish) {
      return res.status(404).json({ msg: 'Wish not found' });
    }
    if (wish.posted_by.toString() === req.user._id.toString()) {
      return res.status(403).json({ msg: 'Cannot grant your own wish' });
    }

    wish.status = 'granted';
    wish.granted_by = req.user._id; // Set the granted_by field
    await wish.save();

    res.json(wish);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Fulfill a wish
router.put('/:id/fulfill', authMiddleware, async (req, res) => {
  try {
    const wish = await Wish.findOne({ _id: req.params.id, posted_by: req.user._id });

    if (!wish || wish.status !== 'granted') {
      return res.status(403).json({ msg: 'Wish not found or not authorized to fulfill' });
    }

    wish.status = 'fulfilled';
    await wish.save();

    res.json(wish);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
