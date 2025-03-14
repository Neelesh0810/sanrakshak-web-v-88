
import React, { useState } from 'react';
import { Share2, Bookmark, BookmarkCheck, Copy, Check, Mail, User } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from '../context/ThemeProvider';

interface StatusUpdateActionsProps {
  statusId: string;
  title: string;
  message: string;
  source: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

const StatusUpdateActions: React.FC<StatusUpdateActionsProps> = ({
  statusId,
  title,
  message,
  source,
  timestamp,
  priority
}) => {
  const [isSaved, setIsSaved] = useState(() => {
    const user = JSON.parse(localStorage.getItem('authUser') || '{}');
    if (!user.id) return false;
    
    const savedAlerts = JSON.parse(localStorage.getItem(`savedAlerts_${user.id}`) || '[]');
    return savedAlerts.some((alert: any) => alert.id === statusId);
  });
  
  const [isCopied, setIsCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const { toast } = useToast();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const handleSave = () => {
    const user = JSON.parse(localStorage.getItem('authUser') || '{}');
    if (!user.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save alerts",
      });
      return;
    }
    
    const savedAlerts = JSON.parse(localStorage.getItem(`savedAlerts_${user.id}`) || '[]');
    
    if (isSaved) {
      // Remove from saved
      const updatedAlerts = savedAlerts.filter((alert: any) => alert.id !== statusId);
      localStorage.setItem(`savedAlerts_${user.id}`, JSON.stringify(updatedAlerts));
      setIsSaved(false);
      toast({
        title: "Alert Removed",
        description: "Alert has been removed from your saved items",
      });
    } else {
      // Add to saved
      const newSavedAlert = {
        id: statusId,
        title,
        message,
        source,
        timestamp,
        priority,
        savedAt: Date.now()
      };
      
      localStorage.setItem(`savedAlerts_${user.id}`, JSON.stringify([newSavedAlert, ...savedAlerts]));
      setIsSaved(true);
      toast({
        title: "Alert Saved",
        description: "Alert has been saved to your collection",
      });
    }
    
    // Dispatch event to update other components
    window.dispatchEvent(new Event('alert-saved'));
  };
  
  const handleCopyLink = () => {
    const url = `${window.location.origin}/status/${statusId}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    
    toast({
      title: "Link Copied",
      description: "Alert link copied to clipboard",
    });
    
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailInput) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send the sharing request to a backend
    // For now, we'll simulate success
    
    toast({
      title: "Alert Shared",
      description: `Alert has been shared with ${emailInput}`,
    });
    
    setEmailInput('');
  };
  
  return (
    <div className="flex space-x-2">
      <button
        onClick={handleSave}
        className={`p-2 rounded-full transition-colors ${
          isSaved 
            ? (isLight ? 'bg-gray-200 text-gray-800' : 'bg-white/10 text-white') 
            : (isLight ? 'hover:bg-gray-100' : 'hover:bg-white/5')
        }`}
        aria-label={isSaved ? "Unsave alert" : "Save alert"}
      >
        {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </button>
      
      <Popover>
        <PopoverTrigger asChild>
          <button 
            className={`p-2 rounded-full ${isLight ? 'hover:bg-gray-100' : 'hover:bg-white/5'} transition-colors`}
            aria-label="Share alert"
          >
            <Share2 size={18} />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className={`w-72 p-0 ${isLight ? 'bg-white border-gray-200' : 'bg-black border-white/10'}`}
          align="end"
        >
          <div className="p-3 border-b border-gray-100 dark:border-white/10">
            <h3 className="font-medium">Share Alert</h3>
          </div>
          
          <div className="p-3">
            <button
              onClick={handleCopyLink}
              className={`flex items-center w-full px-3 py-2 rounded-lg text-left text-sm ${
                isLight ? 'hover:bg-gray-100' : 'hover:bg-white/5'
              } transition-colors mb-2`}
            >
              {isCopied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
              <span>Copy link</span>
            </button>
            
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/10">
              <form onSubmit={handleShare}>
                <div className="mb-3">
                  <label htmlFor="share-email" className="block text-xs mb-1">
                    Share with colleague
                  </label>
                  <div className="flex items-center">
                    <span className={`p-2 ${isLight ? 'bg-gray-100' : 'bg-white/5'} rounded-l`}>
                      <Mail size={16} />
                    </span>
                    <input
                      id="share-email"
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Email address"
                      className={`flex-1 py-2 px-3 ${
                        isLight 
                          ? 'bg-gray-100 border-gray-300 focus:ring-gray-400' 
                          : 'bg-white/5 border-white/10 focus:ring-white/30'
                      } border rounded-r outline-none focus:ring-2`}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={`w-full py-2 rounded-lg ${
                    isLight 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'bg-white text-black hover:bg-white/90'
                  } transition-colors text-sm`}
                >
                  Share Alert
                </button>
              </form>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default StatusUpdateActions;
