import { Router } from 'express';
import { register, login, getMe, changePassword, updateProfile, getUsers, approveUser, toggleUserActive, deleteUser } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/change-password', authenticate, changePassword);
router.put('/profile', authenticate, updateProfile);
router.get('/users', authenticate, getUsers);
router.put('/users/:id/approve', authenticate, approveUser);
router.put('/users/:id/toggle-active', authenticate, toggleUserActive);
router.delete('/users/:id', authenticate, deleteUser);

export default router;
