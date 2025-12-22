import express from 'express';
import { body } from 'express-validator';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';
import {
  deleteMe,
  deleteUser,
  getMe,
  getUserById,
  getUsers,
  updateMe,
  updateUser,
} from '../controllers/userController.js';

const router = express.Router();

// Current user
router.get('/me', protect, getMe);

router.put(
  '/me',
  protect,
  [body('name').optional().isString().isLength({ min: 2, max: 100 })],
  updateMe
);

router.delete('/me', protect, deleteMe);

// Admin CRUD
router.get('/', protect, requireAdmin, getUsers);
router.get('/:id', protect, requireAdmin, getUserById);

router.put(
  '/:id',
  protect,
  requireAdmin,
  [
    body('name').optional().isString().isLength({ min: 2, max: 100 }),
    body('role').optional().isIn(['user', 'admin']),
    body('isEmailVerified').optional().isBoolean(),
  ],
  updateUser
);

router.delete('/:id', protect, requireAdmin, deleteUser);

export default router;


