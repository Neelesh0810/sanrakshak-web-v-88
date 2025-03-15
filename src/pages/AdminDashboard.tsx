import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import AnimatedTransition from '@/components/AnimatedTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Search, 
  RefreshCw,
  AlertCircle,
  LogOut,
  FileBarChart2,
  Settings
} from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';
import { Button } from '@/components/ui/button';
import ReportsSection from '@/components/ReportsSection';
import ResourceManagementDialog from '@/components/ResourceManagementDialog';

interface Resource {
  id: string;
  type: 'need' | 'offer';
  category: 'water' | 'shelter' | 'food' | 'supplies' | 'medical' | 'safety';
  title: string;
  description: string;
  location: string;
  contact?: string;
  urgent?: boolean;
  timestamp: number;
  status: 'pending' | 'addressing' | 'resolved';
  assignedTo?: string;
}

const AdminDashboard = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showReports, setShowReports] = useState(false);
  const [showManageDialog, setShowManageDialog] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const fetchResources = () => {
    const storedResources = localStorage.getItem('resources');
    if (storedResources) {
      const parsedResources = JSON.parse(storedResources).map((res: any) => ({
        ...res,
        status: res.status || 'pending'
      }));
      setResources(parsedResources);
    } else {
      const sampleResources: Resource[] = [
        {
          id: '1',
          type: 'need',
          category: 'water',
          title: 'Clean Water Needed',
          description: 'Family of 4 needs clean drinking water. We have been without for 2 days.',
          location: 'North District, Block C',
          urgent: true,
          timestamp: Date.now() - 3600000,
          status: 'addressing',
          assignedTo: 'Water Relief Team'
        },
        {
          id: '2',
          type: 'need',
          category: 'food',
          title: 'Food for children',
          description: 'Need food supplies for 3 children under 10.',
          location: 'East Village, House 45',
          urgent: true,
          timestamp: Date.now() - 7200000,
          status: 'pending'
        },
        {
          id: '3',
          type: 'need',
          category: 'medical',
          title: 'Insulin Required',
          description: 'Diabetic patient needs insulin. Current supply will last only 24 hours.',
          location: 'South Side Apartments, Building 3',
          contact: '555-0187',
          urgent: true,
          timestamp: Date.now() - 1800000,
          status: 'resolved',
          assignedTo: 'Medical Team Alpha'
        }
      ];
      
      setResources(sampleResources);
      localStorage.setItem('resources', JSON.stringify(sampleResources));
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.role === 'admin') {
        setUser(parsedUser);
      } else {
        toast({
          title: "Access Denied",
          description: "You need administrator privileges to access this page",
        });
        navigate('/dashboard', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }

    fetchResources();
    
    setIsLoading(false);
  }, [navigate, toast]);

  useEffect(() => {
    let result = [...resources];
    
    if (statusFilter !== 'all') {
      result = result.filter(resource => resource.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(resource => resource.category === categoryFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(resource => 
        resource.title.toLowerCase().includes(query) || 
        resource.description.toLowerCase().includes(query) ||
        resource.location.toLowerCase().includes(query)
      );
    }
    
    result.sort((a, b) => {
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return b.timestamp - a.timestamp;
    });
    
    setFilteredResources(result);
  }, [resources, statusFilter, categoryFilter, searchQuery]);

  const updateResourceStatus = (id: string, newStatus: 'pending' | 'addressing' | 'resolved', assignedTo?: string) => {
    const updatedResources = resources.map(resource => {
      if (resource.id === id) {
        return { 
          ...resource, 
          status: newStatus,
          assignedTo: assignedTo || resource.assignedTo
        };
      }
      return resource;
    });
    
    setResources(updatedResources);
    localStorage.setItem('resources', JSON.stringify(updatedResources));
    
    toast({
      title: "Status Updated",
      description: `Request has been marked as ${newStatus}`,
    });
  };

  const handleAssignRequest = (id: string) => {
    const assignedTo = prompt("Enter the name of the team or person to assign this request to:");
    if (assignedTo) {
      updateResourceStatus(id, 'addressing', assignedTo);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'water': return 'Water';
      case 'shelter': return 'Shelter';
      case 'food': return 'Food';
      case 'supplies': return 'Supplies';
      case 'medical': return 'Medical';
      case 'safety': return 'Safety';
      default: return category;
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      fetchResources();
      setIsLoading(false);
      
      toast({
        title: "Data Refreshed",
        description: "Latest requests have been loaded",
      });
    }, 800);
  };

  const getRequestCounts = () => {
    const pending = resources.filter(r => r.status === 'pending').length;
    const addressing = resources.filter(r => r.status === 'addressing').length;
    const resolved = resources.filter(r => r.status === 'resolved').length;
    
    return { pending, addressing, resolved, total: resources.length };
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    
    window.dispatchEvent(new Event('auth-state-changed'));
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Logged Out",
      description: "You have been signed out successfully",
    });
    
    navigate('/', { replace: true });
  };

  const counts = getRequestCounts();

  return (
    <div className="min-h-screen bg-black">
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 backdrop-blur-xl bg-black/50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-bold text-xl">Sanrakshak Admin</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center">
                  <span className="mr-4 text-sm text-gray-400">
                    Logged in as <span className="font-medium text-white">{user.email}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 py-1.5 px-3 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <AnimatedTransition>
        <main className="pt-20 pb-16 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Administrator Dashboard</h1>
              <p className="text-gray-400">Manage and coordinate emergency response efforts</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="glass-dark rounded-xl p-4 flex flex-col">
                <div className="text-sm text-gray-400 mb-1">Pending Requests</div>
                <div className="flex items-center">
                  <Clock className="text-yellow-500 mr-2" size={20} />
                  <span className="text-2xl font-bold">{counts.pending}</span>
                </div>
              </div>
              
              <div className="glass-dark rounded-xl p-4 flex flex-col">
                <div className="text-sm text-gray-400 mb-1">Being Addressed</div>
                <div className="flex items-center">
                  <FileCheck className="text-blue-500 mr-2" size={20} />
                  <span className="text-2xl font-bold">{counts.addressing}</span>
                </div>
              </div>
              
              <div className="glass-dark rounded-xl p-4 flex flex-col">
                <div className="text-sm text-gray-400 mb-1">Resolved</div>
                <div className="flex items-center">
                  <CheckCircle2 className="text-green-500 mr-2" size={20} />
                  <span className="text-2xl font-bold">{counts.resolved}</span>
                </div>
              </div>
              
              <div className="glass-dark rounded-xl p-4 flex flex-col">
                <div className="text-sm text-gray-400 mb-1">Total Requests</div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">{counts.total}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <div className="glass-dark rounded-xl p-6 mb-6">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Resource Requests</h2>
                    
                    <div className="flex flex-wrap gap-3 items-center">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search requests..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-1 focus:ring-white/30 focus:outline-none w-full md:w-60"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Filter size={16} className="text-gray-400" />
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
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
                      
                      <Button
                        onClick={refreshData}
                        variant="outline"
                        className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
                      >
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        <span>Refresh</span>
                      </Button>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all" onClick={() => setStatusFilter('all')}>
                        All Requests
                      </TabsTrigger>
                      <TabsTrigger value="pending" onClick={() => setStatusFilter('pending')}>
                        <Clock size={14} className="mr-1" />
                        Pending
                      </TabsTrigger>
                      <TabsTrigger value="addressing" onClick={() => setStatusFilter('addressing')}>
                        <FileCheck size={14} className="mr-1" />
                        Addressing
                      </TabsTrigger>
                      <TabsTrigger value="resolved" onClick={() => setStatusFilter('resolved')}>
                        <CheckCircle2 size={14} className="mr-1" />
                        Resolved
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="mt-0">
                      <RequestsTable 
                        resources={filteredResources} 
                        onAssign={handleAssignRequest}
                        onStatusChange={updateResourceStatus}
                        getCategoryLabel={getCategoryLabel}
                      />
                    </TabsContent>
                    
                    <TabsContent value="pending" className="mt-0">
                      <RequestsTable 
                        resources={filteredResources.filter(r => r.status === 'pending')} 
                        onAssign={handleAssignRequest}
                        onStatusChange={updateResourceStatus}
                        getCategoryLabel={getCategoryLabel}
                      />
                    </TabsContent>
                    
                    <TabsContent value="addressing" className="mt-0">
                      <RequestsTable 
                        resources={filteredResources.filter(r => r.status === 'addressing')} 
                        onAssign={handleAssignRequest}
                        onStatusChange={updateResourceStatus}
                        getCategoryLabel={getCategoryLabel}
                      />
                    </TabsContent>
                    
                    <TabsContent value="resolved" className="mt-0">
                      <RequestsTable 
                        resources={filteredResources.filter(r => r.status === 'resolved')} 
                        onAssign={handleAssignRequest}
                        onStatusChange={updateResourceStatus}
                        getCategoryLabel={getCategoryLabel}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="glass-dark rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Resource Management</h2>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-white/5 border-white/10"
                      onClick={() => setShowManageDialog(true)}
                    >
                      <Settings size={18} className="mr-2" />
                      Manage All
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start bg-white/5 border-white/10"
                      onClick={() => setShowReports(!showReports)}
                    >
                      <FileBarChart2 size={18} className="mr-2" />
                      View Reports
                    </Button>
                  </div>
                </div>
                
                {showReports && (
                  <ReportsSection />
                )}
              </div>
            </div>
          </div>
        </main>
      </AnimatedTransition>
      
      <ResourceManagementDialog
        open={showManageDialog}
        onOpenChange={setShowManageDialog}
      />
    </div>
  );
};

interface RequestsTableProps {
  resources: Resource[];
  onAssign: (id: string) => void;
  onStatusChange: (id: string, status: 'pending' | 'addressing' | 'resolved', assignedTo?: string) => void;
  getCategoryLabel: (category: string) => string;
}

const RequestsTable: React.FC<RequestsTableProps> = ({ 
  resources, 
  onAssign,
  onStatusChange,
  getCategoryLabel
}) => {
  
  if (resources.length === 0) {
    return (
      <div className="text-center py-16 border border-white/5 rounded-lg bg-black/20">
        <AlertCircle className="mx-auto mb-3 text-gray-400" size={32} />
        <p className="text-gray-400">No requests found matching your filters</p>
      </div>
    );
  }
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Title</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Category</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Location</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Time</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Assigned To</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                  ${resource.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 
                    resource.status === 'addressing' ? 'bg-blue-500/20 text-blue-300' : 
                    'bg-green-500/20 text-green-300'}`
                }>
                  {resource.status === 'pending' ? (
                    <Clock className="mr-1" size={12} />
                  ) : resource.status === 'addressing' ? (
                    <FileCheck className="mr-1" size={12} />
                  ) : (
                    <CheckCircle2 className="mr-1" size={12} />
                  )}
                  {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                </span>
              </td>
              <td className="py-3 px-4">
                {resource.urgent && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                    Urgent
                  </span>
                )}
              </td>
              <td className="py-3 px-4">{resource.title}</td>
              <td className="py-3 px-4">{getCategoryLabel(resource.category)}</td>
              <td className="py-3 px-4">{resource.location}</td>
              <td className="py-3 px-4 text-sm text-gray-400">{formatTimestamp(resource.timestamp)}</td>
              <td className="py-3 px-4">
                {resource.assignedTo || (
                  <span className="text-gray-500 italic text-sm">Not assigned</span>
                )}
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  {resource.status === 'pending' && (
                    <button 
                      onClick={() => onAssign(resource.id)}
                      className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors"
                    >
                      Assign
                    </button>
                  )}
                  
                  {resource.status === 'pending' && (
                    <button 
                      onClick={() => onStatusChange(resource.id, 'addressing')}
                      className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors"
                    >
                      Address
                    </button>
                  )}
                  
                  {resource.status === 'addressing' && (
                    <button 
                      onClick={() => onStatusChange(resource.id, 'resolved')}
                      className="px-3 py-1 text-xs bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                  
                  {resource.status === 'resolved' && (
                    <button 
                      onClick={() => onStatusChange(resource.id, 'addressing')}
                      className="px-3 py-1 text-xs bg-yellow-500/20 text-yellow-300 rounded hover:bg-yellow-500/30 transition-colors"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
