import React from "react";
import { Database, ref, set, onValue } from "firebase/database";
import { FirebaseStorage } from "firebase/storage";
import { Cake } from "../types";
import { CATEGORIES } from "../constants";
import AdminOrders from "./AdminOrders";
import AdminSpecial from "./AdminSpecial";
import { useToast } from "./Toast";

const toTitle = (s: string) =>
  s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

interface AdminProps {
  db: Database;
  storage: FirebaseStorage;
  adminMode?: "products" | "orders" | "special";
}
const Admin: React.FC<AdminProps> = ({
  db,
  storage,
  adminMode = "products",
}) => {
  const { show } = useToast();
  const [selectedCategory, setSelectedCategory] =
    React.useState<string>("Cakes");
  const [showOrders, setShowOrders] = React.useState(false);
  const [showSpecial, setShowSpecial] = React.useState(false);
  const [products, setProducts] = React.useState<Cake[]>([]);
  const [coverUrl, setCoverUrl] = React.useState<string>("");
  const [form, setForm] = React.useState<{
    name: string;
    price: string;
    description: string;
    image: string;
  }>({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  React.useEffect(() => {
    const mapRaw = localStorage.getItem("productsByCategory");
    const map = mapRaw ? (JSON.parse(mapRaw) as Record<string, Cake[]>) : {};
    setProducts(map[selectedCategory] ?? []);
    const slug = selectedCategory.toLowerCase().replace(/\s+/g, "-");
    const r = ref(db, `productsByCategory/${slug}`);
    const unsub = (onValue as any)(r, (snap: any) => {
      const val = snap.val() as Cake[] | null;
      if (val && Array.isArray(val)) setProducts(val);
    });
    const coverRef = ref(db, `categoryCovers/${slug}`);
    const unsubCover = (onValue as any)(coverRef, (snap: any) => {
      const val = snap.val() as string | null;
      if (typeof val === "string") setCoverUrl(val);
    });
    return () => {
      if (typeof unsub === "function") unsub();
      if (typeof unsubCover === "function") unsubCover();
    };
  }, [selectedCategory]);

  React.useEffect(() => {
    if (adminMode === "orders") {
      setShowOrders(true);
      setShowSpecial(false);
    } else if (adminMode === "special") {
      setShowSpecial(true);
      setShowOrders(false);
    } else {
      setShowOrders(false);
      setShowSpecial(false);
    }
  }, [adminMode]);

  const persist = (next: Cake[]) => {
    const mapRaw = localStorage.getItem("productsByCategory");
    const map = mapRaw ? (JSON.parse(mapRaw) as Record<string, Cake[]>) : {};
    map[selectedCategory] = next.map((p) => ({
      ...p,
      category: selectedCategory,
    }));
    try {
      const safe = map[selectedCategory].every(
        (p) => !String(p.image || "").startsWith("data:")
      );
      if (safe) {
        localStorage.setItem("productsByCategory", JSON.stringify(map));
      }
    } catch (e) {}
    setProducts(next);
    const slug = selectedCategory.toLowerCase().replace(/\s+/g, "-");
    const productsRef = ref(db, `productsByCategory/${slug}`);
    set(productsRef, map[selectedCategory]);
    try {
      const now = Date.now();
      (persist as any)._lastToast = (persist as any)._lastToast || 0;
      if (now - (persist as any)._lastToast > 3000) {
        show({ type: "success", title: "Changes saved" });
        (persist as any)._lastToast = now;
      }
    } catch {}
  };

  const persistDebouncedRef = React.useRef<number | null>(null);
  const persistDebounced = (next: Cake[]) => {
    setProducts(next);
    if (persistDebouncedRef.current) {
      clearTimeout(persistDebouncedRef.current);
    }
    // @ts-ignore
    persistDebouncedRef.current = setTimeout(() => {
      persist(next);
      persistDebouncedRef.current = null;
    }, 400) as any;
  };

  const addProduct = async () => {
    if (!form.name.trim()) return;
    const priceNum = Number(form.price) || 0;
    const id = Date.now();
    const next: Cake = {
      id,
      name: form.name.trim(),
      price: priceNum,
      description: form.description.trim(),
      image: form.image,
      category: selectedCategory,
    };
    persist([next, ...products]);
    show({ type: "success", title: "Product added", description: next.name });
    setForm({ name: "", price: "", description: "", image: "" });
  };

  const updateProduct = (id: number, patch: Partial<Cake>) => {
    const next = products.map((p) => (p.id === id ? { ...p, ...patch } : p));
    persistDebounced(next);
  };

  const deleteProduct = (id: number) => {
    const target = products.find((p) => p.id === id);
    persistDebounced(products.filter((p) => p.id !== id));
    show({
      type: "warning",
      title: "Product deleted",
      description: target?.name,
    });
  };

  const onImageFile = async (file: File) => {
    const dataUrl = await readFileAsDataUrl(file);
    setForm((f) => ({ ...f, image: dataUrl }));
  };

  const saveCover = (url: string) => {
    setCoverUrl(url);
    const slug = selectedCategory.toLowerCase().replace(/\s+/g, "-");
    const coverRef = ref(db, `categoryCovers/${slug}`);
    set(coverRef, url);
    show({
      type: "success",
      title: "Cover updated",
      description: selectedCategory,
    });
    try {
      if (!url.startsWith("data:")) {
        const coversRaw = localStorage.getItem("categoryCoverOverrides");
        const covers = coversRaw
          ? (JSON.parse(coversRaw) as Record<string, string>)
          : {};
        covers[selectedCategory] = url;
        localStorage.setItem("categoryCoverOverrides", JSON.stringify(covers));
      }
    } catch (e) {}
  };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-brand-dark">Admin</h2>
        {/* no extra admin header actions */}
      </div>

      {!showOrders && !showSpecial && (
        <div className="bg-white rounded-3xl border border-brand-dark/10 p-6 mb-10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-gray-500">Category</div>
              <div className="mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green">
                <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                <span className="text-sm font-semibold">
                  {selectedCategory}
                </span>
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-brand-dark/10 rounded-xl px-4 py-2 bg-white"
            >
              {CATEGORIES.map((c) => c.name).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Product name</div>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                    placeholder="Chocolate Fudge Cake"
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Price</div>
                  <input
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                    className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                    placeholder="e.g. 349.99"
                    type="number"
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500 mb-1">Image URL</div>
                  <input
                    value={form.image}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, image: e.target.value }))
                    }
                    className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500 mb-1">Upload image</div>
                  <label className="block w-full rounded-2xl border-2 border-dashed border-brand-dark/15 p-6 text-center cursor-pointer hover:border-brand-green/50 transition">
                    <input
                      onChange={(e) =>
                        e.target.files && onImageFile(e.target.files[0])
                      }
                      className="hidden"
                      type="file"
                      accept="image/*"
                    />
                    <div className="text-gray-600">
                      <div className="font-semibold">
                        Drop or click to upload
                      </div>
                      <div className="text-sm">PNG, JPG up to 5MB</div>
                    </div>
                  </label>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500 mb-1">Description</div>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                    placeholder="Taste notes, serving size, customizations"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={addProduct}
                  className="px-6 py-3 rounded-full bg-brand-green text-white hover:bg-amber-600 transition shadow-sm"
                >
                  Add Product
                </button>
                <button
                  onClick={() =>
                    setForm({ name: "", price: "", description: "", image: "" })
                  }
                  className="px-4 py-3 rounded-full border border-brand-dark/10 hover:bg-brand-dark hover:text-white transition"
                >
                  Clear
                </button>
                {form.image && (
                  <img
                    src={form.image}
                    alt="preview"
                    loading="lazy"
                    decoding="async"
                    className="h-12 w-12 rounded-lg object-cover border border-brand-dark/10"
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-brand-dark/10 overflow-hidden">
                <div className="px-4 py-3 bg-brand-green/10 text-brand-green font-semibold">
                  Category cover
                </div>
                <div className="p-4 space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden border border-brand-dark/10 bg-gray-100">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt="cover"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-gray-400">
                        No cover set
                      </div>
                    )}
                  </div>
                  <input
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                    placeholder={`Image URL for ${selectedCategory}`}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => saveCover(coverUrl.trim())}
                      className="flex-1 px-4 py-2 rounded-full bg-brand-green text-white hover:bg-amber-600 transition"
                    >
                      Save Cover
                    </button>
                    <button
                      onClick={() => {
                        const first = products.find((p) => !!p.image);
                        if (first && first.image) saveCover(first.image);
                      }}
                      className="px-4 py-2 rounded-full border border-brand-dark/10 hover:bg-brand-dark hover:text-white transition"
                    >
                      Use first product
                    </button>
                  </div>
                  <label className="block w-full rounded-2xl border-2 border-dashed border-brand-dark/15 p-4 text-center cursor-pointer hover:border-brand-green/50 transition">
                    <input
                      onChange={(e) =>
                        e.target.files &&
                        readFileAsDataUrl(e.target.files[0]).then((u) =>
                          saveCover(u)
                        )
                      }
                      className="hidden"
                      type="file"
                      accept="image/*"
                    />
                    <div className="text-gray-600 text-sm">
                      Upload cover image
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showOrders && !showSpecial && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition border border-brand-dark/5"
            >
              <div className="aspect-square overflow-hidden relative">
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                )}
                {coverUrl && coverUrl === p.image && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-green text-white text-xs font-semibold">
                    Cover
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Product name
                    </div>
                    <input
                      value={p.name}
                      onChange={(e) =>
                        updateProduct(p.id, { name: e.target.value })
                      }
                      className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                      placeholder="e.g. Chocolate Fudge Cake"
                    />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Price</div>
                    <input
                      value={String(p.price)}
                      onChange={(e) =>
                        updateProduct(p.id, { price: Number(e.target.value) })
                      }
                      className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                      placeholder="e.g. 349.99"
                      type="number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-500 mb-1">
                      Description
                    </div>
                    <textarea
                      value={p.description}
                      onChange={(e) =>
                        updateProduct(p.id, { description: e.target.value })
                      }
                      className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                      placeholder="Taste notes, serving size, customizations"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-500 mb-1">Image URL</div>
                    <input
                      value={p.image}
                      onChange={(e) =>
                        updateProduct(p.id, { image: e.target.value })
                      }
                      className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-500 mb-1">
                      Upload image
                    </div>
                    <label className="block w-full rounded-2xl border-2 border-dashed border-brand-dark/15 p-4 text-center cursor-pointer hover:border-brand-green/50 transition">
                      <input
                        onChange={(e) =>
                          e.target.files &&
                          readFileAsDataUrl(e.target.files[0]).then((u) =>
                            updateProduct(p.id, { image: u })
                          )
                        }
                        className="hidden"
                        type="file"
                        accept="image/*"
                      />
                      <div className="text-gray-600 text-sm">
                        Drop or click to upload
                      </div>
                    </label>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="px-4 py-2 rounded-full border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => saveCover(p.image)}
                    className="px-4 py-2 rounded-full border border-brand-dark/10 hover:bg-brand-dark hover:text-white transition"
                  >
                    Set as Cover
                  </button>
                  <span className="text-brand-green font-bold">
                    R{Number(p.price || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showOrders && <AdminOrders />}
      {showSpecial && <AdminSpecial db={db} storage={storage} />}
    </div>
  );
};

export default Admin;
