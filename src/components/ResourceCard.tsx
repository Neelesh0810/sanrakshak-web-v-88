import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Droplet, Home, ShoppingBag, Utensils, Heart, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';

interface ResourceCardProps {
  type: 'need' | 'offer';
  category: 'water' | 'shelter' | 'food' | 'supplies' | 'medical' | 'safety';
  title: string;
  description: string;
  location: string;
  contact?: string;
  urgent?: boolean;
  className?: string;
  requestId?: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  type,
  category,
  title,
  description,
  location,
  contact,
  urgent = false,
  className,
  requestId = '',
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  useEffect(() => {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      const user = JSON.parse(authUser);
      setCurrentUser(user);
      
      const userResponses = JSON.parse(localStorage.getItem(`responses_${user.id}`) || '[]');
      const hasResponded = userResponses.some((response: any) => response.requestId === requestId);
      
      if (hasResponded) {
        setIsRequested(true);
      }
    }
  }, [requestId]);
  
  const getCategoryIcon = () => {
    switch (category) {
      case 'water':
        return <Droplet size={18} />;
      case 'shelter':
        return <Home size={18} />;
      case 'food':
        return <Utensils size={18} />;
      case 'supplies':
        return <ShoppingBag size={18} />;
      case 'medical':
        return <Heart size={18} />;
      case 'safety':
        return <Shield size={18} />;
      default:
        return <Droplet size={18} />;
    }
  };

  const canInteract = () => {
    if (!currentUser) return false;
    
    if (currentUser.role === 'victim' && type === 'need') return false;
    
    if (currentUser.role !== 'victim' && type === 'offer') return false;
    
    return true;
  };

  const handleRequestClick = () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request or respond",
      });
      navigate('/login');
      return;
    }
    
    if (!canInteract()) {
      if (currentUser.role === 'victim' && type === 'need') {
        toast({
          title: "Action Not Available",
          description: "As someone affected, you can only request resources, not respond to needs",
        });
      } else if (currentUser.role !== 'victim' && type === 'offer') {
        toast({
          title: "Action Not Available",
          description: "As a helper, you can only respond to needs, not request resources",
        });
      }
      return;
    }
    
    setIsRequesting(true);
    
    setTimeout(() => {
      setIsRequesting(false);
      setIsRequested(true);
      
      const responseId = Date.now().toString();
      const userResponses = JSON.parse(localStorage.getItem(`responses_${currentUser.id}`) || '[]');
      
      const newResponse = {
        id: responseId,
        requestId,
        type: type === 'need' ? 'offer' : 'request',
        category,
        title,
        time: Date.now(),
        status: 'pending'
      };
      
      localStorage.setItem(`responses_${currentUser.id}`, JSON.stringify([newResponse, ...userResponses]));
      
      const notifications = JSON.parse(localStorage.getItem(`notifications_${currentUser.id}`) || '[]');
      
      const newNotification = {
        id: Date.now().toString(),
        type: type === 'need' ? 'response' : 'request',
        title: type === 'need' ? 'You offered help' : 'You requested resource',
        message: `You have ${type === 'need' ? 'offered to help with' : 'requested'}: ${title}`,
        time: Date.now(),
        read: false,
        link: '/connect'
      };
      
      localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify([newNotification, ...notifications]));
      
      toast({
        title: type === 'need' ? "Response Sent" : "Request Sent",
        description: type === 'need' 
          ? "Your offer to help has been sent" 
          : "Your request has been submitted",
      });
    }, 1000);
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg',
        isLight
          ? (type === 'need' 
              ? 'border border-gray-300 bg-white shadow-soft' 
              : 'border border-gray-300 bg-gray-100')
          : (type === 'need' 
              ? 'border-white/10 bg-black/40' 
              : 'border-white/5 bg-white/5'),
        urgent && (isLight ? 'ring-1 ring-gray-800' : 'ring-1 ring-white/20'),
        className
      )}
    >
      {urgent && (
        <div className={cn(
          "absolute top-0 right-0 px-2 py-1 text-xs font-semibold rounded-bl-lg",
          isLight ? "bg-black text-white" : "bg-white text-black"
        )}>
          Urgent
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className={cn(
            'p-2 rounded-full mr-3',
            isLight
              ? (type === 'need' ? 'bg-gray-200' : 'bg-gray-300')
              : (type === 'need' ? 'bg-black/60' : 'bg-white/10')
          )}>
            {getCategoryIcon()}
          </div>
          <div>
            <p className={cn(
              "text-xs uppercase tracking-wider",
              isLight ? "text-gray-600" : "text-gray-400"
            )}>
              {type === 'need' ? 'Needed' : 'Offered'}
            </p>
            <h3 className="font-semibold text-lg mt-0.5">{title}</h3>
          </div>
        </div>
        
        <p className={cn(
          "text-sm mb-4 line-clamp-2",
          isLight ? "text-gray-700" : "text-gray-300"
        )}>{description}</p>
        
        <div className={cn(
          "text-xs mb-4",
          isLight ? "text-gray-600" : "text-gray-400"
        )}>
          <p>Location: {location}</p>
          {contact && <p className="mt-1">Contact: {contact}</p>}
        </div>
        
        <div className="flex justify-end">
          {isRequested ? (
            <button 
              disabled
              className={cn(
                "flex items-center text-sm font-medium py-1.5 px-3 rounded-full opacity-70 transition-colors",
                isLight ? "bg-gray-200 text-gray-600" : "bg-white/10"
              )}
            >
              <CheckCircle size={14} className="mr-1.5" />
              <span>{type === 'need' ? 'Response Sent' : 'Requested'}</span>
            </button>
          ) : !canInteract() && currentUser ? (
            <div className={cn(
              "flex items-center text-xs",
              isLight ? "text-gray-600" : "text-gray-400"
            )}>
              <AlertTriangle size={12} className="mr-1" />
              <span>
                {currentUser.role === 'victim' && type === 'need' 
                  ? 'Switch to volunteer mode to help' 
                  : 'Not available for your role'}
              </span>
            </div>
          ) : (
            <button 
              onClick={handleRequestClick}
              disabled={isRequesting}
              className={cn(
                "flex items-center text-sm font-medium py-1.5 px-3 rounded-full transition-colors focus-ring disabled:opacity-50",
                isLight
                  ? "bg-black text-white hover:bg-black/90"
                  : "bg-white/10 hover:bg-white/15"
              )}
              aria-label={type === 'need' ? 'I can help' : 'I need this'}
            >
              {isRequesting ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <span className="mr-1.5">{type === 'need' ? 'Respond' : 'Request'}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
