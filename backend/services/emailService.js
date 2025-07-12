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
           from: process.env.EMAIL_USER,
           to,
           subject,
           html: htmlContent,
         };
         await transporter.sendMail(mailOptions);
         console.log(`Email sent to ${to} with subject: ${subject}`);
       } catch (error) {
         console.error(`Error sending email to ${to}:`, error);
       }
     };

     module.exports = {
       sendEmail,
     };
     