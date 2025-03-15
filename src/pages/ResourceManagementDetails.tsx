import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  MessageCircle, 
  Tag, 
  AlertTriangle,
  PenLine,
  CheckCircle,
  Droplet,
  Home,
  Utensils,
  ShoppingBag,
  Heart,
  Shield,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import AnimatedTransition from '@/components/AnimatedTransition';
import useResourceData, { Resource, ResourceStatus } from '@/hooks/useResourceData';
import BackButton from '@/components/BackButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ResourceManagementDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getResourceById, updateResource } = useResourceData();
  const [resource, setResource] = useState<Resource | undefined>(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id) {
      const resourceData = getResourceById(id);
      setResource(resourceData);
      
      if (!resourceData) {
        toast({
          title: "Resource Not Found",
          description: "The requested resource could not be found.",
          variant: "destructive"
        });
        navigate('/resource-management');
      }
    }
    
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      setCurrentUser(JSON.parse(authUser));
    }
    
    const handleResourceUpdate = () => {
      if (id) {
        const updatedResource = getResourceById(id);
        setResource(updatedResource);
      }
    };
    
    window.addEventListener('resource-updated', handleResourceUpdate);
    return () => {
      window.removeEventListener('resource-updated', handleResourceUpdate);
    };
  }, [id, getResourceById, toast, navigate]);
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'water':
        return <Droplet size={20} />;
      case 'shelter':
        return <Home size={20} />;
      case 'food':
        return <Utensils size={20} />;
      case 'supplies':
        return <ShoppingBag size={20} />;
      case 'medical':
        return <Heart size={20} />;
      case 'safety':
        return <Shield size={20} />;
      default:
        return <Info size={20} />;
    }
  };
  
  const handleStatusChange = (newStatus: ResourceStatus) => {
    if (!resource) return;
    
    setIsUpdating(true);
    
    setTimeout(() => {
      updateResource(resource.id, {
        status: newStatus
      });
      
      toast({
        title: "Status Updated",
        description: `Resource status changed to ${newStatus}`
      });
      
      setIsUpdating(false);
    }, 500);
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  if (!resource) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-[60vh]">
              <p>Loading resource details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <AnimatedTransition>
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="mb-8">
              <BackButton />
              
              <div className="flex flex-col md:flex-row justify-between items-start mt-4">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="mr-3 p-2 rounded-full bg-white/10">
                      {getCategoryIcon(resource.category)}
                    </div>
                    <div>
                      <Badge 
                        variant={resource.type === 'need' ? 'default' : 'secondary'}
                        className="mb-1"
                      >
                        {resource.type === 'need' ? 'NEEDED' : 'OFFERED'}
                      </Badge>
                      {resource.urgent && (
                        <Badge variant="destructive" className="ml-2">
                          URGENT
                        </Badge>
                      )}
                      <h1 className="text-2xl font-bold">{resource.title}</h1>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mt-4 md:mt-0">
                  <Select
                    value={resource.status || 'pending'}
                    onValueChange={(value) => handleStatusChange(value as ResourceStatus)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="addressing">Addressing</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    aria-label="Edit Resource"
                  >
                    <PenLine size={18} />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-6">{resource.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-400">
                          <MapPin size={16} className="mr-2" />
                          <span>{resource.location}</span>
                        </div>
                        
                        {resource.locationDetails && (
                          <div className="text-gray-400 ml-6 text-sm">
                            {resource.locationDetails}
                          </div>
                        )}
                        
                        <div className="flex items-center text-gray-400">
                          <Clock size={16} className="mr-2" />
                          <span>Posted {formatDate(resource.timestamp)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {resource.username && (
                          <div className="flex items-center text-gray-400">
                            <User size={16} className="mr-2" />
                            <span>Posted by {resource.username}</span>
                          </div>
                        )}
                        
                        {resource.contact && (
                          <div className="flex items-center text-gray-400">
                            <Phone size={16} className="mr-2" />
                            <span>{resource.contact}</span>
                          </div>
                        )}
                        
                        {resource.contactName && (
                          <div className="flex items-center text-gray-400">
                            <User size={16} className="mr-2" />
                            <span>Contact: {resource.contactName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {resource.items && resource.items.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {resource.items.map((item, index) => (
                          <li key={index} className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span>{item.name}</span>
                            <Badge variant="outline">{item.quantity} {item.quantity === 1 ? 'unit' : 'units'}</Badge>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle>Status History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="mr-3 flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <CheckCircle size={16} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <h4 className="font-medium">Resource created</h4>
                            <span className="text-xs text-gray-500">{formatDate(resource.timestamp)}</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            Initial status: {resource.status || 'pending'}
                          </p>
                        </div>
                      </div>
                      
                      {resource.status === 'addressing' && (
                        <div className="flex items-start">
                          <div className="mr-3 flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              <Tag size={16} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <h4 className="font-medium">Status updated</h4>
                              <span className="text-xs text-gray-500">{formatDate(resource.timestamp + 3600000)}</span>
                            </div>
                            <p className="text-sm text-gray-400">
                              Status changed to: addressing
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {resource.status === 'resolved' && (
                        <div className="flex items-start">
                          <div className="mr-3 flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              <CheckCircle size={16} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <h4 className="font-medium">Resource resolved</h4>
                              <span className="text-xs text-gray-500">{formatDate(resource.timestamp + 7200000)}</span>
                            </div>
                            <p className="text-sm text-gray-400">
                              This resource has been successfully fulfilled
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Current Status</h3>
                        <div className="flex items-center">
                          <Badge 
                            variant={
                              resource.status === 'resolved' 
                                ? 'default' 
                                : resource.status === 'addressing' 
                                  ? 'outline' 
                                  : 'secondary'
                            }
                            className="capitalize"
                          >
                            {resource.status || 'pending'}
                          </Badge>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Actions</h3>
                        <div className="space-y-2">
                          <Button className="w-full justify-start" variant="secondary">
                            <MessageCircle size={16} className="mr-2" />
                            Send Message
                          </Button>
                          
                          <Button className="w-full justify-start" variant="outline">
                            <Tag size={16} className="mr-2" />
                            Assign to Team
                          </Button>
                          
                          <Button className="w-full justify-start" variant="ghost">
                            <AlertTriangle size={16} className="mr-2" />
                            Report Issue
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Related Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-full bg-white/10 mr-2">
                            {getCategoryIcon(resource.category)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">Similar {resource.category} {resource.type}</p>
                            <p className="text-xs text-gray-400">Posted 2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-full bg-white/10 mr-2">
                            {getCategoryIcon(resource.category)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">Another {resource.category} resource</p>
                            <p className="text-xs text-gray-400">Posted 1 day ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" className="w-full mt-2 text-sm" size="sm">
                        View all similar resources
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </AnimatedTransition>
    </div>
  );
};

export default ResourceManagementDetails;
