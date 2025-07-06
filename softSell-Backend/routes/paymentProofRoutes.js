const express = require('express')
const { submitPaymentProof } = require('../controllers/paymentProofController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, submitPaymentProof)

module.exports = router
