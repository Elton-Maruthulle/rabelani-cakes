import React from "react";
import { Database, onValue, ref } from "firebase/database";
import { FeaturedSpecial } from "../types";
import { ShoppingBag, Star } from "lucide-react";

interface FeaturedItemProps {
  db?: Database;
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

const FeaturedItem: React.FC<FeaturedItemProps> = ({ db }) => {
  const [special, setSpecial] = React.useState<FeaturedSpecial>(defaults);
  React.useEffect(() => {
    if (!db) return;
    const r = ref(db, "specials/featured");
    return onValue(r, (snap) => {
      const val = snap.val() as FeaturedSpecial | null;
      if (val) setSpecial({ ...defaults, ...val });
    });
  }, [db]);
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-brand-dark rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          {/* Decorative Pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          <div className="grid md:grid-cols-2 items-center gap-0">
            {/* Image Side */}
            <div className="h-[400px] md:h-[600px] w-full relative overflow-hidden group">
              <img
                src={special.image}
                alt={special.titleLine2}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent md:bg-gradient-to-r md:from-transparent md:to-brand-dark/90"></div>
            </div>

            {/* Content Side */}
            <div className="p-10 md:p-16 relative text-brand-light">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-xs font-bold tracking-wider uppercase mb-6">
                <Star size={12} className="fill-brand-accent" />
                Baker's Choice
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {special.titleLine1} <br />
                <span className="text-brand-accent font-logo font-normal">
                  {special.titleLine2}
                </span>
              </h2>

              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                {special.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="flex flex-col">
                  <span className="text-sm text-white/40 line-through">
                    R{special.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-3xl font-bold text-white">
                    R{special.salePrice.toFixed(2)}
                  </span>
                </div>

                <button className="flex items-center gap-3 bg-brand-light text-brand-dark px-8 py-4 rounded-full font-bold hover:bg-brand-accent transition-colors duration-300 shadow-lg hover:shadow-brand-accent/20 group">
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedItem;
