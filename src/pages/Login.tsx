import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import AnimatedTransition from '@/components/AnimatedTransition';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      try {
        // Verify that the stored data is valid JSON
        const parsedUser = JSON.parse(authUser);
        if (parsedUser && parsedUser.id) {
          navigate('/dashboard');
        }
      } catch (e) {
        // Clear invalid data
        console.error("Invalid authUser data:", e);
        localStorage.removeItem('authUser');
      }
    }
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
        
        // Store authenticated user in localStorage (without password)
        const authUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          profileImg: user.profileImg,
          canVolunteer: user.canVolunteer
        };
        
        localStorage.setItem('authUser', JSON.stringify(authUser));
        
        toast({
          title: "Login Successful",
          description: "Welcome back to Relief Connect",
        });
        
        // Add a delay before navigation to ensure localStorage is updated
        setTimeout(() => {
          // Trigger storage event for other tabs/components
          window.dispatchEvent(new Event('storage'));
          navigate('/dashboard');
        }, 300);
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

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatedTransition className="w-full max-w-md">
          <div className="glass-dark rounded-xl p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
              <p className="text-gray-600 dark:text-gray-400">Sign in to access your Relief Connect account</p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-white/5 border border-red-200 dark:border-white/10 rounded-lg text-sm text-red-600 dark:text-red-400">
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
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg py-3 pl-10 pr-4 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-1 focus:ring-black/20 dark:focus:ring-white/30 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg py-3 pl-10 pr-4 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-1 focus:ring-black/20 dark:focus:ring-white/30 focus:outline-none"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium py-3 flex items-center justify-center hover:bg-black/90 dark:hover:bg-white/90 transition-colors disabled:opacity-50"
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
              
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <span>Don't have an account? </span>
                <Link to="/signup" className="text-black dark:text-white hover:underline">
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
