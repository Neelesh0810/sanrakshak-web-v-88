
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import AnimatedTransition from '@/components/AnimatedTransition';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      
      toast({
        title: "Reset Email Sent",
        description: "Check your inbox for password reset instructions",
      });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatedTransition className="w-full max-w-md">
          {!isSubmitted ? (
            <div className="glass-dark border border-white/10 rounded-xl p-6 sm:p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                <p className="text-gray-400">Enter your email to receive reset instructions</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
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
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-white text-black font-medium py-3 flex items-center justify-center hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">◌</span>
                      Processing...
                    </span>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>
                
                <div className="text-center">
                  <Link to="/login" className="text-sm text-gray-400 hover:text-white inline-flex items-center">
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            </div>
          ) : (
            <div className="glass-dark border border-white/10 rounded-xl p-6 sm:p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <CheckCircle size={32} className="text-white" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
              <p className="text-gray-400 mb-6">
                We've sent password reset instructions to:
                <span className="block mt-2 font-medium text-white">{email}</span>
              </p>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  If you don't see the email, check other places it might be, like your junk, spam, social, or other folders.
                </p>
                
                <div className="pt-2">
                  <Link to="/login" className="inline-flex items-center text-sm bg-white/10 px-4 py-2 rounded-lg hover:bg-white/15 transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Return to Sign In
                  </Link>
                </div>
              </div>
            </div>
          )}
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default ForgotPassword;
