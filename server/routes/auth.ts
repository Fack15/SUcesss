import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

// Authentication routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));
router.post('/update-password', authController.updatePassword.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.get('/verify-token', authController.verifyToken.bind(authController));

export default router;