import { Request, Response, NextFunction } from 'express';
import { SpaceService } from '../services/spaceService.js';
import { sendSuccess } from '../utils/response.js';

export class SpaceController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const spaces = await SpaceService.getAll(includeInactive);
      return sendSuccess(res, 200, 'Espacios obtenidos exitosamente', spaces);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const space = await SpaceService.getById(id);
      return sendSuccess(res, 200, 'Espacio obtenido exitosamente', space);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const space = await SpaceService.create(req.body);
      return sendSuccess(res, 201, 'Espacio creado exitosamente', space);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const space = await SpaceService.update(id, req.body);
      return sendSuccess(res, 200, 'Espacio actualizado exitosamente', space);
    } catch (error) {
      next(error);
    }
  }

  static async toggleStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const space = await SpaceService.toggleStatus(id);
      return sendSuccess(res, 200, 'Estado del espacio actualizado', space);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await SpaceService.delete(id);
      return sendSuccess(res, 200, 'Espacio eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  }
}
