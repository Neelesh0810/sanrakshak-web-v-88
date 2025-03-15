
import React from 'react';
import { Droplet, Home, ShoppingBag, Utensils, Heart, Shield } from 'lucide-react';

export type ResourceCategory = 'water' | 'shelter' | 'food' | 'supplies' | 'medical' | 'safety';

interface CategorySelectorProps {
  category: ResourceCategory;
  setCategory: (category: ResourceCategory) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ category, setCategory }) => {
  const categoryConfig = [
    { 
      id: 'water', 
      label: 'Water', 
      icon: <Droplet size={24} className="mb-1" />,
      gradientColor: 'from-[#D3E4FD] to-[#0EA5E9]'
    },
    { 
      id: 'shelter', 
      label: 'Shelter', 
      icon: <Home size={24} className="mb-1" />, 
      gradientColor: 'from-[#E5DEFF] to-[#9b87f5]'
    },
    { 
      id: 'food', 
      label: 'Food', 
      icon: <Utensils size={24} className="mb-1" />, 
      gradientColor: 'from-[#FEF7CD] to-[#F97316]'
    },
    { 
      id: 'supplies', 
      label: 'Supplies', 
      icon: <ShoppingBag size={24} className="mb-1" />, 
      gradientColor: 'from-[#FDE1D3] to-[#F97316]'
    },
    { 
      id: 'medical', 
      label: 'Medical', 
      icon: <Heart size={24} className="mb-1" />, 
      gradientColor: 'from-[#FFDEE2] to-[#D946EF]'
    },
    { 
      id: 'safety', 
      label: 'Safety', 
      icon: <Shield size={24} className="mb-1" />, 
      gradientColor: 'from-[#F2FCE2] to-[#6E59A5]'
    }
  ];
  
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Category</label>
      <div className="grid grid-cols-3 gap-3">
        {categoryConfig.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id as ResourceCategory)}
            className={`relative overflow-hidden rounded-lg transition-all duration-200 ${
              category === cat.id 
                ? 'scale-105 shadow-lg' 
                : 'hover:scale-102 opacity-80 hover:opacity-100'
            }`}
          >
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${cat.gradientColor} opacity-${
                category === cat.id ? '20' : '10'
              }`}
            ></div>
            <div className="relative flex flex-col items-center justify-center py-3 px-2 bg-black/80">
              <div className={`mb-1 ${category === cat.id ? 'text-white' : 'text-white/80'}`}>
                {cat.icon}
              </div>
              <span className={`text-xs font-medium ${category === cat.id ? 'text-white' : 'text-white/80'}`}>
                {cat.label}
              </span>
              {category === cat.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
