
import React, { useState, useEffect } from 'react';
import { Users, ArrowRight, Clock, AlertTriangle, CheckCircle, MapPin, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusUpdate from '../StatusUpdate';
import AnimatedTransition from '../AnimatedTransition';
import SavedAlerts from '../SavedAlerts';
import useResourceData from '@/hooks/useResourceData';

interface NGODashboardProps {
  resourceData?: ReturnType<typeof useResourceData>;
}

const NGODashboard: React.FC<NGODashboardProps> = ({ resourceData }) => {
  const { resources, responses } = resourceData || useResourceData();
  const [mostUrgentNeeds, setMostUrgentNeeds] = useState<any[]>([]);
  
  useEffect(() => {
    // Filter and sort urgent needs
    const urgentNeeds = resources
      .filter(resource => resource.type === 'need' && resource.urgent)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);
    
    setMostUrgentNeeds(urgentNeeds);
  }, [resources]);
  
  // Calculate resource statistics
  const stats = {
    totalRequests: resources.filter(r => r.type === 'need').length,
    totalResponses: responses.length,
    urgentNeeds: resources.filter(r => r.type === 'need' && r.urgent).length,
    resolvedCases: responses.filter(r => r.status === 'accepted').length
  };
  
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <AnimatedTransition>
          <div className="relative overflow-hidden glass-dark rounded-xl border border-white/10 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="flex items-center mb-2">
                  <Users size={18} className="mr-2 text-white" />
                  <h2 className="text-xl font-semibold">NGO Dashboard</h2>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Coordinate your organization's disaster response efforts and track resource allocation.
                </p>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock size={12} className="mr-1" />
                  <span>Last updated: just now</span>
                </div>
              </div>
              
              <div className="flex space-x-2 items-center">
                <SavedAlerts />
                <Link to="/resources" className="px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition-colors">
                  View Resources
                </Link>
                <Link to="/emergency-plan" className="px-4 py-2 rounded-full text-sm bg-white/10 hover:bg-white/15 transition-colors">
                  Response Plan
                </Link>
              </div>
            </div>
          </div>
        </AnimatedTransition>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AnimatedTransition delay={100}>
          <div className="bg-black/30 border border-white/10 p-4 rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Requests</p>
                <h3 className="text-2xl font-semibold mt-1">{stats.totalRequests}</h3>
              </div>
              <span className="p-2 bg-white/10 rounded-full">
                <CheckCircle size={16} />
              </span>
            </div>
          </div>
        </AnimatedTransition>
        
        <AnimatedTransition delay={150}>
          <div className="bg-black/30 border border-white/10 p-4 rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Responses Sent</p>
                <h3 className="text-2xl font-semibold mt-1">{stats.totalResponses}</h3>
              </div>
              <span className="p-2 bg-white/10 rounded-full">
                <ArrowRight size={16} />
              </span>
            </div>
          </div>
        </AnimatedTransition>
        
        <AnimatedTransition delay={200}>
          <div className="bg-black/30 border border-white/10 p-4 rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Urgent Needs</p>
                <h3 className="text-2xl font-semibold mt-1">{stats.urgentNeeds}</h3>
              </div>
              <span className="p-2 bg-white/10 rounded-full">
                <AlertTriangle size={16} />
              </span>
            </div>
          </div>
        </AnimatedTransition>
        
        <AnimatedTransition delay={250}>
          <div className="bg-black/30 border border-white/10 p-4 rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Resolved Cases</p>
                <h3 className="text-2xl font-semibold mt-1">{stats.resolvedCases}</h3>
              </div>
              <span className="p-2 bg-white/10 rounded-full">
                <CheckCircle size={16} />
              </span>
            </div>
          </div>
        </AnimatedTransition>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnimatedTransition delay={150}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Most Urgent Needs</h2>
                <Link to="/resources" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                  <span className="mr-1">View All</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
              
              <div className="space-y-4">
                {mostUrgentNeeds.length > 0 ? (
                  mostUrgentNeeds.map((need) => (
                    <div key={need.id} className="bg-black/30 border border-white/10 rounded-xl p-4">
                      <div className="flex items-start">
                        <div className="p-2 bg-white/10 rounded-full mr-3">
                          <AlertTriangle size={16} />
                        </div>
                        <div>
                          <h3 className="font-medium">{need.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{need.description}</p>
                          
                          <div className="mt-3 flex items-center text-xs text-gray-500">
                            <MapPin size={12} className="mr-1" />
                            <span>{need.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-white/5 flex justify-end">
                        <Link to={`/resource/${need.id}`} className="px-3 py-1 rounded text-xs bg-white/10 hover:bg-white/15 transition-colors">
                          Respond
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-black/30 border border-white/10 rounded-xl p-6 text-center">
                    <p className="text-gray-400">No urgent needs at the moment</p>
                  </div>
                )}
              </div>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={200}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Resource Distribution</h2>
                <Link to="/admin-dashboard" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                  <span className="mr-1">Full Report</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
              
              <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                <div className="h-64 rounded bg-black/50 border border-white/5 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <BarChart size={32} className="mx-auto mb-2 text-gray-500" />
                    <p className="text-gray-400">Resource distribution chart</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Displaying resource allocation by category
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="p-2 bg-white/5 rounded">
                    <p className="text-xs text-gray-400">Water</p>
                    <p className="font-medium">42%</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded">
                    <p className="text-xs text-gray-400">Food</p>
                    <p className="font-medium">27%</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded">
                    <p className="text-xs text-gray-400">Shelter</p>
                    <p className="font-medium">18%</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        </div>
        
        <div>
          <AnimatedTransition delay={250}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Status Updates</h2>
                <Link to="/alerts" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                  <span className="mr-1">View All</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
              
              <div className="space-y-4">
                <StatusUpdate
                  id="status-1"
                  title="Power Restoration Progress"
                  message="Crews are working to restore power to the eastern district. Estimated completion: 24 hours."
                  source="City Power & Utilities"
                  timestamp="1 hour ago"
                  priority="high"
                />
                
                <StatusUpdate
                  id="status-2"
                  title="Road Closure Update"
                  message="Main Street between 5th and 8th Ave remains flooded and closed to traffic. Use alternate routes."
                  source="Department of Transportation"
                  timestamp="3 hours ago"
                  priority="medium"
                />
              </div>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={300}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Team Activity</h2>
                <Link to="/admin-dashboard" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                  <span className="mr-1">Details</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
              
              <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span>Active volunteers:</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Field teams:</span>
                    <span className="font-medium">6</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Completed tasks:</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Response time (avg):</span>
                    <span className="font-medium">27 min</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
