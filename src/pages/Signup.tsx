
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import AnimatedTransition from '@/components/AnimatedTransition';
import { Lock, Mail, User, ArrowRight, UserCheck, Building, UserCog } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('victim');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }
    
    // Check if email is already registered
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((user: any) => user.email === email.toLowerCase());
    
    if (existingUser) {
      setError('Email is already registered');
      setIsLoading(false);
      return;
    }
    
    // Store user data in localStorage
    const newUser = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      password, // In a real app, this would be hashed
      name,
      role,
      profileImg: null,
      createdAt: Date.now(),
      canVolunteer: role === 'victim' ? true : false, // Victims can also volunteer
      isActive: true
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Log the user in
    localStorage.setItem('authUser', JSON.stringify({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      profileImg: newUser.profileImg,
      canVolunteer: newUser.canVolunteer
    }));
    
    toast({
      title: "Account Created",
      description: "Welcome to Relief Connect!",
    });
    
    setIsLoading(false);
    navigate('/');
  };

  const getRoleIcon = (roleType: string) => {
    switch (roleType) {
      case 'victim':
        return <User size={16} className="mr-2" />;
      case 'volunteer':
        return <UserCheck size={16} className="mr-2" />;
      case 'ngo':
        return <Building size={16} className="mr-2" />;
      case 'government':
        return <UserCog size={16} className="mr-2" />;
      default:
        return <User size={16} className="mr-2" />;
    }
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
            
            {error && (
              <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}
            
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
                    minLength={8}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 placeholder:text-gray-500 focus:ring-1 focus:ring-white/30 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {role === 'victim' && (
                  <p className="mt-1 text-xs text-gray-400">As someone affected, you can also volunteer to help others</p>
                )}
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
