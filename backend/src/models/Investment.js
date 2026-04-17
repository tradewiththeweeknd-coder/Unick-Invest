const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  investmentType: {
    type: String,
    enum: ['TYPE1', 'TYPE2', 'TYPE3', 'TYPE4', 'TYPE5', 'TYPE6', 'TYPE7', 'TYPE8'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  dailyReturn: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  totalEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  lastEarningsUpdate: {
    type: Date,
    default: Date.now
  },
  earningsHistory: [{
    date: Date,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'credited'],
      default: 'pending'
    }
  }],
  depositProof: {
    fileName: String,
    path: String,
    uploadedAt: Date,
    approved: {
      type: Boolean,
      default: false
    }
  },
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Índices para performance
investmentSchema.index({ userId: 1, status: 1 });
investmentSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Investment', investmentSchema);