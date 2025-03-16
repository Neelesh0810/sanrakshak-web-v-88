
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { Clock, Info, AlertTriangle, MapPin, ExternalLink, Bookmark, Share2, Navigation, Compass } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';
import BackButton from '../components/BackButton';
import { useToast } from '@/hooks/use-toast';

const StatusDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const { toast } = useToast();
  const isLight = theme === 'light';
  const [mapError, setMapError] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Get user location or default to Jabalpur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Jabalpur
          setUserLocation({
            lat: 23.1636,
            lng: 79.9548
          });
        }
      );
    } else {
      // Default to Jabalpur
      setUserLocation({
        lat: 23.1636,
        lng: 79.9548
      });
    }
  }, []);
  
  // Status data mapping with Jabalpur-specific locations
  const statusMap: { [key: string]: any } = {
    'status-1': {
      title: 'Power Restoration Progress',
      message: 'Crews are working to restore power to Madan Mahal and Ranjhi areas. Estimated completion: 24 hours.',
      fullDescription: 'Utility crews have been deployed across Madan Mahal and Ranjhi areas to repair downed power lines and restore service. Areas with critical infrastructure like Netaji Subhash Chandra Bose Medical College and Rani Durgavati University are being prioritized. Residents should prepare for at least 24 more hours without power. Charging stations have been set up at Model School Adhartal and the St. Aloysius College.',
      affectedAreas: ['Madan Mahal', 'Ranjhi', 'Adhartal (partial)'],
      source: 'MP Power Distribution Company',
      sourceUrl: '#',
      timestamp: '1 hour ago',
      updated: 'June 15, 2023 - 10:25 AM',
      priority: 'high',
      coordinates: {
        lat: 23.1759,
        lng: 79.9821
      }
    },
    'status-2': {
      title: 'Road Closure Update',
      message: 'Wright Town Road between Civil Lines and Napier Town remains flooded and closed to traffic. Use alternate routes.',
      fullDescription: 'Flooding has made Wright Town Road impassable between Civil Lines and Napier Town. Public Works Department is pumping water but the road is expected to remain closed for at least 48 hours. Traffic is being diverted to Ghamapur Road and Gol Bazaar. Emergency vehicles have established alternate routes to maintain response times.',
      affectedAreas: ['Wright Town', 'Civil Lines', 'Napier Town'],
      source: 'Jabalpur Municipal Corporation',
      sourceUrl: '#',
      timestamp: '3 hours ago',
      updated: 'June 15, 2023 - 8:15 AM',
      priority: 'medium',
      coordinates: {
        lat: 23.1655,
        lng: 79.9422
      }
    },
    'status-3': {
      title: 'Medical Supply Delivery',
      message: 'Additional medical supplies have arrived at Netaji Subhash Chandra Bose Medical College and Victoria Hospital.',
      fullDescription: 'A shipment of critical medical supplies including insulin, antibiotics, wound care supplies, and respiratory medications has arrived at Netaji Subhash Chandra Bose Medical College and Victoria Hospital. Patients in need of prescription refills should contact the Victoria Hospital. Mobile medical units are being deployed to neighborhoods with limited transportation access, particularly in the low-lying areas of Gwarighat and Tilwara Ghat.',
      affectedAreas: ['Jabalpur City-wide'],
      source: 'District Health Department',
      sourceUrl: '#',
      timestamp: '5 hours ago',
      updated: 'June 15, 2023 - 6:30 AM',
      priority: 'low',
      coordinates: {
        lat: 23.1839,
        lng: 79.9318
      }
    }
  };
  
  const status = statusMap[id || ''] || {
    title: 'Status Not Found',
    message: 'The requested status update could not be found.',
    fullDescription: 'No additional information available.',
    affectedAreas: ['Unknown'],
    source: 'Unknown',
    sourceUrl: '#',
    timestamp: 'Unknown',
    updated: 'Unknown',
    priority: 'medium',
    coordinates: {
      lat: 23.1636,
      lng: 79.9548
    }
  };
  
  const getPriorityStyles = () => {
    switch (status.priority) {
      case 'high':
        return isLight ? 'border-l-4 border-red-500' : 'border-l-4 border-white';
      case 'medium':
        return isLight ? 'border-l-4 border-gray-800' : 'border-l-4 border-gray-400';
      case 'low':
        return isLight ? 'border-l-4 border-gray-500' : 'border-l-4 border-gray-700';
      default:
        return isLight ? 'border-l-4 border-gray-800' : 'border-l-4 border-gray-400';
    }
  };
  
  const getPriorityIcon = () => {
    switch (status.priority) {
      case 'high':
        return <AlertTriangle size={20} className={`mr-2 ${isLight ? "text-red-500" : "text-white"}`} />;
      case 'medium':
        return <Info size={20} className={`mr-2 ${isLight ? "text-gray-800" : "text-gray-300"}`} />;
      case 'low':
        return <Info size={20} className={`mr-2 ${isLight ? "text-gray-600" : "text-gray-500"}`} />;
      default:
        return <Info size={20} className={`mr-2 ${isLight ? "text-gray-800" : "text-gray-300"}`} />;
    }
  };

  // Calculate the current user's location or use a simulated one near the event
  const calculateUserLocation = () => {
    if (userLocation) {
      return userLocation;
    }
    // If no user location, simulate one near the event (slightly offset)
    return {
      lat: status.coordinates.lat + 0.005,
      lng: status.coordinates.lng - 0.003
    };
  };

  const displayedUserLocation = calculateUserLocation();

  useEffect(() => {
    // Reset map error state when component mounts or id changes
    setMapError(false);
  }, [id]);

  // Calculate distance between two coordinates in km (haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };

  // Calculate approximate distance to display
  const distanceToEvent = userLocation 
    ? calculateDistance(userLocation.lat, userLocation.lng, status.coordinates.lat, status.coordinates.lng).toFixed(1) + "km away"
    : "Unknown distance";

  // Function to handle map load error
  const handleMapError = () => {
    setMapError(true);
    toast({
      title: "Map Error",
      description: "Unable to load the map. Please try again later.",
      variant: "destructive",
    });
  };
  
  return (
    <div className={`min-h-screen ${isLight ? "bg-white" : "bg-black"} text-foreground`}>
      <Header emergency={true} />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <BackButton className={`${isLight ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white"} transition-colors mb-4`} />
            
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {getPriorityIcon()}
                <h1 className="text-2xl font-bold">{status.title}</h1>
              </div>
              
              <div className="flex space-x-2">
                <button className={`p-2 rounded-full ${isLight ? "hover:bg-gray-100" : "hover:bg-white/10"} transition-colors`}>
                  <Bookmark size={18} />
                </button>
                <button className={`p-2 rounded-full ${isLight ? "hover:bg-gray-100" : "hover:bg-white/10"} transition-colors`}>
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <div className={`${isLight ? "bg-white border border-gray-300 shadow-soft" : "bg-black/30 border border-white/10"} rounded-lg overflow-hidden transition-all mb-6 ${getPriorityStyles()}`}>
            <div className="p-4">
              <div className={`flex items-center text-sm ${isLight ? "text-gray-600" : "text-gray-400"} mb-4`}>
                <Clock size={14} className="mr-2" />
                <span>Updated: {status.updated}</span>
              </div>
              
              <p className={`${isLight ? "text-gray-800" : "text-gray-200"} mb-4`}>{status.message}</p>
              
              <div className="flex justify-between items-center">
                <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-500"}`}>Source: {status.source}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className={`${isLight ? "bg-white border border-gray-300 shadow-soft" : "bg-black/30 border border-white/10"} rounded-xl p-6 mb-6`}>
                <h2 className="text-xl font-semibold mb-4">Detailed Information</h2>
                <p className={`${isLight ? "text-gray-700" : "text-gray-300"} mb-6`}>{status.fullDescription}</p>
                
                <h3 className="font-medium mb-2">Affected Areas</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {status.affectedAreas.map((area: string, index: number) => (
                    <span 
                      key={index} 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isLight ? "bg-gray-200" : "bg-white/10"}`}
                    >
                      {area}
                    </span>
                  ))}
                </div>
                
                <div className={`flex items-center ${isLight ? "text-gray-700" : "text-gray-400"} mb-2`}>
                  <MapPin size={18} className="mr-2" />
                  <span>Location Information</span>
                </div>
                
                {/* Map visualization with static fallback */}
                <div className={`mb-4 overflow-hidden rounded-lg border ${isLight ? "border-gray-300" : "border-white/10"} h-[250px] relative`}>
                  {mapError ? (
                    <div className={`w-full h-full flex flex-col items-center justify-center ${isLight ? "bg-gray-100" : "bg-black/40"} p-4`}>
                      <AlertTriangle className="h-8 w-8 text-orange-500 mb-2" />
                      <p className="text-sm text-center">Map could not be loaded. API key issue detected.</p>
                      
                      {/* Static map fallback */}
                      <div className="w-full mt-4 flex items-center justify-center">
                        <div className={`relative w-[80%] h-[120px] ${isLight ? "bg-blue-100" : "bg-blue-900/30"} rounded-lg overflow-hidden`}>
                          {/* Main area */}
                          <div className={`absolute top-[30%] left-[20%] w-[60%] h-[40%] ${isLight ? "bg-blue-200" : "bg-blue-800/40"} rounded`}></div>
                          
                          {/* Roads */}
                          <div className={`absolute top-[50%] left-0 w-full h-[2px] ${isLight ? "bg-gray-400" : "bg-gray-600"}`}></div>
                          <div className={`absolute top-0 left-[50%] w-[2px] h-full ${isLight ? "bg-gray-400" : "bg-gray-600"}`}></div>
                          
                          {/* Affected area */}
                          <div className={`absolute top-[40%] left-[40%] w-[20%] h-[20%] ${isLight ? "bg-red-200" : "bg-red-900/40"} rounded-full animate-pulse`}></div>
                          
                          {/* Incident location */}
                          <div className="absolute top-[45%] left-[45%] w-[10%] h-[10%] bg-red-500 rounded-full z-10"></div>
                          
                          {/* User location */}
                          <div className="absolute top-[30%] left-[60%] w-[8px] h-[8px] bg-blue-500 rounded-full z-10"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <div className="text-center p-4">
                        <div className="animate-pulse flex flex-col items-center">
                          <MapPin className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Loading map visualization...</p>
                        </div>
                        <div className="mt-4 text-xs text-gray-400">Displaying location: {status.coordinates.lat.toFixed(4)}, {status.coordinates.lng.toFixed(4)}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Map coordinates overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between z-20 pointer-events-none">
                    <div className={`px-2 py-1 rounded ${isLight ? "bg-white/90" : "bg-black/60"} text-xs backdrop-blur-sm`}>
                      {status.coordinates.lat.toFixed(4)}, {status.coordinates.lng.toFixed(4)}
                    </div>
                    <div className={`px-2 py-1 rounded ${isLight ? "bg-white/90" : "bg-black/60"} text-xs backdrop-blur-sm flex items-center`}>
                      <Navigation className="h-3 w-3 mr-1" />
                      <span>{distanceToEvent}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`${isLight ? "bg-white border border-gray-300 shadow-soft" : "bg-black/30 border border-white/10"} rounded-xl p-6`}>
                <h2 className="text-xl font-semibold mb-4">Related Updates</h2>
                
                <div className="space-y-4">
                  <div className={`border-l-4 ${isLight ? "border-gray-500 bg-gray-50" : "border-gray-700 bg-white/5"} rounded-r-lg p-3`}>
                    <h3 className="font-medium">Weather Condition Update</h3>
                    <p className={`text-sm ${isLight ? "text-gray-700" : "text-gray-400"} mt-1`}>
                      Heavy rain expected to continue for the next 12 hours across Jabalpur district.
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-500"}`}>Madhya Pradesh Meteorological Department</span>
                      <Link to="/alerts" className="text-xs hover:underline">View</Link>
                    </div>
                  </div>
                  
                  <div className={`border-l-4 ${isLight ? "border-gray-500 bg-gray-50" : "border-gray-700 bg-white/5"} rounded-r-lg p-3`}>
                    <h3 className="font-medium">Shelter Capacity Status</h3>
                    <p className={`text-sm ${isLight ? "text-gray-700" : "text-gray-400"} mt-1`}>
                      Rani Durgavati University shelter at 75% capacity, St. Aloysius College at 60%.
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-500"}`}>Jabalpur Disaster Management</span>
                      <Link to="/alerts" className="text-xs hover:underline">View</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className={`${isLight ? "bg-white border border-gray-300 shadow-soft" : "bg-black/30 border border-white/10"} rounded-xl p-6 mb-6`}>
                <h2 className="text-xl font-semibold mb-4">Source Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Published by</h3>
                    <p className={`${isLight ? "text-gray-700" : "text-gray-400"} text-sm`}>{status.source}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Contact</h3>
                    <p className={`${isLight ? "text-gray-700" : "text-gray-400"} text-sm`}>Jabalpur Emergency Response Center</p>
                    <p className={`${isLight ? "text-gray-700" : "text-gray-400"} text-sm`}>0761-2762217</p>
                  </div>
                  
                  <a 
                    href={status.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center text-sm ${isLight ? "text-gray-800 hover:text-black" : "text-gray-300 hover:text-white"}`}
                  >
                    Visit official website
                    <ExternalLink size={14} className="ml-2" />
                  </a>
                </div>
              </div>
              
              <div className={`${isLight ? "bg-white border border-gray-300 shadow-soft" : "bg-black/30 border border-white/10"} rounded-xl p-6`}>
                <h2 className="text-xl font-semibold mb-4">Actions</h2>
                
                <div className="space-y-3">
                  <Link to="/resources" className={`block w-full py-2 px-4 rounded-lg text-center ${isLight ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-white/90"} transition-colors`}>
                    Find Related Resources
                  </Link>
                  
                  <Link to="/shelter-map" className={`block w-full py-2 px-4 rounded-lg text-center ${isLight ? "bg-gray-200 hover:bg-gray-300 text-gray-800" : "bg-white/10 hover:bg-white/15"} transition-colors`}>
                    View Shelter Map
                  </Link>
                  
                  <Link to="/emergency-plan" className={`block w-full py-2 px-4 rounded-lg text-center ${isLight ? "bg-gray-200 hover:bg-gray-300 text-gray-800" : "bg-white/10 hover:bg-white/15"} transition-colors`}>
                    Emergency Plan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StatusDetails;
