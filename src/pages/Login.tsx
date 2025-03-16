
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Shield } from 'lucide-react';
import Header from '../components/Header';
import AnimatedTransition from '../components/AnimatedTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from "@/components/BackButton";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('user');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent default form submission
    e.preventDefault();
    
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    let loggedInUser;
    
    if (loginType === 'admin') {
      // For admin login, make sure to check the role as well
      loggedInUser = users.find((user: any) => 
        user.email === email && 
        user.password === password && 
        user.role === 'admin'
      );
      
      if (!loggedInUser) {
        toast({
          title: "Admin Login Failed",
          description: "Invalid admin credentials. Please check your email and password.",
        });
        return;
      }
    } else {
      // Regular user login
      loggedInUser = users.find((user: any) => user.email === email && user.password === password);
      
      if (!loggedInUser) {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please check your email and password.",
        });
        return;
      }
    }
    
    // Save authenticated user to localStorage
    localStorage.setItem('authUser', JSON.stringify(loggedInUser));
    
    toast({
      title: "Login Successful",
      description: `Welcome back, ${loggedInUser.name}!`,
    });
    
    // Get current users array
    const usersStr = localStorage.getItem('users');
    const allUsers = usersStr ? JSON.parse(usersStr) : [];
    
    // Check if this user is already in our users array
    const userExists = allUsers.some((u: any) => u.id === loggedInUser.id);
    
    if (!userExists) {
      // Add the new user to our users array with appropriate structure
      allUsers.push({
        id: loggedInUser.id,
        name: loggedInUser.name,
        role: loggedInUser.role,
        contactInfo: loggedInUser.email || loggedInUser.phone || 'No contact info',
        location: loggedInUser.location || 'Unknown location',
        lastActive: 'just now',
        skills: ['volunteer', 'ngo', 'government'].includes(loggedInUser.role) ? ['New Volunteer'] : [],
        needsHelp: loggedInUser.role === 'victim' ? ['Newly Registered'] : []
      });
      
      // Save updated users array
      localStorage.setItem('users', JSON.stringify(allUsers));
    } else {
      // Update the last active time for existing user
      const updatedUsers = allUsers.map((u: any) => {
        if (u.id === loggedInUser.id) {
          return { ...u, lastActive: 'just now' };
        }
        return u;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('auth-changed'));
    
    console.log("Login successful, redirecting to:", loggedInUser.role === 'admin' ? '/admin-dashboard' : '/dashboard');
    
    // Redirect based on user role (with replace: true to prevent back navigation to login)
    if (loggedInUser.role === 'admin') {
      navigate('/admin-dashboard', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20 pb-16 min-h-screen">
        <div className="container mx-auto px-4 max-w-md">
          <AnimatedTransition>
            <div className="relative bg-black/20 rounded-xl border border-white/10 p-8">
              <div className="absolute top-4 left-4">
                <BackButton />
              </div>
              
              <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
              
              <Tabs defaultValue="user" onValueChange={setLoginType} className="w-full mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user">User</TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center justify-center">
                    <Shield size={16} className="mr-2" />
                    Admin
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="user">
                  <div className="text-sm text-gray-400 text-center mb-4">
                    Login as a regular user (affected person, volunteer, NGO, or government)
                  </div>
                </TabsContent>
                
                <TabsContent value="admin">
                  <div className="text-sm text-gray-400 text-center mb-4">
                    Login with administrator credentials
                  </div>
                </TabsContent>
              </Tabs>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    type="email" 
                    id="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-black/30 border-white/30 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-black/30 border-white/30 text-white pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
                  {loginType === 'admin' ? 'Admin Login' : 'Login'}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-gray-300">
                  Forgot Password?
                </Link>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Don't have an account? <Link to="/signup" className="text-white hover:underline">Sign up</Link>
                </p>
              </div>
            </div>
          </AnimatedTransition>
        </div>
      </main>
      
      <footer className="py-6 border-t border-white/5 backdrop-blur-sm bg-black/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <span className="text-sm text-gray-400">
                Relief Connect • Emergency Response System
              </span>
            </div>
            
            <div className="text-center md:text-right">
              <span className="text-xs text-gray-500">
                This system is for emergency use • Always follow official guidance
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
