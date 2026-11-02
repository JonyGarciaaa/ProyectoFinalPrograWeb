import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return sendSuccess(res, 201, 'Usuario registrado exitosamente', result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      return sendSuccess(res, 200, 'Inicio de sesión exitoso', result);
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getProfile(req.user!.userId);
      return sendSuccess(res, 200, 'Perfil obtenido correctamente', user);
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const users = await AuthService.getAllUsers();
      return sendSuccess(res, 200, 'Usuarios listados correctamente', users);
    } catch (error) {
      next(error);
    }
  }
}
