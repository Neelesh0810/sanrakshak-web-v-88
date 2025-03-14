
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ArrowLeft, Clock, Info, AlertTriangle, MapPin, ExternalLink, Share2 } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';
import StatusUpdateActions from '@/components/StatusUpdateActions';
import { useToast } from "@/hooks/use-toast";

const StatusDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isLight = theme === 'light';
  const { toast } = useToast();
  const [subscribed, setSubscribed] = useState(false);
  
  // Get the user role to determine where the back button should go
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      const user = JSON.parse(authUser);
      setUserRole(user.role);
    }
  }, []);
  
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
  
  const handleSubscribe = () => {
    setSubscribed(true);
    toast({
      title: "Subscribed to Updates",
      description: "You will receive notifications for this alert",
    });
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
  
  // Determine back button destination based on user role
  const getBackDestination = () => {
    if (userRole === 'ngo' || userRole === 'government') {
      return '/dashboard';
    }
    return '/alerts';
  };
  
  return (
    <div className={`min-h-screen ${isLight ? "bg-white" : "bg-black"} text-foreground`}>
      <Header emergency={true} />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Link to={getBackDestination()} className={`flex items-center ${isLight ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white"} transition-colors mb-4`}>
              <ArrowLeft size={16} className="mr-2" />
              <span>{userRole === 'ngo' || userRole === 'government' ? 'Back to Dashboard' : 'Back to Alerts'}</span>
            </Link>
            
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {getPriorityIcon()}
                <h1 className="text-2xl font-bold">{status.title}</h1>
              </div>
              
              <StatusUpdateActions
                statusId={id || ''}
                title={status.title}
                message={status.message}
                source={status.source}
                timestamp={status.timestamp}
                priority={status.priority}
              />
            </div>
          </div>
          
          <div className={`${isLight ? "bg-white border border-gray-300 shadow-soft" : "bg-black/30 backdrop-blur-sm border border-white/10"} rounded-lg overflow-hidden transition-all mb-6 ${getPriorityStyles()}`}>
            <div className="p-4">
              <div className={`flex items-center text-sm ${isLight ? "text-gray-600" : "text-gray-400"} mb-4`}>
                <Clock size={14} className="mr-2" />
                <span>Updated: {status.updated}</span>
              </div>
              
              <p className={isLight ? "text-gray-800" : "text-gray-200"} mb-4>{status.message}</p>
              
              <div className="flex justify-between items-center">
                <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-500"}`}>Source: {status.source}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className={`${isLight ? "bg-white border border-gray-300 shadow-soft" : "bg-black/30 border border-white/10"} rounded-xl p-6 mb-6`}>
                <h2 className="text-xl font-semibold mb-4">Detailed Information</h2>
                <p className={isLight ? "text-gray-700" : "text-gray-300"} mb-6>{status.fullDescription}</p>
                
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
                
                <div className={`${isLight ? "bg-gray-100 border border-gray-300" : "bg-black/40 border border-white/5"} rounded-lg h-56 flex items-center justify-center mb-4`}>
                  <div className="text-center">
                    <p className={isLight ? "text-gray-700" : "text-gray-400"}>Map view would be displayed here</p>
                    <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-500"} mt-1`}>
                      Coordinates: {status.coordinates.lat}, {status.coordinates.lng}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`${isLight ? "bg-white border border-gray-300 shadow-soft" : "bg-black/30 border border-white/10"} rounded-xl p-6`}>
                <h2 className="text-xl font-semibold mb-4">Related Updates</h2>
                
                <div className="space-y-4">
                  <div className={`border-l-4 ${isLight ? "border-gray-500 bg-gray-50" : "border-gray-700 bg-white/5"} rounded-r-lg p-3`}>
                    <h3 className="font-medium">Weather Condition Update</h3>
                    <p className={`text-sm ${isLight ? "text-gray-700" : "text-gray-400"} mt-1`}>
                      Heavy rain expected to continue for the next 12 hours.
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-500"}`}>National Weather Service</span>
                      <Link to="/alerts" className="text-xs hover:underline">View</Link>
                    </div>
                  </div>
                  
                  <div className={`border-l-4 ${isLight ? "border-gray-500 bg-gray-50" : "border-gray-700 bg-white/5"} rounded-r-lg p-3`}>
                    <h3 className="font-medium">Shelter Capacity Status</h3>
                    <p className={`text-sm ${isLight ? "text-gray-700" : "text-gray-400"} mt-1`}>
                      Central High School shelter at 75% capacity, Community Center at 60%.
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-500"}`}>Emergency Management</span>
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
                    <p className={`${isLight ? "text-gray-700" : "text-gray-400"} text-sm`}>Emergency Response Center</p>
                    <p className={`${isLight ? "text-gray-700" : "text-gray-400"} text-sm`}>555-555-1234</p>
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
                
                <div className={`border-t ${isLight ? "border-gray-300" : "border-white/10"} mt-4 pt-4`}>
                  <h3 className="text-sm font-medium mb-2">Subscribe to Updates</h3>
                  <button 
                    onClick={handleSubscribe}
                    disabled={subscribed}
                    className={`w-full py-2 px-4 rounded-lg text-center text-sm ${
                      subscribed 
                        ? (isLight ? "bg-gray-100 text-gray-500" : "bg-white/5 text-gray-400")
                        : (isLight ? "bg-gray-200 hover:bg-gray-300 text-gray-800" : "bg-white/10 hover:bg-white/15")
                    } transition-colors`}
                  >
                    {subscribed ? "Notifications Enabled" : "Get Notifications"}
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
