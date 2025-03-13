
import React from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatusUpdateProps {
  id?: string;
  title: string;
  message: string;
  source: string;
  timestamp: string;
  priority?: 'low' | 'medium' | 'high';
  className?: string;
}

const StatusUpdate: React.FC<StatusUpdateProps> = ({
  id = "status-1",
  title,
  message,
  source,
  timestamp,
  priority = 'medium',
  className,
}) => {
  const getPriorityStyles = () => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-white';
      case 'medium':
        return 'border-l-4 border-gray-400';
      case 'low':
        return 'border-l-4 border-gray-700';
      default:
        return 'border-l-4 border-gray-400';
    }
  };

  return (
    <div 
      className={cn(
        'bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden transition-all hover:bg-black/40',
        getPriorityStyles(),
        className
      )}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex items-center text-xs text-gray-400">
            <Clock size={12} className="mr-1" />
            <span>{timestamp}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mb-3">{message}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Source: {source}</span>
          <Link 
            to={`/status/${id}`} 
            className="text-xs bg-white/10 hover:bg-white/15 px-3 py-1 rounded-full transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdate;
