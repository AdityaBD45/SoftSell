const mongoose = require('mongoose')

const licenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: [
  'Netflix',
  'Hotstar',
  'Amazon Prime',
  'JioCinema',
  'Sony LIV',
  'ZEE5',
  'YouTube Premium',
  'Spotify',
  'Apple Music',
  'Microsoft 365',
  'Google Workspace',
  'Canva Pro',
  'Adobe Creative Cloud',
  'Notion Pro',
  'Figma Pro',
  'GitHub Copilot',
  'ChatGPT Plus',
  'Udemy',
  'Unacademy',
  'Other'
],
    },
    price: {
      type: Number,
      
    },
    
    daysToSell: {
      type: Number,
      required: true,
      min: 1,
    },
    expiryDate: {
      type: Date,
    },

    credentials: {
      username: {
        type: String,
        required: true,
        select: false,
      },
      password: {
        type: String,
        required: true,
        select: false,
      },
    },

    contactNumber: {
      type: String,
      required: true,
      select: false,
    },
    
     paidToSeller: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'sold'],
      default: 'pending',
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('License', licenseSchema)
