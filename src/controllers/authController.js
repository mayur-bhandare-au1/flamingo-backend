import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import OtpToken from '../models/OtpToken.js';
import { generateOtp } from '../utils/generateOtp.js';
import { sendOtpEmail } from '../utils/emailService.js';

await connectDB();

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return null;
};

export const register = async (req, res) => {
  const validationError = handleValidation(req, res);
  if (validationError) return;

  const { name, email, password } = req.body;

  console.log(`Body is ${req.body}`)

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });

    // Generate OTP
    const otp = generateOtp();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await OtpToken.deleteMany({ user: user._id });
    await OtpToken.create({ user: user._id, otpHash, expiresAt });

    await sendOtpEmail(user.email, otp);

    return res.status(201).json({
      message: 'User registered, verification OTP sent to email',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const verifyEmail = async (req, res) => {
  const validationError = handleValidation(req, res);
  if (validationError) return;

  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or OTP' });
    }

    const record = await OtpToken.findOne({ user: user._id });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired or not found' });
    }

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (otpHash !== record.otpHash) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isEmailVerified = true;
    await user.save();
    await OtpToken.deleteMany({ user: user._id });

    const token = signToken(user._id);

    return res.status(200).json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const resendOtp = async (req, res) => {
  const validationError = handleValidation(req, res);
  if (validationError) return;

  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const otp = generateOtp();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OtpToken.deleteMany({ user: user._id });
    await OtpToken.create({ user: user._id, otpHash, expiresAt });

    await sendOtpEmail(user.email, otp);

    return res.status(200).json({ message: 'OTP resent to email' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  const validationError = handleValidation(req, res);
  if (validationError) return;

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user._id);

    return res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


