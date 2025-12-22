import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP configuration is missing in environment variables');
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
};

export const sendOtpEmail = async (to, otp) => {
  const mailTransporter = getTransporter();

  const mailOptions = {
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject: 'Flamingo App - Email Verification OTP',
    text: `Your Flamingo email verification code is: ${otp}\n\nThis code will expire in 10 minutes.\nIf you did not request this, please ignore this email.`,
    html: `<p>Your Flamingo email verification code is:</p>
           <h2>${otp}</h2>
           <p>This code will expire in 10 minutes.</p>
           <p>If you did not request this, please ignore this email.</p>`,
  };

  await mailTransporter.sendMail(mailOptions);
};


