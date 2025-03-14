
import React, { useState } from 'react';
import { Droplet, Home, ShoppingBag, Utensils, Heart, Shield, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type ResourceCategory = 'water' | 'shelter' | 'food' | 'supplies' | 'medical' | 'safety';

interface VictimRequestFormProps {
  onSubmit: (request: {
    title: string;
    description: string;
    category: ResourceCategory;
    location: string;
    people: number;
    urgent: boolean;
    contact?: string;
  }) => void;
  onCancel: () => void;
}

const VictimRequestForm: React.FC<VictimRequestFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('water');
  const [location, setLocation] = useState('');
  const [people, setPeople] = useState(1);
  const [urgent, setUrgent] = useState(false);
  const [contact, setContact] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Please enter a title for your request';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Please provide details about your needs';
    }
    
    if (!location.trim()) {
      newErrors.location = 'Please enter your location';
    }
    
    if (people < 1) {
      newErrors.people = 'Number of people must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please check your form",
        description: "Some required information is missing",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit({
      title,
      description,
      category,
      location,
      people,
      urgent,
      contact: contact || undefined
    });
  };

  return (
    <div className="glass-dark border border-white/10 rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Request Assistance</h2>
        {urgent && (
          <div className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm flex items-center">
            <AlertCircle size={14} className="mr-1" />
            Urgent Request
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            What do you need? <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief description of what you need"
            className={`w-full bg-black/40 border ${errors.title ? 'border-red-400' : 'border-white/10'} rounded-lg p-3 placeholder:text-gray-500 focus:ring-1 focus:ring-white/30 focus:outline-none`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Category <span className="text-red-400">*</span>
          </label>
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
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Details <span className="text-red-400">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Provide more information about what you need"
            className={`w-full bg-black/40 border ${errors.description ? 'border-red-400' : 'border-white/10'} rounded-lg p-3 placeholder:text-gray-500 focus:ring-1 focus:ring-white/30 focus:outline-none resize-none`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
          )}
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Your Location <span className="text-red-400">*</span>
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Your current location"
              className={`w-full bg-black/40 border ${errors.location ? 'border-red-400' : 'border-white/10'} rounded-lg p-3 placeholder:text-gray-500 focus:ring-1 focus:ring-white/30 focus:outline-none`}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-400">{errors.location}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="people" className="block text-sm font-medium mb-1">
              # of People <span className="text-red-400">*</span>
            </label>
            <input
              id="people"
              type="number"
              min="1"
              value={people}
              onChange={(e) => setPeople(parseInt(e.target.value) || 1)}
              className={`w-24 bg-black/40 border ${errors.people ? 'border-red-400' : 'border-white/10'} rounded-lg p-3 placeholder:text-gray-500 focus:ring-1 focus:ring-white/30 focus:outline-none`}
            />
            {errors.people && (
              <p className="mt-1 text-sm text-red-400">{errors.people}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="contact" className="block text-sm font-medium mb-1">
            Contact Information (Optional)
          </label>
          <input
            id="contact"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Phone number or other contact info"
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 placeholder:text-gray-500 focus:ring-1 focus:ring-white/30 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">
            This helps responders reach you directly
          </p>
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
            This is an urgent need <span className="text-red-400">(life-threatening or critical)</span>
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
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default VictimRequestForm;
