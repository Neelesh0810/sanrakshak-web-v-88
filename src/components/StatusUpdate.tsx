
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
        return isLight ? 'border-l-4 border-red-500' : 'border-l-4 border-white';
      case 'medium':
        return isLight ? 'border-l-4 border-gray-800' : 'border-l-4 border-gray-400';
      case 'low':
        return isLight ? 'border-l-4 border-gray-500' : 'border-l-4 border-gray-700';
      default:
        return isLight ? 'border-l-4 border-gray-800' : 'border-l-4 border-gray-400';
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
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex items-center text-xs text-gray-400">
            <Clock size={12} className="mr-1" />
            <span>{timestamp}</span>
          </div>
        </div>
        
        <p className={cn("text-sm mb-3", isLight ? "text-gray-700" : "text-gray-300")}>{message}</p>
        
        <div className="flex justify-between items-center">
          <span className={cn("text-xs", isLight ? "text-gray-600" : "text-gray-500")}>Source: {source}</span>
          <Link 
            to={`/status/${id}`} 
            className={cn(
              "text-xs px-3 py-1 rounded-full transition-colors",
              isLight 
                ? "bg-gray-200 hover:bg-gray-300 text-gray-800" 
                : "bg-white/10 hover:bg-white/15"
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
