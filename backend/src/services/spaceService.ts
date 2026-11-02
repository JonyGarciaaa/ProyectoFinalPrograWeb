import prisma from '../config/prisma.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { CreateSpaceInput, UpdateSpaceInput } from '../validators/spaceValidators.js';

export class SpaceService {
  static async getAll(includeInactive = false) {
    return prisma.space.findMany({
      where: includeInactive ? undefined : { status: 'ACTIVE' },
      include: {
        schedules: {
          orderBy: { dayOfWeek: 'asc' },
        },
        _count: {
          select: { reservations: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  static async getById(id: string) {
    const space = await prisma.space.findUnique({
      where: { id },
      include: {
        schedules: {
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });

    if (!space) {
      throw new AppError('Espacio no encontrado', 404);
    }

    return space;
  }

  static async create(data: CreateSpaceInput) {
    const space = await prisma.space.create({
      data: {
        name: data.name.trim(),
        description: data.description.trim(),
        location: data.location.trim(),
        capacity: data.capacity,
        imageUrl: data.imageUrl || null,
        status: data.status,
      },
    });

    // Generate default weekday schedules
    for (let day = 1; day <= 5; day++) {
      await prisma.schedule.create({
        data: {
          spaceId: space.id,
          dayOfWeek: day,
          openingTime: '08:00',
          closingTime: '18:00',
          status: 'ACTIVE',
        },
      });
    }

    return this.getById(space.id);
  }

  static async update(id: string, data: UpdateSpaceInput) {
    await this.getById(id);

    return prisma.space.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.description && { description: data.description.trim() }),
        ...(data.location && { location: data.location.trim() }),
        ...(data.capacity !== undefined && { capacity: data.capacity }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
        ...(data.status && { status: data.status }),
      },
    });
  }

  static async toggleStatus(id: string) {
    const space = await this.getById(id);
    const newStatus = space.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    return prisma.space.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  static async delete(id: string) {
    await this.getById(id);
    return prisma.space.delete({
      where: { id },
    });
  }
}
