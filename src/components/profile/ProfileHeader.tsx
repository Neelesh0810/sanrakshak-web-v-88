
import React from 'react';
import { User, Mail, CheckSquare, AlertTriangle, UserCheck } from 'lucide-react';
import { User as UserType } from '@/context/AuthContext';

interface ProfileHeaderProps {
  user: UserType;
  isLight: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isLight }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`w-24 h-24 rounded-full ${isLight ? "bg-gray-100" : "bg-white/10"} flex items-center justify-center mb-4`}>
        <User size={36} />
      </div>
      
      <h2 className="text-xl font-semibold">{user.name}</h2>
      <div className="flex items-center text-sm text-gray-500 mt-1">
        <Mail size={14} className="mr-1" />
        <span>{user.email}</span>
      </div>
      
      <div className={`flex items-center mt-2 ${isLight ? "bg-gray-100" : "bg-white/10"} px-3 py-1 rounded-full text-xs font-medium`}>
        {user.role === 'victim' && <AlertTriangle size={12} className="mr-1" />}
        {user.role === 'volunteer' && <UserCheck size={12} className="mr-1" />}
        {user.role === 'ngo' && <CheckSquare size={12} className="mr-1" />}
        {user.role === 'government' && <CheckSquare size={12} className="mr-1" />}
        <span className="capitalize">{user.role}</span>
      </div>
    </div>
  );
};

export default ProfileHeader;
