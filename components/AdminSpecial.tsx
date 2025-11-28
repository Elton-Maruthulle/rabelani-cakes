import React from "react";
import { Database, onValue, ref, set } from "firebase/database";
import { Cake, FeaturedSpecial } from "../types";
import { CATEGORIES } from "../constants";
import { FirebaseStorage } from "firebase/storage";
import { useToast } from "./Toast";

interface AdminSpecialProps {
  db: Database;
  storage: FirebaseStorage;
}

const defaults: FeaturedSpecial = {
  titleLine1: "The Rabelani",
  titleLine2: "Signature Truffle",
  description:
    "Three layers of decadent dark Belgian chocolate sponge, filled with ganache and topped with hand-crafted truffles. The ultimate indulgence for serious chocolate lovers.",
  originalPrice: 45.0,
  salePrice: 38.5,
  image:
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1000",
};

const AdminSpecial: React.FC<AdminSpecialProps> = ({ db, storage }) => {
  const [special, setSpecial] = React.useState<FeaturedSpecial>(defaults);
  const [selectedCategory, setSelectedCategory] =
    React.useState<string>("Cakes");
  const [products, setProducts] = React.useState<Cake[]>([]);
  const { show } = useToast();

  React.useEffect(() => {
    const r = ref(db, "specials/featured");
    return onValue(r, (snap) => {
      const val = snap.val() as FeaturedSpecial | null;
      if (val) setSpecial({ ...defaults, ...val });
    });
  }, [db]);

  React.useEffect(() => {
    const slug = selectedCategory.toLowerCase().replace(/\s+/g, "-");
    const r = ref(db, `productsByCategory/${slug}`);
    return onValue(r, (snap) => {
      const val = snap.val() as Cake[] | null;
      setProducts(Array.isArray(val) ? val : []);
    });
  }, [db, selectedCategory]);

  const save = async () => {
    const r = ref(db, "specials/featured");
    await set(r, special);
    show({ type: "success", title: "Special saved" });
  };

  const setFromProduct = (p: Cake) => {
    if (!p.image) return;
    setSpecial((s) => ({ ...s, image: p.image }));
    show({ type: "info", title: "Special image updated", description: p.name });
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-dark/10 p-6">
      <h3 className="text-2xl font-bold text-brand-dark mb-4">
        Special (Baker's Choice)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          value={special.titleLine1}
          onChange={(e) =>
            setSpecial((s) => ({ ...s, titleLine1: e.target.value }))
          }
          className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
          placeholder="Title line 1"
        />
        <input
          value={special.titleLine2}
          onChange={(e) =>
            setSpecial((s) => ({ ...s, titleLine2: e.target.value }))
          }
          className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
          placeholder="Title line 2"
        />
        <input
          value={String(special.originalPrice)}
          onChange={(e) =>
            setSpecial((s) => ({
              ...s,
              originalPrice: Number(e.target.value) || 0,
            }))
          }
          className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
          placeholder="Original price"
          type="number"
          step="0.01"
        />
        <input
          value={String(special.salePrice)}
          onChange={(e) =>
            setSpecial((s) => ({
              ...s,
              salePrice: Number(e.target.value) || 0,
            }))
          }
          className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
          placeholder="Sale price"
          type="number"
          step="0.01"
        />
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">Choose product image</div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-brand-dark/10 rounded-xl px-3 py-2 bg-white"
            >
              {CATEGORIES.map((c) => c.name).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          {products.length === 0 ? (
            <div className="text-sm text-gray-500">
              No products in {selectedCategory} yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setFromProduct(p)}
                  className="relative rounded-xl overflow-hidden border border-brand-dark/10 hover:border-brand-green/50 transition"
                  title={p.name}
                >
                  <div className="aspect-square">
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-2 py-1 truncate">
                    {p.name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <textarea
          value={special.description}
          onChange={(e) =>
            setSpecial((s) => ({ ...s, description: e.target.value }))
          }
          className="w-full border border-brand-dark/10 rounded-xl px-4 py-2 md:col-span-2"
          rows={4}
          placeholder="Description"
        />
      </div>
      <div className="mt-4 flex gap-3 items-center">
        <button
          onClick={save}
          className="px-6 py-3 rounded-full bg-brand-green text-white hover:bg-amber-600 transition"
        >
          Save Special
        </button>
        {special.image && (
          <img
            src={special.image}
            alt="preview"
            loading="lazy"
            decoding="async"
            className="h-12 w-12 rounded-lg object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default AdminSpecial;
