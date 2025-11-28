import React from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { CartItem } from "../types";

type AdminOrder = {
  id: string;
  orderNumber?: string;
  uid: string;
  items: CartItem[];
  total: number;
  status: string;
  customer?: {
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    postalCode?: string;
    notes?: string;
  };
  createdAt?: any;
};

const AdminOrders: React.FC = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyAW4t5w7z4mJU2vZtmPu3oVj8DbnvX0gUk",
    authDomain: "rabelani-cakes.firebaseapp.com",
    projectId: "rabelani-cakes",
    storageBucket: "rabelani-cakes.firebasestorage.app",
    messagingSenderId: "88618307532",
    appId: "1:88618307532:web:d75ec8403519f834f31769",
  };
  const app = React.useMemo(() => initializeApp(firebaseConfig), []);
  const db = React.useMemo(
    () =>
      getDatabase(app, "https://rabelani-cakes-default-rtdb.firebaseio.com"),
    [app]
  );
  const [orders, setOrders] = React.useState<AdminOrder[]>([]);

  React.useEffect(() => {
    const ordersRoot = ref(db, "orders");
    return onValue(ordersRoot, (snap) => {
      const val = snap.val() as Record<string, Record<string, any>> | null;
      const list: AdminOrder[] = [];
      if (val) {
        for (const uid of Object.keys(val)) {
          const userOrders = val[uid] || {};
          for (const oid of Object.keys(userOrders)) {
            const o = userOrders[oid];
            list.push({
              uid,
              id: oid,
              orderNumber: o.orderNumber,
              items: o.items || [],
              total: o.total || 0,
              status: o.status || "placed",
              customer: o.customer,
              createdAt: o.createdAt,
            });
          }
        }
      }
      list
        .sort(
          (a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0)
        )
        .reverse();
      setOrders(list);
    });
  }, [db]);

  const markCompleted = (uid: string, oid: string) => {
    const statusRef = ref(db, `orders/${uid}/${oid}/status`);
    set(statusRef, "completed");
  };
  const reopenOrder = (uid: string, oid: string) => {
    const statusRef = ref(db, `orders/${uid}/${oid}/status`);
    set(statusRef, "placed");
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-dark/10 p-6">
      <h3 className="text-2xl font-bold text-brand-dark mb-4">Orders</h3>
      {orders.length === 0 ? (
        <div className="text-gray-600">No orders yet.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={`${o.uid}-${o.id}`}
              className="border border-brand-dark/10 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-brand-dark">
                  {o.orderNumber ?? o.id}
                </div>
                <div className="text-brand-green font-bold">
                  ${o.total.toFixed(2)}
                </div>
              </div>
              <div className="text-xs text-gray-500">User: {o.uid}</div>
              <div className="mt-2">
                <span className="text-sm">Status: </span>
                <span className="text-sm font-medium">{o.status}</span>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => markCompleted(o.uid, o.id)}
                    className="px-3 py-1 rounded-full border border-brand-dark/10 hover:bg-brand-dark hover:text-white transition"
                  >
                    Mark Completed
                  </button>
                  <button
                    onClick={() => reopenOrder(o.uid, o.id)}
                    className="px-3 py-1 rounded-full border border-brand-dark/10 hover:bg-brand-dark hover:text-white transition"
                  >
                    Reopen
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-700 mt-2">
                {o.customer?.fullName && <div>{o.customer.fullName}</div>}
                {o.customer?.phone && <div>{o.customer.phone}</div>}
                {(o.customer?.addressLine1 || o.customer?.addressLine2) && (
                  <div>
                    {o.customer?.addressLine1}
                    {o.customer?.addressLine2
                      ? `, ${o.customer.addressLine2}`
                      : ""}
                  </div>
                )}
                {(o.customer?.city || o.customer?.postalCode) && (
                  <div>
                    {[o.customer?.city, o.customer?.postalCode]
                      .filter(Boolean)
                      .join(" ")}
                  </div>
                )}
                {o.customer?.notes && (
                  <div className="text-gray-500">{o.customer.notes}</div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                {o.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-2">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="text-sm">
                      <div className="text-brand-dark">{it.name}</div>
                      <div className="text-gray-600">
                        x{it.quantity} • ${it.price.toFixed(2)}
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

export default AdminOrders;
