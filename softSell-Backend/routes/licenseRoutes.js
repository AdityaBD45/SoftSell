const express = require('express')
const router = express.Router()

const {
  submitLicense,
  approveLicense,
  rejectLicense,
  buyLicense,
  getLicenses,
  getLicenseById,
  getMyPurchases,
  markAsPaid,
  getExpiredSoldLicenses
} = require('../controllers/licenseController')

const { protect, requireRole } = require('../middleware/authMiddleware')

// 🧾 Seller submits license
router.post('/', protect, requireRole('seller'), submitLicense)

// 🛂 Admin approves license
router.patch('/:id/approve', protect, requireRole('admin'), approveLicense)

// ❌ Admin rejects license
router.patch('/:id/reject', protect, requireRole('admin'), rejectLicense)

// 💳 Buyer purchases license
router.post('/:id/buy', protect, requireRole('user'), buyLicense)

router.get('/mypurchases', protect,  getMyPurchases)

router.get('/expired-sold', protect, requireRole('admin'), getExpiredSoldLicenses)

router.put('/mark-paid/:licenseId', protect,  requireRole('admin'), markAsPaid)


router.get('/', protect, getLicenses)
router.get('/:id', protect, getLicenseById)




module.exports = router
