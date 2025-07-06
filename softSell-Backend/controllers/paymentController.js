const PaymentProof = require('../models/PaymentProof')
const License = require('../models/License')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail') // ✅ IMPORT FIX

const getPendingProofs = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' })
    }

    const proofs = await PaymentProof.find({ status: 'pending' })
      .populate('buyer', 'name email')
      .populate('license', 'title seller')

    res.json(proofs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const approveProof = async (req, res) => {
  try {
    const proof = await PaymentProof.findById(req.params.id).populate('license')

    if (!proof || proof.status !== 'pending') {
      return res.status(404).json({ message: 'Proof not found or already handled' })
    }

    const license = await License.findById(proof.license._id)
    if (!license) return res.status(404).json({ message: 'License not found' })
    if (license.status !== 'approved' || license.buyer) {
      return res.status(400).json({ message: 'License already sold or not available' })
    }

    // Mark license as sold
    license.buyer = proof.buyer
    license.status = 'sold'
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + license.daysToSell)
    license.expiryDate = expiry
    await license.save()

    // Update payment proof
    proof.status = 'approved'
    await proof.save()

    // Send emails
    const buyer = await User.findById(proof.buyer)
    const seller = await User.findById(license.seller)

    if (buyer?.email) {
      await sendEmail({
        to: buyer.email,
        subject: 'License Purchase Approved',
        html: `
          <p>Hello <strong>${buyer.name}</strong>,</p>
          <p>Your purchase for <strong>${license.title}</strong> is approved.</p>
          <p>Here are your credentials:</p>
          <ul>
            <li><strong>Username:</strong> ${license.credentials.username}</li>
            <li><strong>Password:</strong> ${license.credentials.password}</li>
            <li><strong>Expires on:</strong> ${expiry.toDateString()}</li>
          </ul>
          <p>Regards,<br>SoftSell Team</p>
        `,
      })
    }

    if (seller?.email) {
      await sendEmail({
        to: seller.email,
        subject: 'Your License Has Been Sold',
        html: `
          <p>Hello <strong>${seller.name}</strong>,</p>
          <p>Your license titled <strong>${license.title}</strong> has been sold.</p>
          <p>We’ll notify you again after it expires for payment.</p>
          <p>Regards,<br>SoftSell Team</p>
        `,
      })
    }

    res.json({ message: 'Payment approved and license marked as sold' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const rejectProof = async (req, res) => {
  try {
    const proof = await PaymentProof.findById(req.params.id)
    if (!proof || proof.status !== 'pending') {
      return res.status(404).json({ message: 'Proof not found or already handled' })
    }

    proof.status = 'rejected'
    await proof.save()

    res.json({ message: 'Payment proof rejected' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getPendingProofs,
  approveProof,
  rejectProof,
}
