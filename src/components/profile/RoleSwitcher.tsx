
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/context/AuthContext';

interface RoleSwitcherProps {
  user: User;
  actingAs: string;
  onRoleSwitch: (role: 'victim' | 'volunteer') => void;
  isLight: boolean;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ user, actingAs, onRoleSwitch, isLight }) => {
  if (!user.canVolunteer) {
    return null;
  }
  
  const handleRoleSwitch = () => {
    const newRole = actingAs === 'victim' ? 'volunteer' : 'victim';
    onRoleSwitch(newRole as 'victim' | 'volunteer');
  };
  
  return (
    <button 
      onClick={handleRoleSwitch}
      className={`mt-4 flex items-center text-sm ${isLight ? "bg-gray-100 hover:bg-gray-200" : "bg-white/10 hover:bg-white/15"} px-3 py-2 rounded-lg transition-colors`}
    >
      <ArrowRightLeft size={14} className="mr-1.5" />
      <span>
        Switch to {actingAs === 'victim' ? 'Volunteer' : 'Victim'} Mode
      </span>
    </button>
  );
};

export default RoleSwitcher;
