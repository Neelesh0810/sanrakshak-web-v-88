
import React from 'react';
import { Building, ArrowRight, PieChart, Users, Map, Plus } from 'lucide-react';
import ResourceCard from '../ResourceCard';
import StatusUpdate from '../StatusUpdate';
import AnimatedTransition from '../AnimatedTransition';
import { Link } from 'react-router-dom';

const NGODashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <AnimatedTransition>
          <div className="relative overflow-hidden glass-dark rounded-xl border border-white/10 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="flex items-center mb-2">
                  <Building size={18} className="mr-2 text-white" />
                  <h2 className="text-xl font-semibold">NGO Operations</h2>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Coordinate disaster response efforts, manage resources, and track impact across affected areas.
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Link to="/resource-management" className="px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition-colors">
                  Manage Resources
                </Link>
                <Link to="/ngo-reports" className="px-4 py-2 rounded-full text-sm bg-white/10 hover:bg-white/15 transition-colors">
                  View Reports
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
              <h2 className="text-xl font-semibold">Resource Management</h2>
              <Link to="/resource-management" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <span className="mr-1">Manage All</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 border border-white/10 bg-black/30 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">Water Supplies</h3>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Available</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">5,000 bottles ready for distribution</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Updated 30 minutes ago</span>
                  <Link to="/resource-management/water" className="text-white hover:underline flex items-center">
                    <span>Details</span>
                    <ArrowRight size={12} className="ml-1" />
                  </Link>
                </div>
              </div>
              
              <div className="p-5 border border-white/10 bg-black/30 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">Food Supplies</h3>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Low Stock</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">120 meal kits remaining (Critical level)</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Updated 45 minutes ago</span>
                  <Link to="/resource-management/food" className="text-white hover:underline flex items-center">
                    <span>Details</span>
                    <ArrowRight size={12} className="ml-1" />
                  </Link>
                </div>
              </div>
              
              <div className="p-5 border border-white/10 bg-black/30 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">Medical Supplies</h3>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Available</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">First aid kits, medications, and basic medical equipment</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Updated 2 hours ago</span>
                  <Link to="/resource-management/medical" className="text-white hover:underline flex items-center">
                    <span>Details</span>
                    <ArrowRight size={12} className="ml-1" />
                  </Link>
                </div>
              </div>
              
              <div className="p-5 border border-white/10 bg-black/30 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">Shelter Capacity</h3>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">65% Full</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">3 shelter locations with capacity for 150 more people</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Updated 1 hour ago</span>
                  <Link to="/resource-management/shelter" className="text-white hover:underline flex items-center">
                    <span>Details</span>
                    <ArrowRight size={12} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link to="/resource-management/add" className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg transition-colors">
                <Plus size={16} className="mr-1" />
                <span>Add New Resource</span>
              </Link>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={200}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Help Requests</h2>
              <Link to="/resource-requests" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <span className="mr-1">View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="space-y-4">
              <ResourceCard
                type="need"
                category="water"
                title="Clean Drinking Water"
                description="Urgently need bottled water for family of 4, including infant."
                location="Riverside District, Block 3"
                urgent={true}
                requestId="resource-1"
              />
              
              <ResourceCard
                type="need"
                category="medical"
                title="Diabetes Medication"
                description="Need insulin and blood sugar testing supplies."
                location="Downtown, Apartment Complex B"
                contact="555-987-6543"
                urgent={true}
                requestId="resource-3"
              />
            </div>
          </AnimatedTransition>
        </div>
        
        <div>
          <AnimatedTransition className="mb-6" delay={150}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Impact Dashboard</h2>
              <Link to="/ngo-reports" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <span className="mr-1">Full Report</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-white/10 rounded-xl bg-black/30">
                <div className="flex items-center mb-3">
                  <Users size={16} className="mr-2" />
                  <h3 className="font-medium">People Assisted</h3>
                </div>
                <div className="text-3xl font-bold mb-2">1,247</div>
                <div className="text-xs text-gray-400">Increase of 215 from yesterday</div>
              </div>
              
              <div className="p-4 border border-white/10 rounded-xl bg-black/30">
                <div className="flex items-center mb-3">
                  <Map size={16} className="mr-2" />
                  <h3 className="font-medium">Areas Covered</h3>
                </div>
                <div className="text-3xl font-bold mb-2">8</div>
                <div className="text-xs text-gray-400">2 new areas since yesterday</div>
              </div>
              
              <div className="p-4 border border-white/10 rounded-xl bg-black/30">
                <div className="flex items-center mb-3">
                  <PieChart size={16} className="mr-2" />
                  <h3 className="font-medium">Resource Distribution</h3>
                </div>
                <div className="mt-3 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Water</span>
                      <span>38%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: '38%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Food</span>
                      <span>27%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: '27%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Medical</span>
                      <span>20%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Shelter</span>
                      <span>15%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={250}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Status Updates</h2>
              <Link to="/alerts" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <span className="mr-1">View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <StatusUpdate
              id="status-1"
              title="Power Restoration Progress"
              message="Crews are working to restore power to the eastern district. Estimated completion: 24 hours."
              source="City Power & Utilities"
              timestamp="1 hour ago"
              priority="high"
            />
          </AnimatedTransition>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
