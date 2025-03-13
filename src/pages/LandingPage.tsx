
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Shield, CheckCircle, MapPin } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useTheme } from '../context/ThemeProvider';

const LandingPage = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();

  // Check if user is already logged in and redirect to dashboard
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

  return (
    <div className={`min-h-screen ${isLight ? 'bg-white' : 'bg-black'} text-foreground`}>
      <header className={`py-6 px-6 ${isLight ? 'bg-white' : 'bg-black'}`}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="flex items-center justify-center transform rotate-15"
                style={{ transform: 'rotate(15deg)' }}
              >
                <Shield size={28} className="text-primary font-bold" />
                <span className="font-bold text-2xl">S.</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className={`text-sm font-medium py-1.5 px-3 rounded-lg ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"} transition-colors`}
              >
                Sign in
              </Link>
              <Link 
                to="/signup" 
                className={`text-sm font-medium py-1.5 px-3 rounded-lg ${isLight ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-white/90"} transition-colors`}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <AnimatedTransition>
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary-foreground text-sm">
                  <AlertTriangle size={14} className="mr-2" />
                  <span>Emergency Response Platform</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Coordinate Relief Efforts in Disaster Situations
                </h1>
                
                <p className="text-lg md:text-xl mb-8 text-muted-foreground">
                  Connect those in need with volunteers, NGOs, and government resources during emergencies.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link 
                    to="/signup" 
                    className={`inline-flex items-center justify-center px-6 py-3 rounded-lg text-base font-medium ${isLight ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-white/90"} transition-colors`}
                  >
                    Get Started
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                  
                  <Link 
                    to="/emergency-plan" 
                    className={`inline-flex items-center justify-center px-6 py-3 rounded-lg text-base font-medium ${isLight ? "bg-white border border-gray-200 hover:bg-gray-50" : "bg-transparent border border-white/20 hover:bg-white/5"} transition-colors`}
                  >
                    Emergency Resources
                  </Link>
                </div>
              </div>
            </AnimatedTransition>
          </div>
        </section>
        
        <section className={`py-16 ${isLight ? 'bg-gray-50' : 'bg-black/40'}`}>
          <div className="container mx-auto px-4">
            <AnimatedTransition>
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                <p className="text-muted-foreground">
                  Sanrakshak connects people in need with those who can help during emergencies
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className={`p-6 rounded-xl ${isLight ? 'bg-white shadow-sm border border-gray-100' : 'bg-black/20 border border-white/10'}`}>
                  <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center ${isLight ? 'bg-primary/10' : 'bg-white/10'}`}>
                    <AlertTriangle size={20} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Report Needs</h3>
                  <p className="text-muted-foreground">
                    Those affected by disasters can quickly request assistance for food, water, shelter or medical aid.
                  </p>
                </div>
                
                <div className={`p-6 rounded-xl ${isLight ? 'bg-white shadow-sm border border-gray-100' : 'bg-black/20 border border-white/10'}`}>
                  <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center ${isLight ? 'bg-primary/10' : 'bg-white/10'}`}>
                    <CheckCircle size={20} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Coordinate Response</h3>
                  <p className="text-muted-foreground">
                    Volunteers, NGOs and government agencies can see real-time needs and coordinate effective responses.
                  </p>
                </div>
                
                <div className={`p-6 rounded-xl ${isLight ? 'bg-white shadow-sm border border-gray-100' : 'bg-black/20 border border-white/10'}`}>
                  <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center ${isLight ? 'bg-primary/10' : 'bg-white/10'}`}>
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                  <p className="text-muted-foreground">
                    Monitor the status of assistance requests and relief efforts in real-time.
                  </p>
                </div>
              </div>
            </AnimatedTransition>
          </div>
        </section>
      </main>
      
      <footer className={`py-8 ${isLight ? 'bg-white border-t border-gray-100' : 'bg-black border-t border-white/10'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div 
                  className="flex items-center justify-center transform rotate-15"
                  style={{ transform: 'rotate(15deg)' }}
                >
                  <Shield size={20} className="text-primary font-bold" />
                  <span className="font-bold text-lg">S.</span>
                </div>
                <span className="ml-2 text-sm text-muted-foreground">
                  Emergency Response Platform
                </span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Sanrakshak. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
