import React from 'react';
import { ArrowRight } from 'lucide-react';

const CustomOrder: React.FC = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[3rem] overflow-hidden min-h-[500px] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&q=80&w=2000" 
              alt="Wedding Cake Decorating" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-10 md:p-20 max-w-2xl text-white">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium tracking-wider uppercase mb-6 border border-white/30">
              Custom Events
            </span>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-[0.9]">
              Planning a <br/>
              <span className="font-logo text-brand-accent">Dream Event?</span>
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed font-light">
              From towering wedding cakes to bespoke birthday treats, our team works with you to create a centerpiece that tastes as magical as it looks.
            </p>
            <button className="bg-brand-light text-brand-dark px-10 py-5 rounded-full font-bold text-lg hover:bg-brand-green hover:text-white transition-all duration-300 flex items-center gap-3 group shadow-2xl hover:shadow-brand-green/50">
              Book a Consultation
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomOrder;