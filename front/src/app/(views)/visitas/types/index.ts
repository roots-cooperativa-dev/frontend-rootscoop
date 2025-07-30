export interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  visitId?: string;
  isBooked?: boolean;
  maxAppointments: number;
  currentAppointmentsCount: number;
}

export interface Visita {
  id: string;
  title: string;
  description?: string;
  status?: string;
  availableSlots: Slot[];
}
