
import React from 'react';
import { BarChart, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AnimatedTransition from '../AnimatedTransition';
import useResourceData from '@/hooks/useResourceData';

interface GovernmentDashboardProps {
  resourceData?: ReturnType<typeof useResourceData>;
}

const GovernmentDashboard: React.FC<GovernmentDashboardProps> = ({ resourceData }) => {
  // Use passed resourceData or create a new instance (for backward compatibility)
  const { resources, loading } = resourceData || useResourceData();
  
  return (
    <div className="container mx-auto px-4">
      <AnimatedTransition>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Resource Status Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Resources Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : resources.filter(r => r.type === 'offer').length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {loading ? '' : `${resources.filter(r => r.type === 'offer' && r.urgent).length} marked as urgent`}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : resources.filter(r => r.type === 'need').length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {loading ? '' : `${resources.filter(r => r.type === 'need' && r.status === 'pending').length} pending requests`}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resource Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : Math.round((resources.filter(r => r.status !== 'pending').length / Math.max(resources.length, 1)) * 100)}%</div>
              <p className="text-xs text-muted-foreground mt-2">
                {loading ? '' : `${resources.filter(r => r.status === 'addressing').length} cases being addressed`}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Emergency Resource Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Resource distribution analytics</p>
                    <Button variant="outline" className="mt-4">View Detailed Analytics</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">Government Updates</CardTitle>
                <Button variant="outline" size="sm">Post Update</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Flash Flood Warning - Level 3</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Issued for northern districts. Evacuation recommended for low-lying areas.
                        </p>
                      </div>
                      <span className="text-xs text-white bg-red-500/90 px-2 py-0.5 rounded-full">Critical</span>
                    </div>
                    <div className="mt-3 pt-3 border-t flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Posted 1 hour ago
                      </span>
                      <Link to="/alerts" className="text-xs text-foreground bg-secondary hover:bg-secondary/80 px-2 py-1 rounded transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Power Restoration Update</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Power restored to 60% of affected areas. Crews working on remaining outages.
                        </p>
                      </div>
                      <span className="text-xs text-white bg-yellow-500/90 px-2 py-0.5 rounded-full">Important</span>
                    </div>
                    <div className="mt-3 pt-3 border-t flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Posted 3 hours ago
                      </span>
                      <Link to="/alerts" className="text-xs text-foreground bg-secondary hover:bg-secondary/80 px-2 py-1 rounded transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Agency Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link to="/resources" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
                    <div className="flex justify-between items-center">
                      <span>Manage Resources</span>
                      <ChevronRight size={16} />
                    </div>
                  </Link>
                  
                  <Link to="/alerts" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
                    <div className="flex justify-between items-center">
                      <span>Issue Emergency Alerts</span>
                      <ChevronRight size={16} />
                    </div>
                  </Link>
                  
                  <Link to="/volunteer-tasks" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
                    <div className="flex justify-between items-center">
                      <span>Coordinate Volunteers</span>
                      <ChevronRight size={16} />
                    </div>
                  </Link>
                  
                  <Link to="/map" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
                    <div className="flex justify-between items-center">
                      <span>Emergency Map</span>
                      <ChevronRight size={16} />
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Resource Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Water & Hydration</span>
                      <span className="font-medium">{loading ? '...' : resources.filter(r => r.category === 'water').length}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: loading ? '0%' : `${Math.min((resources.filter(r => r.category === 'water').length / Math.max(resources.length, 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Food & Nutrition</span>
                      <span className="font-medium">{loading ? '...' : resources.filter(r => r.category === 'food').length}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: loading ? '0%' : `${Math.min((resources.filter(r => r.category === 'food').length / Math.max(resources.length, 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Medical Supplies</span>
                      <span className="font-medium">{loading ? '...' : resources.filter(r => r.category === 'medical').length}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: loading ? '0%' : `${Math.min((resources.filter(r => r.category === 'medical').length / Math.max(resources.length, 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Shelter</span>
                      <span className="font-medium">{loading ? '...' : resources.filter(r => r.category === 'shelter').length}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: loading ? '0%' : `${Math.min((resources.filter(r => r.category === 'shelter').length / Math.max(resources.length, 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default GovernmentDashboard;
