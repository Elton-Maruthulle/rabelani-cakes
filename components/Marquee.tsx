import React from 'react';
import { Star } from 'lucide-react';

const Marquee: React.FC = () => {
  const items = [
    "Freshly Baked Every Morning",
    "100% Organic Ingredients",
    "Gluten-Free Options Available",
    "Order Before 10AM for Same Day Delivery",
    "Artisan Sourdough",
    "Wedding Cakes"
  ];

  return (
    <div className="bg-brand-green overflow-hidden py-3 border-y border-brand-dark/10 mb-8">
      <div className="flex whitespace-nowrap animate-scroll">
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center mx-6">
            <span className="text-white font-bold text-sm tracking-widest uppercase">{item}</span>
            <Star className="w-3 h-3 text-brand-dark ml-6 fill-brand-dark" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
