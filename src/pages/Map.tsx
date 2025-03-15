
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import LocationFinder from '@/components/LocationFinder';
import { MapPin, Navigation, Compass } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import BackButton from '@/components/BackButton';
import { useLocation } from 'react-router-dom';

const Map = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const selectedLocationId = location.state?.selectedLocationId;
  
  // Attempt to get user location on load
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation(position);
            setIsLoading(false);
            console.log("Location acquired:", position);
            
            if (selectedLocationId) {
              toast({
                title: "Selected Location",
                description: `Navigating to location ID: ${selectedLocationId}`,
              });
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            toast({
              title: "Location Error",
              description: "Could not access your location. Please enable location services.",
            });
            setIsLoading(false);
          }
        );
      } else {
        toast({
          title: "Location Not Supported",
          description: "Your browser does not support geolocation.",
        });
        setIsLoading(false);
      }
    };
    
    // Simulate map loading
    setTimeout(() => {
      getLocation();
    }, 1500);
  }, [toast, selectedLocationId]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header title="Resource Map" />
      
      <AnimatedTransition>
        <main className="pt-20 pb-16 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="mb-4">
              <BackButton />
            </div>
          
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Emergency Resources Map</h1>
              <p className="text-gray-400">Find nearby assistance and resources</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="relative rounded-xl overflow-hidden h-[70vh] border border-white/10">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white mb-4"></div>
                        <p className="text-gray-300">Loading map and resources...</p>
                      </div>
                    </div>
                  ) : (
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d117756.07676855968!2d79.94600543036132!3d23.16175785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1616661901026!5m2!1sen!2sin" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen={true} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Emergency Resources Map"
                      className="w-full h-full"
                    />
                  )}
                  
                  {userLocation && !isLoading && (
                    <div className="absolute bottom-4 left-4 glass-dark px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2 text-white/70" />
                        <span>You are here</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 glass-dark rounded-lg overflow-hidden">
                    <div className="flex">
                      <button className="p-2 hover:bg-white/10 transition-colors">
                        <MapPin size={18} />
                      </button>
                      <button className="p-2 hover:bg-white/10 transition-colors">
                        <Navigation size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {userLocation && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-dark p-4 rounded-lg backdrop-blur-sm">
                      <h3 className="font-medium mb-2">Central Shelter</h3>
                      <p className="text-sm text-gray-400 mb-2">0.8 miles away</p>
                      <button className="w-full mt-2 bg-white/10 hover:bg-white/15 text-white py-1 px-3 rounded-lg text-sm">
                        Navigate
                      </button>
                    </div>
                    <div className="glass-dark p-4 rounded-lg backdrop-blur-sm">
                      <h3 className="font-medium mb-2">Medical Center</h3>
                      <p className="text-sm text-gray-400 mb-2">1.2 miles away</p>
                      <button className="w-full mt-2 bg-white/10 hover:bg-white/15 text-white py-1 px-3 rounded-lg text-sm">
                        Navigate
                      </button>
                    </div>
                    <div className="glass-dark p-4 rounded-lg backdrop-blur-sm">
                      <h3 className="font-medium mb-2">Water Station</h3>
                      <p className="text-sm text-gray-400 mb-2">0.5 miles away</p>
                      <button className="w-full mt-2 bg-white/10 hover:bg-white/15 text-white py-1 px-3 rounded-lg text-sm">
                        Navigate
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <LocationFinder className="h-full" />
              </div>
            </div>
          </div>
        </main>
      </AnimatedTransition>
    </div>
  );
};

export default Map;
