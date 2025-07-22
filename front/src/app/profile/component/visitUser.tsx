"use client";

import { useEffect, useState } from "react";
import { getUserVisits } from "../../../services/visits";
import { useAuthContext } from "@/src/context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

type Visit = {
  id: string;
  status: "pending" | "approved";
  bookedAt: string;
  numberOfPeople: number;
  visitSlot: {
    date: string;
    startTime: string;
    endTime: string;
    visit: {
      title: string;
      description: string;
    };
  };
};

const VisitasAgendadas = () => {
  const { user, token } = useAuthContext();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const data = await getUserVisits(token);
        setVisits(data);
      } catch (err) {
        setError("Error al cargar las visitas agendadas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, user]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Visitas Agendadas</h1>

      {loading && (
        <div className="flex justify-center items-center gap-2 text-muted-foreground">
          <Loader2 className="animate-spin w-5 h-5" />
          Cargando visitas...
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && visits.length === 0 && (
        <p className="text-muted-foreground">No tienes visitas agendadas.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visits.map((visita) => (
          <Card key={visita.id} className="shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle>{visita.visitSlot.visit.title}</CardTitle>
              <div className="mt-2 text-sm text-muted-foreground">
                {visita.visitSlot.visit.description}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Fecha:</span>
                <span>{format(new Date(visita.visitSlot.date), "dd/MM/yyyy")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Hora:</span>
                <span>
                  {visita.visitSlot.startTime} - {visita.visitSlot.endTime}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Agendada el:</span>
                <span>{format(new Date(visita.bookedAt), "dd/MM/yyyy HH:mm")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Personas:</span>
                <span>{visita.numberOfPeople}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Estado:</span>
                <Badge
                  variant={visita.status === "approved" ? "default" : "secondary"}
                  className={
                    visita.status === "approved"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-yellow-500 text-black hover:bg-yellow-600"
                  }
                >
                  {visita.status === "approved" ? "Aprobada" : "Pendiente"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VisitasAgendadas;
