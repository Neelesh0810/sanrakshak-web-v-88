
import React from 'react';
import { useTheme } from '../context/ThemeProvider';
import { ArrowLeft, MapPin, Clock, User, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceDetailsPanelProps {
  resource: {
    id: string;
    type: 'need' | 'offer';
    category: string;
    title: string;
    description: string;
    location: string;
    contact?: string;
    timestamp: number;
    urgent?: boolean;
    status?: string;
    people?: number;
  };
  onClose: () => void;
}

const ResourceDetailsPanel: React.FC<ResourceDetailsPanelProps> = ({ resource, onClose }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={cn(
      "fixed inset-y-0 right-0 w-96 shadow-xl z-50 transition-all transform",
      isLight ? "bg-white" : "bg-black/90 backdrop-blur-sm"
    )}>
      <div className="p-6">
        <button 
          onClick={onClose}
          className="flex items-center text-sm mb-6 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={16} className="mr-2" />
          Close
        </button>

        <h2 className="text-xl font-semibold mb-4">{resource.title}</h2>
        
        <div className="space-y-6">
          <div>
            <p className={cn(
              "text-sm mb-4",
              isLight ? "text-gray-700" : "text-gray-300"
            )}>{resource.description}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <MapPin size={16} className="mr-2 opacity-70" />
              <span>{resource.location}</span>
            </div>

            {resource.contact && (
              <div className="flex items-center text-sm">
                <Phone size={16} className="mr-2 opacity-70" />
                <span>{resource.contact}</span>
              </div>
            )}

            {resource.people && (
              <div className="flex items-center text-sm">
                <User size={16} className="mr-2 opacity-70" />
                <span>{resource.people} people affected</span>
              </div>
            )}

            <div className="flex items-center text-sm">
              <Clock size={16} className="mr-2 opacity-70" />
              <span>{new Date(resource.timestamp).toLocaleString()}</span>
            </div>
          </div>

          <div className={cn(
            "p-4 rounded-lg",
            isLight ? "bg-gray-100" : "bg-white/5"
          )}>
            <h3 className="font-medium mb-2">Status</h3>
            <div className={cn(
              "inline-block px-2 py-1 rounded text-sm",
              resource.status === 'resolved' 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            )}>
              {resource.status || 'Pending'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailsPanel;
