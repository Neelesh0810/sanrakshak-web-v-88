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
  
  return (
    <div className="glass-dark border border-white/10 rounded-xl p-5">
      <h2 className="text-xl font-semibold mb-4">
        {isVolunteer ? 'Offer Resources' : (type === 'need' ? 'Request Resources' : 'Offer Resources')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isVolunteer && (
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setType('need')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                type === 'need' 
                  ? 'bg-white text-black' 
                  : 'bg-white/10 hover:bg-white/15'
              }`}
            >
              I Need Help
            </button>
            <button
              type="button"
              onClick={() => setType('offer')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                type === 'offer' 
                  ? 'bg-white text-black' 
                  : 'bg-white/10 hover:bg-white/15'
              }`}
            >
              I Can Help
            </button>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setCategory('water')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                category === 'water' 
                  ? 'border-white bg-white/10' 
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <Droplet size={24} className="mb-1" />
              <span className="text-xs">Water</span>
            </button>
            <button
              type="button"
              onClick={() => setCategory('shelter')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                category === 'shelter' 
                  ? 'border-white bg-white/10' 
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <Home size={24} className="mb-1" />
              <span className="text-xs">Shelter</span>
            </button>
            <button
              type="button"
              onClick={() => setCategory('food')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                category === 'food' 
                  ? 'border-white bg-white/10' 
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <Utensils size={24} className="mb-1" />
              <span className="text-xs">Food</span>
            </button>
            <button
              type="button"
              onClick={() => setCategory('supplies')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                category === 'supplies' 
                  ? 'border-white bg-white/10' 
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <ShoppingBag size={24} className="mb-1" />
              <span className="text-xs">Supplies</span>
            </button>
            <button
              type="button"
              onClick={() => setCategory('medical')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                category === 'medical' 
                  ? 'border-white bg-white/10' 
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <Heart size={24} className="mb-1" />
              <span className="text-xs">Medical</span>
            </button>
            <button
              type="button"
              onClick={() => setCategory('safety')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                category === 'safety' 
                  ? 'border-white bg-white/10' 
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <Shield size={24} className="mb-1" />
              <span className="text-xs">Safety</span>
            </button>
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
