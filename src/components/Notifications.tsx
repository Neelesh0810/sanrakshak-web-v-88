
import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCheck, AlertTriangle, Info, MessageSquare, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NotificationDetailsDialog from './NotificationDetailsDialog';

type NotificationType = 'alert' | 'request' | 'response' | 'system' | 'update';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: number;
  read: boolean;
  link?: string;
  source?: string;
  location?: string;
}

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case 'alert':
      return <AlertTriangle size={16} className="text-white" />;
    case 'request':
      return <Package size={16} className="text-white" />;
    case 'response':
      return <MessageSquare size={16} className="text-white" />;
    case 'update':
      return <Info size={16} className="text-white" />;
    default:
      return <Bell size={16} className="text-white" />;
  }
};

const Notifications: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const user = JSON.parse(localStorage.getItem('authUser') || '{}');
  
  useEffect(() => {
    // Load notifications from localStorage or initialize with examples
    const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else if (user.id) {
      // Example notifications with enhanced details
      const initialNotifications: Notification[] = [
        {
          id: '1',
          type: 'alert',
          title: 'Weather Alert',
          message: 'Flash flood warning for your area. Move to higher ground immediately.',
          time: Date.now() - 1800000, // 30 minutes ago
          read: false,
          source: 'Weather Department',
          location: 'Jabalpur, Central Region'
        },
        {
          id: '2',
          type: 'request',
          title: 'Request Received',
          message: 'Your request for water supplies has been acknowledged.',
          time: Date.now() - 3600000, // 1 hour ago
          read: false,
          link: '/connect',
          source: 'Relief Management Center',
          location: 'Distribution Center, Jabalpur'
        },
        {
          id: '3',
          type: 'response',
          title: 'Response to Your Offer',
          message: 'Mark Johnson has responded to your shelter offer.',
          time: Date.now() - 86400000, // 1 day ago
          read: true,
          link: '/connect',
          source: 'Community Connect Portal',
          location: 'South Jabalpur'
        },
        {
          id: '4',
          type: 'update',
          title: 'Resource Update',
          message: 'New medical supplies are available at Central Hospital.',
          time: Date.now() - 43200000, // 12 hours ago
          read: false,
          link: '/resources',
          source: 'Health Department',
          location: 'Central Hospital, Jabalpur'
        }
      ];
      
      setNotifications(initialNotifications);
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(initialNotifications));
    }
  }, [user.id]);
  
  // Handle clicks outside notification panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };
  
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
  };
  
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
  };
  
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.link) {
      if (notification.link && notification.message.includes("details")) {
        // If the notification has details to show
        setSelectedNotification(notification);
        setDetailsDialogOpen(true);
      } else {
        // Direct navigation
        navigate(notification.link);
        setIsOpen(false);
      }
    }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const formatTime = (timestamp: number) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now.getTime() - notificationTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };
  
  return (
    <div className="relative" ref={notificationRef}>
      <button 
        className="p-2 rounded-full hover:bg-white/5 transition-colors focus-ring relative"
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-white text-black text-xs flex items-center justify-center rounded-full">
            {unreadCount}
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
              <h3 className="font-medium">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs flex items-center text-gray-400 hover:text-white"
                  >
                    <CheckCheck size={14} className="mr-1" />
                    Mark all as read
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <div>
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-white/5' : ''
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 ${
                          notification.type === 'alert' ? 'bg-white/20' : 'bg-white/10'
                        }`}>
                          <NotificationIcon type={notification.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                              {formatTime(notification.time)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.link && (
                            <div className="mt-1 text-xs text-gray-400">
                              Tap to view details
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-gray-400 text-sm">No notifications yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <NotificationDetailsDialog
        notification={selectedNotification}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onMarkAsRead={markAsRead}
      />
    </div>
  );
};

export default Notifications;
