
import React, { useState, useEffect } from 'react';
import { BarChart, Building2, Users, FileText, AlertTriangle, UserCheck, Building, Filter } from 'lucide-react';
import StatusUpdate from '../StatusUpdate';
import AnimatedTransition from '../AnimatedTransition';
import { Link } from 'react-router-dom';
import useResourceData from '@/hooks/useResourceData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserProfile from '../UserProfile';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RegisteredUser {
  id: string;
  name: string;
  role: 'volunteer' | 'ngo';
  contactInfo: string;
  location: string;
  lastActive: string;
  skills?: string[];
}

const GovernmentDashboard: React.FC = () => {
  const resourceData = useResourceData();
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<RegisteredUser[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'volunteer' | 'ngo'>('all');
  const [showAllHelpers, setShowAllHelpers] = useState(false);

  // Simulate fetching registered users from local storage
  useEffect(() => {
    const fetchRegisteredUsers = () => {
      // Get stored users from localStorage
      const storedUsers = localStorage.getItem('registeredUsers');
      
      let users: RegisteredUser[] = [];
      if (storedUsers) {
        try {
          users = JSON.parse(storedUsers);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      // If no stored users, provide fallback data for demo purposes
      if (users.length === 0) {
        users = [
          {
            id: '1',
            name: 'Sarah Johnson',
            role: 'volunteer',
            contactInfo: 'sarah.j@example.com',
            location: 'Central District',
            lastActive: '2 hours ago',
            skills: ["First Aid", "Search & Rescue", "Logistics"],
          },
          {
            id: '2',
            name: 'Red Cross Chapter',
            role: 'ngo',
            contactInfo: 'local@redcross.org',
            location: 'Multiple Districts',
            lastActive: '30 minutes ago',
          },
          {
            id: '3',
            name: 'Michael Chen',
            role: 'volunteer',
            contactInfo: 'm.chen@example.com',
            location: 'North District',
            lastActive: '4 hours ago',
            skills: ["Medical", "Transportation", "Communication"],
          },
          {
            id: '4',
            name: 'Community Relief Foundation',
            role: 'ngo',
            contactInfo: 'help@crf.org',
            location: 'South District',
            lastActive: '1 hour ago',
          },
        ];
        
        // Save to localStorage for future use
        localStorage.setItem('registeredUsers', JSON.stringify(users));
      }
      
      setRegisteredUsers(users);
      setFilteredUsers(users);
    };
    
    fetchRegisteredUsers();
    
    // Setup event listener for user login/registration
    const handleUserChange = () => {
      fetchRegisteredUsers();
    };
    
    window.addEventListener('user-logged-in', handleUserChange);
    window.addEventListener('user-registered', handleUserChange);
    
    return () => {
      window.removeEventListener('user-logged-in', handleUserChange);
      window.removeEventListener('user-registered', handleUserChange);
    };
  }, []);
  
  // Filter users based on selected filter
  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredUsers(registeredUsers);
    } else {
      setFilteredUsers(registeredUsers.filter(user => user.role === selectedFilter));
    }
  }, [selectedFilter, registeredUsers]);
  
  // Function to handle connecting with a helper
  const handleConnect = (userId: string) => {
    console.log('Connecting with user:', userId);
    // Implementation could involve sending a connection request
    alert(`Connection request sent to user ${userId}`);
  };
  
  // Function to handle messaging a helper
  const handleMessage = (userId: string) => {
    console.log('Messaging user:', userId);
    // Implementation could redirect to a chat interface
    alert(`Opening chat with user ${userId}`);
  };
  
  // Calculate display users based on showAllHelpers flag
  const displayUsers = showAllHelpers 
    ? filteredUsers 
    : filteredUsers.slice(0, 4);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <AnimatedTransition>
          <div className="relative overflow-hidden rounded-xl border border-white/10 glass-dark p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="flex items-center mb-2">
                  <Building2 size={18} className="mr-2 text-white" />
                  <h2 className="text-xl font-semibold">Government Response Hub</h2>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Coordinate disaster response efforts, manage infrastructure recovery, and analyze impact assessments.
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Link to="/command-center" className="px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition-colors">
                  Command Center
                </Link>
                <Link to="/recovery-plan" className="px-4 py-2 rounded-full text-sm bg-white/10 hover:bg-white/15 transition-colors">
                  Recovery Plan
                </Link>
              </div>
            </div>
          </div>
        </AnimatedTransition>
      </div>
      
      <AnimatedTransition className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center p-4 bg-black/20 rounded-xl border border-white/10">
            <div className="bg-white/10 p-2 rounded-lg mr-4">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xs text-gray-400">Active Incidents</h3>
              <p className="text-2xl font-semibold">3</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-black/20 rounded-xl border border-white/10">
            <div className="bg-white/10 p-2 rounded-lg mr-4">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xs text-gray-400">Affected Areas</h3>
              <p className="text-2xl font-semibold">12</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-black/20 rounded-xl border border-white/10">
            <div className="bg-white/10 p-2 rounded-lg mr-4">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xs text-gray-400">People Affected</h3>
              <p className="text-2xl font-semibold">5,483</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-black/20 rounded-xl border border-white/10">
            <div className="bg-white/10 p-2 rounded-lg mr-4">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xs text-gray-400">Response Plans</h3>
              <p className="text-2xl font-semibold">7</p>
            </div>
          </div>
        </div>
      </AnimatedTransition>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatedTransition delay={100} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2" />
                Registered Volunteers and NGOs
              </CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedFilter('all')}
                  className={selectedFilter === 'all' ? 'bg-primary text-primary-foreground' : ''}
                >
                  All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedFilter('volunteer')}
                  className={selectedFilter === 'volunteer' ? 'bg-primary text-primary-foreground' : ''}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Volunteers
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedFilter('ngo')}
                  className={selectedFilter === 'ngo' ? 'bg-primary text-primary-foreground' : ''}
                >
                  <Building className="h-4 w-4 mr-1" />
                  NGOs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayUsers.map((user) => (
                  <UserProfile
                    key={user.id}
                    name={user.name}
                    role={user.role}
                    contactInfo={user.contactInfo}
                    location={user.location}
                    lastActive={user.lastActive}
                    skills={user.skills || []}
                  />
                ))}
              </div>
              
              {filteredUsers.length > 4 && !showAllHelpers && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAllHelpers(true)}
                  >
                    View All Registered Helpers ({filteredUsers.length})
                  </Button>
                </div>
              )}
              
              {showAllHelpers && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAllHelpers(false)}
                  >
                    Show Less
                  </Button>
                </div>
              )}
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-black/20 border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-sm">Connect with Helpers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {displayUsers.slice(0, 3).map((user) => (
                        <div key={`connect-${user.id}`} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-400">{user.role === 'volunteer' ? 'Volunteer' : 'NGO'}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => handleConnect(user.id)}
                          >
                            Connect
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/20 border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-sm">Message Center</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {displayUsers.slice(0, 3).map((user) => (
                        <div key={`message-${user.id}`} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-400">{user.location}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMessage(user.id)}
                          >
                            Message
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </AnimatedTransition>
        
        <div className="space-y-6">
          <AnimatedTransition delay={200}>
            <div className="bg-black/20 border border-white/10 rounded-xl p-4">
              <h3 className="text-lg font-medium mb-4">Critical Alerts</h3>
              
              <div className="space-y-3">
                <StatusUpdate
                  id="govt-status-1"
                  title="Flooding in South District"
                  message="Water levels rising. Evacuation in progress. Emergency services deployed."
                  source="Emergency Management"
                  timestamp="35 minutes ago"
                  priority="high"
                />
                
                <StatusUpdate
                  id="govt-status-2"
                  title="Bridge Structural Issues"
                  message="Highway 95 bridge showing damage. Engineers dispatched. Avoid area."
                  source="Transportation Department"
                  timestamp="2 hours ago"
                  priority="high"
                />
              </div>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={250}>
            <div className="bg-black/20 border border-white/10 rounded-xl p-4">
              <h3 className="text-lg font-medium mb-4">Agency Coordination</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Emergency Services</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Public Health</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Transportation</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Limited</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Utilities</span>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Limited</span>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        </div>
      </div>
    </div>
  );
};

export default GovernmentDashboard;
