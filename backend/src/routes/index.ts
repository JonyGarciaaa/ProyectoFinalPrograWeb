import { Router } from 'express';
import authRoutes from './authRoutes.js';
import spaceRoutes from './spaceRoutes.js';
import reservationRoutes from './reservationRoutes.js';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ReserveHub API',
  });
});

router.use('/auth', authRoutes);
router.use('/spaces', spaceRoutes);
router.use('/reservations', reservationRoutes);

export default router;
