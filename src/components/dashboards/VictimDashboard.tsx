import React, { useState, useEffect } from 'react';
import { Buildings, Map, Bell, ChevronRight, Clock, Calendar, Activity, Users, Search } from 'lucide-react';
import UserProfile from '../UserProfile';
import StatusUpdate from '../StatusUpdate';
import AnimatedTransition from '../AnimatedTransition';
import { Link } from 'react-router-dom';
import useResourceData from '@/hooks/useResourceData';

interface VictimDashboardProps {
  resourceData?: ReturnType<typeof useResourceData>;
  userFilter?: 'all' | 'volunteers' | 'ngos';
}

const VictimDashboard: React.FC<VictimDashboardProps> = ({ 
  resourceData,
  userFilter = 'all'
}) => {
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch actual registered users from localStorage
  useEffect(() => {
    const fetchUsers = () => {
      try {
        // Get all users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Filter based on user preference
        let filteredUsers = users;
        if (userFilter === 'volunteers') {
          filteredUsers = users.filter((user: any) => user.role === 'volunteer');
        } else if (userFilter === 'ngos') {
          filteredUsers = users.filter((user: any) => user.role === 'ngo');
        } else {
          // For 'all', still only show volunteers and NGOs
          filteredUsers = users.filter((user: any) => 
            user.role === 'volunteer' || user.role === 'ngo'
          );
        }
        
        setRegisteredUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        // Fallback to empty array
        setRegisteredUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
    
    // Listen for auth changes to update user list
    const handleAuthChange = () => {
      fetchUsers();
    };
    
    window.addEventListener('auth-changed', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, [userFilter]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <AnimatedTransition className="mb-6" delay={0}>
          <div className="relative overflow-hidden glass-dark rounded-xl border border-white/10 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="flex items-center mb-2">
                  <Bell size={18} className="mr-2 text-white" />
                  <h2 className="text-xl font-semibold">Emergency Alerts</h2>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Stay informed with real-time updates and important announcements.
                </p>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock size={12} className="mr-1" />
                  <span>Last updated: just now</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link to="/alerts" className="px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition-colors">
                  View All Alerts
                </Link>
                <Link to="/submit-report" className="px-4 py-2 rounded-full text-sm bg-white/10 hover:bg-white/15 transition-colors">
                  Submit Report
                </Link>
              </div>
            </div>
          </div>
        </AnimatedTransition>
        
        <AnimatedTransition className="mb-6" delay={100}>
          <div className="relative overflow-hidden glass-dark rounded-xl border border-white/10 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="flex items-center mb-2">
                  <Buildings size={18} className="mr-2 text-white" />
                  <h2 className="text-xl font-semibold">Available Resources</h2>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Find essential resources and support services in your area.
                </p>
                <div className="flex items-center text-xs text-gray-400">
                  <Map size={12} className="mr-1" />
                  <span>Current Location: City Center</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link to="/resources" className="px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition-colors">
                  Explore Resources
                </Link>
                <Link to="/connect" className="px-4 py-2 rounded-full text-sm bg-white/10 hover:bg-white/15 transition-colors">
                  Request Assistance
                </Link>
              </div>
            </div>
          </div>
        </AnimatedTransition>
        
        <AnimatedTransition delay={200}>
          <div className="relative overflow-hidden glass-dark rounded-xl border border-white/10 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="flex items-center mb-2">
                  <Calendar size={18} className="mr-2 text-white" />
                  <h2 className="text-xl font-semibold">Emergency Plan</h2>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Prepare and stay safe with a personalized emergency plan.
                </p>
                <div className="flex items-center text-xs text-gray-400">
                  <Activity size={12} className="mr-1" />
                  <span>Last updated: 2 weeks ago</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link to="/emergency-plan" className="px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition-colors">
                  View Emergency Plan
                </Link>
                <Link to="/edit-plan" className="px-4 py-2 rounded-full text-sm bg-white/10 hover:bg-white/15 transition-colors">
                  Edit Plan
                </Link>
              </div>
            </div>
          </div>
        </AnimatedTransition>
      </div>
      
      <div>
        <AnimatedTransition className="mb-6" delay={150}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Emergency Updates</h2>
            <Link to="/alerts" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
              <span className="mr-1">View All</span>
              <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="space-y-4">
            <StatusUpdate
              id="status-1"
              title="Power Restoration Progress"
              message="Crews are working to restore power to the eastern district. Estimated completion: 24 hours."
              source="City Power & Utilities"
              timestamp="1 hour ago"
              priority="high"
            />
            
            <StatusUpdate
              id="status-2"
              title="Road Closure Update"
              message="Main Street between 5th and 8th Ave remains flooded and closed to traffic. Use alternate routes."
              source="Department of Transportation"
              timestamp="3 hours ago"
              priority="medium"
            />
          </div>
        </AnimatedTransition>
        
        <AnimatedTransition delay={250}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {userFilter === 'volunteers' ? 'Volunteers' : 
               userFilter === 'ngos' ? 'NGOs' : 
               'Assistance Network'}
            </h2>
            <Link to="/connect" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
              <span className="mr-1">Connect</span>
              <ChevronRight size={16} />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              <div className="animate-pulse h-44 rounded-xl bg-white/5"></div>
              <div className="animate-pulse h-44 rounded-xl bg-white/5"></div>
            </div>
          ) : registeredUsers.length > 0 ? (
            <div className="space-y-4">
              {registeredUsers.slice(0, 3).map((user) => (
                <UserProfile
                  key={user.id}
                  userId={user.id}
                  name={user.name}
                  role={user.role}
                  contactInfo={user.phone || user.email}
                  location={user.location || 'Unknown location'}
                  lastActive="Recently"
                  skills={user.skills || ['General assistance']}
                />
              ))}
            </div>
          ) : (
            <div className="border border-white/10 rounded-xl p-4 text-center">
              <Users size={24} className="mx-auto mb-2 text-gray-400" />
              <p className="text-gray-400 mb-2">No {userFilter === 'all' ? 'users' : userFilter} registered yet</p>
              <Link to="/connect" className="text-sm bg-white/10 hover:bg-white/15 px-3 py-1 rounded inline-block">
                Find Help
              </Link>
            </div>
          )}
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default VictimDashboard;
