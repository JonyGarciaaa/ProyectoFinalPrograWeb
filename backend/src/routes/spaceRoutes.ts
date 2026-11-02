import { Router } from 'express';
import { SpaceController } from '../controllers/spaceController.js';
import { ReservationController } from '../controllers/reservationController.js';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';
import { validateBody, validateQuery } from '../middlewares/validateMiddleware.js';
import { createSpaceSchema, updateSpaceSchema } from '../validators/spaceValidators.js';
import { availabilityQuerySchema } from '../validators/reservationValidators.js';

const router = Router();

// Public space catalog
router.get('/', SpaceController.getAll);
router.get('/:id', SpaceController.getById);

// Availability checking (RF-06)
router.get('/:id/availability', validateQuery(availabilityQuerySchema), ReservationController.getAvailability);

// Admin space management (RF-12, RF-13, RF-14)
router.post('/', authenticateToken, requireAdmin, validateBody(createSpaceSchema), SpaceController.create);
router.put('/:id', authenticateToken, requireAdmin, validateBody(updateSpaceSchema), SpaceController.update);
router.patch('/:id/toggle', authenticateToken, requireAdmin, SpaceController.toggleStatus);
router.delete('/:id', authenticateToken, requireAdmin, SpaceController.delete);

export default router;
