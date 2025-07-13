const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE_HOST,
  port: process.env.EMAIL_SERVICE_PORT,
  secure: process.env.EMAIL_SERVICE_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"LevelMinds" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error)
  {
    console.error(`Error sending email to ${to}:`, error);
    // In a real app, you might want to throw the error or handle it more gracefully
  }
};

const sendOnboardingEmail = async (email, password) => {
    const subject = 'Welcome to LevelMinds! Complete Your Registration';
    const htmlContent = `
        <h1>Welcome to LevelMinds!</h1>
        <p>An account has been created for you. Please log in to complete your profile setup.</p>
        <p>Here are your login credentials:</p>
        <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>
            <a href="${process.env.FRONTEND_URL}/" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Login Now
            </a>
        </p>
        <p>We recommend changing your password after your first login.</p>
        <p>Best regards,<br/>The LevelMinds Team</p>
    `;
    await sendEmail(email, subject, htmlContent);
};


module.exports = {
  sendEmail,
  sendOnboardingEmail,
};