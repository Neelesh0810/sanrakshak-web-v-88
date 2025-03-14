
import React from 'react';
import { useTheme } from '../context/ThemeProvider';
import { ArrowLeft, MapPin, Clock, User, Phone, CheckCircle, FileCheck, AlertCircle } from 'lucide-react';
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
    quantity?: number;
    assignedTo?: string;
  };
  onClose: () => void;
}

const ResourceDetailsPanel: React.FC<ResourceDetailsPanelProps> = ({ resource, onClose }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Format the timestamp into a readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get status icon based on current status
  const getStatusIcon = () => {
    switch(resource.status) {
      case 'resolved':
        return <CheckCircle size={18} className="mr-2 text-green-500" />;
      case 'addressing':
        return <FileCheck size={18} className="mr-2 text-blue-500" />;
      default:
        return <AlertCircle size={18} className="mr-2 text-yellow-500" />;
    }
  };

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

        <div className="mb-4">
          {resource.urgent && (
            <div className={cn(
              "inline-block px-2 py-1 text-xs rounded-full mb-2",
              isLight ? "bg-red-100 text-red-800" : "bg-red-900/40 text-red-300"
            )}>
              Urgent
            </div>
          )}
          <h2 className="text-xl font-semibold">{resource.title}</h2>
        </div>
        
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

            {resource.people !== undefined && (
              <div className="flex items-center text-sm">
                <User size={16} className="mr-2 opacity-70" />
                <span>{resource.people} people affected</span>
              </div>
            )}

            {resource.quantity !== undefined && (
              <div className="flex items-center text-sm">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center opacity-70">
                  #
                </span>
                <span>{resource.quantity} units available</span>
              </div>
            )}

            <div className="flex items-center text-sm">
              <Clock size={16} className="mr-2 opacity-70" />
              <span>{formatDate(resource.timestamp)}</span>
            </div>
          </div>

          <div className={cn(
            "p-4 rounded-lg",
            isLight ? "bg-gray-100" : "bg-white/5"
          )}>
            <h3 className="font-medium mb-2">Status</h3>
            <div className="flex items-center">
              {getStatusIcon()}
              <div className={cn(
                "inline-block px-2 py-1 rounded text-sm",
                resource.status === 'resolved' 
                  ? (isLight ? "bg-green-100 text-green-800" : "bg-green-900/30 text-green-300")
                  : resource.status === 'addressing'
                    ? (isLight ? "bg-blue-100 text-blue-800" : "bg-blue-900/30 text-blue-300")
                    : (isLight ? "bg-yellow-100 text-yellow-800" : "bg-yellow-900/30 text-yellow-300")
              )}>
                {resource.status ? resource.status.charAt(0).toUpperCase() + resource.status.slice(1) : 'Pending'}
              </div>
            </div>
            
            {resource.assignedTo && (
              <div className="mt-2 text-sm">
                <span className={isLight ? "text-gray-600" : "text-gray-400"}>Assigned to: </span>
                <span>{resource.assignedTo}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailsPanel;
