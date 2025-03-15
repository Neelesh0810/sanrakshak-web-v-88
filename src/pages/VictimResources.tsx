
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ResourceCard from '../components/ResourceCard';
import RequestForm from '../components/RequestForm';
import VictimRequestForm from '../components/VictimRequestForm';
import { PlusCircle, Filter } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import AnimatedTransition from '@/components/AnimatedTransition';
import useResourceData, { Resource } from '@/hooks/useResourceData';
import BackButton from '@/components/BackButton';

const VictimResources = () => {
  const { resources, responses, addResource, loading } = useResourceData();
  const [showForm, setShowForm] = useState(false);
  const [showVictimForm, setShowVictimForm] = useState(false);
  const [filter, setFilter] = useState<'offer' | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [respondedRequestIds, setRespondedRequestIds] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const fetchRespondedRequests = () => {
      if (user?.id) {
        const userResponses = JSON.parse(localStorage.getItem(`responses_${user.id}`) || '[]');
        const fastLookupResponses = JSON.parse(localStorage.getItem(`responded_requests_${user.id}`) || '[]');
        
        const combinedResponses = new Set([
          ...fastLookupResponses,
          ...userResponses.map((response: any) => response.requestId)
        ]);
        
        setRespondedRequestIds(combinedResponses);
      } else {
        setRespondedRequestIds(new Set());
      }
    };
    
    fetchRespondedRequests();
    
    const handleResponseUpdate = () => {
      fetchRespondedRequests();
    };
    
    window.addEventListener('response-created', handleResponseUpdate);
    window.addEventListener('response-updated', handleResponseUpdate);
    window.addEventListener('resource-updated', handleResponseUpdate);
    
    return () => {
      window.removeEventListener('response-created', handleResponseUpdate);
      window.removeEventListener('response-updated', handleResponseUpdate);
      window.removeEventListener('resource-updated', handleResponseUpdate);
    };
  }, [user]);
  
  useEffect(() => {
    const fetchUser = () => {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    
    fetchUser();
    
    const handleAuthChange = () => {
      fetchUser();
    };
    
    window.addEventListener('auth-changed', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);
  
  const handleFormSubmit = (formData: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request resources",
      });
      return;
    }
    
    // Force type to be 'need' for victims
    formData.type = 'need';
    
    addResource({
      ...formData,
      status: 'pending'
    });
    
    setShowForm(false);
    toast({
      title: "Request Posted",
      description: "Your request has been published successfully",
    });
  };

  const handleVictimRequestSubmit = (formData: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a request",
      });
      return;
    }
    
    addResource({
      type: 'need',
      category: formData.category,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      locationDetails: formData.locationDetails,
      contact: formData.contact,
      contactName: formData.contactName,
      specialNotes: formData.specialNotes,
      urgent: formData.urgent,
      status: 'pending',
      people: formData.people,
      items: formData.items
    });
    
    setShowVictimForm(false);
    toast({
      title: "Request Submitted",
      description: "Your request has been sent to the emergency response team",
    });
  };
  
  const filteredResources = resources
    .filter(resource => resource.type === 'offer') // Only show offers that victims can request
    .filter(resource => categoryFilter === 'all' || resource.category === categoryFilter)
    .sort((a, b) => {
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return b.timestamp - a.timestamp;
    });
    
  const formatTimestamp = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  const showRequestForm = () => {
    setShowVictimForm(true);
    setShowForm(false);
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header title="Request Resources" />
      
      <AnimatedTransition>
        <main className="pt-20 pb-16 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="mb-4">
              <BackButton />
            </div>
          
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div>
                <h1 className="text-2xl font-bold mb-2">Available Resources</h1>
                <p className="text-gray-400">Request resources or submit a help request</p>
              </div>
              
              {!showForm && !showVictimForm && (
                <button
                  onClick={showRequestForm}
                  className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
                  aria-label="Request help"
                >
                  <PlusCircle size={18} />
                  <span>Request Help</span>
                </button>
              )}
            </div>
            
            {showForm ? (
              <div className="mb-8">
                <RequestForm 
                  onSubmit={handleFormSubmit} 
                  onCancel={() => setShowForm(false)}
                  userRole={user?.role} 
                />
              </div>
            ) : showVictimForm ? (
              <div className="mb-8">
                <VictimRequestForm 
                  onSubmit={handleVictimRequestSubmit} 
                  onCancel={() => setShowVictimForm(false)} 
                />
              </div>
            ) : (
              <div className="mb-6 flex flex-col sm:flex-row gap-3">
                <div className="flex items-center space-x-2">
                  <Filter size={16} className="text-gray-400" />
                  <span className="text-sm">Filter:</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3 sm:mt-0 sm:ml-4">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as string)}
                    className="bg-white/10 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                  >
                    <option value="all">All Categories</option>
                    <option value="water">Water</option>
                    <option value="shelter">Shelter</option>
                    <option value="food">Food</option>
                    <option value="supplies">Supplies</option>
                    <option value="medical">Medical</option>
                    <option value="safety">Safety</option>
                  </select>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(resource => (
                <div key={resource.id} className="relative">
                  <div className="absolute top-3 right-3 text-xs text-gray-400">
                    {formatTimestamp(resource.timestamp)}
                  </div>
                  <ResourceCard
                    type={resource.type}
                    category={resource.category}
                    title={resource.title}
                    description={resource.description}
                    location={resource.location}
                    contact={resource.contact}
                    urgent={resource.urgent}
                    requestId={resource.id}
                    isRequested={user?.id && respondedRequestIds.has(resource.id)}
                  />
                </div>
              ))}
              
              {filteredResources.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <p className="text-gray-400">No resources match your filters.</p>
                  <button
                    onClick={() => {
                      setCategoryFilter('all');
                    }}
                    className="mt-2 px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/15 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </AnimatedTransition>
    </div>
  );
};

export default VictimResources;
