const nodemailer = require('nodemailer');
const config = require('../config/config');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (config.smtp.host && config.smtp.user && config.smtp.pass) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
      }
    });
  }
  return transporter;
};

/**
 * Send email notification if SMTP is configured; otherwise log cleanly in non-test mode.
 */
const sendNotificationEmail = async ({ to, subject, text, html }) => {
  if (!to) return { sent: false, reason: 'No recipient' };

  const mailer = getTransporter();
  if (!mailer) {
    if (config.nodeEnv !== 'test') {
      console.log(`[Email Notification Preview] To: ${to} | Subject: ${subject}`);
    }
    return { sent: false, simulated: true };
  }

  try {
    const info = await mailer.sendMail({
      from: config.smtp.from,
      to,
      subject,
      text,
      html
    });
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email delivery error:', error.message);
    return { sent: false, error: error.message };
  }
};

module.exports = { sendNotificationEmail };
