const jwt = require('jsonwebtoken')
const User = require('../models/User')

// For debugging only — remove in production
//console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Exists' : 'Missing')

const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      //console.log('Token received:', token)

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' })
      }

      return next()
    } catch (error) {
      console.error('JWT Error:', error.name, error.message)

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please login again.' })
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token, please login again.' })
      }

      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  } else {
    console.log('No authorization token found in headers')
    res.status(401).json({ message: 'Not authorized, no token' })
  }
}

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next()
    }
    return res.status(403).json({ message: `${role} access only` })
  }
}

module.exports = { protect, requireRole }
