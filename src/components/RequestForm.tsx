
import React, { useState, useEffect } from 'react';
import { Droplet, Home, ShoppingBag, Utensils, Heart, Shield } from 'lucide-react';

type ResourceCategory = 'water' | 'shelter' | 'food' | 'supplies' | 'medical' | 'safety';
type ResourceType = 'need' | 'offer';

interface RequestFormProps {
  onSubmit: (request: {
    type: ResourceType;
    category: ResourceCategory;
    title: string;
    description: string;
    location: string;
    contact?: string;
    urgent?: boolean;
  }) => void;
  onCancel: () => void;
  userRole?: string;
}

const RequestForm: React.FC<RequestFormProps> = ({ onSubmit, onCancel, userRole = 'victim' }) => {
  const [type, setType] = useState<ResourceType>('need');
  const [category, setCategory] = useState<ResourceCategory>('water');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [urgent, setUrgent] = useState(false);
  
  useEffect(() => {
    if (userRole === 'volunteer' || userRole === 'ngo' || userRole === 'government') {
      setType('offer');
    } else {
      setType('need');
    }
  }, [userRole]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      category,
      title,
      description,
      location,
      contact: contact || undefined,
      urgent: urgent || undefined
    });
  };
  
  const isVolunteer = userRole === 'volunteer' || userRole === 'ngo' || userRole === 'government';
  
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
    <div className="glass-dark border border-white/10 rounded-xl p-5">
      <h2 className="text-xl font-semibold mb-4">
        {isVolunteer ? 'Offer Resources' : (type === 'need' ? 'Request Resources' : 'Offer Resources')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isVolunteer && type === 'need' && (
          <div className="flex">
            <button
              type="button"
              onClick={() => setType('need')}
              className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-white text-black"
            >
              I Need Help
            </button>
          </div>
        )}
        
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
                <div className="relative flex flex-col items-center justify-center py-3 px-2">
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
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Brief description of what you need/offer"
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 placeholder:text-gray-500 focus:ring-1 focus:ring-white/30 focus:outline-none"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Details</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            placeholder="Provide more information about your request"
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 placeholder:text-gray-500 focus:ring-1 focus:ring-white/30 focus:outline-none resize-none"
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="Your location or drop point"
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 placeholder:text-gray-500 focus:ring-1 focus:ring-white/30 focus:outline-none"
          />
        </div>
        
        <div>
          <label htmlFor="contact" className="block text-sm font-medium mb-1">Contact (Optional)</label>
          <input
            id="contact"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Phone number or other contact info"
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 placeholder:text-gray-500 focus:ring-1 focus:ring-white/30 focus:outline-none"
          />
        </div>
        
        {/* Only show urgent checkbox for victims */}
        {!isVolunteer && (
          <div className="flex items-center">
            <input
              id="urgent"
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
              className="w-4 h-4 bg-black border-white/30 rounded focus:ring-white"
            />
            <label htmlFor="urgent" className="ml-2 text-sm">
              Mark as urgent
            </label>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
