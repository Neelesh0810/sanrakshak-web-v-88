
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { AlertTriangle, Bell, Clock, Filter, BellOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  source: string;
  timestamp: number;
  read: boolean;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread'>('all');
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load alerts from localStorage or use sample data
    const storedAlerts = localStorage.getItem('alerts');
    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    } else {
      // Sample alerts
      const sampleAlerts: Alert[] = [
        {
          id: '1',
          title: 'Flash Flood Warning',
          message: 'Flash flood warning issued for southern areas. Avoid low-lying areas and prepare for possible evacuation.',
          severity: 'critical',
          source: 'Emergency Management Agency',
          timestamp: Date.now() - 1800000, // 30 minutes ago
          read: false
        },
        {
          id: '2',
          title: 'Medical Supply Distribution',
          message: 'Medical supplies will be distributed at Central Hospital from 2-6pm today. Bring ID.',
          severity: 'info',
          source: 'Health Department',
          timestamp: Date.now() - 7200000, // 2 hours ago
          read: false
        },
        {
          id: '3',
          title: 'Road Closure Update',
          message: 'Main Street remains closed due to debris. Use alternate routes via North Avenue.',
          severity: 'warning',
          source: 'Transportation Department',
          timestamp: Date.now() - 10800000, // 3 hours ago
          read: true
        },
        {
          id: '4',
          title: 'Power Restoration Progress',
          message: 'Power has been restored to 70% of affected areas. Estimated full restoration by tomorrow evening.',
          severity: 'info',
          source: 'Utility Company',
          timestamp: Date.now() - 14400000, // 4 hours ago
          read: true
        },
        {
          id: '5',
          title: 'Contaminated Water Advisory',
          message: 'Water may be contaminated in Zone 3. Boil water before consumption or use bottled water until further notice.',
          severity: 'critical',
          source: 'Water Authority',
          timestamp: Date.now() - 36000000, // 10 hours ago
          read: false
        }
      ];
      
      setAlerts(sampleAlerts);
      localStorage.setItem('alerts', JSON.stringify(sampleAlerts));
    }
  }, []);
  
  const markAsRead = (id: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage alerts",
      });
      return;
    }
    
    const updatedAlerts = alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    );
    
    setAlerts(updatedAlerts);
    localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
    
    toast({
      title: "Alert Updated",
      description: "Alert marked as read",
    });
  };
  
  const markAllAsRead = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage alerts",
      });
      return;
    }
    
    const updatedAlerts = alerts.map(alert => ({ ...alert, read: true }));
    setAlerts(updatedAlerts);
    localStorage.setItem('alerts', JSON.stringify(updatedAlerts));
    
    toast({
      title: "Alerts Updated",
      description: "All alerts marked as read",
    });
  };
  
  const filteredAlerts = alerts
    .filter(alert => filter === 'all' || alert.severity === filter)
    .filter(alert => readFilter === 'all' || (readFilter === 'unread' && !alert.read))
    .sort((a, b) => b.timestamp - a.timestamp);
  
  const formatTimestamp = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-white text-black';
      case 'warning':
        return 'bg-white/70 text-black';
      case 'info':
      default:
        return 'bg-white/30 text-white';
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header title="Emergency Alerts" />
      
      <AnimatedTransition>
        <main className="pt-20 pb-16 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">Emergency Alerts</h1>
                <p className="text-gray-400">Stay informed about critical situations and updates</p>
              </div>
              
              <button
                onClick={markAllAsRead}
                disabled={!user || alerts.every(alert => alert.read)}
                className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/15 transition-colors disabled:opacity-50 border border-white/10"
              >
                <Bell size={18} />
                <span>Mark All as Read</span>
              </button>
            </div>
            
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-400" />
                <span className="text-sm">Filter:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    filter === 'all' 
                      ? 'bg-white text-black' 
                      : 'bg-white/10 hover:bg-white/15 border-white/10'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('critical')}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    filter === 'critical' 
                      ? 'bg-white text-black' 
                      : 'bg-white/10 hover:bg-white/15 border-white/10'
                  }`}
                >
                  Critical
                </button>
                <button
                  onClick={() => setFilter('warning')}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    filter === 'warning' 
                      ? 'bg-white text-black' 
                      : 'bg-white/10 hover:bg-white/15 border-white/10'
                  }`}
                >
                  Warning
                </button>
                <button
                  onClick={() => setFilter('info')}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    filter === 'info' 
                      ? 'bg-white text-black' 
                      : 'bg-white/10 hover:bg-white/15 border-white/10'
                  }`}
                >
                  Info
                </button>
              </div>
              
              <div className="flex gap-2 mt-3 sm:mt-0 sm:ml-4">
                <button
                  onClick={() => setReadFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    readFilter === 'all' 
                      ? 'bg-white text-black' 
                      : 'bg-white/10 hover:bg-white/15 border-white/10'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setReadFilter('unread')}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    readFilter === 'unread' 
                      ? 'bg-white text-black' 
                      : 'bg-white/10 hover:bg-white/15 border-white/10'
                  }`}
                >
                  Unread Only
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className={`glass-dark rounded-xl p-4 transition-all relative ${!alert.read ? 'bg-white/5' : ''}`}
                >
                  {!alert.read && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></div>
                  )}
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                      <AlertTriangle size={20} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{alert.title}</h3>
                      <p className="text-gray-300 mt-1">{alert.message}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Bell size={14} className="mr-1" />
                          {alert.source}
                        </span>
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {formatTimestamp(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {!alert.read && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="self-end md:self-center bg-white/10 hover:bg-white/15 transition-colors rounded-lg px-3 py-1.5 text-sm flex items-center border border-white/10"
                      >
                        <BellOff size={14} className="mr-1" />
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {filteredAlerts.length === 0 && (
                <div className="text-center py-12 border border-white/5 rounded-xl bg-transparent shadow-none">
                  <Bell size={48} className="mx-auto mb-4 text-gray-500" />
                  <h3 className="text-xl font-semibold mb-2">No Alerts</h3>
                  <p className="text-gray-400 mb-4">There are no alerts matching your current filters.</p>
                  <button
                    onClick={() => {
                      setFilter('all');
                      setReadFilter('all');
                    }}
                    className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/15 transition-colors border border-white/10"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </AnimatedTransition>
    </div>
  );
};

export default Alerts;
