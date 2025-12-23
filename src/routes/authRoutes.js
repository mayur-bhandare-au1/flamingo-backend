import express from 'express';
import connectDB from '../config/db.js';
import { body } from 'express-validator';
import { login, register, resendOtp, verifyEmail } from '../controllers/authController.js';

const router = express.Router();
await connectDB();
router.post(
  '/register',
  [
    body('name').isString().isLength({ min: 2, max: 100 }).trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
  ],
  register
);

router.post(
  '/verify-email',
  [
    body('email').isEmail().normalizeEmail(),
    body('otp').isLength({ min: 4, max: 10 }),
  ],
  verifyEmail
);

router.post(
  '/resend-otp',
  [body('email').isEmail().normalizeEmail()],
  resendOtp
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
  ],
  login
);

export default router;


