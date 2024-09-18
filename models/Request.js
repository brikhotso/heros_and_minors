const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true,
  },
  interested_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'received'],
    default: 'requested',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  message: { // New field for the user's message
    type: String,
    required: true,
  },
  location: { // New field for the user's location
    type: String,
    required: true,
  },
  contactInfo: { // New field for the user's contact info
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Request', RequestSchema);
