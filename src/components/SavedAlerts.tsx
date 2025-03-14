
import React, { useState, useEffect, useRef } from 'react';
import { Bookmark, X, MapPin, ExternalLink, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';

interface SavedAlert {
  id: string;
  title: string;
  message: string;
  source: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  savedAt: number;
}

const SavedAlerts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [savedAlerts, setSavedAlerts] = useState<SavedAlert[]>([]);
  const alertsRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const user = JSON.parse(localStorage.getItem('authUser') || '{}');
  
  useEffect(() => {
    // Load saved alerts from localStorage
    const loadSavedAlerts = () => {
      const userSavedAlerts = localStorage.getItem(`savedAlerts_${user.id}`);
      if (userSavedAlerts) {
        setSavedAlerts(JSON.parse(userSavedAlerts));
      }
    };
    
    loadSavedAlerts();
    
    // Listen for storage events
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === `savedAlerts_${user.id}`) {
        loadSavedAlerts();
      }
    };
    
    // Listen for custom events
    const handleAlertSaved = () => {
      loadSavedAlerts();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('alert-saved', handleAlertSaved);
    window.addEventListener('alert-removed', handleAlertSaved);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('alert-saved', handleAlertSaved);
      window.removeEventListener('alert-removed', handleAlertSaved);
    };
  }, [user.id]);
  
  // Handle clicks outside alerts panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const toggleAlerts = () => {
    setIsOpen(!isOpen);
  };
  
  const removeAlert = (id: string) => {
    const updatedAlerts = savedAlerts.filter(alert => alert.id !== id);
    setSavedAlerts(updatedAlerts);
    localStorage.setItem(`savedAlerts_${user.id}`, JSON.stringify(updatedAlerts));
    window.dispatchEvent(new Event('alert-removed'));
  };
  
  const badgeCount = savedAlerts.length;
  
  return (
    <div className="relative" ref={alertsRef}>
      <button 
        className="p-2 rounded-full hover:bg-white/5 transition-colors focus-ring relative"
        onClick={toggleAlerts}
        aria-label="Saved Alerts"
      >
        <Bookmark size={20} />
        {badgeCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-white text-black text-xs flex items-center justify-center rounded-full">
            {badgeCount}
          </span>
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-black border border-white/10 shadow-xl rounded-xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-medium">Saved Alerts</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {savedAlerts.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {savedAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 hover:bg-white/5">
                      <div className="flex justify-between items-start">
                        <Link 
                          to={`/status/${alert.id}`} 
                          className="font-medium hover:underline"
                          onClick={() => setIsOpen(false)}
                        >
                          {alert.title}
                        </Link>
                        <button 
                          onClick={() => removeAlert(alert.id)}
                          className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          <span>{alert.timestamp}</span>
                        </div>
                        <span className="text-xs">{alert.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Bookmark size={24} className="mx-auto mb-2 text-gray-500" />
                  <p className="text-gray-400">No saved alerts</p>
                  <p className="text-xs text-gray-500 mt-1">Alerts you save will appear here</p>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-white/10 bg-white/5">
              <Link 
                to="/alerts"
                className="block w-full py-2 px-3 rounded-lg text-center text-sm hover:bg-white/10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View All Alerts
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavedAlerts;
