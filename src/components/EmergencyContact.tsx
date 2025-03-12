
import React from 'react';
import { cn } from '@/lib/utils';
import { Phone, MessageCircle, Copy } from 'lucide-react';

interface EmergencyContactProps {
  name: string;
  role: string;
  phone: string;
  available?: boolean;
  className?: string;
}

const EmergencyContact: React.FC<EmergencyContactProps> = ({
  name,
  role,
  phone,
  available = true,
  className,
}) => {
  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phone);
    // You would usually show a toast notification here
    console.log('Phone number copied to clipboard');
  };

  return (
    <div 
      className={cn(
        'rounded-xl border border-white/10 backdrop-blur-sm transition-all',
        available ? 'bg-black/30' : 'bg-black/20',
        className
      )}
    >
      <div className="p-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-xs text-gray-400 mt-1">{role}</p>
          </div>
          <div className={cn(
            'h-3 w-3 rounded-full mt-1',
            available ? 'bg-white' : 'bg-gray-600'
          )} />
        </div>
        
        <div className="flex items-center mt-4 mb-2">
          <div className="font-mono text-sm">{phone}</div>
          <button 
            onClick={handleCopyPhone}
            className="ml-2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Copy phone number"
          >
            <Copy size={14} />
          </button>
        </div>
        
        <div className="flex space-x-2 mt-3">
          <button 
            className={cn(
              'flex items-center justify-center rounded-full py-1.5 px-4 text-sm transition-colors flex-1',
              available 
                ? 'bg-white text-black hover:bg-white/90' 
                : 'bg-white/10 text-gray-400 cursor-not-allowed'
            )}
            disabled={!available}
          >
            <Phone size={14} className="mr-1.5" />
            <span>Call</span>
          </button>
          
          <button 
            className="flex items-center justify-center rounded-full py-1.5 px-4 text-sm bg-white/10 hover:bg-white/15 transition-colors flex-1"
          >
            <MessageCircle size={14} className="mr-1.5" />
            <span>Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContact;
