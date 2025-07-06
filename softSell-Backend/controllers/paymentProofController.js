const PaymentProof = require('../models/PaymentProof');
const uploadImageToCloudinary = require('../config/uploadToCloudinary');

const submitPaymentProof = async (req, res) => {
  try {
    const { licenseId, txnId, screenshotBase64 } = req.body;
    const buyerId = req.user._id;

    console.log('📥 Incoming Payment Proof:');
    console.log('➡️ licenseId:', licenseId);
    console.log('➡️ txnId:', txnId);
    console.log('➡️ screenshotBase64 length:', screenshotBase64?.length);

    // Validate required fields
    if (
      !licenseId || typeof licenseId !== 'string' || !licenseId.trim() ||
      !txnId || typeof txnId !== 'string' || !txnId.trim() ||
      !screenshotBase64 || typeof screenshotBase64 !== 'string' ||
      !screenshotBase64.startsWith('data:image/')
    ) {
      return res.status(400).json({ message: 'All fields are required and must be valid' });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadImageToCloudinary(screenshotBase64);

    // Save payment proof to DB
    const proof = await PaymentProof.create({
      license: licenseId,
      buyer: buyerId,
      txnId,
      screenshot: imageUrl,
      status: 'pending',
    });

    res.status(201).json({
      message: '✅ Payment proof submitted successfully',
      proof,
    });
  } catch (err) {
    console.error('❌ submitPaymentProof Error:', err.message || err);
    res.status(500).json({ message: 'Failed to submit payment proof' });
  }
};



module.exports = {
  submitPaymentProof,
};
