import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createReservationSchema = z
  .object({
    spaceId: z.string().uuid('ID de espacio inválido'),
    reservationDate: z.string().regex(dateRegex, 'Formato de fecha inválido (AAAA-MM-DD)'),
    startTime: z.string().regex(timeRegex, 'Formato de hora de inicio inválido (HH:mm)'),
    endTime: z.string().regex(timeRegex, 'Formato de hora de fin inválido (HH:mm)'),
    notes: z.string().max(500, 'Las notas no pueden superar 500 caracteres').optional(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'La hora de inicio debe ser menor a la hora de finalización (RN-06)',
    path: ['endTime'],
  });

export const updateReservationStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  notes: z.string().max(500).optional(),
});

export const availabilityQuerySchema = z.object({
  date: z.string().regex(dateRegex, 'Formato de fecha inválido (AAAA-MM-DD)'),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationStatusInput = z.infer<typeof updateReservationStatusSchema>;
