
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import LocationFinder from '@/components/LocationFinder';
import { MapPin, Navigation, Compass } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Map = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
  const { toast } = useToast();
  
  // Attempt to get user location on load
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation(position);
            setIsLoading(false);
            console.log("Location acquired:", position);
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
  }, [toast]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header title="Resource Map" />
      
      <AnimatedTransition>
        <main className="pt-20 pb-16 min-h-screen">
          <div className="container mx-auto px-4">
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
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center p-6 glass-dark rounded-xl max-w-md backdrop-blur-sm">
                        <Navigation size={48} className="mx-auto mb-4 text-white/70" />
                        <h3 className="text-xl font-semibold mb-2">Map Placeholder</h3>
                        <p className="text-gray-300 mb-4">
                          {userLocation 
                            ? "Your location has been found. In a real application, a map would be displayed here with nearby resources." 
                            : "Location services are not enabled. Please allow location access to see resources near you."}
                        </p>
                        {userLocation && (
                          <div className="text-left bg-white/5 p-3 rounded-lg text-sm mb-4">
                            <p><span className="text-gray-400">Latitude:</span> {userLocation.coords.latitude.toFixed(6)}</p>
                            <p><span className="text-gray-400">Longitude:</span> {userLocation.coords.longitude.toFixed(6)}</p>
                            <p><span className="text-gray-400">Accuracy:</span> {userLocation.coords.accuracy.toFixed(1)}m</p>
                          </div>
                        )}
                        <button 
                          className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
                          onClick={() => {
                            setIsLoading(true);
                            setTimeout(() => {
                              if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(
                                  (position) => {
                                    setUserLocation(position);
                                    setIsLoading(false);
                                    toast({
                                      title: "Location Updated",
                                      description: "Your location has been refreshed.",
                                    });
                                  },
                                  (error) => {
                                    console.error("Error getting location:", error);
                                    setIsLoading(false);
                                    toast({
                                      title: "Location Error",
                                      description: error.message,
                                    });
                                  }
                                );
                              }
                            }, 1000);
                          }}
                        >
                          <Compass size={16} className="inline-block mr-2" />
                          Refresh Location
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {userLocation && (
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
