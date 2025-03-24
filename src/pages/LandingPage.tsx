
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { useTheme } from '@/context/ThemeProvider';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useAuth } from '@/context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/signup', { replace: true });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white dark:bg-neutral-950">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      <AnimatedTransition>
        <div className="relative min-h-screen flex flex-col justify-center items-center">
          {/* Content Section - Centered on the page */}
          <div className="relative z-20 container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto flex flex-col items-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold mb-2 text-neutral-900 dark:text-white">Sanrakshak</h2>
              
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 text-sm md:text-base font-medium">
                <span>Emergency Response Platform</span>
              </div>
              
              <p className="text-lg md:text-xl mb-4 text-neutral-700 dark:text-neutral-300">
                Connect those in need with volunteers, NGOs, and government resources during emergencies.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 mb-8">
                {loading ? (
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
          
          {/* Animation Section - As background */}
          <div className="absolute inset-0 z-10">
            <BackgroundPaths title="" />
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default LandingPage;
