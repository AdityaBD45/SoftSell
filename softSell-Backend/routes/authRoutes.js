const express = require('express')
const router = express.Router()
const { registerUser, loginUser, updateUserProfile  } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')


// Register user
router.post('/register', registerUser)

// Login user
router.post('/login', loginUser)

router.put('/update-profile', protect, updateUserProfile) 

module.exports = router
