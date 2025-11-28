import React from "react";
import { CartItem, CheckoutDetails } from "../types";

interface CartProps {
  items: CartItem[];
  onBack?: () => void;
  onInc: (id: number) => void;
  onDec: (id: number) => void;
  onRemove: (id: number) => void;
  onClear: () => void;
  onCheckout?: (details: CheckoutDetails) => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  onBack,
  onInc,
  onDec,
  onRemove,
  onClear,
  onCheckout,
}) => {
  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const [showCheckout, setShowCheckout] = React.useState(false);
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [addressLine1, setAddressLine1] = React.useState("");
  const [addressLine2, setAddressLine2] = React.useState("");
  const [city, setCity] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const submit = () => {
    if (!onCheckout) return;
    if (!fullName || !phone || !addressLine1) return;
    onCheckout({
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      notes,
    });
  };
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-brand-dark">Cart</h2>
        <div className="flex gap-2">
          <button
            onClick={onClear}
            className="px-4 py-2 rounded-full border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition"
          >
            Clear
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-full border border-brand-dark/10 hover:bg-brand-dark hover:text-white transition"
            >
              Back
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-dark/10 p-6 text-gray-600">
          Your cart is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {items.map((it) => (
              <div
                key={it.id}
                className="bg-white rounded-2xl border border-brand-dark/10 p-4 flex items-center gap-4"
              >
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="font-bold text-brand-dark">{it.name}</div>
                  <div className="text-gray-500">R{it.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDec(it.id)}
                    className="w-8 h-8 rounded-full border border-brand-dark/10"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{it.quantity}</span>
                  <button
                    onClick={() => onInc(it.id)}
                    className="w-8 h-8 rounded-full border border-brand-dark/10"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => onRemove(it.id)}
                  className="px-3 py-2 rounded-full border border-red-300 text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-brand-dark/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Items</span>
              <span>{items.reduce((s, it) => s + it.quantity, 0)}</span>
            </div>
            <div className="flex items-center justify-between font-bold text-brand-dark text-xl">
              <span>Total</span>
              <span>R{total.toFixed(2)}</span>
            </div>
            {!showCheckout && (
              <button
                onClick={() => setShowCheckout(true)}
                className="mt-4 w-full bg-brand-green text-white px-4 py-3 rounded-full hover:bg-amber-600 transition"
              >
                Checkout
              </button>
            )}
            {showCheckout && (
              <div className="mt-4 space-y-3">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                />
                <input
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Address line 1"
                  className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                />
                <input
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Address line 2 (optional)"
                  className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                  />
                  <input
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postal code"
                    className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                  />
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes (delivery instructions, etc.)"
                  className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                  rows={3}
                />
                <div className="flex gap-3">
                  <button
                    onClick={submit}
                    className="flex-1 bg-brand-green text-white px-4 py-3 rounded-full hover:bg-amber-600 transition"
                  >
                    Place Order
                  </button>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="px-4 py-3 rounded-full border border-brand-dark/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
