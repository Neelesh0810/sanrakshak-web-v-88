
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Compass, Search } from 'lucide-react';

interface LocationPoint {
  id: string;
  name: string;
  type: 'shelter' | 'medical' | 'food' | 'water';
  distance: string;
  address: string;
  available: boolean;
}

interface LocationFinderProps {
  className?: string;
}

const SAMPLE_LOCATIONS: LocationPoint[] = [
  {
    id: 'loc1',
    name: 'Central Emergency Shelter',
    type: 'shelter',
    distance: '0.6 miles',
    address: '123 Main Street',
    available: true,
  },
  {
    id: 'loc2',
    name: 'Community Medical Center',
    type: 'medical',
    distance: '1.2 miles',
    address: '456 Oak Avenue',
    available: true,
  },
  {
    id: 'loc3',
    name: 'Food Distribution Point',
    type: 'food',
    distance: '0.8 miles',
    address: '789 Pine Road',
    available: true,
  },
  {
    id: 'loc4',
    name: 'Water Station Alpha',
    type: 'water',
    distance: '1.5 miles',
    address: '101 River Lane',
    available: false,
  },
];

const LocationFinder: React.FC<LocationFinderProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCurrentLocation(position);
          console.log('Location acquired:', position);
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const filteredLocations = SAMPLE_LOCATIONS.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn('glass-dark rounded-xl overflow-hidden', className)}>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Find Nearby Assistance</h2>
        
        <div className="flex mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-l-lg py-2 pl-9 pr-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>
          <button 
            onClick={handleGetLocation}
            className="flex items-center justify-center bg-white/10 hover:bg-white/15 transition-colors rounded-r-lg px-4"
            aria-label="Get current location"
          >
            <Compass size={18} />
          </button>
        </div>
        
        {currentLocation && (
          <div className="bg-white/5 rounded-lg p-2 mb-4 text-xs">
            <div className="flex items-center">
              <MapPin size={14} className="text-gray-400 mr-1" />
              <span>
                Location acquired. Showing nearby resources.
              </span>
            </div>
          </div>
        )}
        
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {filteredLocations.map(location => (
            <div 
              key={location.id}
              className={cn(
                'rounded-lg p-3 transition-all',
                location.available ? 'bg-white/5 hover:bg-white/10' : 'bg-black/20 opacity-70'
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sm">{location.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{location.address}</p>
                </div>
                <div className="bg-white/10 text-xs rounded-full px-2 py-0.5">
                  {location.distance}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <span className="capitalize text-xs px-2 py-0.5 bg-white/5 rounded-full">
                  {location.type}
                </span>
                <button 
                  className={cn(
                    'text-xs rounded-full px-3 py-1',
                    location.available
                      ? 'bg-white/10 hover:bg-white/15 transition-colors'
                      : 'bg-black/30 text-gray-500 cursor-not-allowed'
                  )}
                  disabled={!location.available}
                >
                  Navigate
                </button>
              </div>
            </div>
          ))}
          
          {filteredLocations.length === 0 && (
            <div className="text-center py-6 text-gray-400 text-sm">
              No locations found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationFinder;
