import React from "react";
import { CartItem } from "../types";
import { Database, onValue, ref } from "firebase/database";

interface OrdersProps {
  userId: string;
  db: Database;
  onBack?: () => void;
}

type OrderRecord = {
  id: string;
  orderNumber?: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt?: any;
  customer?: any;
};

const Orders: React.FC<OrdersProps> = ({ userId, db, onBack }) => {
  const [orders, setOrders] = React.useState<OrderRecord[]>([]);
  React.useEffect(() => {
    const ordersRef = ref(db, `orders/${userId}`);
    return onValue(ordersRef, (snap) => {
      const val = snap.val() as Record<string, OrderRecord> | null;
      const list = val
        ? Object.values(val)
            .sort(
              (a, b) =>
                (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0)
            )
            .reverse()
        : [];
      setOrders(list);
    });
  }, [db, userId]);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-brand-dark">My Orders</h2>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-full border border-brand-dark/10 hover:bg-brand-dark hover:text-white transition"
          >
            Back
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-dark/10 p-6 text-gray-600">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-2xl border border-brand-dark/10 p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-brand-dark">
                  Order #{o.orderNumber ?? o.id}
                </div>
                <div className="text-brand-green font-bold">
                  R{o.total.toFixed(2)}
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Status: {o.status}
              </div>
              {o.customer && (
                <div className="text-sm text-gray-700 mb-4">
                  <div>{o.customer.fullName}</div>
                  <div>{o.customer.phone}</div>
                  <div>
                    {o.customer.addressLine1}
                    {o.customer.addressLine2
                      ? `, ${o.customer.addressLine2}`
                      : ""}
                  </div>
                  <div>
                    {[o.customer.city, o.customer.postalCode]
                      .filter(Boolean)
                      .join(" ")}
                  </div>
                  {o.customer.notes && (
                    <div className="text-gray-500">{o.customer.notes}</div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {o.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-brand-dark font-medium">
                        {it.name}
                      </div>
                      <div className="text-gray-500">
                        x{it.quantity} • R{it.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
