import React from "react";
import { ArrowRight, ChefHat, Wheat, Star } from "lucide-react";

interface HeroProps {
  onStartOrder?: () => void;
  onViewMenu?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartOrder, onViewMenu }) => {
  const cakesMap = import.meta.glob("./img/cakes/*.{png,jpg,jpeg,webp}", {
    eager: true,
  }) as Record<string, any>;
  const cupcakesMap = import.meta.glob("./img/cupcakes/*.{png,jpg,jpeg,webp}", {
    eager: true,
  }) as Record<string, any>;
  const cakes = React.useMemo(
    () => Object.values(cakesMap).map((m: any) => m.default ?? m),
    []
  );
  const cupcakes = React.useMemo(
    () => Object.values(cupcakesMap).map((m: any) => m.default ?? m),
    []
  );
  const fallback =
    "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&q=80&w=800&h=800";
  const pick = (arr: string[]) =>
    arr.length ? arr[Math.floor(Math.random() * arr.length)] : fallback;
  const [visibleIndex, setVisibleIndex] = React.useState(0);
  const [lastCat, setLastCat] = React.useState<"cake" | "cupcake">("cupcake");
  const [imgs, setImgs] = React.useState<string[]>([
    pick(cakes),
    pick(cupcakes),
  ]);
  React.useEffect(() => {
    const id = setInterval(() => {
      const nextCat = lastCat === "cake" ? "cupcake" : "cake";
      const pool = nextCat === "cake" ? cakes : cupcakes;
      const url = pick(pool);
      setImgs((prev) => {
        const next = [...prev];
        next[1 - visibleIndex] = url;
        return next;
      });
      setVisibleIndex((v) => 1 - v);
      setLastCat(nextCat);
    }, 5000);
    return () => clearInterval(id);
  }, [cakes, cupcakes, visibleIndex, lastCat]);
  return (
    <section className="relative px-6 py-12 md:py-24 max-w-7xl mx-auto overflow-hidden">
      {/* Subtle Background Texture via CSS class in parent or just here */}
      <div className="absolute inset-0 bg-texture opacity-60 -z-20 pointer-events-none"></div>

      {/* Floating Background Icons */}
      <div className="absolute top-20 left-10 text-brand-green/20 animate-float pointer-events-none -z-10">
        <Wheat size={64} />
      </div>
      <div className="absolute bottom-40 right-10 text-brand-dark/10 animate-float-delayed pointer-events-none -z-10">
        <Star size={48} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-8 z-10">
          <h1 className="opacity-0 animate-fade-in-up delay-100 text-5xl md:text-7xl lg:text-8xl font-bold text-brand-dark leading-[1] tracking-tight">
            Artisan bakes <br /> made with{" "}
            <span className="font-logo text-brand-green font-normal">love</span>
          </h1>
          <p className="opacity-0 animate-fade-in-up delay-200 text-gray-500 text-lg md:text-xl max-w-md leading-relaxed font-light">
            Wake up to the smell of fresh croissants, warm muffins, and
            sourdough bread. Baked daily and delivered to your doorstep.
          </p>

          <div className="opacity-0 animate-fade-in-up delay-300 flex flex-col sm:flex-row items-start gap-4 pt-4">
            <button
              onClick={onStartOrder}
              className="group flex items-center gap-2 bg-brand-green text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg shadow-orange-200 hover:bg-amber-600 hover:shadow-orange-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95"
            >
              Start Your Order
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onViewMenu}
              className="flex items-center gap-2 px-8 py-4 rounded-full text-lg font-semibold text-brand-dark border-2 border-brand-dark/10 hover:border-brand-dark hover:bg-brand-dark hover:text-white transition-all duration-300"
            >
              View Menu
            </button>
          </div>

          <div className="opacity-0 animate-fade-in-up delay-400 flex items-center gap-4 text-sm font-medium text-brand-dark pt-4 border-t border-brand-dark/5 w-fit">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-brand-light bg-gray-200 overflow-hidden shadow-sm"
                >
                  <img
                    src={`https://i.pravatar.cc/100?img=${i + 25}`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="pl-2 flex flex-col">
              <span className="font-bold text-base">12,500+ Happy Eaters</span>
              <div className="flex text-brand-accent">
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative flex justify-center md:justify-end mt-8 md:mt-0 perspective-1000 group">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-amber-200/30 blur-[80px] rounded-full -z-10 animate-pulse-slow"></div>

          <div className="relative w-full max-w-lg aspect-square animate-float">
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50">
              <img
                src={imgs[0]}
                alt="Hero"
                className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-700 ${
                  visibleIndex === 0 ? "opacity-100" : "opacity-0"
                }`}
              />
              <img
                src={imgs[1]}
                alt="Hero"
                className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-700 ${
                  visibleIndex === 1 ? "opacity-100" : "opacity-0"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Floating Badge - Delivery Time */}
            <div className="opacity-0 animate-scale-in delay-500 absolute top-8 right-8 md:-top-6 md:-right-6 bg-brand-dark text-white w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-brand-light hover:scale-110 transition-transform duration-300 cursor-default z-20">
              <span className="font-bold text-2xl leading-none">20</span>
              <span className="text-[10px] uppercase tracking-wide opacity-80">
                mins
              </span>
            </div>

            {/* Floating Badge - Freshness */}
            <div className="opacity-0 animate-scale-in delay-700 absolute bottom-12 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-xl flex items-center gap-4 border border-brand-dark/5 hover:scale-105 transition-transform duration-300 z-20 max-w-[200px]">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <ChefHat size={24} />
              </div>
              <div>
                <p className="font-bold text-brand-dark leading-tight">
                  Baked Fresh Daily
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Straight from the oven
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
