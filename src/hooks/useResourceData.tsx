
import { useState, useEffect } from 'react';

// Define types for our resources
export type ResourceType = 'need' | 'offer';
export type ResourceCategory = 'water' | 'shelter' | 'food' | 'supplies' | 'medical' | 'safety';
export type ResourceStatus = 'pending' | 'addressing' | 'resolved';

export interface Resource {
  id: string;
  type: ResourceType;
  category: ResourceCategory;
  title: string;
  description: string;
  location: string;
  locationDetails?: string;
  contact?: string;
  contactName?: string;
  specialNotes?: string;
  urgent?: boolean;
  timestamp: number;
  status?: ResourceStatus;
  assignedTo?: string;
  people?: number;
  userId?: string;
  username?: string;
  items?: Array<{name: string, quantity: number}>;
}

export interface ResourceResponse {
  id: string;
  requestId: string;
  type: 'offer' | 'request';
  category: ResourceCategory;
  title: string;
  time: number;
  status: 'pending' | 'accepted' | 'rejected';
}

const useResourceData = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [responses, setResponses] = useState<ResourceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<string>('Jabalpur');

  // Get user's location for dummy data
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // For demo purposes, we'll still use Jabalpur locations but could use real location data
            setUserLocation('Jabalpur');
          },
          (error) => {
            console.log("Location permission denied or error, using default location");
            setUserLocation('Jabalpur');
          }
        );
      } else {
        console.log("Geolocation not supported, using default location");
        setUserLocation('Jabalpur');
      }
    };
    
    getLocation();
  }, []);

  // Load resources from localStorage
  useEffect(() => {
    const loadResources = () => {
      // Load from Connect page
      const connectResources = localStorage.getItem('resourceRequests');
      
      // Load from Resources page
      const pageResources = localStorage.getItem('resources');
      
      let allResources: Resource[] = [];
      
      if (connectResources) {
        try {
          const parsed = JSON.parse(connectResources);
          allResources = [...allResources, ...parsed];
        } catch (error) {
          console.error('Error parsing connectResources:', error);
        }
      }
      
      if (pageResources) {
        try {
          const parsed = JSON.parse(pageResources);
          // Avoid duplicates by checking ids
          const existingIds = new Set(allResources.map(r => r.id));
          const newResources = parsed.filter((r: Resource) => !existingIds.has(r.id));
          allResources = [...allResources, ...newResources];
        } catch (error) {
          console.error('Error parsing pageResources:', error);
        }
      }
      
      // If no resources found or no offer type resources, create initial data
      const offerResources = allResources.filter(r => r.type === 'offer');
      
      if (allResources.length === 0 || offerResources.length === 0) {
        // Create dummy resources with more detailed location information
        const dummyResources: Resource[] = [
          {
            id: '1',
            type: 'need',
            category: 'water',
            title: 'Clean Drinking Water',
            description: 'Urgently need bottled water for family of 4, including infant.',
            location: 'Madan Mahal, Jabalpur',
            locationDetails: 'Near Madan Mahal Fort, South Block',
            urgent: true,
            timestamp: Date.now() - 3600000,
            status: 'pending'
          },
          {
            id: '2',
            type: 'offer',
            category: 'shelter',
            title: 'Temporary Housing Available',
            description: 'Can accommodate up to 3 people in spare rooms. Has generator and supplies.',
            location: 'Civil Lines, Jabalpur',
            locationDetails: 'Lane 3, Near City Hospital',
            contact: '9876543210',
            contactName: 'Priya Sharma',
            timestamp: Date.now() - 7200000,
            status: 'pending'
          },
          {
            id: '3',
            type: 'offer',
            category: 'food',
            title: 'Hot Meals Available',
            description: 'Providing hot vegetarian meals three times daily for affected families.',
            location: 'Napier Town, Jabalpur',
            locationDetails: 'Community Center, Block B',
            contact: '9988776655',
            contactName: 'Vikram Singh',
            specialNotes: 'Please bring your own containers if possible',
            timestamp: Date.now() - 5400000,
            status: 'pending'
          },
          {
            id: '4',
            type: 'offer',
            category: 'medical',
            title: 'Medical Supplies & First Aid',
            description: 'Distributing essential medicines, bandages, and first aid supplies. Doctor available for consultation.',
            location: 'Garha, Jabalpur',
            locationDetails: 'Near Railway Colony',
            contact: '8765432109',
            contactName: 'Dr. Rajesh Kumar',
            urgent: true,
            timestamp: Date.now() - 2700000,
            status: 'pending'
          },
          {
            id: '5',
            type: 'offer',
            category: 'supplies',
            title: 'Blankets and Clothing',
            description: 'Offering warm blankets, children\'s clothing, and basic hygiene supplies for displaced families.',
            location: 'Adhartal, Jabalpur',
            locationDetails: 'Community Hall, Near Lake View',
            contact: '7654321098',
            contactName: 'Sunita Patel',
            timestamp: Date.now() - 9000000,
            status: 'pending'
          },
          {
            id: '6',
            type: 'offer',
            category: 'safety',
            title: 'Temporary Power Supply',
            description: 'Generator available for charging phones and essential medical equipment. Available 8am-8pm.',
            location: 'Katanga, Jabalpur',
            locationDetails: 'Market Square',
            contact: '9876123450',
            contactName: 'Amit Verma',
            timestamp: Date.now() - 10800000,
            status: 'pending'
          }
        ];
        
        if (allResources.length === 0) {
          allResources = dummyResources;
        } else {
          // Just add the offer resources if there are no offers
          const dummyOffers = dummyResources.filter(r => r.type === 'offer');
          allResources = [...allResources, ...dummyOffers];
        }
      }
      
      // Sort resources consistently by timestamp and urgency
      allResources.sort((a, b) => {
        if (a.urgent && !b.urgent) return -1;
        if (!a.urgent && b.urgent) return 1;
        return b.timestamp - a.timestamp;
      });
      
      setResources(allResources);
      setLoading(false);
    };
    
    // Load all user responses
    const loadResponses = () => {
      const allResponses: ResourceResponse[] = [];
      
      // Check for all response keys in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('responses_')) {
          try {
            const userResponses = JSON.parse(localStorage.getItem(key) || '[]');
            allResponses.push(...userResponses);
          } catch (error) {
            console.error(`Error parsing responses from ${key}:`, error);
          }
        }
      }
      
      setResponses(allResponses);
    };
    
    loadResources();
    loadResponses();
    
    // Listen for storage events to update in real-time across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && (
          event.key === 'resourceRequests' || 
          event.key === 'resources' || 
          event.key.startsWith('responses_')
        )) {
        loadResources();
        loadResponses();
      }
    };
    
    // Listen for custom events for real-time updates within the same tab
    const handleResourceChange = () => {
      console.log('Resource data change detected, refreshing data');
      loadResources();
      loadResponses();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resource-updated', handleResourceChange);
    window.addEventListener('resource-created', handleResourceChange);
    window.addEventListener('response-updated', handleResourceChange);
    window.addEventListener('response-created', handleResourceChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resource-updated', handleResourceChange);
      window.removeEventListener('resource-created', handleResourceChange);
      window.removeEventListener('response-updated', handleResourceChange);
      window.removeEventListener('response-created', handleResourceChange);
    };
  }, [userLocation]);
  
  // Function to add a new resource
  const addResource = (newResource: Omit<Resource, 'id' | 'timestamp'>) => {
    const resource: Resource = {
      ...newResource,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    
    const updatedResources = [resource, ...resources];
    setResources(updatedResources);
    
    // Update localStorage based on type
    if (newResource.userId) {
      // This is for the Connect page
      localStorage.setItem('resourceRequests', JSON.stringify(updatedResources));
    } else {
      // This is for the Resources page
      localStorage.setItem('resources', JSON.stringify(updatedResources));
    }
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('resource-created'));
    
    return resource;
  };
  
  // Function to add a response
  const addResponse = (userId: string, response: Omit<ResourceResponse, 'id' | 'time'>) => {
    const newResponse: ResourceResponse = {
      ...response,
      id: Date.now().toString(),
      time: Date.now()
    };
    
    const userResponses = JSON.parse(localStorage.getItem(`responses_${userId}`) || '[]');
    const updatedResponses = [newResponse, ...userResponses];
    
    localStorage.setItem(`responses_${userId}`, JSON.stringify(updatedResponses));
    
    // Update the responses state
    setResponses([newResponse, ...responses]);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('response-created'));
    
    return newResponse;
  };
  
  // Function to update a response
  const updateResponse = (userId: string, responseId: string, updates: Partial<ResourceResponse>) => {
    // Get the current responses for the user
    const userResponses = JSON.parse(localStorage.getItem(`responses_${userId}`) || '[]');
    
    // Update the specific response
    const updatedResponses = userResponses.map((response: ResourceResponse) => {
      if (response.id === responseId) {
        return { ...response, ...updates };
      }
      return response;
    });
    
    // Save back to localStorage
    localStorage.setItem(`responses_${userId}`, JSON.stringify(updatedResponses));
    
    // Update the responses state
    setResponses(prev => prev.map(response => {
      if (response.id === responseId) {
        return { ...response, ...updates };
      }
      return response;
    }));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('response-updated'));
    
    return updatedResponses.find((r: ResourceResponse) => r.id === responseId);
  };

  // Function to clean up invalid responses
  const cleanupInvalidResponses = () => {
    const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    if (!currentUser.id) return;

    // Get current user's responses
    const userResponses = JSON.parse(localStorage.getItem(`responses_${currentUser.id}`) || '[]');

    // Filter out responses for non-existent resources
    const validResponses = userResponses.filter((response: ResourceResponse) => 
      resources.some(resource => resource.id === response.requestId)
    );

    // Only update if there are invalid responses
    if (validResponses.length !== userResponses.length) {
      localStorage.setItem(`responses_${currentUser.id}`, JSON.stringify(validResponses));
      
      // Update the responses state
      setResponses(prev => {
        const otherResponses = prev.filter(r => 
          !userResponses.some((ur: ResourceResponse) => ur.id === r.id)
        );
        return [...otherResponses, ...validResponses];
      });
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('response-updated'));
    }
  };

  // Run cleanup when resources are loaded
  useEffect(() => {
    if (!loading) {
      cleanupInvalidResponses();
    }
  }, [loading, resources]);
  
  return {
    resources,
    responses,
    loading,
    addResource,
    addResponse,
    updateResponse,
    cleanupInvalidResponses
  };
};

export default useResourceData;
