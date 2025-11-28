import React from "react";
import { Cake } from "../types";

import { Database, onValue, ref } from "firebase/database";
interface CupCakeGalleryProps {
  onBack?: () => void;
  onAddToCart?: (cake: Cake) => void;
  db?: Database;
}

const toTitle = (s: string) =>
  s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const CupCakeGallery: React.FC<CupCakeGalleryProps> = ({
  onBack,
  onAddToCart,
  db,
}) => {
  const [items, setItems] = React.useState<Cake[]>([]);
  const imgRefs = React.useRef<Record<number, HTMLImageElement | null>>({});
  const [loaded, setLoaded] = React.useState<Record<number, boolean>>({});
  const [page, setPage] = React.useState<number>(1);
  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  React.useEffect(() => {
    if (db) {
      const r = ref(db, "productsByCategory/cup-cakes");
      return onValue(r, (snap) => {
        const val = snap.val() as Cake[] | null;
        if (val && Array.isArray(val)) setItems(val);
      });
    } else {
      const mapRaw = localStorage.getItem("productsByCategory");
      const map = mapRaw ? (JSON.parse(mapRaw) as Record<string, Cake[]>) : {};
      const fromStore = map["Cup Cakes"];
      if (fromStore && Array.isArray(fromStore)) setItems(fromStore);
    }
  }, [db]);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [items, totalPages, page]);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-brand-dark">Cup Cakes</h2>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-full border border-brand-dark/10 hover:bg-brand-dark hover:text-white transition"
          >
            Back
          </button>
        )}
      </div>

      {items.length === 0 && (
        <div className="bg-white rounded-2xl border border-brand-dark/10 p-6 text-gray-600">
          No products yet for Cup Cakes. Add items from Admin.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paged.map((cake) => (
          <div
            key={cake.id}
            className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition hover:-translate-y-1 border border-brand-dark/5"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={cake.image}
                alt={cake.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                ref={(el) => (imgRefs.current[cake.id] = el)}
                onLoad={() =>
                  setLoaded((prev) => ({ ...prev, [cake.id]: true }))
                }
              />
              {!loaded[cake.id] && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-brand-dark">
                  {cake.name}
                </h3>
                <span className="text-brand-green font-bold">
                  R{cake.price.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {cake.description || "Add a description"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    animateToCart(imgRefs.current[cake.id]);
                    onAddToCart && onAddToCart(cake);
                  }}
                  className="flex-1 bg-brand-green text-white px-4 py-3 rounded-full hover:bg-amber-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length > pageSize && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-full border ${
              page === 1
                ? "border-gray-200 text-gray-300"
                : "border-brand-dark/10 hover:bg-brand-dark hover:text-white"
            } transition`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            const active = n === page;
            return (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-10 h-10 rounded-full border ${
                  active
                    ? "bg-brand-dark text-white"
                    : "border-brand-dark/10 hover:bg-brand-dark hover:text-white"
                } transition`}
              >
                {n}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-full border ${
              page === totalPages
                ? "border-gray-200 text-gray-300"
                : "border-brand-dark/10 hover:bg-brand-dark hover:text-white"
            } transition`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CupCakeGallery;
const animateToCart = (img?: HTMLImageElement | null) => {
  const cart = document.getElementById("cart-button");
  if (!img || !cart) return;
  const ir = img.getBoundingClientRect();
  const cr = cart.getBoundingClientRect();
  const clone = img.cloneNode(true) as HTMLImageElement;
  clone.style.position = "fixed";
  clone.style.left = ir.left + "px";
  clone.style.top = ir.top + "px";
  clone.style.width = ir.width + "px";
  clone.style.height = ir.height + "px";
  clone.style.borderRadius = "16px";
  clone.style.zIndex = "9999";
  clone.style.transition =
    "transform 700ms cubic-bezier(0.25,1,0.5,1), opacity 700ms";
  document.body.appendChild(clone);
  const dx = cr.left + cr.width / 2 - (ir.left + ir.width / 2);
  const dy = cr.top + cr.height / 2 - (ir.top + ir.height / 2);
  requestAnimationFrame(() => {
    clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.1)`;
    clone.style.opacity = "0.2";
  });
  setTimeout(() => {
    clone.remove();
    cart.classList.add("animate-bounce");
    setTimeout(() => cart.classList.remove("animate-bounce"), 600);
  }, 750);
};
