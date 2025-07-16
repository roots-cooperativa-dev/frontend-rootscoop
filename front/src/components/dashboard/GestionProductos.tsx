'use client';

import { useEffect, useState } from "react";
import { fetchProductos } from "../../app/utils/ProductsHelper";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import {
  Plus, Eye, Edit, Trash2
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { IProducto } from "../../app/types/index";

export const GestionProductos = () => {
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerProductos = async () => {
      console.log("Llamando a fetchProductos...");
      const data = await fetchProductos();
      console.log("Respuesta de fetchProductos:", data);

      if (data.length === 0) {
        console.warn("No se recibieron productos. Verificá el backend o el endpoint.");
      }

      setProductos(data);
      setLoading(false);
    };

    obtenerProductos();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Gestión de Productos</h1>

      <Card>
        <Button className="mt-4 bg-[#017d74] hover:bg-[#015f5c] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Producto
        </Button>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
          <CardDescription>Lista de productos disponibles</CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
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
                        {producto.files?.[0]?.url ? (
                          <img
                            src={producto.files[0].url}
                            alt={producto.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            Sin imagen
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{producto.name}</TableCell>
                      <TableCell>
                        ${producto.sizes?.[0]?.price ?? "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge className={!producto.isDeleted ? "bg-green-500" : "bg-red-500"}>
                          {!producto.isDeleted ? "Disponible" : "Eliminado"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="text-blue-600">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-yellow-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" className="text-white-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}


        </CardContent>
      </Card>
    </div>
  );
};
