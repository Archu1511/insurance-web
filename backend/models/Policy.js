const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a policy title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  type: {
    type: String,
    enum: ['Health', 'Life', 'Vehicle', 'Home', 'Travel'],
    required: [true, 'Please select a policy type']
  },
  premiumAmount: {
    type: Number,
    required: [true, 'Please add premium amount']
  },
  coverageAmount: {
    type: Number,
    required: [true, 'Please add coverage amount']
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration in months'],
    default: 12
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);
