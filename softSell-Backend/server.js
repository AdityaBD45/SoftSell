const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const licenseRoutes = require('./routes/licenseRoutes')
const paymentProofRoutes = require('./routes/paymentProofRoutes') // for image upload (base64)
const paymentRoutes = require('./routes/paymentRoutes')           // for admin approval/reject
const testEmailRoute = require('./routes/testEmail')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err))

// Routes
app.get('/', (req, res) => res.send('SoftSell API is running...'))

app.use('/api/auth', authRoutes)
app.use('/api/licenses', licenseRoutes)
app.use('/api/test-email', testEmailRoute)
app.use('/api/purchase/proof', paymentProofRoutes)  // POST base64 screenshot
app.use('/api/purchase', paymentRoutes)             // GET/PUT admin verification

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
