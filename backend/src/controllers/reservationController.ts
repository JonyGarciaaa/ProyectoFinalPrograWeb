import { Response, NextFunction } from 'express';
import { ReservationService } from '../services/reservationService.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export class ReservationController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reservation = await ReservationService.create(req.user!.userId, req.body);
      return sendSuccess(res, 201, 'Reserva creada exitosamente', reservation);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reservations = await ReservationService.getAll();
      return sendSuccess(res, 200, 'Reservas obtenidas exitosamente', reservations);
    } catch (error) {
      next(error);
    }
  }

  static async getMy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reservations = await ReservationService.getByUser(req.user!.userId);
      return sendSuccess(res, 200, 'Tus reservas obtenidas exitosamente', reservations);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const reservation = await ReservationService.getById(id);
      return sendSuccess(res, 200, 'Reserva obtenida exitosamente', reservation);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const reservation = await ReservationService.updateStatus(
        id,
        req.body,
        { userId: req.user!.userId, role: req.user!.role }
      );
      return sendSuccess(res, 200, 'Estado de la reserva actualizado exitosamente', reservation);
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const reservation = await ReservationService.cancel(id, {
        userId: req.user!.userId,
        role: req.user!.role,
      });
      return sendSuccess(res, 200, 'Reserva cancelada exitosamente', reservation);
    } catch (error) {
      next(error);
    }
  }

  static async getAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const date = req.query.date as string;
      const availability = await ReservationService.getAvailability(id, date);
      return sendSuccess(res, 200, 'Disponibilidad calculada exitosamente', availability);
    } catch (error) {
      next(error);
    }
  }
}
