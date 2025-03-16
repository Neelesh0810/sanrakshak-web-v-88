
import React from 'react';
import { cn } from '@/lib/utils';
import { User, Phone, MapPin, Clock, BadgeHelp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface UserProfileProps {
  name: string;
  role: 'victim' | 'volunteer' | 'government' | 'ngo';
  contactInfo: string;
  location: string;
  lastActive: string;
  skills?: string[];
  needsHelp?: string[];
  className?: string;
  userId?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  role,
  contactInfo,
  location,
  lastActive,
  skills = [],
  needsHelp = [],
  className,
  userId = 'default-id',
}) => {
  const { toast } = useToast();
  
  const getRoleDisplay = () => {
    switch (role) {
      case 'victim':
        return { label: 'Needs Assistance', icon: BadgeHelp, bgClass: 'bg-white/10' };
      case 'volunteer':
        return { label: 'Volunteer', icon: User, bgClass: 'bg-white/10' };
      case 'government':
        return { label: 'Government', icon: Shield, bgClass: 'bg-white/10' };
      case 'ngo':
        return { label: 'NGO', icon: Shield, bgClass: 'bg-white/10' };
      default:
        return { label: 'User', icon: User, bgClass: 'bg-white/10' };
    }
  };
  
  const roleInfo = getRoleDisplay();
  const RoleIcon = roleInfo.icon;

  const handleConnect = () => {
    // Create a connection record in localStorage
    const currentUser = localStorage.getItem('authUser');
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect with others",
      });
      return;
    }

    const connections = JSON.parse(localStorage.getItem('connections') || '[]');
    const parsedUser = JSON.parse(currentUser);
    
    // Check if connection already exists
    const existingConnection = connections.find(
      (conn: any) => conn.userId === parsedUser.id && conn.connectedTo === userId
    );
    
    if (!existingConnection) {
      connections.push({
        id: `conn-${Date.now()}`,
        userId: parsedUser.id,
        connectedTo: userId,
        userName: parsedUser.name,
        connectedName: name,
        timestamp: Date.now(),
        status: 'pending'
      });
      
      localStorage.setItem('connections', JSON.stringify(connections));
      
      toast({
        title: "Connection Request Sent",
        description: `You've requested to connect with ${name}`,
      });
    } else {
      toast({
        title: "Already Connected",
        description: `You're already connected with ${name}`,
      });
    }
  };

  return (
    <div 
      className={cn(
        'rounded-xl border border-white/10 backdrop-blur-sm bg-black/30 overflow-hidden',
        className
      )}
    >
      <div className="pt-5 px-5 pb-4">
        <div className="flex items-center mb-4">
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', roleInfo.bgClass)}>
            <RoleIcon size={20} />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold">{name}</h3>
            <div className="flex items-center mt-0.5">
              <span className="text-xs bg-white/10 rounded-full px-2 py-0.5">
                {roleInfo.label}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-300">
            <Phone size={14} className="mr-2 text-gray-400" />
            <span>{contactInfo}</span>
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <MapPin size={14} className="mr-2 text-gray-400" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <Clock size={14} className="mr-2 text-gray-400" />
            <span>Last active: {lastActive}</span>
          </div>
        </div>
        
        {role === 'volunteer' && skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, index) => (
                <span key={index} className="text-xs bg-white/5 rounded-full px-2 py-0.5">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {role === 'victim' && needsHelp.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Needs Assistance With</h4>
            <div className="flex flex-wrap gap-1">
              {needsHelp.map((need, index) => (
                <span key={index} className="text-xs bg-white/5 rounded-full px-2 py-0.5">
                  {need}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2 mt-3">
          <button 
            onClick={handleConnect} 
            className="flex-1 py-1.5 rounded-full text-sm bg-white text-black font-medium hover:bg-white/90 transition-colors"
          >
            {role === 'victim' ? 'Provide Help' : 'Connect'}
          </button>
          <Link 
            to={`/chat/${userId}`} 
            className="flex-1 py-1.5 rounded-full text-sm bg-white/10 hover:bg-white/15 transition-colors text-center"
          >
            Message
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
