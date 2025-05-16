// bot/services/email.js
const nodemailer = require('nodemailer');

// Create a reusable transporter using ethereal.email for testing or your SMTP settings
let transporter;

// Initialize transporter once
async function getTransporter() {
  if (transporter) return transporter;
  // For demo/testing: use ethereal
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
  return transporter;
}

/**
 * Sends a one-time code to the given email address.
 * @param {string} toEmail
 * @param {string} code
 */
async function sendEmailOTP(toEmail, code) {
  const trans = await getTransporter();
  const info = await trans.sendMail({
    from: '"Stellica Bot" <no-reply@stellica.com>',
    to: toEmail,
    subject: 'Your Stellica Transfer One-Time Code',
    text: `Your one-time transfer code is: ${code}`
  });
  console.log('Sent email OTP:', nodemailer.getTestMessageUrl(info));
}

module.exports = { sendEmailOTP };
