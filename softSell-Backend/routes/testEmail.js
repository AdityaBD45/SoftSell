const express = require('express')
const router = express.Router()
const sendEmail = require('../utils/sendEmail')

router.get('/', async (req, res) => {
  try {
    await sendEmail({
      to: 'lalitaadityadharaneppanavar@gmail.com',
      subject: 'Test Email from SoftSell',
      html: '<h1>Hello Aditya</h1><p>This is a test email from Brevo SMTP.</p>'
    })
    res.send('Email sent (check your inbox)')
  } catch (error) {
    console.error('Email error:', error)
    res.status(500).send('Failed to send email')
  }
})

module.exports = router
