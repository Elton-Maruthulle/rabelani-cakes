import React from "react";
import { Database, onValue, ref, set } from "firebase/database";
import { FeaturedSpecial } from "../types";
import {
  Storage,
  ref as sref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

interface AdminSpecialProps {
  db: Database;
  storage: Storage;
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
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    const r = ref(db, "specials/featured");
    return onValue(r, (snap) => {
      const val = snap.val() as FeaturedSpecial | null;
      if (val) setSpecial({ ...defaults, ...val });
    });
  }, [db]);

  const save = async () => {
    const r = ref(db, "specials/featured");
    await set(r, special);
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `specials/featured-${Date.now()}.${ext}`;
    const dest = sref(storage, path);
    await uploadBytes(dest, file);
    const url = await getDownloadURL(dest);
    setSpecial((s) => ({ ...s, image: url }));
    setUploading(false);
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
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            className="w-full border border-brand-dark/10 rounded-xl px-4 py-2"
          />
          {uploading && (
            <div className="text-sm text-gray-500 mt-2">Uploading...</div>
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
            className="h-12 w-12 rounded-lg object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default AdminSpecial;
