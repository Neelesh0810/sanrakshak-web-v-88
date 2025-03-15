
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import CategorySelector, { ResourceCategory } from './CategorySelector';
import FormField from './FormField';
import RequestTypeSelector, { ResourceType } from './RequestTypeSelector';

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
        {!isVolunteer && type === 'need' && (
          <RequestTypeSelector type={type} setType={setType} />
        )}
        
        <CategorySelector category={category} setCategory={setCategory} />
        
        <FormField
          id="title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Brief description of what you need/offer"
        />
        
        <FormField
          id="description"
          label="Details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Provide more information about your request"
          isTextarea
          rows={3}
        />
        
        <FormField
          id="location"
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          placeholder="Your location or drop point"
        />
        
        <FormField
          id="contact"
          label="Contact (Optional)"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Phone number or other contact info"
        />
        
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
