import React from 'react';
import { Leaf, Clock, Heart, Award } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Clock className="w-8 h-8 text-brand-green" />,
      title: "Baked Fresh Daily",
      desc: "Our ovens start at 4 AM. We ensure every croissant, loaf, and muffin is warm and fresh when it reaches you."
    },
    {
      icon: <Leaf className="w-8 h-8 text-brand-green" />,
      title: "100% Organic Sourcing",
      desc: "We partner with local farmers to source the finest organic flour, free-range eggs, and seasonal fruits."
    },
    {
      icon: <Award className="w-8 h-8 text-brand-green" />,
      title: "Master Craftsmanship",
      desc: "Led by award-winning pastry chefs who treat every creation as a piece of edible art."
    },
    {
      icon: <Heart className="w-8 h-8 text-brand-green" />,
      title: "Made with Love",
      desc: "We believe the secret ingredient is passion. You can taste the care in every single bite."
    }
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl font-bold text-brand-dark">The Rabelani Standard</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          We don't just bake cakes; we craft experiences. Here is what makes our bakery a cut above the rest.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <div 
            key={idx}
            className="group bg-white p-8 rounded-[2rem] border border-brand-dark/5 hover:border-brand-green/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-brand-green/10 group-hover:bg-brand-green/10">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-green transition-colors">
              {feature.title}
            </h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;