
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AnimatedTransition from '../components/AnimatedTransition';
import ResourceCard from '../components/ResourceCard';
import { Plus, ArrowRight, Filter } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import RequestForm from '@/components/RequestForm';

type ResourceRequest = {
  id: string;
  type: 'need' | 'offer';
  category: 'water' | 'shelter' | 'food' | 'supplies' | 'medical' | 'safety';
  title: string;
  description: string;
  location: string;
  contact?: string;
  urgent?: boolean;
  userId: string;
  username: string;
  createdAt: number;
};

const Connect = () => {
  const [requests, setRequests] = useState<ResourceRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get current user
  const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');
  
  useEffect(() => {
    // Load requests from localStorage
    const savedRequests = localStorage.getItem('resourceRequests');
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    } else {
      // Example data if none exists
      const initialRequests: ResourceRequest[] = [
        {
          id: '1',
          type: 'need',
          category: 'water',
          title: 'Clean Drinking Water',
          description: 'Urgently need bottled water for family of 4, including infant.',
          location: 'Riverside District, Block 3',
          urgent: true,
          userId: 'user1',
          username: 'Jane Doe',
          createdAt: Date.now() - 3600000
        },
        {
          id: '2',
          type: 'offer',
          category: 'shelter',
          title: 'Temporary Housing Available',
          description: 'Can accommodate up to 3 people in spare rooms. Has generator and supplies.',
          location: 'Hillcrest Area, 22 Oak Street',
          contact: '555-123-4567',
          userId: 'user2',
          username: 'Mark Johnson',
          createdAt: Date.now() - 7200000
        }
      ];
      setRequests(initialRequests);
      localStorage.setItem('resourceRequests', JSON.stringify(initialRequests));
    }
  }, []);
  
  const handleAddRequest = (newRequest: Omit<ResourceRequest, 'id' | 'userId' | 'username' | 'createdAt'>) => {
    if (!currentUser.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit requests",
      });
      navigate('/login');
      return;
    }
    
    const request: ResourceRequest = {
      ...newRequest,
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.name,
      createdAt: Date.now()
    };
    
    const updatedRequests = [request, ...requests];
    setRequests(updatedRequests);
    localStorage.setItem('resourceRequests', JSON.stringify(updatedRequests));
    
    toast({
      title: "Request Submitted",
      description: `Your ${newRequest.type === 'need' ? 'need' : 'offer'} has been posted successfully.`,
    });
    
    setShowForm(false);
  };
  
  const filteredRequests = filter === 'all' 
    ? requests 
    : filter === 'my' 
      ? requests.filter(req => req.userId === currentUser.id)
      : requests.filter(req => req.type === filter);
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Connect</h1>
              <p className="text-gray-400 mt-1">Request or offer resources</p>
            </div>
            
            <button 
              onClick={() => setShowForm(!showForm)}
              className="flex items-center px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
            >
              {showForm ? 'Cancel' : (
                <>
                  <Plus size={18} className="mr-1" />
                  <span>New Request</span>
                </>
              )}
            </button>
          </div>
          
          {showForm && (
            <AnimatedTransition className="mb-8">
              <RequestForm onSubmit={handleAddRequest} onCancel={() => setShowForm(false)} />
            </AnimatedTransition>
          )}
          
          <div className="mb-6">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  filter === 'all' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                All Requests
              </button>
              <button 
                onClick={() => setFilter('need')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  filter === 'need' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                Needs
              </button>
              <button 
                onClick={() => setFilter('offer')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  filter === 'offer' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                Offers
              </button>
              {currentUser.id && (
                <button 
                  onClick={() => setFilter('my')}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    filter === 'my' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  My Requests
                </button>
              )}
              <button 
                className="p-2 rounded-full bg-white/10 hover:bg-white/15 transition-colors"
                aria-label="Filter options"
              >
                <Filter size={18} />
              </button>
            </div>
          </div>
          
          <AnimatedTransition>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <ResourceCard
                    key={request.id}
                    type={request.type}
                    category={request.category}
                    title={request.title}
                    description={request.description}
                    location={request.location}
                    contact={request.contact}
                    urgent={request.urgent}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-gray-400 mb-4">No requests found. Be the first to add one!</p>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 transition-colors"
                  >
                    Add Request
                  </button>
                </div>
              )}
            </div>
          </AnimatedTransition>
          
          {filteredRequests.length > 6 && (
            <div className="mt-8 text-center">
              <button className="flex items-center px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 transition-colors mx-auto">
                <span className="mr-1">Load More</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-6 border-t border-white/5 backdrop-blur-sm bg-black/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <span className="text-sm text-gray-400">
                Relief Connect • Emergency Response System
              </span>
            </div>
            
            <div className="text-center md:text-right">
              <span className="text-xs text-gray-500">
                This system is for emergency use • Always follow official guidance
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Connect;
