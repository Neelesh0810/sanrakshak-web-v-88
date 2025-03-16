
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
        'rounded-lg overflow-hidden transition-all shadow-[0_8px_20px_rgba(0,0,0,0.12)] backdrop-blur-sm',
        isLight 
          ? 'bg-white/95 border border-black/20 shadow-soft' 
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
              "text-xs px-3 py-1 rounded-full transition-colors text-black shadow-sm",
              isLight 
                ? "bg-blue-100 hover:bg-blue-200 border border-black/10" 
                : "bg-blue-900/20 hover:bg-blue-900/30 border border-white/10"
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
