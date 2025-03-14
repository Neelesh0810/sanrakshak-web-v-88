
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import AnimatedTransition from '@/components/AnimatedTransition';
import { Lock, Mail, ArrowRight, Shield, User } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { useTheme } from '../context/ThemeProvider';
import { Switch } from "@/components/ui/switch";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const authUser = localStorage.getItem('authUser');
      if (authUser) {
        try {
          // Verify that the stored data is valid JSON
          const parsedUser = JSON.parse(authUser);
          if (parsedUser && parsedUser.id) {
            // If admin, go to admin dashboard, otherwise regular dashboard
            if (parsedUser.role === 'admin') {
              navigate('/admin-dashboard', { replace: true });
            } else {
              navigate('/dashboard', { replace: true });
            }
          }
        } catch (e) {
          // Clear invalid data
          console.error("Invalid authUser data:", e);
          localStorage.removeItem('authUser');
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Get users from localStorage
      const usersJson = localStorage.getItem('users') || '[]';
      const users = JSON.parse(usersJson);
      
      const user = users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (user) {
        if (!user.isActive) {
          setError('Your account has been deactivated. Please contact support.');
          setIsLoading(false);
          return;
        }
        
        // For admin login, check if user has admin role
        if (isAdmin && user.role !== 'admin') {
          setError('You do not have administrator access.');
          setIsLoading(false);
          return;
        }
        
        // Store authenticated user in localStorage (without password)
        const authUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'victim', // Default to victim if no role
          profileImg: user.profileImg,
          canVolunteer: user.canVolunteer
        };
        
        // Set the user in localStorage
        localStorage.setItem('authUser', JSON.stringify(authUser));
        
        // Dispatch events only after setting localStorage
        window.dispatchEvent(new Event('auth-state-changed')); 
        window.dispatchEvent(new Event('storage'));
        
        // Display success toast
        toast({
          title: "Login Successful",
          description: `Welcome back to ${isAdmin ? 'the admin panel' : 'Relief Connect'}`,
        });
        
        // Clear form
        setEmail('');
        setPassword('');
        
        // Navigate to appropriate dashboard
        if (user.role === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error("Login error:", error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
    setError(''); // Clear any previous errors when switching modes
  };

  return (
    <div className={`min-h-screen ${isLight ? "bg-white" : "bg-black"} text-foreground flex flex-col`}>
      <div className="p-4">
        <BackButton />
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatedTransition className="w-full max-w-md">
          <div className={`${isLight ? "border border-gray-300 shadow-soft bg-white" : "glass-dark"} rounded-xl p-6 sm:p-8`}>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">
                Welcome Back
              </h1>
              <p className={isLight ? "text-gray-600" : "text-gray-400"}>
                Sign in to your Relief Connect account
              </p>
            </div>
            
            {/* User/Admin Toggle Switch */}
            <div className="flex items-center justify-center mb-6 space-x-2">
              <div className="flex items-center space-x-2">
                <User className={`${isAdmin ? "text-gray-400" : "text-primary"} w-5 h-5`} />
                <span className={`text-sm ${isAdmin ? "text-gray-400" : "text-foreground"}`}>User</span>
              </div>
              <Switch 
                checked={isAdmin}
                onCheckedChange={toggleAdminMode}
                className={`${isAdmin ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"}`}
              />
              <div className="flex items-center space-x-2">
                <Shield className={`${isAdmin ? "text-primary" : "text-gray-400"} w-5 h-5`} />
                <span className={`text-sm ${isAdmin ? "text-foreground" : "text-gray-400"}`}>Admin</span>
              </div>
            </div>
            
            {error && (
              <div className={`mb-4 p-3 ${isLight ? "bg-red-50 border border-red-200 text-red-600" : "bg-white/5 border border-white/10 text-red-400"} rounded-lg text-sm`}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className={isLight ? "text-gray-500" : "text-gray-400"} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full ${isLight ? "bg-white border-gray-300 placeholder:text-gray-400 focus:ring-gray-400" : "bg-black/40 border-white/10 placeholder:text-gray-500 focus:ring-white/30"} border rounded-lg py-3 pl-10 pr-4 focus:ring-1 focus:outline-none`}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link to="/forgot-password" className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"} hover:text-primary`}>
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className={isLight ? "text-gray-500" : "text-gray-400"} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full ${isLight ? "bg-white border-gray-300 placeholder:text-gray-400 focus:ring-gray-400" : "bg-black/40 border-white/10 placeholder:text-gray-500 focus:ring-white/30"} border rounded-lg py-3 pl-10 pr-4 focus:ring-1 focus:outline-none`}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-lg font-medium py-3 flex items-center justify-center transition-colors disabled:opacity-50 ${isLight ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-white/90"}`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">◌</span>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Sign in
                    <ArrowRight size={16} className="ml-1" />
                  </span>
                )}
              </button>
              
              <div className="text-center text-sm text-gray-400">
                <span>Don't have an account? </span>
                <Link to="/signup" className={isLight ? "text-black hover:underline" : "text-white hover:underline"}>
                  Create one
                </Link>
              </div>
            </form>
          </div>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default Login;
