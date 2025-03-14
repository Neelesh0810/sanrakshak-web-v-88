
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { AlertTriangle, Info } from 'lucide-react';
import StatusUpdateActions from './StatusUpdateActions';
import { useTheme } from '../context/ThemeProvider';

interface StatusUpdateProps {
  id: string;
  title: string;
  message: string;
  source: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

const StatusUpdate: React.FC<StatusUpdateProps> = ({
  id,
  title,
  message,
  source,
  timestamp,
  priority
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
  
  const getPriorityIcon = () => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={16} className={isLight ? "text-red-500" : "text-white"} />;
      case 'medium':
      case 'low':
      default:
        return <Info size={16} className={isLight ? "text-gray-800" : "text-gray-300"} />;
    }
  };
  
  return (
    <div className={cn(
      isLight ? "bg-white border border-gray-300 shadow-soft" : "bg-black/30 backdrop-blur-sm border border-white/10",
      "rounded-lg overflow-hidden transition-all",
      getPriorityStyles()
    )}>
      <Link to={`/status/${id}`} className="block p-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <div className="p-1 mr-2">
                {getPriorityIcon()}
              </div>
              <h3 className="font-semibold">{title}</h3>
            </div>
            
            <p className={cn(
              "text-sm mt-1 mb-2",
              isLight ? "text-gray-700" : "text-gray-300"
            )}>
              {message}
            </p>
            
            <div className={cn(
              "flex justify-between items-center text-xs",
              isLight ? "text-gray-600" : "text-gray-400"
            )}>
              <span>{timestamp}</span>
              <span>{source}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className={cn(
        "px-3 py-2 border-t flex justify-end",
        isLight ? "border-gray-100" : "border-white/10"
      )}>
        <StatusUpdateActions 
          statusId={id}
          title={title}
          message={message}
          source={source}
          timestamp={timestamp}
          priority={priority}
        />
      </div>
    </div>
  );
};

export default StatusUpdate;
