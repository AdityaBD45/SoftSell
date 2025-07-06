const express = require('express')
const { getPendingProofs, approveProof, rejectProof } = require('../controllers/paymentController')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.get('/proofs', protect, getPendingProofs)
router.put('/proofs/:id/approve', protect, approveProof)
router.put('/proofs/:id/reject', protect, rejectProof)

module.exports = router
