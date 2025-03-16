
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { ArrowLeft, MapPin, Navigation, Compass, Route, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
  const [mapLoaded, setMapLoaded] = useState(false);
  
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
    loadDefaultMap();
  }, [toast]);

  const loadDefaultMap = () => {
    const mapIframe = document.getElementById('shelter-map');
    if (mapIframe) {
      const defaultSrc = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBtLRkfZb_SQHkRxsLYgQWs04vT1WLKNSE&center=23.1636,79.9548&zoom=13&maptype=roadmap`;
      mapIframe.setAttribute('src', defaultSrc);
      setMapLoaded(true);
    }
  };

  const handleShowOnMap = useCallback(() => {
    if (selectedShelter) {
      const mapIframe = document.getElementById('shelter-map') as HTMLIFrameElement;
      if (mapIframe) {
        const newSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBtLRkfZb_SQHkRxsLYgQWs04vT1WLKNSE&q=${selectedShelter.coordinates.lat},${selectedShelter.coordinates.lng}&zoom=15&maptype=roadmap`;
        mapIframe.src = newSrc;
      }
      
      setDialogOpen(false);
      setShowRoute(false);
      
      toast({
        title: "Shelter Location",
        description: `Showing ${selectedShelter.name} on map`,
      });
    }
  }, [selectedShelter, toast]);

  const handleShowRoute = useCallback(() => {
    if (selectedShelter && userLocation && !locationPermissionDenied) {
      const mapIframe = document.getElementById('shelter-map') as HTMLIFrameElement;
      if (mapIframe) {
        const userLat = userLocation.lat;
        const userLng = userLocation.lng;
        const destLat = selectedShelter.coordinates.lat;
        const destLng = selectedShelter.coordinates.lng;
        
        // Update iframe to show the route using the embed API
        const newSrc = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBtLRkfZb_SQHkRxsLYgQWs04vT1WLKNSE&origin=${userLat},${userLng}&destination=${destLat},${destLng}&mode=driving`;
        mapIframe.src = newSrc;
      }
      
      setDialogOpen(false);
      setShowRoute(true);
      
      toast({
        title: "Route Displayed",
        description: `Showing route to ${selectedShelter.name}`,
      });
    } else {
      toast({
        title: "Location Required",
        description: "Your location is needed to show the route. Please enable location services.",
      });
    }
  }, [selectedShelter, userLocation, locationPermissionDenied, toast]);

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
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white mb-4"></div>
                      <p className="text-gray-300">Loading map...</p>
                    </div>
                  </div>
                )}
                <iframe 
                  id="shelter-map"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shelter Map"
                  className="w-full h-full"
                  onLoad={() => setMapLoaded(true)}
                />
                
                {userLocation && mapLoaded && (
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg text-sm">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2 text-white/70" />
                      <span className="text-white">Your location is available</span>
                    </div>
                  </div>
                )}
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
              disabled={locationPermissionDenied || !userLocation}
            >
              {locationPermissionDenied || !userLocation ? (
                <Ban className="mr-2 h-4 w-4" />
              ) : (
                <Route className="mr-2 h-4 w-4" />
              )}
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
