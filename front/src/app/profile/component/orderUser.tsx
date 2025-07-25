"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "../../../context/authContext";
import { getOrdersUser } from "../../../services/products";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { format } from "date-fns";
import Loading from "@/src/components/loading/pantallaCargando";

const OrdersUser = () => {
  const { token, loading: loadingAuth } = useAuthContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        //const response = await getOrdersUser(token);
        //setOrders(response.data);
      } catch (error) {
        console.error("Error al obtener órdenes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!loadingAuth) fetchOrders();
  }, [token, loadingAuth]);

  if (loading || loadingAuth) {
    return (
      <>
      <Loading/>
      </>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center w-screen h-48">
        <p className="text-gray-500 text-sm">No tienes órdenes registradas.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Mis Órdenes</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Orden #{order.id.slice(0, 8)}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Fecha: {format(new Date(order.date), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
              <Badge
                variant={order.status === "finalized" ? "success" : "default"}
                className={
                  order.status === "finalized"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {order.status}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Total:</span> $
                {order.orderDetail.total}
              </div>

              <div className="space-y-3">
                {order.orderDetail.products.map((product: any) => (
                  <Card
                    key={product.id}
                    className="border border-gray-200 bg-muted p-4 shadow-sm"
                  >
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    {product.sizes.map((size: any) => (
                      <p
                        key={size.id}
                        className="text-sm text-muted-foreground"
                      >
                        Tamaño: <span className="font-medium">{size.size}</span>{" "}
                        — ${size.price}
                      </p>
                    ))}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersUser;
