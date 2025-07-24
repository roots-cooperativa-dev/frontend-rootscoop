export interface Slot {
  id: string;
  date: string;
  startTime: string;
  isBooked: boolean;
}

export interface Visita {
  id: string; // si lo usás, podés sacarlo si no
  title: string; // este es el que usamos como descripción de la cita
  availableSlots: Slot[];
}
