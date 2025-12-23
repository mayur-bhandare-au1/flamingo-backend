import nodemailer from 'nodemailer';

  import { Resend } from 'resend';

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

const resend = new Resend("re_PkBJeqMt_BiePYXwxiZX3wViYNrNkJUUe");

export const sendOtpEmail = async (to, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Flamingo <onboarding@resend.dev>", // OK for testing
      to: ["flamingoappdemo@gmail.com"], // must be array (best practice)
      subject: "Flamingo App - Email Verification OTP",
      html: `
        <p>Your Flamingo email verification code is:</p>
        <h2>${otp}</h2>
        <p>This code will expire in <strong>10 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Failed to send OTP email");
    }

    return data;
  } catch (err) {
    console.error("sendOtpEmail failed:", err);
    throw err;
  }
};



