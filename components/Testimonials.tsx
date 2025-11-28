import React from 'react';
import { Quote, Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Wedding Client",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      text: "The most beautiful wedding cake I could have imagined. Not only did it look stunning, but the lemon elderflower flavor was to die for!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Regular Customer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      text: "I stop by every morning for a coffee and a croissant. Rabelani's has completely ruined other bakeries for me. Simply the best.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Event Planner",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
      text: "Professional, reliable, and incredibly talented. I recommend Rabelani's Cakery to all my clients for their dessert tables.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-brand-green/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
             <span className="text-brand-green font-logo text-2xl">Sweet Words</span>
             <h2 className="text-4xl md:text-5xl font-bold text-brand-dark">Love from our <br/>Community</h2>
          </div>
          <div className="flex gap-2">
            <button className="w-12 h-12 rounded-full border border-brand-dark/10 flex items-center justify-center hover:bg-brand-dark hover:text-white transition-colors">
              ←
            </button>
            <button className="w-12 h-12 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-green transition-colors">
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm relative group hover:-translate-y-2 transition-transform duration-300">
              <Quote className="absolute top-8 right-8 text-brand-green/20 w-10 h-10 group-hover:scale-110 transition-transform" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-brand-accent text-brand-accent" />
                ))}
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed font-light text-lg">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4">
                <img 
                  src={review.image} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-light"
                />
                <div>
                  <h4 className="font-bold text-brand-dark">{review.name}</h4>
                  <p className="text-xs text-brand-green font-medium uppercase tracking-wider">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;