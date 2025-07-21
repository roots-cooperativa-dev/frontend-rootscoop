interface Slot {
  id: string;
  date: string;
  startTime: string;
  isBooked: boolean;
}

interface Visita {
  availableSlots: Slot[];
  // otros campos si los hay
}
type VisitaDisponible = {
  fecha: string;
  hora: string;
};
