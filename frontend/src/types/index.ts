export type Role = 'USER' | 'ADMIN';
export type SpaceStatus = 'ACTIVE' | 'INACTIVE';
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  _count?: {
    reservations: number;
  };
}

export interface Schedule {
  id: string;
  spaceId: string;
  dayOfWeek: number;
  openingTime: string;
  closingTime: string;
  status: SpaceStatus;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  location: string;
  capacity: number;
  imageUrl?: string | null;
  status: SpaceStatus;
  createdAt: string;
  updatedAt: string;
  schedules?: Schedule[];
  _count?: {
    reservations: number;
  };
}

export interface Reservation {
  id: string;
  userId: string;
  spaceId: string;
  reservationDate: string; // YYYY-MM-DD
  startTime: string;       // HH:mm
  endTime: string;         // HH:mm
  status: ReservationStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  space?: Space;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface AvailabilityResponse {
  date: string;
  spaceId: string;
  spaceName?: string;
  isOpen: boolean;
  message?: string;
  schedule?: {
    openingTime: string;
    closingTime: string;
  };
  slots: TimeSlot[];
  reservations: Array<{
    id: string;
    startTime: string;
    endTime: string;
    status: ReservationStatus;
  }>;
}
