
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
  
  // Function to handle navigation to a shelter
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
    // Get user's location when component mounts
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

  // Function to show the shelter on the map
  const handleShowOnMap = () => {
    if (selectedShelter) {
      const mapIframe = document.getElementById('shelter-map');
      if (mapIframe) {
        const newSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3668.5294410669823!2d${selectedShelter.coordinates.lng}!3d${selectedShelter.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodeURIComponent(selectedShelter.name)}!5e0!3m2!1sen!2sin!4v1616661901026!5m2!1sen!2sin`;
        mapIframe.src = newSrc;
      }
      
      setDialogOpen(false);
      setShowRoute(false);
      
      toast({
        title: "Shelter Location",
        description: `Showing ${selectedShelter.name} on the map`,
      });
    }
  };

  // Function to show the route on the map
  const handleShowRoute = () => {
    if (selectedShelter) {
      if (!userLocation && !locationPermissionDenied) {
        toast({
          title: "Location Required",
          description: "Your location is needed to show the route. Please enable location services.",
        });
        return;
      }
      
      const mapIframe = document.getElementById('shelter-map');
      if (mapIframe) {
        if (userLocation) {
          // If we have user location, create a route
          const userLat = userLocation.lat;
          const userLng = userLocation.lng;
          const destLat = selectedShelter.coordinates.lat;
          const destLng = selectedShelter.coordinates.lng;
          
          // Update iframe to show the route
          const newSrc = `https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d58696.41047349456!2d${(userLng + destLng)/2}!3d${(userLat + destLat)/2}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x0%3A0x0!2zMjPCsDAw4oCZMDAuMCJOIDc5wrAwMOKAmTAwLjAiRQ!3m2!1d${userLat}!2d${userLng}!4m5!1s0x0%3A0x0!2z${encodeURIComponent(selectedShelter.name)}!3m2!1d${destLat}!2d${destLng}!5e0!3m2!1sen!2sin!4v1616661901026!5m2!1sen!2sin`;
          mapIframe.src = newSrc;
        } else {
          // If permission denied, at least show shelter location
          const newSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3668.5294410669823!2d${selectedShelter.coordinates.lng}!3d${selectedShelter.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodeURIComponent(selectedShelter.name)}!5e0!3m2!1sen!2sin!4v1616661901026!5m2!1sen!2sin`;
          mapIframe.src = newSrc;
        }
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

  // NGO shelter data for Jabalpur
  const shelters = [
    {
      id: 1,
      name: "Anubhuti Foundation",
      address: "Civil Lines, Jabalpur",
      capacity: 120,
      occupancy: 65,
      amenities: ["Food", "Water", "Medical", "Power"],
      coordinates: { lat: 23.1636, lng: 79.9548 }
    },
    {
      id: 2,
      name: "Samarpan Seva Sansthan",
      address: "Adhartal, Jabalpur",
      capacity: 180,
      occupancy: 92,
      amenities: ["Food", "Water", "Power", "Pet Friendly"],
      coordinates: { lat: 23.1812, lng: 79.9324 }
    },
    {
      id: 3,
      name: "Jabalpur Relief Center",
      address: "Napier Town, Jabalpur",
      capacity: 250,
      occupancy: 121,
      amenities: ["Food", "Water", "Medical", "Wifi"],
      coordinates: { lat: 23.1572, lng: 79.9429 }
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
            {/* Map column - takes up 2/3 of the available space on desktop */}
            <div className="md:col-span-2">
              <div className="bg-black/20 border border-white/10 rounded-xl overflow-hidden h-[70vh]">
                <iframe 
                  id="shelter-map"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d117756.07676855968!2d79.94600543036132!3d23.16175785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1616661901026!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Emergency Shelters Map"
                  className="w-full h-full"
                />
              </div>
            </div>
            
            {/* Shelters list column - takes up 1/3 of the available space on desktop */}
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

      {/* Navigation Dialog */}
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
