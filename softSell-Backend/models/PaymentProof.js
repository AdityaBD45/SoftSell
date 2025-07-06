const mongoose = require('mongoose')

const paymentProofSchema = new mongoose.Schema({
  license: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'License',
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  txnId: {
    type: String,
    required: true,
  },
  screenshot: {
    type: String, // Cloudinary URL
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('PaymentProof', paymentProofSchema)
