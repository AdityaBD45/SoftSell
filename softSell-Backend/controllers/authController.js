const jwt = require('jsonwebtoken')
const User = require('../models/User')
const uploadImageToCloudinary = require('../config/uploadToCloudinary') // 👈 import your Cloudinary utility
const bcrypt = require('bcryptjs')



// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}


// @desc    Register new user with role
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, qrBase64 } = req.body

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    let qrCodeUrl = ''

    // 2. If seller, QR code is required
    if (role === 'seller') {
      if (!qrBase64) {
        return res.status(400).json({ message: 'QR code is required for seller registration' })
      }

      // Upload QR code image to Cloudinary
      const uploadResult = await uploadImageToCloudinary(qrBase64)
      qrCodeUrl = uploadResult.secure_url
    }

    // 3. Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      qrCodeUrl: role === 'seller' ? qrCodeUrl : undefined
    })

    // 4. Respond
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      })
    } else {
      res.status(400).json({ message: 'Invalid user data' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      })
    } else {
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateUserProfile = async (req, res) => {
  const { password, qrBase64 } = req.body

  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Set new password (let schema hook hash it)
    if (password) {
      user.password = password
    }

    // If seller and QR is provided, upload and update qrCodeUrl
    if (user.role === 'seller' && qrBase64) {
      const uploadResult = await uploadImageToCloudinary(qrBase64)
      user.qrCodeUrl = uploadResult.secure_url
    }

    await user.save()

    res.json({
      message: 'Profile updated successfully',
      qrCodeUrl: user.qrCodeUrl || null
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}



module.exports = { registerUser, loginUser, updateUserProfile }
