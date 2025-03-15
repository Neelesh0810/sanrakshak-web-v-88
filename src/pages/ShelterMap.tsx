
import React from 'react';
import Header from '../components/Header';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const ShelterMap = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  const handleGoBack = () => {
    navigate('/dashboard');
  };
  
  // Function to navigate to a specific location on the map
  const navigateToLocation = (lat: number, lng: number, name: string) => {
    // Open Google Maps with the specific location
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${name}`, '_blank');
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
                      onClick={() => navigateToLocation(shelter.coordinates.lat, shelter.coordinates.lng, shelter.name)}
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
    </div>
  );
};

export default ShelterMap;
