const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  granted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'granted', 'fulfilled'], default: 'pending' },
});

const Wish = mongoose.model('Wish', wishSchema);
module.exports = Wish;
