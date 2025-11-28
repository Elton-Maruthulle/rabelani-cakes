import React from "react";
import { CATEGORIES } from "../constants";
import CategoryCard from "./CategoryCard";

interface CategoryGridProps {
  onCategoryClick?: (name: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategoryClick }) => {
  return (
    <section className="px-6 pb-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {CATEGORIES.map((category, index) => (
          <div
            key={category.id}
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${(index + 2) * 100}ms` }}
          >
            <CategoryCard
              category={category}
              onClick={
                onCategoryClick
                  ? () => onCategoryClick(category.name)
                  : undefined
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
