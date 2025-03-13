
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Droplet, Home, ShoppingBag, Utensils, Heart, Shield, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ResourceCardProps {
  type: 'need' | 'offer';
  category: 'water' | 'shelter' | 'food' | 'supplies' | 'medical' | 'safety';
  title: string;
  description: string;
  location: string;
  contact?: string;
  urgent?: boolean;
  className?: string;
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
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const { toast } = useToast();
  
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

  const handleRequestClick = () => {
    // Check if user is logged in
    const user = localStorage.getItem('authUser');
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request or respond",
      });
      return;
    }
    
    setIsRequesting(true);
    
    // Simulate request processing
    setTimeout(() => {
      setIsRequesting(false);
      setIsRequested(true);
      
      // Add to notifications
      const currentUser = JSON.parse(user);
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
        'relative overflow-hidden rounded-xl backdrop-blur-sm border transition-all duration-300 hover:shadow-lg',
        type === 'need' 
          ? 'border-white/10 bg-black/40' 
          : 'border-white/5 bg-white/5',
        urgent && 'ring-1 ring-white/20',
        className
      )}
    >
      {urgent && (
        <div className="absolute top-0 right-0 px-2 py-1 text-xs bg-white text-black font-semibold rounded-bl-lg">
          Urgent
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className={cn(
            'p-2 rounded-full mr-3',
            type === 'need' ? 'bg-black/60' : 'bg-white/10'
          )}>
            {getCategoryIcon()}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400">
              {type === 'need' ? 'Needed' : 'Offered'}
            </p>
            <h3 className="font-semibold text-lg mt-0.5">{title}</h3>
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{description}</p>
        
        <div className="text-xs text-gray-400 mb-4">
          <p>Location: {location}</p>
          {contact && <p className="mt-1">Contact: {contact}</p>}
        </div>
        
        <div className="flex justify-end">
          {isRequested ? (
            <button 
              disabled
              className="flex items-center text-sm font-medium py-1.5 px-3 rounded-full bg-white/10 opacity-70 transition-colors"
            >
              <CheckCircle size={14} className="mr-1.5" />
              <span>{type === 'need' ? 'Response Sent' : 'Requested'}</span>
            </button>
          ) : (
            <button 
              onClick={handleRequestClick}
              disabled={isRequesting}
              className="flex items-center text-sm font-medium py-1.5 px-3 rounded-full bg-white/10 hover:bg-white/15 transition-colors focus-ring disabled:opacity-50"
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
