import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validateMiddleware.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';

const router = Router();

// Public routes
router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.login);

// Protected routes
router.get('/profile', authenticateToken, AuthController.getProfile);
router.get('/users', authenticateToken, requireAdmin, AuthController.getAllUsers);

export default router;
