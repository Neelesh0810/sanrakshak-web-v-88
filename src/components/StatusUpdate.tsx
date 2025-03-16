
import React from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';

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
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const getPriorityStyles = () => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-red-500';
      case 'medium':
        return 'border-l-4 border-amber-500';
      case 'low':
        return 'border-l-4 border-blue-500';
      default:
        return 'border-l-4 border-amber-500';
    }
  };

  return (
    <div 
      className={cn(
        'rounded-lg overflow-hidden transition-all',
        isLight 
          ? 'bg-white border border-gray-300 shadow-soft' 
          : 'bg-black/30 backdrop-blur-sm border border-white/10',
        getPriorityStyles(),
        className
      )}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-black">{title}</h3>
          <div className="flex items-center text-xs text-black">
            <Clock size={12} className="mr-1" />
            <span>{timestamp}</span>
          </div>
        </div>
        
        <p className="text-sm mb-3 text-black">{message}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-black">Source: {source}</span>
          <Link 
            to={`/status/${id}`} 
            className={cn(
              "text-xs px-3 py-1 rounded-full transition-colors",
              isLight 
                ? "bg-blue-100 hover:bg-blue-200 text-blue-800" 
                : "bg-blue-900/20 hover:bg-blue-900/30 text-blue-300"
            )}
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdate;
