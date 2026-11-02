import prisma from '../config/prisma.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { CreateReservationInput, UpdateReservationStatusInput } from '../validators/reservationValidators.js';

export class ReservationService {
  static async create(userId: string, data: CreateReservationInput) {
    // RN-07: Validar que la fecha no sea anterior a hoy
    const today = new Date().toISOString().split('T')[0];
    if (data.reservationDate < today) {
      throw new AppError('No se pueden crear reservas para fechas anteriores a la actual (RN-07)', 400);
    }

    // RN-05: Validar que el espacio exista y esté activo
    const space = await prisma.space.findUnique({
      where: { id: data.spaceId },
    });

    if (!space) {
      throw new AppError('El espacio especificado no existe', 404);
    }

    if (space.status !== 'ACTIVE') {
      throw new AppError('No se pueden realizar reservas sobre espacios deshabilitados (RN-05)', 400);
    }

    // Validar horario según schedules del espacio
    const targetDate = new Date(`${data.reservationDate}T12:00:00Z`);
    const dayOfWeek = targetDate.getUTCDay(); // 0 = Domingo, 1 = Lunes...

    const schedule = await prisma.schedule.findFirst({
      where: {
        spaceId: data.spaceId,
        dayOfWeek,
        status: 'ACTIVE',
      },
    });

    if (!schedule) {
      throw new AppError('El espacio no tiene servicio programado para el día de la semana seleccionado', 400);
    }

    if (data.startTime < schedule.openingTime || data.endTime > schedule.closingTime) {
      throw new AppError(
        `El horario reservado debe estar dentro del horario de atención del espacio (${schedule.openingTime} - ${schedule.closingTime})`,
        400
      );
    }

    // RN-01: Validar solapamiento de reservas (Conflict checking)
    // Conflicto ocurre si: nuevaInicio < reservaFin AND nuevaFin > reservaInicio
    const existingConflicts = await prisma.reservation.findMany({
      where: {
        spaceId: data.spaceId,
        reservationDate: data.reservationDate,
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [
          { startTime: { lt: data.endTime } },
          { endTime: { gt: data.startTime } },
        ],
      },
    });

    if (existingConflicts.length > 0) {
      throw new AppError(
        `Conflicto de horarios (RN-01): El espacio ya se encuentra reservado en el rango solicitado (${existingConflicts[0].startTime} - ${existingConflicts[0].endTime}).`,
        409
      );
    }

    // Crear reserva
    return prisma.reservation.create({
      data: {
        userId,
        spaceId: data.spaceId,
        reservationDate: data.reservationDate,
        startTime: data.startTime,
        endTime: data.endTime,
        notes: data.notes?.trim() || null,
        status: 'CONFIRMED',
      },
      include: {
        space: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  static async getAll() {
    return prisma.reservation.findMany({
      include: {
        space: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: [{ reservationDate: 'desc' }, { startTime: 'desc' }],
    });
  }

  static async getByUser(userId: string) {
    return prisma.reservation.findMany({
      where: { userId },
      include: {
        space: true,
      },
      orderBy: [{ reservationDate: 'desc' }, { startTime: 'desc' }],
    });
  }

  static async getById(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        space: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!reservation) {
      throw new AppError('Reserva no encontrada', 404);
    }

    return reservation;
  }

  static async updateStatus(id: string, data: UpdateReservationStatusInput, requestingUser: { userId: string; role: string }) {
    const reservation = await this.getById(id);

    // RN-03: Solo un admin o el propio usuario pueden cancelar
    if (requestingUser.role !== 'ADMIN' && reservation.userId !== requestingUser.userId) {
      throw new AppError('No tienes permisos para modificar esta reserva (RN-03)', 403);
    }

    // Si es un usuario normal, solo puede cancelar
    if (requestingUser.role !== 'ADMIN' && data.status !== 'CANCELLED') {
      throw new AppError('Los usuarios solo pueden solicitar la cancelación de su reserva', 403);
    }

    return prisma.reservation.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.notes && { notes: data.notes.trim() }),
      },
      include: {
        space: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  static async cancel(id: string, requestingUser: { userId: string; role: string }) {
    return this.updateStatus(id, { status: 'CANCELLED' }, requestingUser);
  }

  static async getAvailability(spaceId: string, date: string) {
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      throw new AppError('Espacio no encontrado', 404);
    }

    const targetDate = new Date(`${date}T12:00:00Z`);
    const dayOfWeek = targetDate.getUTCDay();

    const schedule = await prisma.schedule.findFirst({
      where: {
        spaceId,
        dayOfWeek,
        status: 'ACTIVE',
      },
    });

    if (!schedule) {
      return {
        date,
        spaceId,
        isOpen: false,
        message: 'El espacio se encuentra cerrado en el día seleccionado.',
        slots: [],
        reservations: [],
      };
    }

    // Obtener reservas activas en la fecha
    const reservations = await prisma.reservation.findMany({
      where: {
        spaceId,
        reservationDate: date,
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
      },
      orderBy: { startTime: 'asc' },
    });

    // Generar franjas de 1 hora entre openingTime y closingTime
    const slots: Array<{ startTime: string; endTime: string; isAvailable: boolean }> = [];
    const openHour = parseInt(schedule.openingTime.split(':')[0], 10);
    const closeHour = parseInt(schedule.closingTime.split(':')[0], 10);

    for (let h = openHour; h < closeHour; h++) {
      const slotStart = `${h.toString().padStart(2, '0')}:00`;
      const slotEnd = `${(h + 1).toString().padStart(2, '0')}:00`;

      const hasConflict = reservations.some(
        (r) => slotStart < r.endTime && slotEnd > r.startTime
      );

      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        isAvailable: !hasConflict,
      });
    }

    return {
      date,
      spaceId,
      spaceName: space.name,
      isOpen: true,
      schedule: {
        openingTime: schedule.openingTime,
        closingTime: schedule.closingTime,
      },
      slots,
      reservations,
    };
  }
}
