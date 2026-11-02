import { z } from 'zod';

export const createSpaceSchema = z.object({
  name: z.string().min(2, 'El nombre del espacio es obligatorio').max(100),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  location: z.string().min(2, 'La ubicación es obligatoria'),
  capacity: z.number().int().positive('La capacidad debe ser un número entero positivo'),
  imageUrl: z.string().url('La URL de imagen debe ser válida').optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateSpaceSchema = createSpaceSchema.partial();

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceInput = z.infer<typeof updateSpaceSchema>;
