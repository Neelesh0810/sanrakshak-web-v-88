
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { User, Mail, Edit, Clock, ArrowRight, LogOut } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface UserActivity {
  id: string;
  type: 'request' | 'response' | 'alert' | 'update';
  title: string;
  timestamp: number;
}

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      
      // Generate some sample activities for the user
      const sampleActivities: UserActivity[] = [
        {
          id: '1',
          type: 'request',
          title: 'Requested water supplies',
          timestamp: Date.now() - 86400000 * 2 // 2 days ago
        },
        {
          id: '2',
          type: 'response',
          title: 'Offered help with shelter',
          timestamp: Date.now() - 86400000 // 1 day ago
        },
        {
          id: '3',
          type: 'alert',
          title: 'Acknowledged flood warning',
          timestamp: Date.now() - 3600000 * 12 // 12 hours ago
        },
        {
          id: '4',
          type: 'update',
          title: 'Updated location status',
          timestamp: Date.now() - 3600000 * 3 // 3 hours ago
        },
      ];
      
      setActivities(sampleActivities);
    } else {
      // Redirect to login if not logged in
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your profile",
      });
      navigate('/login');
    }
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [toast, navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('authUser');
    toast({
      title: "Logged Out",
      description: "You have been signed out successfully",
    });
    navigate('/');
  };
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-white/10 h-16 w-16 mb-4"></div>
            <div className="h-4 bg-white/10 rounded w-32 mb-3"></div>
            <div className="h-3 bg-white/10 rounded w-48"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header title="Your Profile" />
      
      <AnimatedTransition>
        <main className="pt-20 pb-16 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="glass-dark border border-white/10 rounded-xl p-6 mb-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                    <User size={40} className="text-white/70" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
                    <p className="text-gray-400 flex items-center justify-center md:justify-start mt-1">
                      <Mail size={16} className="mr-2" />
                      {user?.email || 'user@example.com'}
                    </p>
                    
                    <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                        Role: {user?.role === 'victim' ? 'Disaster Victim' : 'Volunteer'}
                      </span>
                      <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                        Account ID: {user?.id || '1'}
                      </span>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                      <button className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-white/90 transition-colors">
                        <Edit size={16} />
                        <span>Edit Profile</span>
                      </button>
                      
                      <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/15 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                
                <div className="glass-dark border border-white/10 rounded-xl overflow-hidden">
                  {activities.length > 0 ? (
                    <div className="divide-y divide-white/5">
                      {activities.map((activity) => (
                        <div key={activity.id} className="p-4 hover:bg-white/5 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-gray-400 flex items-center mt-1">
                                <Clock size={14} className="mr-2" />
                                {formatTimestamp(activity.timestamp)}
                              </p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              activity.type === 'request' ? 'bg-white/20' :
                              activity.type === 'response' ? 'bg-white/30' :
                              activity.type === 'alert' ? 'bg-white/40' : 'bg-white/15'
                            }`}>
                              {activity.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-400">No activity recorded yet</p>
                    </div>
                  )}
                  
                  <div className="p-3 border-t border-white/5 bg-white/5">
                    <button className="w-full text-sm flex items-center justify-center py-1 hover:bg-white/10 rounded-lg transition-colors">
                      <span>View Full History</span>
                      <ArrowRight size={14} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-dark border border-white/10 rounded-xl p-5">
                  <h3 className="font-semibold mb-3">Your Requests</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Resources and assistance you've requested
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">3</div>
                    <button className="text-sm bg-white/10 px-3 py-1 rounded-lg hover:bg-white/15 transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
                
                <div className="glass-dark border border-white/10 rounded-xl p-5">
                  <h3 className="font-semibold mb-3">Your Responses</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Help and resources you've offered
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">1</div>
                    <button className="text-sm bg-white/10 px-3 py-1 rounded-lg hover:bg-white/15 transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </AnimatedTransition>
    </div>
  );
};

export default Profile;
