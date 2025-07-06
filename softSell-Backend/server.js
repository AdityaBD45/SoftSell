const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const licenseRoutes = require('./routes/licenseRoutes');
const paymentProofRoutes = require('./routes/paymentProofRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const testEmailRoute = require('./routes/testEmail');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware: allow frontend domain via CORS
app.use(cors({
  origin: ['https://softsell-16g8.onrender.com'], // your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// ✅ Routes
app.get('/', (req, res) => res.send('SoftSell API is running...'));

app.use('/api/auth', authRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/test-email', testEmailRoute);
app.use('/api/purchase/proof', paymentProofRoutes);
app.use('/api/purchase', paymentRoutes);

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
