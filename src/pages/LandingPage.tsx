
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import AnimatedTransition from '@/components/AnimatedTransition';

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [localTheme, setLocalTheme] = useState<'dark' | 'light'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  // Check if user is already logged in and update state
  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      try {
        const authUser = localStorage.getItem('authUser');
        if (authUser) {
          // Verify that the stored data is valid JSON
          const parsedUser = JSON.parse(authUser);
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem('authUser');
            setUser(null);
          }
        } else {
          localStorage.removeItem('authUser'); // Ensure it's removed
          setUser(null);
        }
      } catch (e) {
        // Clear invalid data
        console.error("Invalid authUser data:", e);
        localStorage.removeItem('authUser');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-state-changed', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/signup', { replace: true });
    }
  };

  const toggleLocalTheme = () => {
    setLocalTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Apply theme only to this page's container
  const themeClass = localTheme === 'dark' ? 'dark-mode' : 'light-mode';

  return (
    <div className={`min-h-screen relative overflow-hidden ${themeClass}`}>
      <div className="absolute top-4 right-4 z-20">
        <div 
          onClick={toggleLocalTheme}
          className="cursor-pointer"
        >
          <ThemeToggle className="pointer-events-none" />
        </div>
      </div>
      
      <AnimatedTransition>
        <div className="relative min-h-screen flex flex-col">
          {/* Title Section - moved higher */}
          <div className="pt-4 pb-6 relative z-10">
            <BackgroundPaths title="Sanrakshak" />
          </div>
          
          {/* Content Section - moved higher and given more specific placement */}
          <div className="relative w-full z-10 mt-8">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-black/5 dark:bg-white/5 text-sm md:text-base font-medium">
                  <span>Emergency Response Platform</span>
                </div>
                
                <p className="text-lg md:text-xl mb-12 text-neutral-700 dark:text-neutral-300">
                  Connect those in need with volunteers, NGOs, and government resources during emergencies.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                  {isLoading ? (
                    <div className="h-12 bg-gray-100 dark:bg-white/10 animate-pulse rounded-lg w-40"></div>
                  ) : user ? (
                    <RainbowButton onClick={() => navigate('/dashboard')}>
                      Go to Dashboard
                    </RainbowButton>
                  ) : (
                    <>
                      <RainbowButton onClick={handleGetStarted}>
                        Get Started
                      </RainbowButton>
                      <Link 
                        to="/login" 
                        className="inline-flex items-center justify-center px-6 py-2 rounded-xl text-base font-medium bg-transparent border-2 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default LandingPage;
