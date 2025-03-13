
import React, { useState } from 'react';
import Header from '../components/Header';
import { Building, Users, Shield, Wifi, Fuel, PawPrint, Info, Filter, Search } from 'lucide-react';

const ShelterMap = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const toggleFilter = (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filter);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header emergency={true} />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Shelter Map</h1>
            <p className="text-gray-400 mt-1">Find nearby evacuation shelters and safe zones</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3 space-y-6">
              <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search for shelters..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Filter size={16} className="text-gray-400" />
                  <span className="text-sm font-medium">Filters</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs ${
                      activeFilter === 'pet' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
                    }`}
                    onClick={() => toggleFilter('pet')}
                  >
                    <PawPrint size={12} />
                    <span>Pet Friendly</span>
                  </button>
                  
                  <button
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs ${
                      activeFilter === 'wifi' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
                    }`}
                    onClick={() => toggleFilter('wifi')}
                  >
                    <Wifi size={12} />
                    <span>WiFi</span>
                  </button>
                  
                  <button
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs ${
                      activeFilter === 'power' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
                    }`}
                    onClick={() => toggleFilter('power')}
                  >
                    <Fuel size={12} />
                    <span>Power</span>
                  </button>
                  
                  <button
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs ${
                      activeFilter === 'medical' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
                    }`}
                    onClick={() => toggleFilter('medical')}
                  >
                    <Shield size={12} />
                    <span>Medical</span>
                  </button>
                </div>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  <ShelterItem
                    name="Central High School"
                    address="1200 Main Street"
                    capacity="350/400"
                    features={['pet', 'wifi', 'power', 'medical']}
                    distance="0.8 miles"
                    active={true}
                  />
                  
                  <ShelterItem
                    name="Community Center"
                    address="45 Oak Avenue"
                    capacity="120/200"
                    features={['wifi', 'power']}
                    distance="1.2 miles"
                  />
                  
                  <ShelterItem
                    name="Riverside Church"
                    address="78 River Road"
                    capacity="85/100"
                    features={['pet']}
                    distance="2.5 miles"
                  />
                  
                  <ShelterItem
                    name="Lincoln Elementary"
                    address="320 Park Street"
                    capacity="175/300"
                    features={['wifi', 'power', 'medical']}
                    distance="3.1 miles"
                  />
                  
                  <ShelterItem
                    name="Sports Complex"
                    address="900 Stadium Way"
                    capacity="290/500"
                    features={['pet', 'power']}
                    distance="4.7 miles"
                  />
                </div>
              </div>
              
              <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Info size={16} />
                  <h3 className="font-medium">Emergency Kit Reminder</h3>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  When evacuating to a shelter, bring essential supplies for at least 72 hours:
                </p>
                <ul className="text-xs text-gray-400 space-y-1 ml-5 list-disc">
                  <li>Medications and medical supplies</li>
                  <li>Personal hygiene items</li>
                  <li>Change of clothes</li>
                  <li>Blanket or sleeping bag</li>
                  <li>Phone charger and battery pack</li>
                  <li>Important documents in waterproof container</li>
                  <li>Pet supplies if bringing pets</li>
                </ul>
              </div>
            </div>
            
            <div className="lg:w-2/3">
              <div className="bg-black/30 border border-white/10 rounded-xl h-[600px] flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Interactive Shelter Map</h3>
                  <p className="text-sm text-gray-400 max-w-md mx-auto">
                    This would display an interactive map showing shelter locations, 
                    current location, and evacuation routes. Select a shelter from the 
                    list to see details and directions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Shelter Item Component
interface ShelterItemProps {
  name: string;
  address: string;
  capacity: string;
  features: string[];
  distance: string;
  active?: boolean;
}

const ShelterItem: React.FC<ShelterItemProps> = ({ 
  name, 
  address, 
  capacity, 
  features,
  distance,
  active = false
}) => {
  return (
    <div className={`border ${active ? 'border-white' : 'border-white/10'} rounded-lg p-3 hover:bg-white/5 transition-colors`}>
      <div className="flex justify-between">
        <h3 className="font-medium">{name}</h3>
        <div className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{distance}</div>
      </div>
      
      <p className="text-xs text-gray-400 mt-1">{address}</p>
      
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center">
          <Users size={14} className="text-gray-500 mr-1" />
          <span className="text-xs">{capacity}</span>
        </div>
        
        <div className="flex space-x-1">
          {features.includes('pet') && (
            <div className="bg-white/10 p-1 rounded-full" title="Pet Friendly">
              <PawPrint size={12} />
            </div>
          )}
          {features.includes('wifi') && (
            <div className="bg-white/10 p-1 rounded-full" title="WiFi Available">
              <Wifi size={12} />
            </div>
          )}
          {features.includes('power') && (
            <div className="bg-white/10 p-1 rounded-full" title="Power/Charging">
              <Fuel size={12} />
            </div>
          )}
          {features.includes('medical') && (
            <div className="bg-white/10 p-1 rounded-full" title="Medical Staff">
              <Shield size={12} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShelterMap;
