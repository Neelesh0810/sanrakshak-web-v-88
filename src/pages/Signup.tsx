import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, KeyRound, User, Phone, MapPin } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'victim' | 'volunteer'>('victim');
  const [canVolunteer, setCanVolunteer] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate input
    if (!name || !email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
      });
      setLoading(false);
      return;
    }
    
    // Check password length
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
      });
      setLoading(false);
      return;
    }
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.find((user: any) => user.email === email)) {
      toast({
        title: "Email already exists",
        description: "Please use a different email address.",
      });
      setLoading(false);
      return;
    }
    
    // Create new user object
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      location,
      password,
      role,
      canVolunteer,
    };
    
    // Save user to localStorage
    localStorage.setItem('authUser', JSON.stringify(newUser));
    
    // Save user to users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('auth-changed'));
    
    // Show success message
    toast({
      title: "Signup successful",
      description: "You have successfully signed up.",
    });
    
    // Redirect to dashboard
    navigate('/dashboard');
    setLoading(false);
    
    const isSignupSuccessful = true;

    if (isSignupSuccessful) {
      // After successful signup
      
      // Get current users array
      const usersStr = localStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      // Add the new user to our users array with appropriate structure
      users.push({
        id: newUser.id,
        name: newUser.name,
        role: newUser.role,
        contactInfo: newUser.email || newUser.phone || 'No contact info',
        location: newUser.location || 'Unknown location',
        lastActive: 'just now',
        skills: newUser.role === 'volunteer' ? ['New Volunteer'] : [],
        needsHelp: newUser.role === 'victim' ? ['Newly Registered'] : []
      });
      
      // Save updated users array
      localStorage.setItem('users', JSON.stringify(users));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('auth-changed'));
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-4 bg-black/30 border border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-gray-400 text-center">Enter your details below to register.</CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center">
              <User size={16} className="mr-2 text-gray-400" />
              <span>Name</span>
            </Label>
            <Input 
              id="name" 
              placeholder="Enter your name" 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center">
              <Mail size={16} className="mr-2 text-gray-400" />
              <span>Email</span>
            </Label>
            <Input 
              id="email" 
              placeholder="Enter your email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center">
              <Phone size={16} className="mr-2 text-gray-400" />
              <span>Phone</span>
            </Label>
            <Input 
              id="phone" 
              placeholder="Enter your phone number" 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center">
              <MapPin size={16} className="mr-2 text-gray-400" />
              <span>Location</span>
            </Label>
            <Input 
              id="location" 
              placeholder="Enter your location" 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center">
              <KeyRound size={16} className="mr-2 text-gray-400" />
              <span>Password</span>
            </Label>
            <Input 
              id="password" 
              placeholder="Enter your password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center">
              <Input 
                type="radio" 
                name="role" 
                value="victim"
                checked={role === 'victim'}
                onChange={() => setRole('victim')}
                className="mr-2"
              />
              <span>I am affected by the disaster</span>
            </Label>
            
            <Label className="flex items-center">
              <Input 
                type="radio" 
                name="role" 
                value="volunteer"
                checked={role === 'volunteer'}
                onChange={() => setRole('volunteer')}
                className="mr-2"
              />
              <span>I want to volunteer</span>
            </Label>
          </div>
          
          {role === 'victim' && (
            <div className="space-y-2">
              <Label htmlFor="canVolunteer" className="flex items-center">
                <Checkbox 
                  id="canVolunteer"
                  checked={canVolunteer}
                  onCheckedChange={(checked) => setCanVolunteer(!!checked)}
                  className="mr-2"
                />
                <span>I can also volunteer</span>
              </Label>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button className="w-full" onClick={handleSignup} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </CardFooter>
        
        <div className="text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-white hover:underline">Log in</Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
