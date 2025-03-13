import React from 'react';
import Header from '../components/Header';
import { FileText, MapPin, Shield, User, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

const EmergencyPlan = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header emergency={true} />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <BackButton className="mb-4" />
          
          <div className="mb-8">
            <div className="mb-2">
              <h1 className="text-3xl font-bold">Emergency Plan</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Hurricane Category 3 Response Plan</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-soft">
                <h2 className="text-xl font-semibold mb-4">Immediate Actions</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-gray-100 dark:bg-white/10 rounded-full p-2 mr-4 mt-1">
                      <Shield size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Seek Shelter</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                        Move to an interior room on the lowest level of your home. Stay away from windows, skylights, and glass doors.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gray-100 dark:bg-white/10 rounded-full p-2 mr-4 mt-1">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Evacuation Zones</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                        If in zones A, B, or C, evacuate immediately to designated shelters or move inland. Check the <Link to="/shelter-map" className="text-black dark:text-white underline">Shelter Map</Link> for locations.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gray-100 dark:bg-white/10 rounded-full p-2 mr-4 mt-1">
                      <User size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Communication</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                        Inform family members of your location and safety status. Use text messages to conserve battery. Check in with emergency contacts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-soft">
                <h2 className="text-xl font-semibold mb-4">Essential Supplies</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Water</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">1 gallon per person per day for at least 3 days</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Food</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Non-perishable food for at least 3 days</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Medications</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">7-day supply of medications and medical items</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Power</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Flashlights, batteries, portable chargers</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-soft">
                <h2 className="text-xl font-semibold mb-4">After the Storm</h2>
                
                <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                  <p>• Do not wade or drive through flood waters. 6 inches of water can knock you down, 12 inches can float your vehicle.</p>
                  <p>• Stay away from downed power lines and report them to the power company.</p>
                  <p>• Check for gas leaks if you smell gas or hear a blowing or hissing noise.</p>
                  <p>• Document any property damage with photographs for insurance purposes.</p>
                  <p>• Check on neighbors, especially elderly or those with special needs.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-soft">
                <div className="flex items-center space-x-2 mb-4">
                  <Zap size={18} />
                  <h2 className="text-xl font-semibold">Alerts</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="border-l-4 border-black dark:border-white bg-gray-50 dark:bg-white/5 pl-3 py-2 rounded-r">
                    <p className="text-sm font-medium">Hurricane Warning Active</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Until Thursday 8:00 PM</p>
                  </div>
                  
                  <div className="border-l-4 border-gray-500 bg-gray-50 dark:bg-white/5 pl-3 py-2 rounded-r">
                    <p className="text-sm font-medium">Flash Flood Watch</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Until Friday 6:00 AM</p>
                  </div>
                </div>
                
                <Link to="/alerts" className="flex justify-center w-full mt-4 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 py-2 rounded-lg transition-colors border border-gray-200 dark:border-white/10">
                  View All Alerts
                </Link>
              </div>
              
              <div className="bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-soft">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText size={18} />
                  <h2 className="text-xl font-semibold">Resources</h2>
                </div>
                
                <div className="space-y-3">
                  <Link to="/resources" className="block p-3 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg transition-colors border border-gray-200 dark:border-white/10">
                    <p className="text-sm font-medium">Community Resources</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Find or offer help</p>
                  </Link>
                  
                  <Link to="/map" className="block p-3 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg transition-colors border border-gray-200 dark:border-white/10">
                    <p className="text-sm font-medium">Emergency Services Map</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Locate nearby services</p>
                  </Link>
                  
                  <Link to="#" className="block p-3 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg transition-colors border border-gray-200 dark:border-white/10">
                    <p className="text-sm font-medium">Preparedness Guide</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Download PDF (1.2MB)</p>
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

export default EmergencyPlan;
