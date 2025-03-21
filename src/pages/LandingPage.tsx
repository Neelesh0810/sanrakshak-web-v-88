
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
  const [pageTheme, setPageTheme] = useState<"dark" | "light">("light");

  // Initialize page theme based on user preference or system preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('landingPageTheme') as "dark" | "light" | null;
    
    if (savedTheme) {
      setPageTheme(savedTheme);
    } else if (prefersDark) {
      setPageTheme("dark");
    }
  }, []);

  // Update local theme when pageTheme changes
  useEffect(() => {
    // Update document for just this page
    const root = document.documentElement;
    
    if (pageTheme === 'dark') {
      root.classList.add('landing-dark-mode');
    } else {
      root.classList.remove('landing-dark-mode');
    }
    
    // Save theme preference for landing page only
    localStorage.setItem('landingPageTheme', pageTheme);
  }, [pageTheme]);

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

  return (
    <div className={`min-h-screen relative overflow-hidden ${pageTheme === 'dark' ? 'bg-neutral-950' : 'bg-white'}`}>
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle theme={pageTheme} setTheme={setPageTheme} />
      </div>
      
      <AnimatedTransition>
        <div className="relative min-h-screen flex flex-col">
          {/* Title Section with reduced padding */}
          <div className="pt-4 pb-8 relative z-10">
            <BackgroundPaths title="Sanrakshak" />
          </div>
          
          {/* Content Section - moved higher */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="container mx-auto px-4 text-center mt-20">
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-black/5 dark:bg-white/5 text-sm md:text-base font-medium">
                  <span className={pageTheme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}>
                    Emergency Response Platform
                  </span>
                </div>
                
                <p className={`text-lg md:text-xl mb-12 ${pageTheme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Connect those in need with volunteers, NGOs, and government resources during emergencies.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
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
                        className={`inline-flex items-center justify-center px-6 py-2 rounded-xl text-base font-medium bg-transparent border-2 
                        ${pageTheme === 'dark' 
                          ? 'border-white/10 hover:bg-white/5 text-white' 
                          : 'border-black/10 hover:bg-black/5 text-black'} transition-colors`}
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
