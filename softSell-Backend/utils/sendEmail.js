const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',  // Brevo SMTP server
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: '8f1487001@smtp-brevo.com', // your Brevo SMTP login
    pass: 'dOPjBYMahtfVATF6'          // your Brevo SMTP master password
  }
})

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: '"SoftSell" <lalitaadityadharaneppanavar@gmail.com>', // sender address
    to,
    subject,
    html,
  }

  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
