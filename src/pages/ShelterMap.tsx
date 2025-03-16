
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { ArrowLeft, MapPin, Navigation, Compass, Route } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

const ShelterMap = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { toast } = useToast();
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  
  const handleGoBack = () => {
    navigate('/dashboard');
  };
  
  const handleNavigateToShelter = (shelter) => {
    setSelectedShelter(shelter);
    setDialogOpen(true);
    setShowRoute(false);
    
    toast({
      title: "Shelter Selected",
      description: `Selected ${shelter.name}`,
    });
  };

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            console.log("User location acquired:", position);
          },
          (error) => {
            console.error("Error getting location:", error);
            setLocationPermissionDenied(true);
            toast({
              title: "Location Error",
              description: "Could not access your location. Some features may be limited.",
            });
          }
        );
      } else {
        setLocationPermissionDenied(true);
        toast({
          title: "Location Not Supported",
          description: "Your browser does not support geolocation.",
        });
      }
    };
    
    getUserLocation();
  }, [toast]);

  const handleShowOnMap = () => {
    if (selectedShelter) {
      setDialogOpen(false);
      setShowRoute(false);
      
      toast({
        title: "Shelter Location",
        description: `Selected ${selectedShelter.name}`,
      });
    }
  };

  const handleShowRoute = () => {
    if (selectedShelter) {
      if (!userLocation && !locationPermissionDenied) {
        toast({
          title: "Location Required",
          description: "Your location is needed to show the route. Please enable location services.",
        });
        return;
      }
      
      setDialogOpen(false);
      setShowRoute(true);
      
      toast({
        title: "Route Displayed",
        description: userLocation 
          ? `Showing route to ${selectedShelter.name}` 
          : `Showing ${selectedShelter.name} location`,
      });
    }
  };

  const shelters = [
    {
      id: 1,
      name: "Rani Durgavati University Shelter",
      address: "Saraswati Vihar, Pachpedi, Jabalpur",
      capacity: 220,
      occupancy: 135,
      amenities: ["Food", "Water", "Medical", "Power"],
      coordinates: { lat: 23.1759, lng: 79.9821 }
    },
    {
      id: 2,
      name: "Model School Adhartal",
      address: "Adhartal, Jabalpur",
      capacity: 180,
      occupancy: 92,
      amenities: ["Food", "Water", "Power", "Pet Friendly"],
      coordinates: { lat: 23.1988, lng: 79.9409 }
    },
    {
      id: 3,
      name: "St. Aloysius College Relief Center",
      address: "Sadar, Jabalpur",
      capacity: 250,
      occupancy: 121,
      amenities: ["Food", "Water", "Medical", "Wifi"],
      coordinates: { lat: 23.1655, lng: 79.9422 }
    }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <Header title="Shelter Map" />
      
      <main className="pt-20 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <Button 
            onClick={handleGoBack}
            variant="ghost"
            className={`mb-4 flex items-center gap-1.5 ${
              isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
            }`}
            aria-label="Go back to dashboard"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="bg-black/20 border border-white/10 rounded-xl overflow-hidden h-[70vh]">
                {/* Static map visualization as fallback */}
                <div className="w-full h-full bg-black/40 flex flex-col items-center justify-center p-4">
                  <div className="flex flex-col items-center text-center text-gray-300 max-w-md">
                    <MapPin size={40} className="mb-4 text-gray-400" />
                    <h3 className="text-xl font-medium mb-2">Shelter Locations</h3>
                    <p className="mb-6">Map showing emergency shelters in Jabalpur area:</p>
                    
                    <div className="w-full space-y-4">
                      {shelters.map(shelter => (
                        <div key={shelter.id} 
                          className={`border border-white/20 rounded-lg p-3 flex items-center ${
                            selectedShelter?.id === shelter.id ? 'bg-white/20' : 'bg-black/50'
                          }`}
                        >
                          <MapPin size={20} className="mr-3 text-gray-400 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-medium">{shelter.name}</h4>
                            <p className="text-sm text-gray-400">{shelter.coordinates.lat.toFixed(4)}, {shelter.coordinates.lng.toFixed(4)}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleNavigateToShelter(shelter)}
                            className="ml-2"
                          >
                            Select
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    {selectedShelter && (
                      <div className="mt-6 w-full">
                        <h3 className="text-lg font-medium mb-2">Selected: {selectedShelter.name}</h3>
                        {showRoute && userLocation && (
                          <div className="border border-white/20 rounded-lg p-3 bg-black/30">
                            <div className="flex items-center">
                              <Route size={20} className="mr-2 text-gray-400" />
                              <p>
                                Route from your location to {selectedShelter.name} ({selectedShelter.address})
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border border-white/10 bg-black/20 rounded-xl p-4 h-[70vh] overflow-auto">
              <h2 className="text-xl font-semibold mb-4">Nearby Shelters</h2>
              
              <div className="space-y-4">
                {shelters.map(shelter => (
                  <div key={shelter.id} className="border border-white/10 bg-black/10 rounded-lg p-3 hover:bg-black/30 transition-colors">
                    <h3 className="font-medium">{shelter.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{shelter.address}</p>
                    <div className="text-xs text-gray-500 mb-2 space-y-1">
                      <p>Capacity: {shelter.capacity} people</p>
                      <p>Status: Open ({Math.round((shelter.occupancy / shelter.capacity) * 100)}% full)</p>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {shelter.amenities.map(amenity => (
                          <span key={amenity} className="inline-block px-2 py-0.5 bg-black/30 rounded-full text-gray-300">{amenity}</span>
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleNavigateToShelter(shelter)}
                      size="sm" 
                      className="w-full mt-2"
                    >
                      Navigate
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedShelter?.name || 'Shelter Details'}</DialogTitle>
            <DialogDescription>
              {selectedShelter ? (
                <div className="space-y-2 mt-1">
                  <div className="flex items-center text-sm">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    <span>{selectedShelter.address}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Compass size={16} className="mr-2 text-gray-400" />
                    <span>Capacity: {selectedShelter.capacity} people</span>
                  </div>
                  <div className="rounded-lg border p-2 mt-4 text-sm bg-background/50">
                    <span className="text-xs uppercase text-muted-foreground font-medium">Amenities</span>
                    <div className="font-medium mt-1 flex flex-wrap gap-1">
                      {selectedShelter.amenities.map(amenity => (
                        <span key={amenity} className="inline-block px-2 py-0.5 bg-black/30 rounded-full text-gray-300">{amenity}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : 'Loading shelter details...'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row pt-2">
            <Button 
              onClick={handleShowRoute}
              className="w-full flex items-center justify-center"
              variant="default"
            >
              <Route className="mr-2 h-4 w-4" />
              Show Route
            </Button>
            <Button 
              onClick={handleShowOnMap}
              className="w-full"
              variant="secondary"
            >
              <Navigation className="mr-2 h-4 w-4" />
              Show on Map
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShelterMap;
