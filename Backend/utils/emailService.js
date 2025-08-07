const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send event reminder email
const sendEventReminder = async (user, event) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Reminder: ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Event Reminder</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">${event.title}</h3>
            ${event.description ? `<p><strong>Description:</strong> ${event.description}</p>` : ''}
            <p><strong>Start:</strong> ${new Date(event.start).toLocaleString()}</p>
            <p><strong>End:</strong> ${new Date(event.end).toLocaleString()}</p>
            ${event.location ? `<p><strong>Location:</strong> ${event.location}</p>` : ''}
            <p><strong>Category:</strong> ${event.category}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            This is an automated reminder from your Calendar app.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email: ', error);
    return false;
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Welcome to Calendar.io!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Calendar.io!</h2>
          <p>Hi ${user.name},</p>
          <p>Thank you for joining Calendar.io! We're excited to help you stay organized and never miss an important event.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Getting Started</h3>
            <ul>
              <li>Create your first event</li>
              <li>Set up reminders</li>
              <li>Organize events by categories</li>
              <li>Invite others to your events</li>
            </ul>
          </div>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The Calendar.io Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email: ', error);
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>You requested a password reset for your Calendar.io account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
          <p>Best regards,<br>The Calendar.io Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email: ', error);
    return false;
  }
};

module.exports = {
  sendEventReminder,
  sendWelcomeEmail,
  sendPasswordResetEmail
}; 