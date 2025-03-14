
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BackButton from '@/components/BackButton';
import { AlertTriangle, MapPin, Clock, User, Building, Share, Bookmark, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface StatusUpdate {
  id: string;
  title: string;
  message: string;
  source: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  location?: string;
  category?: string;
  authorType?: 'government' | 'ngo';
}

const StatusDetails: React.FC = () => {
  const { statusId } = useParams<{ statusId: string }>();
  const [statusUpdate, setStatusUpdate] = useState<StatusUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchStatusUpdate = () => {
      // Simulate API call with timeout
      setTimeout(() => {
        // In a real app, this would be fetched from an API
        const mockStatusUpdates: Record<string, StatusUpdate> = {
          'status-1': {
            id: 'status-1',
            title: 'Power Restoration Progress',
            message: 'Crews are working to restore power to the eastern district. Estimated completion: 24 hours. Multiple power lines were damaged during the storm, affecting approximately 5,000 households. Emergency generators have been deployed to critical facilities including hospitals and emergency shelters.',
            source: 'City Power & Utilities',
            timestamp: '1 hour ago',
            priority: 'high',
            location: 'Eastern District',
            category: 'Infrastructure',
            authorType: 'government'
          },
          'status-2': {
            id: 'status-2',
            title: 'Road Closure Update',
            message: 'Main Street between 5th and 8th Ave remains flooded and closed to traffic. Use alternate routes. Water levels are receding slowly. Cleanup crews are on standby and will begin work as soon as water levels permit. Please avoid the area unless absolutely necessary.',
            source: 'Department of Transportation',
            timestamp: '3 hours ago',
            priority: 'medium',
            location: 'Downtown Area',
            category: 'Transportation',
            authorType: 'government'
          },
          'status-3': {
            id: 'status-3',
            title: 'Medical Supply Distribution',
            message: 'Medical supplies including first aid kits, insulin, and other essential medications are available at Red Cross relief centers. Please bring identification and prescription information if available. Supplies are limited but additional shipments are expected tomorrow.',
            source: 'Red Cross',
            timestamp: '5 hours ago',
            priority: 'high',
            location: 'Multiple Locations',
            category: 'Medical',
            authorType: 'ngo'
          }
        };
        
        if (statusId && statusId in mockStatusUpdates) {
          setStatusUpdate(mockStatusUpdates[statusId]);
        } else {
          setStatusUpdate(null);
        }
        
        // Check if this status update is saved
        checkIfSaved(statusId || '');
        
        setLoading(false);
      }, 1000);
    };
    
    fetchStatusUpdate();
  }, [statusId]);
  
  const checkIfSaved = (id: string) => {
    const savedUpdates = localStorage.getItem('savedStatusUpdates');
    if (savedUpdates) {
      try {
        const parsedUpdates = JSON.parse(savedUpdates);
        const isSavedStatus = parsedUpdates.some((update: StatusUpdate) => update.id === id);
        setIsSaved(isSavedStatus);
      } catch (error) {
        console.error('Error checking saved status:', error);
        setIsSaved(false);
      }
    } else {
      setIsSaved(false);
    }
  };
  
  const handleSaveToggle = () => {
    if (!statusUpdate) return;
    
    // Get current saved updates
    const savedUpdates = localStorage.getItem('savedStatusUpdates');
    let updatesArray: StatusUpdate[] = [];
    
    if (savedUpdates) {
      try {
        updatesArray = JSON.parse(savedUpdates);
      } catch (error) {
        console.error('Error parsing saved updates:', error);
        updatesArray = [];
      }
    }
    
    if (isSaved) {
      // Remove from saved
      updatesArray = updatesArray.filter(update => update.id !== statusUpdate.id);
      localStorage.setItem('savedStatusUpdates', JSON.stringify(updatesArray));
      setIsSaved(false);
      
      toast({
        title: "Removed from saved",
        description: "Status update removed from your saved items",
      });
      
      // Dispatch custom event
      window.dispatchEvent(new Event('status-unsaved'));
    } else {
      // Add to saved
      updatesArray.push(statusUpdate);
      localStorage.setItem('savedStatusUpdates', JSON.stringify(updatesArray));
      setIsSaved(true);
      
      toast({
        title: "Saved",
        description: "Status update saved for quick access",
      });
      
      // Dispatch custom event
      window.dispatchEvent(new Event('status-saved'));
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="container mx-auto px-4 pt-20 pb-16">
          <BackButton />
          <div className="animate-pulse mt-6">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
            <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
            <div className="h-4 bg-white/5 rounded w-3/4 mb-4"></div>
            <div className="h-10 bg-white/10 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!statusUpdate) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="container mx-auto px-4 pt-20 pb-16">
          <BackButton />
          <div className="mt-6 text-center">
            <h1 className="text-xl font-bold mb-4">Status Update Not Found</h1>
            <p className="text-gray-400 mb-6">The status update you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/alerts')}>
              Return to Alerts
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto px-4 pt-20 pb-16">
        <BackButton />
        
        <div className="mt-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(statusUpdate.priority)}`} />
                <h1 className="text-2xl font-bold">{statusUpdate.title}</h1>
              </div>
              <div className="flex flex-wrap text-sm text-gray-400 mt-2">
                <div className="flex items-center mr-4 mb-2">
                  <Clock size={14} className="mr-1" />
                  <span>{statusUpdate.timestamp}</span>
                </div>
                {statusUpdate.location && (
                  <div className="flex items-center mr-4 mb-2">
                    <MapPin size={14} className="mr-1" />
                    <span>{statusUpdate.location}</span>
                  </div>
                )}
                {statusUpdate.category && (
                  <div className="flex items-center mb-2">
                    <AlertTriangle size={14} className="mr-1" />
                    <span>{statusUpdate.category}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/10 bg-white/5"
                onClick={handleSaveToggle}
              >
                {isSaved ? (
                  <>
                    <CheckSquare size={16} className="mr-2 text-green-500" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={16} className="mr-2" />
                    <span>Save</span>
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/10 bg-white/5"
              >
                <Share size={16} className="mr-2" />
                <span>Share</span>
              </Button>
            </div>
          </div>
          
          <div className="glass-dark border border-white/10 rounded-xl p-6 mb-6">
            <p className="mb-6 leading-relaxed">{statusUpdate.message}</p>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center">
                {statusUpdate.authorType === 'government' ? (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                    <Building size={16} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                    <User size={16} />
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{statusUpdate.source}</p>
                  <p className="text-xs text-gray-400">
                    {statusUpdate.authorType === 'government' ? 'Government Agency' : 'Non-Government Organization'}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityTextColor(statusUpdate.priority)} bg-white/5`}>
                {statusUpdate.priority.charAt(0).toUpperCase() + statusUpdate.priority.slice(1)} Priority
              </div>
            </div>
          </div>
          
          <div className="glass-dark border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Related Resources</h2>
            <div className="text-center py-6 text-gray-400">
              <p>No related resources available at this time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusDetails;
