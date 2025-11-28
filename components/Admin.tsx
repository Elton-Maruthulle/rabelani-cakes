import React from "react";
import { Database, ref, set } from "firebase/database";
import { Storage } from "firebase/storage";
import { Cake } from "../types";
import { CATEGORIES } from "../constants";
import AdminOrders from "./AdminOrders";
import AdminSpecial from "./AdminSpecial";

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
  storage: Storage;
  adminMode?: "products" | "orders" | "special";
}
const Admin: React.FC<AdminProps> = ({
  db,
  storage,
  adminMode = "products",
}) => {
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
    const coversRaw = localStorage.getItem("categoryCoverOverrides");
    const covers = coversRaw
      ? (JSON.parse(coversRaw) as Record<string, string>)
      : {};
    setCoverUrl(covers[selectedCategory] ?? "");
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
    localStorage.setItem("productsByCategory", JSON.stringify(map));
    setProducts(next);
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
    setForm({ name: "", price: "", description: "", image: "" });
  };

  const updateProduct = (id: number, patch: Partial<Cake>) => {
    const next = products.map((p) => (p.id === id ? { ...p, ...patch } : p));
    persist(next);
  };

  const deleteProduct = (id: number) => {
    persist(products.filter((p) => p.id !== id));
  };

  const onImageFile = async (file: File) => {
    const dataUrl = await readFileAsDataUrl(file);
    setForm((f) => ({ ...f, image: dataUrl }));
  };

  const importFromImages = () => {
    const slug = selectedCategory.toLowerCase().replace(/\s+/g, "-");
    const filesMap: Record<string, Record<string, any>> = {
      cakes: import.meta.glob("./img/cakes/*.{png,jpg,jpeg,webp}", {
        eager: true,
      }) as Record<string, any>,
      cupcakes: import.meta.glob("./img/cupcakes/*.{png,jpg,jpeg,webp}", {
        eager: true,
      }) as Record<string, any>,
      "celebration-cakes": import.meta.glob(
        "./img/celebration-cakes/*.{png,jpg,jpeg,webp}",
        { eager: true }
      ) as Record<string, any>,
      cookies: import.meta.glob("./img/cookies/*.{png,jpg,jpeg,webp}", {
        eager: true,
      }) as Record<string, any>,
      "wedding-cakes": import.meta.glob(
        "./img/wedding-cakes/*.{png,jpg,jpeg,webp}",
        { eager: true }
      ) as Record<string, any>,
      "design-cakes": import.meta.glob(
        "./img/design-cakes/*.{png,jpg,jpeg,webp}",
        { eager: true }
      ) as Record<string, any>,
      "custom-order": import.meta.glob(
        "./img/custom-order/*.{png,jpg,jpeg,webp}",
        { eager: true }
      ) as Record<string, any>,
      "custom-cake": import.meta.glob(
        "./img/custom-cake/*.{png,jpg,jpeg,webp}",
        { eager: true }
      ) as Record<string, any>,
      "custom-cupcake": import.meta.glob(
        "./img/custom-cupcake/*.{png,jpg,jpeg,webp}",
        { eager: true }
      ) as Record<string, any>,
    };
    const files = filesMap[slug] ?? {};
    const existingByImage = new Map(products.map((p) => [p.image, p]));
    const imported: Cake[] = Object.entries(files).map(([path, mod], i) => {
      const url: string = mod.default ?? mod;
      const base =
        path
          .split("/")
          .pop()
          ?.replace(/\.[^.]+$/, "") ??
        `${selectedCategory.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`;
      return {
        id: Date.now() + i,
        name: toTitle(base),
        image: url,
        price: 0,
        description: "",
        category: selectedCategory,
      };
    });
    const merged = [
      ...imported.filter((c) => !existingByImage.has(c.image)),
      ...products,
    ];
    persist(merged);
  };

  const saveCover = (url: string) => {
    const coversRaw = localStorage.getItem("categoryCoverOverrides");
    const covers = coversRaw
      ? (JSON.parse(coversRaw) as Record<string, string>)
      : {};
    covers[selectedCategory] = url;
    localStorage.setItem("categoryCoverOverrides", JSON.stringify(covers));
    setCoverUrl(url);
    const slug = selectedCategory.toLowerCase().replace(/\s+/g, "-");
    const coverRef = ref(db as any, `categoryCovers/${slug}`);
    set(coverRef, url);
  };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-brand-dark">Admin</h2>
        {!showOrders && !showSpecial && (
          <div className="flex gap-2">
            <button
              onClick={importFromImages}
              className="px-4 py-2 rounded-full border border-brand-dark/10 hover:bg-brand-dark hover:text-white transition"
            >
              Import from images
            </button>
          </div>
        )}
      </div>

      {!showOrders && !showSpecial && (
        <div className="bg-white rounded-2xl border border-brand-dark/10 p-6 mb-8">
          <div className="mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-brand-dark/10 rounded-xl px-4 py-2"
            >
              {CATEGORIES.map((c) => c.name).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
              placeholder="Product name"
            />
            <input
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
              placeholder="Price"
              type="number"
            />
            <input
              value={form.image}
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.value }))
              }
              className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
              placeholder="Image URL (optional)"
            />
            <input
              onChange={(e) => e.target.files && onImageFile(e.target.files[0])}
              className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
              type="file"
              accept="image/*"
            />
          </div>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="w-full border border-brand-dark/10 rounded-xl px-4 py-2 mt-4"
            placeholder="Description"
          />
          <div className="mt-4 flex gap-3">
            <button
              onClick={addProduct}
              className="px-6 py-3 rounded-full bg-brand-green text-white hover:bg-amber-600 transition"
            >
              Add Product
            </button>
            {form.image && (
              <img
                src={form.image}
                alt="preview"
                className="h-12 w-12 rounded-lg object-cover"
              />
            )}
          </div>
          <div className="mt-8 p-4 rounded-xl border border-brand-dark/10 bg-white/60">
            <h3 className="text-lg font-bold text-brand-dark mb-3">
              Category cover image
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <input
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="w-full border border-brand-dark/10 rounded-xl px-4 py-2 md:col-span-2"
                placeholder={`Image URL for ${selectedCategory}`}
              />
              <button
                onClick={() => saveCover(coverUrl.trim())}
                className="px-4 py-2 rounded-full bg-brand-green text-white hover:bg-amber-600 transition"
              >
                Save Cover
              </button>
            </div>
            <div className="mt-3 flex gap-3">
              <input
                onChange={(e) =>
                  e.target.files &&
                  readFileAsDataUrl(e.target.files[0]).then((u) => saveCover(u))
                }
                className="border border-brand-dark/10 rounded-xl px-4 py-2"
                type="file"
                accept="image/*"
              />
              <button
                onClick={() => {
                  const first = products.find((p) => !!p.image);
                  if (first && first.image) saveCover(first.image);
                }}
                className="px-4 py-2 rounded-full border border-brand-dark/10 hover:bg-brand-dark hover:text-white transition"
              >
                Use first product image
              </button>
              {coverUrl && (
                <img
                  src={coverUrl}
                  alt="cover"
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {!showOrders && !showSpecial && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition border border-brand-dark/5"
            >
              <div className="aspect-square overflow-hidden">
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  <input
                    value={p.name}
                    onChange={(e) =>
                      updateProduct(p.id, { name: e.target.value })
                    }
                    className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                  />
                  <input
                    value={String(p.price)}
                    onChange={(e) =>
                      updateProduct(p.id, { price: Number(e.target.value) })
                    }
                    className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                    type="number"
                  />
                  <textarea
                    value={p.description}
                    onChange={(e) =>
                      updateProduct(p.id, { description: e.target.value })
                    }
                    className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                  />
                  <input
                    value={p.image}
                    onChange={(e) =>
                      updateProduct(p.id, { image: e.target.value })
                    }
                    className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
                    placeholder="Image URL"
                  />
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
                    ${Number(p.price || 0).toFixed(2)}
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
