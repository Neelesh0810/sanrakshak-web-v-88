import React, { useState, useEffect } from 'react';
import { Users, ArrowRight, Clock, Building, Activity, FileBarChart, ChevronRight, Search } from 'lucide-react';
import UserProfile from '../UserProfile';
import StatusUpdate from '../StatusUpdate';
import AnimatedTransition from '../AnimatedTransition';
import { Link } from 'react-router-dom';
import useResourceData from '@/hooks/useResourceData';

interface NGODashboardProps {
  resourceData?: ReturnType<typeof useResourceData>;
  userFilter?: 'all' | 'volunteers' | 'ngos';
}

const NGODashboard: React.FC<NGODashboardProps> = ({ 
  resourceData,
  userFilter = 'all' 
}) => {
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = () => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        let filteredUsers = users;
        if (userFilter === 'volunteers') {
          filteredUsers = users.filter((user: any) => user.role === 'volunteer');
        } else if (userFilter === 'ngos') {
          filteredUsers = users.filter((user: any) => user.role === 'ngo');
        } else {
          filteredUsers = users.filter((user: any) => 
            user.role === 'volunteer' || user.role === 'ngo'
          );
        }
        
        setRegisteredUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setRegisteredUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
    
    const handleAuthChange = () => {
      fetchUsers();
    };
    
    window.addEventListener('auth-changed', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, [userFilter]);
  
  const ResourceRequestsSection = () => (
    <div className="bg-black/30 border border-white/10 rounded-xl p-5 mb-6">
      <h2 className="text-xl font-semibold mb-4">Resource Requests</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span>Food supplies needed:</span>
          <span className="font-medium">35 requests</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Medical assistance required:</span>
          <span className="font-medium">18 requests</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Shelter needed:</span>
          <span className="font-medium">22 requests</span>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <Link to="/resources" className="text-sm text-white flex items-center justify-center hover:underline">
            <span>View all requests</span>
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
  
  const ResourceAllocationSection = () => (
    <div className="bg-black/30 border border-white/10 rounded-xl p-5 mb-6">
      <h2 className="text-xl font-semibold mb-4">Resource Allocation</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span>Food distributed:</span>
          <span className="font-medium">28 tons</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Medical supplies used:</span>
          <span className="font-medium">1200 units</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Shelter provided:</span>
          <span className="font-medium">250 families</span>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <Link to="/allocation-stats" className="text-sm text-white flex items-center justify-center hover:underline">
            <span>View allocation statistics</span>
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
  
  const VictimSupportSection = () => (
    <div className="bg-black/30 border border-white/10 rounded-xl p-5 mb-6">
      <h2 className="text-xl font-semibold mb-4">Victim Support</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span>Victims assisted:</span>
          <span className="font-medium">450 individuals</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Counseling sessions:</span>
          <span className="font-medium">32 sessions</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Support groups:</span>
          <span className="font-medium">8 groups</span>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <Link to="/support-services" className="text-sm text-white flex items-center justify-center hover:underline">
            <span>View support services</span>
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <AnimatedTransition className="mb-6" delay={100}>
          <div className="relative overflow-hidden glass-dark rounded-xl border border-white/10 p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="flex items-center mb-2">
                  <Building size={18} className="mr-2 text-white" />
                  <h2 className="text-xl font-semibold">NGO Dashboard</h2>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Coordinate relief efforts, track resource allocation, and manage volunteers.
                </p>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock size={12} className="mr-1" />
                  <span>Last updated: just now</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link to="/resources" className="px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition-colors">
                  Manage Resources
                </Link>
                <Link to="/reports" className="px-4 py-2 rounded-full text-sm bg-white/10 hover:bg-white/15 transition-colors">
                  View Reports
                </Link>
              </div>
            </div>
          </div>
          
          <ResourceRequestsSection />
        </AnimatedTransition>
        
        <ResourceAllocationSection />
        
        <VictimSupportSection />
      </div>
      
      <div>
        <AnimatedTransition className="mb-6" delay={150}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Status Updates</h2>
            <Link to="/alerts" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
              <span className="mr-1">View All</span>
              <ArrowRight size={14} />
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
               userFilter === 'ngos' ? 'Other NGOs' : 
               'Coordination Network'}
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
                Find Partners
              </Link>
            </div>
          )}
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default NGODashboard;
