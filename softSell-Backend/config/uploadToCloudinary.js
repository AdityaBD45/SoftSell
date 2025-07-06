const cloudinary = require('./cloudinary')

const uploadImageToCloudinary = async (imageBase64) => {
  try {
    if (!imageBase64 || !imageBase64.startsWith('data:image/')) {
      throw new Error('Invalid image format: expected base64 data URI')
    }

    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: 'transactions',
    })

    return result.secure_url
  } catch (error) {
    console.error('❌ Cloudinary Upload Error:', error.message || error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

module.exports = uploadImageToCloudinary
