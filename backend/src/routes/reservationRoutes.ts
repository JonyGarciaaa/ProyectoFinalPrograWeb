import { Router } from 'express';
import { ReservationController } from '../controllers/reservationController.js';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validateMiddleware.js';
import {
  createReservationSchema,
  updateReservationStatusSchema,
} from '../validators/reservationValidators.js';

const router = Router();

// All reservation endpoints require authentication (RN-02)
router.use(authenticateToken);

// User's own reservations (RF-10)
router.get('/my', ReservationController.getMy);

// Admin: all reservations (RF-15)
router.get('/', requireAdmin, ReservationController.getAll);

// Create reservation (RF-08, RN-01, RN-06, RN-07)
router.post('/', validateBody(createReservationSchema), ReservationController.create);

// Get single reservation
router.get('/:id', ReservationController.getById);

// Update status (Admin or user cancellation)
router.put('/:id', validateBody(updateReservationStatusSchema), ReservationController.updateStatus);

// Cancel reservation (RF-11, RN-03)
router.delete('/:id', ReservationController.cancel);

export default router;
