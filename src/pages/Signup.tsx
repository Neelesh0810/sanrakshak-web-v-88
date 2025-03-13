
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import AnimatedTransition from '@/components/AnimatedTransition';
import { Lock, Mail, User, ArrowRight, UserCheck } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('victim');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate signup
    setTimeout(() => {
      // Store user data in localStorage
      localStorage.setItem('authUser', JSON.stringify({
        id: Date.now().toString(),
        email,
        name,
        role,
        profileImg: null
      }));
      
      toast({
        title: "Account Created",
        description: "Welcome to Relief Connect!",
      });
      
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatedTransition className="w-full max-w-md">
          <div className="glass-dark border border-white/10 rounded-xl p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
              <p className="text-gray-400">Join Relief Connect and help your community</p>
            </div>
            
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 placeholder:text-gray-500 focus:ring-1 focus:ring-white/30 focus:outline-none"
                  />
                </div>
              </div>
              
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
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 placeholder:text-gray-500 focus:ring-1 focus:ring-white/30 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
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
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 placeholder:text-gray-500 focus:ring-1 focus:ring-white/30 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="role" className="text-sm font-medium">
                  I am...
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCheck size={18} className="text-gray-400" />
                  </div>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 appearance-none focus:ring-1 focus:ring-white/30 focus:outline-none"
                  >
                    <option value="victim">Someone affected by disaster</option>
                    <option value="volunteer">A volunteer</option>
                    <option value="ngo">From an NGO</option>
                    <option value="government">From a government agency</option>
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-white text-black font-medium py-3 flex items-center justify-center hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">◌</span>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Create Account
                    <ArrowRight size={16} className="ml-1" />
                  </span>
                )}
              </button>
              
              <div className="text-center text-sm text-gray-400">
                <span>Already have an account? </span>
                <Link to="/login" className="text-white hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default Signup;
