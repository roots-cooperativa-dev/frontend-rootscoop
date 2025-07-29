"use client";

import { useAuthContext } from "@/src/context/authContext";
import { useEffect, useState } from "react";
import { getOrdersUser } from "../../../services/products";
import { format } from "date-fns";
import Loading from "@/src/components/loading/pantallaCargando";

const OrdersUser = () => {
  const { token, loading: authLoading } = useAuthContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      try {
        const response = await getOrdersUser(token, 1, 5);
        setOrders(response); // ya es un array
      } catch (error) {
        console.error("Error al obtener órdenes:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (authLoading || loadingOrders) {
    return (
      <Loading/>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex w-full justify-center items-center h-screen">
        <h1 className="text-center text-gray-500 text-lg">No hay órdenes registradas</h1>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col w-full mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-[#017d74]">
        Tus Órdenes
      </h1>
      <ul className="space-y-4">
        {orders.map((order: any) => (
          <li
            key={order.id}
            className="bg-white p-4 rounded-xl shadow border border-gray-200"
          >
            <p><strong>Total:</strong> ${order.orderDetail?.total}</p>
            <p><strong>Estado:</strong> {order.status}</p>
            <p><strong>Fecha:</strong> {format(new Date(order.date), "dd/MM/yyyy HH:mm")}</p>

            {order.orderDetail?.products && order.orderDetail.products.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Productos:</p>
                <ul className="list-disc pl-6">
                  {order.orderDetail.products.map((product: any) => (
                    <li key={product.id}>
                      {product.name}
                      {/* Si necesitas mostrar talles y cantidades, deberías tener esa info desde el back */}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersUser;
