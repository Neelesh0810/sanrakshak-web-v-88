
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import { useToast } from "@/hooks/use-toast";
import RoleSwitcher from '../components/RoleSwitcher';
import { useTheme } from '../context/ThemeProvider';

const Index = () => {
  const { toast } = useToast();
  const { theme } = useTheme();
  
  useEffect(() => {
    // Welcome toast on initial load
    toast({
      title: "System Online",
      description: "Disaster response platform activated",
      duration: 3000,
    });
  }, [toast]);

  return (
    <div className={`min-h-screen bg-background text-foreground`}>
      <Header emergency={true} />
      
      <main className="pt-20 pb-16 min-h-screen">
        <Dashboard />
      </main>
      
      <footer className="py-6 border-t border-border backdrop-blur-sm bg-background/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <span className="text-sm text-muted-foreground">
                Relief Connect • Emergency Response System
              </span>
            </div>
            
            <div className="text-center md:text-right">
              <span className="text-xs text-muted-foreground">
                This system is for emergency use • Always follow official guidance
              </span>
            </div>
          </div>
        </div>
      </footer>
      
      <RoleSwitcher />
    </div>
  );
};

export default Index;
