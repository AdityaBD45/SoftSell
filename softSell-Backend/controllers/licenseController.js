const License = require('../models/License')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail') // Adjust this path if needed

// @desc    Submit new license
// @route   POST /api/licenses
// @access  Seller only
const submitLicense = async (req, res) => {
  try {
    const { title, category, daysToSell, contactNumber, credentials } = req.body
    const sellerId = req.user._id

    const newLicense = await License.create({
      title,
      category,
      daysToSell,
      durationInDays: daysToSell,
      contactNumber,
      credentials,
      seller: sellerId,
      status: 'pending',
    })

    const seller = await User.findById(sellerId)
    if (seller && seller.email) {
      await sendEmail({
        to: seller.email,
        subject: 'License Submission Received - SoftSell',
        html: `
          <p>Hello <strong>${seller.name}</strong>,</p>
          <p>Thank you for submitting your license titled "<strong>${title}</strong>".</p>
          <p>Please wait while our admin verifies your license. We will notify you once the verification is complete.</p>
          <p>Regards,<br/>SoftSell Team</p>
        `,
      })
    }

    res.status(201).json({ message: 'License submitted for review', license: newLicense })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Approve license and set price (Admin)
// @route   PATCH /api/licenses/:id/approve
// @access  Admin only
const approveLicense = async (req, res) => {
  try {
    const license = await License.findById(req.params.id)
    if (!license) return res.status(404).json({ message: 'License not found' })

    const { price } = req.body
    if (!price || price <= 0) {
      return res.status(400).json({ message: 'Valid price must be provided by admin' })
    }

    license.price = price
    license.status = 'approved'
    await license.save()

    const seller = await User.findById(license.seller)
    if (seller && seller.email) {
      await sendEmail({
        to: seller.email,
        subject: 'Your License is Approved - SoftSell',
        html: `
    <p>Hello <strong>${seller.name}</strong>,</p>

    <p>Your license titled <strong>"${license.title}"</strong> has been <span style="color: green; font-weight: bold;">verified and approved</span> with a price of ₹${price}.</p>

    <p><strong>Note:</strong> Our admin has logged into your license for verification purposes. You have full control over who is logged into your license.</p>

    <p>Please <span style="color: red;"><strong>log out the admin account</strong></span> from your license device immediately to secure access.</p>

    <p>Once a buyer purchases your license, we will notify you and securely share your credentials with them.</p>

    <p><strong>Payment:</strong> You will receive your payment after the license expiry date.</p>

    <br />
    <p>Regards,<br/>The <strong>SoftSell</strong> Team</p>
  `
      })
    }

    res.json({ message: 'License approved and price set', license })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Reject license (Admin)
// @route   PATCH /api/licenses/:id/reject
// @access  Admin only
const rejectLicense = async (req, res) => {
  try {
    const license = await License.findById(req.params.id)
    if (!license) return res.status(404).json({ message: 'License not found' })

    license.status = 'rejected'
    await license.save()

    res.json({ message: 'License rejected', license })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Purchase license (Buyer)
// @route   POST /api/licenses/:id/buy
// @access  Buyer only
const buyLicense = async (req, res) => {
  try {
    const license = await License.findById(req.params.id)

    if (!license) return res.status(404).json({ message: 'License not found' })
    if (license.status !== 'approved') return res.status(400).json({ message: 'License not available' })
    if (license.buyer) return res.status(400).json({ message: 'License already sold' })

    license.buyer = req.user._id
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + license.daysToSell)
    license.expiryDate = expiryDate
    license.status = 'sold'

    await license.save()

    const seller = await User.findById(license.seller)
    const buyer = await User.findById(license.buyer)

    if (seller && seller.email) {
      await sendEmail({
        to: seller.email,
        subject: 'Your License Has Been Purchased - SoftSell',
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hello <strong>${seller.name}</strong>,</p>

      <p>Good news! Your license titled <strong>"${license.title}"</strong> has been purchased.</p>

      <p>The buyer has received the credentials.</p>

      <p>We will notify you once the license expires.</p>

      <p>Regards,<br>
      <strong>SoftSell Team</strong></p>
    </div>
  `
      })
    }

    if (buyer && buyer.email) {
      await sendEmail({
        to: buyer.email,
        subject: 'License Purchase Confirmation - SoftSell',
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hello <strong>${buyer.name}</strong>,</p>

      <p>Thank you for purchasing the license titled <strong>"${license.title}"</strong>.</p>

      <p>Your license will expire on <strong>${expiryDate.toDateString()}</strong>.</p>

      <p>Regards,<br>
      <strong>SoftSell Team</strong></p>
    </div>
  `
      })
    }

    res.json({ message: 'License purchased successfully', license })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ FIXED: Admin can now access credentials & contactNumber
// @desc    Get all licenses (filtered by role)
// @route   GET /api/licenses
// @access  Protected
const getLicenses = async (req, res) => {
  try {
    let query = {}

    if (req.user.role === 'seller') {
      query.seller = req.user._id
    } else if (req.user.role === 'user') {
  query.status = 'approved'
  query.$or = [
    { buyer: { $exists: false } },
    { buyer: null }
  ]
}

    let licenseQuery = License.find(query).populate('seller', 'name email')

    if (req.user.role === 'admin') {
      licenseQuery = licenseQuery.select('+credentials.username +credentials.password +contactNumber')
    }

    const licenses = await licenseQuery
    res.json(licenses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ FIXED: Admin sees full info for single license
// @desc    Get single license
// @route   GET /api/licenses/:id
// @access  Protected
const getLicenseById = async (req, res) => {
  try {
    let query = License.findById(req.params.id).populate('seller', 'name email')

    if (req.user.role === 'admin') {
      query = query.select('+credentials.username +credentials.password +contactNumber')
    }

    const license = await query

    if (!license) {
      return res.status(404).json({ message: 'License not found' })
    }

    // Seller can only see their own license
    if (req.user.role === 'seller' && license.seller._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to view this license' })
    }

    // Buyer access logic
    if (req.user.role === 'user') {
      const isApprovedAndUnsold = license.status === 'approved' && !license.buyer
      const isBuyer = license.buyer && license.buyer.toString() === req.user._id.toString()

      if (!isApprovedAndUnsold && !isBuyer) {
        return res.status(403).json({ message: 'Only eligible buyers can view this license' })
      }
    }

    res.json(license)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get licenses purchased by current buyer
// @route   GET /api/licenses/mypurchases
// @access  Buyer only
const getMyPurchases = async (req, res) => {
  try {
    const licenses = await License.find({
      buyer: req.user._id,
      status: 'sold',
    })
      .select('+credentials.username +credentials.password') // must explicitly select hidden fields
      .populate('seller', 'name email')

    res.json(licenses)
  } catch (error) {
    console.error('❌ getMyPurchases Error:', error)
    res.status(500).json({ message: 'Failed to fetch purchases' })
  }
}

const markAsPaid = async (req, res) => {
  try {
    const { licenseId } = req.params;

    const license = await License.findById(licenseId)
      .populate('seller', 'email name')
      .populate('buyer', 'email name');

    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    if (license.status !== 'sold') {
      return res.status(400).json({ message: 'Only sold licenses can be marked as paid' });
    }

    if (!license.expiryDate || new Date(license.expiryDate) > new Date()) {
      return res.status(400).json({ message: 'Cannot mark as paid before expiry' });
    }

    if (license.paidToSeller) {
      return res.status(400).json({ message: 'Already marked as paid' });
    }

    license.paidToSeller = true;
    await license.save();

    // 📧 Send HTML Email to Seller
    const sellerHtml = `
      <h2>✅ Payment Received</h2>
      <p>Hello <strong>${license.seller.name}</strong>,</p>
      <p>Your license titled <strong>"${license.title}"</strong> has been <span style="color:green;"><strong>marked as paid</strong></span> by the admin.</p>
      <p>You will receive your payment shortly.</p>
      <br />
      <p>Thank you for using <strong>SoftSell</strong>!</p>
    `;

    await sendEmail({
      to: license.seller.email,
      subject: '✅ Payment Completed - SoftSell',
      html: sellerHtml,
    });

    // 📧 Send HTML Email to Buyer with Feedback link
    const feedbackUrl = `https://softsell.in/feedback?licenseId=${license._id}`;

    const buyerHtml = `
      <h2>🎉 License Delivered</h2>
      <p>Hi <strong>${license.buyer.name}</strong>,</p>
      <p>Your license purchase for <strong>"${license.title}"</strong> is complete and the seller has been paid.</p>
      <p>We'd love to hear your feedback to improve our platform.</p>
      <p>
        👉 <a href="${feedbackUrl}" style="background-color:#6b46c1; color:white; padding:10px 15px; text-decoration:none; border-radius:5px;">Give Feedback</a>
      </p>
      <br />
      <p>Thank you for choosing <strong>SoftSell</strong>!</p>
    `;

    await sendEmail({
      to: license.buyer.email,
      subject: '📦 License Delivered - Feedback Requested',
      html: buyerHtml,
    });

    res.status(200).json({ message: 'Marked as paid and emails sent successfully' });
  } catch (err) {
    console.error('❌ markAsPaid Error:', err.message || err);
    res.status(500).json({ message: 'Failed to mark as paid' });
  }
};

// @desc    Get all licenses that are sold, expired, and not yet marked as paid
// @route   GET /api/licenses/expired-sold
// @access  Admin
const getExpiredSoldLicenses = async (req, res) => {
  try {
    const now = new Date()

    const licenses = await License.find({
      status: 'sold',
      expiryDate: { $lte: now },
      paidToSeller: { $ne: true }
    })
      .populate('seller', 'name email')
      .populate('buyer', 'name email')

    res.status(200).json(licenses)
  } catch (error) {
    console.error('❌ getExpiredSoldLicenses error:', error.message || error)
    res.status(500).json({ message: 'Failed to fetch licenses' })
  }
}


module.exports = {
  submitLicense,
  approveLicense,
  rejectLicense,
  buyLicense,
  getLicenses,
  getLicenseById,
  getMyPurchases,
  markAsPaid,
  getExpiredSoldLicenses
}
