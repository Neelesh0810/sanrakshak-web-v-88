
import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronRight, Calendar, Users, Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import AnimatedTransition from '../AnimatedTransition';
import { useTheme } from '../../context/ThemeProvider';
import useResourceData from '@/hooks/useResourceData';

interface ResourceItemProps {
  id: string;
  type: 'need' | 'offer';
  title: string;
  category: string;
  timestamp: number;
  status?: string;
  urgent?: boolean;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ 
  id, type, title, category, timestamp, status = 'pending', urgent 
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const getStatusBadge = () => {
    switch (status) {
      case 'resolved':
        return <Badge variant="default">Resolved</Badge>;
      case 'addressing':
        return <Badge variant="outline">In Progress</Badge>;
      case 'pending':
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${isLight ? 'border-gray-200' : 'border-white/10'} flex justify-between items-center`}>
      <div>
        <div className="flex items-center">
          <div className={`mr-3 p-1.5 rounded-md ${isLight ? 'bg-gray-100' : 'bg-white/10'}`}>
            {type === 'need' ? 
              <AlertTriangle size={16} className="text-yellow-500" /> :
              <Package size={16} className="text-blue-500" />
            }
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="font-medium">{title}</h3>
              {urgent && <Badge variant="destructive" className="ml-2">Urgent</Badge>}
            </div>
            <div className="flex items-center text-xs mt-1 text-gray-500">
              <span>{category}</span>
              <span className="mx-1">•</span>
              <span>{new Date(timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        {getStatusBadge()}
        <Link 
          to={`/resource-management/${id}`}
          className={`ml-2 p-1.5 rounded-md transition-colors ${
            isLight 
              ? 'hover:bg-gray-100' 
              : 'hover:bg-white/10'
          }`}
        >
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
};

const NGODashboard: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { resources, loading } = useResourceData();
  const [mainStats, setMainStats] = useState({
    pendingRequests: 0,
    availableResources: 0,
    activeCases: 0
  });
  
  useEffect(() => {
    if (!loading) {
      const pendingRequests = resources.filter(r => r.type === 'need' && r.status === 'pending').length;
      const availableResources = resources.filter(r => r.type === 'offer').length;
      const activeCases = resources.filter(r => r.status === 'addressing').length;
      
      setMainStats({
        pendingRequests,
        availableResources,
        activeCases
      });
    }
  }, [resources, loading]);
  
  const recentResources = useMemo(() => {
    // Return the 5 most recent resources
    return [...resources]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [resources]);
  
  const pendingNeedsCount = useMemo(() => {
    return resources.filter(r => r.type === 'need' && r.status === 'pending').length;
  }, [resources]);
  
  const nearbyResourcesCount = useMemo(() => {
    return resources.filter(r => r.type === 'offer' && r.status === 'pending').length;
  }, [resources]);
  
  const resourcesByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    
    resources.forEach(resource => {
      if (!categories[resource.category]) {
        categories[resource.category] = 0;
      }
      categories[resource.category]++;
    });
    
    return Object.entries(categories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [resources]);
  
  return (
    <div className="container mx-auto px-4">
      <AnimatedTransition>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                <div className="text-2xl font-bold">{mainStats.pendingRequests}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {mainStats.pendingRequests > 5 ? 'Requires immediate attention' : 'Within normal range'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="mr-2 h-4 w-4 text-blue-500" />
                <div className="text-2xl font-bold">{mainStats.availableResources}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {mainStats.availableResources < 3 ? 'Low resource availability' : 'Resources available'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-green-500" />
                <div className="text-2xl font-bold">{mainStats.activeCases}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {mainStats.activeCases} cases being actively addressed
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-md font-medium">Resource Management</CardTitle>
                <Link to="/resources">
                  <Button variant="outline" size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Resource
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="animate-pulse p-4 rounded-lg border border-white/10">
                        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                      </div>
                    ))}
                  </div>
                ) : recentResources.length > 0 ? (
                  <div className="space-y-3">
                    {recentResources.map(resource => (
                      <ResourceItem
                        key={resource.id}
                        id={resource.id}
                        type={resource.type}
                        title={resource.title}
                        category={resource.category}
                        timestamp={resource.timestamp}
                        status={resource.status}
                        urgent={resource.urgent}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">No resources available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className={`p-4 rounded-lg border ${isLight ? 'border-gray-200' : 'border-white/10'} flex items-center`}>
                    <div className={`mr-3 p-2 rounded-md ${isLight ? 'bg-gray-100' : 'bg-white/10'}`}>
                      <Calendar size={16} />
                    </div>
                    <div>
                      <h3 className="font-medium">Resource Distribution</h3>
                      <p className="text-xs mt-1 text-gray-500">Tomorrow, 9:00 AM</p>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${isLight ? 'border-gray-200' : 'border-white/10'} flex items-center`}>
                    <div className={`mr-3 p-2 rounded-md ${isLight ? 'bg-gray-100' : 'bg-white/10'}`}>
                      <Users size={16} />
                    </div>
                    <div>
                      <h3 className="font-medium">Volunteer Coordination</h3>
                      <p className="text-xs mt-1 text-gray-500">Friday, 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-md font-medium">Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Pending Needs</span>
                      <span className="text-sm font-medium">{pendingNeedsCount}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full" 
                        style={{ width: `${Math.min((pendingNeedsCount / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Available Resources</span>
                      <span className="text-sm font-medium">{nearbyResourcesCount}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${Math.min((nearbyResourcesCount / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Resources by Category</h3>
                    <div className="space-y-2">
                      {resourcesByCategory.map(({ name, count }) => (
                        <div key={name} className="flex justify-between items-center">
                          <span className="text-xs capitalize">{name}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/resources">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Resource
                    </Button>
                  </Link>
                  
                  <Link to="/volunteer-tasks">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Tasks
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default NGODashboard;
