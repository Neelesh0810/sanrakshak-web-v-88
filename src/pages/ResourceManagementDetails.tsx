
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, MapPin, User, Package, AlertTriangle, Check, XCircle } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import useResourceData, { Resource, ResourceCategory } from "@/hooks/useResourceData";
import BackButton from "@/components/BackButton";

// Function to get icon based on category
const getCategoryIcon = (category: ResourceCategory) => {
  switch (category) {
    case 'water':
      return <span className="text-blue-500">💧</span>;
    case 'food':
      return <span className="text-yellow-500">🍲</span>;
    case 'shelter':
      return <span className="text-green-500">🏠</span>;
    case 'supplies':
      return <span className="text-purple-500">📦</span>;
    case 'medical':
      return <span className="text-red-500">🏥</span>;
    case 'safety':
      return <span className="text-orange-500">🛡️</span>;
    default:
      return <Package size={18} />;
  }
};

// Function to get badge variant based on status
const getStatusVariant = (status?: string) => {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'addressing':
      return 'outline';
    case 'resolved':
      return 'default';
    default:
      return 'secondary';
  }
};

// Function to get status display text
const getStatusText = (status?: string) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'addressing':
      return 'In Progress';
    case 'resolved':
      return 'Resolved';
    default:
      return 'Unknown';
  }
};

const ResourceManagementDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resources, loading } = useResourceData();
  const [resource, setResource] = useState<Resource | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!loading && id) {
      const foundResource = resources.find(r => r.id === id);
      if (foundResource) {
        setResource(foundResource);
      } else {
        toast.error("Resource not found");
        navigate("/dashboard");
      }
    }
  }, [id, resources, loading, navigate]);

  const handleUpdateStatus = async (newStatus: "pending" | "addressing" | "resolved") => {
    if (!resource) return;
    
    setUpdating(true);
    
    try {
      // Update localStorage directly since we don't have a real backend
      const updatedResources = resources.map(r => 
        r.id === resource.id ? { ...r, status: newStatus } : r
      );
      localStorage.setItem('resources', JSON.stringify(updatedResources));
      
      // Update the resource state with the new status
      setResource({ ...resource, status: newStatus });
      
      // Dispatch event to refresh resource data
      window.dispatchEvent(new Event('resource-updated'));
      
      toast.success(`Resource status updated to ${getStatusText(newStatus)}`);
    } catch (error) {
      console.error("Error updating resource status:", error);
      toast.error("Failed to update resource status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <BackButton />
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Resource Not Found</CardTitle>
            <CardDescription>The resource you're looking for doesn't exist or has been removed.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <BackButton />
      
      <Card className="mt-4 overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2">
            {getCategoryIcon(resource.category)}
            <CardTitle>{resource.title}</CardTitle>
          </div>
          <div className="flex justify-between items-center">
            <CardDescription>
              {resource.type === 'need' ? 'Resource Request' : 'Resource Offering'}
            </CardDescription>
            <Badge variant={getStatusVariant(resource.status)}>
              {getStatusText(resource.status)}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Description</h3>
            <p className="text-sm">{resource.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1 flex items-center">
                <MapPin size={16} className="mr-1" />
                Location
              </h3>
              <p className="text-sm">{resource.location}</p>
              {resource.locationDetails && (
                <p className="text-sm text-muted-foreground mt-1">{resource.locationDetails}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1 flex items-center">
                <Clock size={16} className="mr-1" />
                Posted
              </h3>
              <p className="text-sm">
                {formatDistanceToNow(resource.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {resource.contact && (
            <div>
              <h3 className="text-sm font-medium mb-1 flex items-center">
                <User size={16} className="mr-1" />
                Contact
              </h3>
              <p className="text-sm">
                {resource.contactName ? `${resource.contactName}: ${resource.contact}` : resource.contact}
              </p>
            </div>
          )}
          
          {resource.specialNotes && (
            <div>
              <h3 className="text-sm font-medium mb-1 flex items-center">
                <AlertTriangle size={16} className="mr-1" />
                Special Notes
              </h3>
              <p className="text-sm">{resource.specialNotes}</p>
            </div>
          )}
          
          {resource.people && (
            <div>
              <h3 className="text-sm font-medium mb-1">Number of People</h3>
              <p className="text-sm">{resource.people}</p>
            </div>
          )}
          
          {resource.items && resource.items.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-1">Items</h3>
              <ul className="text-sm space-y-1">
                {resource.items.map((item, index) => (
                  <li key={index}>{item.name}: {item.quantity}</li>
                ))}
              </ul>
            </div>
          )}
          
          {resource.urgent && (
            <div className="bg-red-500/10 p-3 rounded-md flex items-center">
              <AlertTriangle size={16} className="text-red-500 mr-2" />
              <p className="text-sm text-red-500 font-medium">This request is marked as urgent</p>
            </div>
          )}
        </CardContent>
        
        <Separator />
        
        <CardFooter className="justify-between py-4">
          <div className="text-sm text-muted-foreground">
            {resource.type === 'need' ? 'Requested' : 'Offered'} by: {resource.username || 'Anonymous'}
          </div>
          
          <div className="flex gap-2">
            {resource.status !== 'pending' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleUpdateStatus('pending')}
                disabled={updating}
              >
                <XCircle size={16} className="mr-1" />
                Mark as Pending
              </Button>
            )}
            
            {resource.status !== 'addressing' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleUpdateStatus('addressing')}
                disabled={updating}
              >
                <Clock size={16} className="mr-1" />
                Mark as In Progress
              </Button>
            )}
            
            {resource.status !== 'resolved' && (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => handleUpdateStatus('resolved')}
                disabled={updating}
              >
                <Check size={16} className="mr-1" />
                Mark as Resolved
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResourceManagementDetails;
