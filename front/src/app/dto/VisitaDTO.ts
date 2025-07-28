export interface VisitaDTO {
    title: string;
    description: string;
    people: number;
}

export interface NuevoTurnoDTO {
  date: string; 
  startTime: string; 
  endTime: string; 
  maxAppointments: number;
}