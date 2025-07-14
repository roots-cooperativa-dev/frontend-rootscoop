'use client';

import { productos } from "../../app/utils/ProductosPreCargados";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export const GestionProductos = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Gestión de Productos</h1>

      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
          <CardDescription>Lista de productos disponibles</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                    <TableCell>${producto.precio}</TableCell>
                    <TableCell>
                      <Badge className={producto.disponible ? "bg-green-500" : "bg-red-500"}>
                        {producto.disponible ? "Disponible" : "Agotado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" className="text-blue-600">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-yellow-600">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Button className="mt-4 bg-[#017d74] hover:bg-[#015f5c] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
