import express from 'express';
import { register, login, getProfile, uploadAvatar } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/avatar', protect, uploadAvatar);

export default router;
