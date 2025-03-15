
import React, { useState } from 'react';
import { Package, Droplet, Pizza, Stethoscope, Home, ShoppingBag, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResourceCategory, Resource } from '@/hooks/useResourceData';
import { toast } from 'sonner';

interface AddResourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (resource: Omit<Resource, 'id' | 'timestamp'>) => Resource;
}

type ResourceTemplate = {
  title: string;
  icon: React.ReactNode;
  category: ResourceCategory;
  description: string;
};

const resourceTemplates: ResourceTemplate[] = [
  {
    title: 'Water Supply',
    icon: <Droplet className="h-5 w-5" />,
    category: 'water',
    description: 'Clean drinking water for distribution',
  },
  {
    title: 'Food Supply',
    icon: <Pizza className="h-5 w-5" />,
    category: 'food',
    description: 'Non-perishable food items and meal kits',
  },
  {
    title: 'Medical Supply',
    icon: <Stethoscope className="h-5 w-5" />,
    category: 'medical',
    description: 'First aid kits, medications, and medical equipment',
  },
  {
    title: 'Shelter',
    icon: <Home className="h-5 w-5" />,
    category: 'shelter',
    description: 'Temporary housing and shelter facilities',
  },
  {
    title: 'General Supplies',
    icon: <ShoppingBag className="h-5 w-5" />,
    category: 'supplies',
    description: 'Clothing, hygiene products, and other essential supplies',
  },
  {
    title: 'Safety Equipment',
    icon: <Shield className="h-5 w-5" />,
    category: 'safety',
    description: 'Safety equipment like flashlights, radios, and protective gear',
  },
];

const AddResourceDialog: React.FC<AddResourceDialogProps> = ({ isOpen, onClose, onAddResource }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ResourceTemplate | null>(null);
  const [step, setStep] = useState<'template' | 'details'>('template');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    location: '',
    contact: '',
  });
  
  const resetForm = () => {
    setSelectedTemplate(null);
    setStep('template');
    setFormData({
      title: '',
      description: '',
      quantity: '',
      location: '',
      contact: '',
    });
  };
  
  const handleSelectTemplate = (template: ResourceTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      ...formData,
      title: template.title,
      description: template.description,
    });
    setStep('details');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    if (!selectedTemplate) return;
    
    // Validate form
    if (!formData.title || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const resource: Omit<Resource, 'id' | 'timestamp'> = {
      type: 'offer',
      category: selectedTemplate.category,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      contact: formData.contact,
      items: formData.quantity ? [{ name: selectedTemplate.title, quantity: parseInt(formData.quantity) || 0 }] : undefined,
    };
    
    onAddResource(resource);
    toast.success('Resource added successfully');
    onClose();
    resetForm();
  };
  
  const handleCancel = () => {
    if (step === 'details') {
      setStep('template');
    } else {
      onClose();
      resetForm();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Package className="h-5 w-5" />
            {step === 'template' ? 'Add New Resource' : 'Resource Details'}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            {step === 'template' 
              ? 'Select the type of resource you want to add' 
              : 'Provide details about the resource'}
          </DialogDescription>
        </DialogHeader>
        
        {step === 'template' ? (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {resourceTemplates.map((template, index) => (
              <button
                key={index}
                className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-left"
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-white">
                    {template.icon}
                  </div>
                  <h3 className="font-medium">{template.title}</h3>
                </div>
                <p className="text-xs text-gray-400">{template.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Resource Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter resource title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the resource"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Amount available"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue="available">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                      <SelectItem value="low">Low Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Where is this resource stored/available"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Information</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Phone number or email"
                />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={handleCancel}>
                Back
              </Button>
              <Button onClick={handleSubmit}>
                Add Resource
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddResourceDialog;
