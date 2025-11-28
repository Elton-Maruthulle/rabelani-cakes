import React from "react";
import { Category } from "../types";

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
  overrideSrc?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  overrideSrc,
}) => {
  const [imageSrc, setImageSrc] = React.useState<string>(
    overrideSrc || category.image
  );
  React.useEffect(() => {
    setImageSrc(overrideSrc || category.image);
  }, [overrideSrc, category.image]);

  return (
    <div
      className={`group relative ${category.bgColor} rounded-[2rem] p-1.5 aspect-square transition-all duration-500 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-2 cursor-pointer overflow-hidden`}
      onClick={onClick}
    >
      {/* Notification Dot */}
      {category.hasNotification && (
        <div className="absolute top-4 right-4 w-3 h-3 bg-brand-accent rounded-full z-20 ring-4 ring-white/30 animate-pulse"></div>
      )}

      {/* Image Container - Full Fill with internal radius */}
      <div className="w-full h-full rounded-[1.6rem] overflow-hidden relative isolate">
        <img
          src={imageSrc}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
        />

        {/* Text Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-50 group-hover:opacity-60 transition-opacity duration-300"></div>

        {/* Label */}
        <div className="absolute bottom-0 left-0 w-full p-5 transform translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-lg md:text-xl tracking-wide leading-tight drop-shadow-md">
            {category.name}
          </h3>
          <div className="h-1 w-12 bg-white/80 mt-2 rounded-full transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
