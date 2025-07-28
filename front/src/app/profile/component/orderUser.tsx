"use client";

import { useAuthContext } from "@/src/context/authContext";
import { format } from "date-fns";

const OrdersUser = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando órdenes...</p>
      </div>
    );
  }

  if (!user || !user.orders || user.orders.length === 0) {
    return (
      <div className="flex w-full justify-center items-center h-screen">
        <h1 className="text-center text-gray-500 text-lg">No hay órdenes registradas</h1>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-[#017d74]">
        Tus Órdenes
      </h1>
      <ul className="space-y-4">
        {user.orders.map((order: any) => (
          <li
            key={order.id}
            className="bg-white p-4 rounded-xl shadow border border-gray-200"
          >
            <p><strong>Total:</strong> ${order.total} {order.currency}</p>
            <p><strong>Estado:</strong> {order.status}</p>
            <p><strong>Fecha:</strong> {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}</p>
            {order.items && order.items.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Productos:</p>
                <ul className="list-disc pl-6">
                  {order.items.map((item: any) => (
                    <li key={item.id}>
                      {item.product.name} - Talle {item.productSize.size} x {item.quantity}
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
