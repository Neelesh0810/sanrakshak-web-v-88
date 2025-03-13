
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { ArrowLeft, Clock, Info, AlertTriangle, MapPin, ExternalLink, Bookmark, Share2 } from 'lucide-react';

const StatusDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock status data based on ID
  // In a real app, this would be fetched from an API
  const statusMap: { [key: string]: any } = {
    'status-1': {
      title: 'Power Restoration Progress',
      message: 'Crews are working to restore power to the eastern district. Estimated completion: 24 hours.',
      fullDescription: 'Utility crews have been deployed across the eastern district to repair downed power lines and restore service. Areas with critical infrastructure like hospitals and emergency shelters are being prioritized. Residents should prepare for at least 24 more hours without power. Charging stations have been set up at Central High School and the Community Center.',
      affectedAreas: ['East Side', 'Riverside', 'Downtown (partial)'],
      source: 'City Power & Utilities',
      sourceUrl: '#',
      timestamp: '1 hour ago',
      updated: 'June 15, 2023 - 10:25 AM',
      priority: 'high',
      coordinates: {
        lat: 34.052235,
        lng: -118.243683
      }
    },
    'status-2': {
      title: 'Road Closure Update',
      message: 'Main Street between 5th and 8th Ave remains flooded and closed to traffic. Use alternate routes.',
      fullDescription: 'Flooding has made Main Street impassable between 5th and 8th Avenue. Public Works is pumping water but the road is expected to remain closed for at least 48 hours. Traffic is being diverted to Highland Avenue and Park Street. Emergency vehicles have established alternate routes to maintain response times.',
      affectedAreas: ['Downtown', 'Business District'],
      source: 'Department of Transportation',
      sourceUrl: '#',
      timestamp: '3 hours ago',
      updated: 'June 15, 2023 - 8:15 AM',
      priority: 'medium',
      coordinates: {
        lat: 34.052235,
        lng: -118.243683
      }
    },
    'status-3': {
      title: 'Medical Supply Delivery',
      message: 'Additional medical supplies have arrived at Central Hospital and Community Clinic.',
      fullDescription: 'A shipment of critical medical supplies including insulin, antibiotics, wound care supplies, and respiratory medications has arrived at Central Hospital and Community Clinic. Patients in need of prescription refills should contact the Community Clinic. Mobile medical units are being deployed to neighborhoods with limited transportation access.',
      affectedAreas: ['Citywide'],
      source: 'Health Department',
      sourceUrl: '#',
      timestamp: '5 hours ago',
      updated: 'June 15, 2023 - 6:30 AM',
      priority: 'low',
      coordinates: {
        lat: 34.052235,
        lng: -118.243683
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
      lat: 0,
      lng: 0
    }
  };
  
  const getPriorityStyles = () => {
    switch (status.priority) {
      case 'high':
        return 'border-l-4 border-white';
      case 'medium':
        return 'border-l-4 border-gray-400';
      case 'low':
        return 'border-l-4 border-gray-700';
      default:
        return 'border-l-4 border-gray-400';
    }
  };
  
  const getPriorityIcon = () => {
    switch (status.priority) {
      case 'high':
        return <AlertTriangle size={20} className="mr-2 text-white" />;
      case 'medium':
        return <Info size={20} className="mr-2 text-gray-300" />;
      case 'low':
        return <Info size={20} className="mr-2 text-gray-500" />;
      default:
        return <Info size={20} className="mr-2 text-gray-300" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header emergency={true} />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Link to="/alerts" className="flex items-center text-gray-400 hover:text-white transition-colors mb-4">
              <ArrowLeft size={16} className="mr-2" />
              <span>Back to Alerts</span>
            </Link>
            
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {getPriorityIcon()}
                <h1 className="text-2xl font-bold">{status.title}</h1>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <Bookmark size={18} />
                </button>
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <div className={`bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden transition-all mb-6 ${getPriorityStyles()}`}>
            <div className="p-4">
              <div className="flex items-center text-sm text-gray-400 mb-4">
                <Clock size={14} className="mr-2" />
                <span>Updated: {status.updated}</span>
              </div>
              
              <p className="text-gray-200 mb-4">{status.message}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Source: {status.source}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-black/30 border border-white/10 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Detailed Information</h2>
                <p className="text-gray-300 mb-6">{status.fullDescription}</p>
                
                <h3 className="font-medium mb-2">Affected Areas</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {status.affectedAreas.map((area: string, index: number) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10"
                    >
                      {area}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center text-gray-400 mb-2">
                  <MapPin size={18} className="mr-2" />
                  <span>Location Information</span>
                </div>
                
                <div className="bg-black/40 border border-white/5 rounded-lg h-56 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <p className="text-gray-400">Map view would be displayed here</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Coordinates: {status.coordinates.lat}, {status.coordinates.lng}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Related Updates</h2>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-gray-700 bg-white/5 rounded-r-lg p-3">
                    <h3 className="font-medium">Weather Condition Update</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Heavy rain expected to continue for the next 12 hours.
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">National Weather Service</span>
                      <Link to="/alerts" className="text-xs hover:underline">View</Link>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-gray-700 bg-white/5 rounded-r-lg p-3">
                    <h3 className="font-medium">Shelter Capacity Status</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Central High School shelter at 75% capacity, Community Center at 60%.
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">Emergency Management</span>
                      <Link to="/alerts" className="text-xs hover:underline">View</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-black/30 border border-white/10 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Source Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Published by</h3>
                    <p className="text-gray-400 text-sm">{status.source}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Contact</h3>
                    <p className="text-gray-400 text-sm">Emergency Response Center</p>
                    <p className="text-gray-400 text-sm">555-555-1234</p>
                  </div>
                  
                  <a 
                    href={status.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-300 hover:text-white"
                  >
                    Visit official website
                    <ExternalLink size={14} className="ml-2" />
                  </a>
                </div>
              </div>
              
              <div className="bg-black/30 border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Actions</h2>
                
                <div className="space-y-3">
                  <Link to="/resources" className="block w-full py-2 px-4 bg-white text-black rounded-lg hover:bg-white/90 transition-colors text-center">
                    Find Related Resources
                  </Link>
                  
                  <Link to="/shelter-map" className="block w-full py-2 px-4 bg-white/10 hover:bg-white/15 rounded-lg transition-colors text-center">
                    View Shelter Map
                  </Link>
                  
                  <Link to="/emergency-plan" className="block w-full py-2 px-4 bg-white/10 hover:bg-white/15 rounded-lg transition-colors text-center">
                    Emergency Plan
                  </Link>
                </div>
                
                <div className="border-t border-white/10 mt-4 pt-4">
                  <h3 className="text-sm font-medium mb-2">Subscribe to Updates</h3>
                  <button className="w-full py-2 px-4 bg-white/10 hover:bg-white/15 rounded-lg transition-colors text-center text-sm">
                    Get Notifications
                  </button>
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
