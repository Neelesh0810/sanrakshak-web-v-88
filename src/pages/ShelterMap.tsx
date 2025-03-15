
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const ShelterMap = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [selectedShelter, setSelectedShelter] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 23.1636, lng: 79.9548 });
  
  // Function to get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationPermissionDenied(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermissionDenied(true);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocationPermissionDenied(true);
    }
  };
  
  // Get user location when component mounts
  useEffect(() => {
    getUserLocation();
  }, []);

  // Function to handle shelter selection and show dialog
  const handleSelectShelter = (shelter: any) => {
    setSelectedShelter(shelter);
  };
  
  // Function to show the route between user location and shelter
  const handleShowRoute = () => {
    if (!userLocation || !selectedShelter) return;
    
    setShowRoute(true);
    // Update map center to show both points
    setMapCenter({
      lat: (userLocation.lat + selectedShelter.coordinates.lat) / 2,
      lng: (userLocation.lng + selectedShelter.coordinates.lng) / 2
    });
  };
  
  // Function to center map on shelter location
  const handleShowOnMap = () => {
    if (!selectedShelter) return;
    
    setShowRoute(false);
    setMapCenter({
      lat: selectedShelter.coordinates.lat,
      lng: selectedShelter.coordinates.lng
    });
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
  
  // Create map URL for embedded iframe based on current state
  const getMapUrl = () => {
    if (showRoute && userLocation && selectedShelter) {
      // URL for directions between two points
      return `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8
      &origin=${userLocation.lat},${userLocation.lng}
      &destination=${selectedShelter.coordinates.lat},${selectedShelter.coordinates.lng}
      &mode=driving`;
    } else if (selectedShelter && !showRoute) {
      // URL for specific shelter location
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8
      &q=${selectedShelter.coordinates.lat},${selectedShelter.coordinates.lng}
      &zoom=15`;
    } else {
      // Default map view of Jabalpur area
      return "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d117756.07676855968!2d79.94600543036132!3d23.16175785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1616661901026!5m2!1sen!2sin";
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header title="Shelter Map" />
      
      <main className="pt-20 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <BackButton className="mb-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Map column - takes up 2/3 of the available space on desktop */}
            <div className="md:col-span-2">
              <div className="bg-black/20 border border-white/10 rounded-xl overflow-hidden h-[70vh]">
                <iframe 
                  src={getMapUrl()}
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
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => handleSelectShelter(shelter)}
                          size="sm" 
                          className="w-full mt-2"
                        >
                          Navigate
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Get Directions</DialogTitle>
                          <DialogDescription>
                            {shelter.name} - {shelter.address}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 py-4">
                          <div className="flex items-center gap-4">
                            <Button 
                              onClick={handleShowOnMap}
                              variant="secondary"
                              className="flex-1"
                            >
                              Show on Map
                            </Button>
                            {!locationPermissionDenied ? (
                              <Button 
                                onClick={handleShowRoute}
                                className="flex-1"
                                disabled={!userLocation}
                              >
                                <Navigation className="mr-2 h-4 w-4" />
                                Show Route
                              </Button>
                            ) : (
                              <div className="flex-1 text-sm text-yellow-500 text-center">
                                Location access denied
                              </div>
                            )}
                          </div>
                          
                          {locationPermissionDenied && (
                            <p className="text-sm text-yellow-500">
                              Location permission is denied. You can still view the shelter on the map.
                            </p>
                          )}
                          {!userLocation && !locationPermissionDenied && (
                            <p className="text-sm text-yellow-500">
                              Getting your location...
                            </p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShelterMap;
