import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useToast } from "@/hooks/use-toast";
import { useTheme } from '../context/ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ActivitySummary from '@/components/profile/ActivitySummary';
import RequestsList from '@/components/profile/RequestsList';
import RoleSwitcher from '@/components/profile/RoleSwitcher';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [actingAs, setActingAs] = useState<string>('');
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({
    requestsMade: 0,
    requestsHelped: 0,
    responseReceived: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        redirectToLogin();
        return;
      }
      
      setActingAs(user.role);
      
      try {
        const allRequests = JSON.parse(localStorage.getItem('resourceRequests') || '[]');
        const userRequests = allRequests.filter((req: any) => req.userId === user.id);
        setRequests(userRequests);
        
        setStats({
          requestsMade: userRequests.filter((req: any) => req.type === 'need').length,
          requestsHelped: userRequests.filter((req: any) => req.type === 'offer').length,
          responseReceived: 0
        });
      } catch (e) {
        console.error("Error loading requests:", e);
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);
  
  const redirectToLogin = () => {
    toast({
      title: "Authentication Required",
      description: "Please sign in to view your profile",
    });
    navigate('/login');
  };

  const handleRoleSwitch = async (newRole: 'victim' | 'volunteer') => {
    if (!user || !user.canVolunteer) return;
    
    setActingAs(newRole);
    
    try {
      await updateUser({ role: newRole });
      
      toast({
        title: "Role Switched",
        description: `You are now acting as a ${newRole}`,
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to switch role:", error);
      toast({
        title: "Error",
        description: "Failed to switch role. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="animate-pulse flex flex-col items-center">
            <div className={`h-6 ${isLight ? "bg-gray-200" : "bg-white/10"} rounded w-48 mb-4`}></div>
            <div className={`h-4 ${isLight ? "bg-gray-200" : "bg-white/10"} rounded w-64 mb-3`}></div>
            <div className={`h-4 ${isLight ? "bg-gray-200" : "bg-white/10"} rounded w-32`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p className="mb-4">Please sign in to view your profile</p>
            <button 
              onClick={() => navigate('/login')}
              className={`px-4 py-2 ${isLight ? "bg-gray-100 hover:bg-gray-200" : "bg-white/10 hover:bg-white/20"} rounded-lg`}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className={isLight ? "text-gray-600 mt-1" : "text-gray-400 mt-1"}>Manage your account and view your activity</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedTransition className="md:col-span-1">
              <div className={`rounded-xl p-6 ${isLight ? "border border-gray-200 bg-white shadow-soft" : "glass-dark border border-white/10"}`}>
                <ProfileHeader user={user} isLight={isLight} />
                
                <RoleSwitcher 
                  user={user} 
                  actingAs={actingAs} 
                  onRoleSwitch={handleRoleSwitch} 
                  isLight={isLight} 
                />
                
                <ActivitySummary stats={stats} isLight={isLight} />
              </div>
            </AnimatedTransition>
            
            <AnimatedTransition className="md:col-span-2">
              <div className={`rounded-xl p-6 ${isLight ? "border border-gray-200 bg-white shadow-soft" : "glass-dark border border-white/10"}`}>
                <h2 className="text-xl font-semibold mb-4">Your Recent Activity</h2>
                <RequestsList requests={requests} isLight={isLight} />
              </div>
            </AnimatedTransition>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
