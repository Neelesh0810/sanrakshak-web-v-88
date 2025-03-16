
import React, { useState, useEffect } from 'react';
import { getAllUsers, filterUsersByRole } from '../utils/userService';
import UserProfile from './UserProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, Building2 } from 'lucide-react';

const RegisteredHelpers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'volunteer' | 'ngo'>('all');
  
  useEffect(() => {
    // Load all users
    const loadUsers = () => {
      const allUsers = getAllUsers();
      
      // Only show volunteers and NGOs
      const helpers = allUsers.filter(user => 
        user.role === 'volunteer' || user.role === 'ngo'
      );
      
      setUsers(helpers);
    };
    
    loadUsers();
    
    // Refresh when users change
    window.addEventListener('users-updated', loadUsers);
    return () => {
      window.removeEventListener('users-updated', loadUsers);
    };
  }, []);
  
  const filteredUsers = filter === 'all' 
    ? users 
    : filterUsersByRole(users, filter);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Registered Helpers</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              filter === 'all' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
            }`}
          >
            All Helpers
          </button>
          <button
            onClick={() => setFilter('volunteer')}
            className={`flex items-center px-4 py-2 rounded-full text-sm transition-colors ${
              filter === 'volunteer' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
            }`}
          >
            <UserCheck size={16} className="mr-2" />
            <span>Volunteers</span>
          </button>
          <button
            onClick={() => setFilter('ngo')}
            className={`flex items-center px-4 py-2 rounded-full text-sm transition-colors ${
              filter === 'ngo' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
            }`}
          >
            <Building2 size={16} className="mr-2" />
            <span>NGOs</span>
          </button>
        </div>
      </div>
      
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <UserProfile
              key={user.id}
              userId={user.id}
              name={user.name}
              role={user.role}
              contactInfo={user.contactInfo}
              location={user.location}
              lastActive={user.lastActive}
              skills={user.skills}
              needsHelp={user.needsHelp}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No helpers found matching the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default RegisteredHelpers;
