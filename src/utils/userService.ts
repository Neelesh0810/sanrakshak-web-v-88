
interface User {
  id: string;
  name: string;
  role: 'victim' | 'volunteer' | 'ngo' | 'government';
  contactInfo: string;
  location: string;
  lastActive: string;
  skills?: string[];
  needsHelp?: string[];
}

// Get all users from localStorage
export const getAllUsers = (): User[] => {
  try {
    const usersString = localStorage.getItem('users');
    if (!usersString) return [];
    return JSON.parse(usersString);
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Get current timestamp in the required format
export const getCurrentTimestamp = (): string => {
  const now = new Date();
  const minutes = Math.floor((Date.now() - now.getTime()) / 60000);
  
  if (minutes < 1) return 'just now';
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  
  return 'more than a day ago';
};

// Filter users by role
export const filterUsersByRole = (users: User[], role: 'volunteer' | 'ngo'): User[] => {
  return users.filter(user => user.role === role);
};

// Add last active information to user when they log in
export const updateUserActivityTimestamp = (userId: string): void => {
  try {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex >= 0) {
      users[userIndex].lastActive = getCurrentTimestamp();
      localStorage.setItem('users', JSON.stringify(users));
    }
  } catch (error) {
    console.error('Error updating user activity:', error);
  }
};

// Make sure our users array is initialized
export const initializeUsersIfNeeded = (): void => {
  if (!localStorage.getItem('users')) {
    // Add some default users if there are none
    const defaultUsers: User[] = [
      {
        id: 'volunteer-1',
        name: 'Sarah Johnson',
        role: 'volunteer',
        contactInfo: 'sarah.j@example.com',
        location: 'Central District',
        lastActive: '2 hours ago',
        skills: ["First Aid", "Search & Rescue", "Logistics"],
      },
      {
        id: 'ngo-1',
        name: 'Red Cross Chapter',
        role: 'ngo',
        contactInfo: 'local@redcross.org',
        location: 'Multiple Districts',
        lastActive: '30 minutes ago',
      },
      {
        id: 'volunteer-2',
        name: 'Michael Chen',
        role: 'volunteer',
        contactInfo: 'm.chen@example.com',
        location: 'North District',
        lastActive: '4 hours ago',
        skills: ["Medical", "Transportation", "Communication"],
      },
      {
        id: 'ngo-2',
        name: 'Community Relief Foundation',
        role: 'ngo',
        contactInfo: 'help@crf.org',
        location: 'South District',
        lastActive: '1 hour ago',
      }
    ];
    
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
};
