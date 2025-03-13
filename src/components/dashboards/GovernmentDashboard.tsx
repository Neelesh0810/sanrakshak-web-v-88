
import React from 'react';
import { Shield, PieChart, AlertTriangle, ArrowRight, Map, FileBarChart } from 'lucide-react';
import StatusUpdate from '../StatusUpdate';
import AnimatedTransition from '../AnimatedTransition';
import { Link } from 'react-router-dom';

const GovernmentDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <AnimatedTransition>
          <div className="relative overflow-hidden glass-dark rounded-xl border border-white/10 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="flex items-center mb-2">
                  <Shield size={18} className="mr-2 text-white" />
                  <h2 className="text-xl font-semibold">Emergency Management</h2>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Centralized disaster response coordination, resource allocation, and critical decision support.
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Link to="/emergency-alert" className="px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition-colors">
                  Issue Alert
                </Link>
                <Link to="/operations" className="px-4 py-2 rounded-full text-sm bg-white/10 hover:bg-white/15 transition-colors">
                  Operations Center
                </Link>
              </div>
            </div>
          </div>
        </AnimatedTransition>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnimatedTransition className="mb-6" delay={100}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">System Status</h2>
              <Link to="/system-status" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <span className="mr-1">Full View</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-dark border border-white/10 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <h3 className="font-medium">Critical</h3>
                </div>
                <div className="text-3xl font-bold mb-2">3</div>
                <div className="text-xs text-gray-400">Power, Medical, Transportation</div>
              </div>
              
              <div className="glass-dark border border-white/10 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <h3 className="font-medium">Warning</h3>
                </div>
                <div className="text-3xl font-bold mb-2">7</div>
                <div className="text-xs text-gray-400">Water, Shelter, Communication</div>
              </div>
              
              <div className="glass-dark border border-white/10 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <h3 className="font-medium">Operational</h3>
                </div>
                <div className="text-3xl font-bold mb-2">12</div>
                <div className="text-xs text-gray-400">Emergency Response, Coordination</div>
              </div>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition className="mb-6" delay={150}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Current Alerts</h2>
              <Link to="/issue-alert" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <span className="mr-1">Issue New Alert</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-white/10 rounded-xl bg-black/30">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <AlertTriangle size={16} className="mr-2 text-red-500" />
                      <h3 className="font-medium">Evacuation Order</h3>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Mandatory evacuation for coastal areas zones A and B</p>
                  </div>
                  <span className="text-xs bg-red-900/30 text-red-200 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Issued 12 hours ago</span>
                  <div className="flex space-x-2">
                    <button className="text-xs text-white bg-white/10 hover:bg-white/15 px-2 py-1 rounded transition-colors">
                      Edit
                    </button>
                    <button className="text-xs text-white bg-white/10 hover:bg-white/15 px-2 py-1 rounded transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-white/10 rounded-xl bg-black/30">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <AlertTriangle size={16} className="mr-2 text-yellow-500" />
                      <h3 className="font-medium">Flash Flood Warning</h3>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Western and central districts expecting heavy rainfall</p>
                  </div>
                  <span className="text-xs bg-yellow-900/30 text-yellow-200 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Issued 4 hours ago</span>
                  <div className="flex space-x-2">
                    <button className="text-xs text-white bg-white/10 hover:bg-white/15 px-2 py-1 rounded transition-colors">
                      Edit
                    </button>
                    <button className="text-xs text-white bg-white/10 hover:bg-white/15 px-2 py-1 rounded transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={200}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Status Updates</h2>
              <Link to="/create-update" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <span className="mr-1">Create Update</span>
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
              
              <StatusUpdate
                id="status-3"
                title="Medical Supply Delivery"
                message="Additional medical supplies have arrived at Central Hospital and Community Clinic."
                source="Health Department"
                timestamp="5 hours ago"
                priority="low"
              />
            </div>
          </AnimatedTransition>
        </div>
        
        <div>
          <AnimatedTransition className="mb-6" delay={150}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Resource Overview</h2>
              <Link to="/resource-allocation" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <span className="mr-1">Details</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-white/10 rounded-xl bg-black/30">
                <div className="flex items-center mb-3">
                  <PieChart size={16} className="mr-2" />
                  <h3 className="font-medium">Resource Allocation</h3>
                </div>
                <div className="mt-3 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Emergency Response</span>
                      <span>42%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Evacuation & Shelter</span>
                      <span>28%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Medical Services</span>
                      <span>18%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Infrastructure Repair</span>
                      <span>12%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={200}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link 
                to="/emergency-alert" 
                className="p-4 border border-white/10 rounded-xl bg-black/30 hover:bg-black/50 transition-colors text-center"
              >
                <AlertTriangle size={24} className="mx-auto mb-2" />
                <span className="text-sm">Issue Alert</span>
              </Link>
              
              <Link 
                to="/resource-allocation" 
                className="p-4 border border-white/10 rounded-xl bg-black/30 hover:bg-black/50 transition-colors text-center"
              >
                <PieChart size={24} className="mx-auto mb-2" />
                <span className="text-sm">Allocate Resources</span>
              </Link>
              
              <Link 
                to="/situational-map" 
                className="p-4 border border-white/10 rounded-xl bg-black/30 hover:bg-black/50 transition-colors text-center"
              >
                <Map size={24} className="mx-auto mb-2" />
                <span className="text-sm">View Map</span>
              </Link>
              
              <Link 
                to="/reports" 
                className="p-4 border border-white/10 rounded-xl bg-black/30 hover:bg-black/50 transition-colors text-center"
              >
                <FileBarChart size={24} className="mx-auto mb-2" />
                <span className="text-sm">Reports</span>
              </Link>
            </div>
          </AnimatedTransition>
        </div>
      </div>
    </div>
  );
};

export default GovernmentDashboard;
