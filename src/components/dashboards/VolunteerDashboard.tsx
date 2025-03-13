
import React from 'react';
import { Users, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import ResourceCard from '../ResourceCard';
import StatusUpdate from '../StatusUpdate';
import AnimatedTransition from '../AnimatedTransition';
import { Link } from 'react-router-dom';

const VolunteerDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <AnimatedTransition>
          <div className="relative overflow-hidden glass-dark rounded-xl border border-white/10 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="flex items-center mb-2">
                  <Users size={18} className="mr-2 text-white" />
                  <h2 className="text-xl font-semibold">Volunteer Dashboard</h2>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Thank you for volunteering. Your assistance is making a real difference in people's lives during this emergency.
                </p>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock size={12} className="mr-1" />
                  <span>Last updated: 10 minutes ago</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link to="/resources" className="px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition-colors">
                  Help Requests
                </Link>
                <Link to="/volunteer-tasks" className="px-4 py-2 rounded-full text-sm bg-white/10 hover:bg-white/15 transition-colors">
                  My Tasks
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
              <h2 className="text-xl font-semibold">Assistance Needed</h2>
              <Link to="/resources" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <span className="mr-1">View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <ResourceCard
                type="need"
                category="food"
                title="Food for Family of 5"
                description="Need non-perishable food items for family with three children."
                location="Eastside, Meadow Apartments"
                contact="555-111-2222"
                requestId="resource-5"
              />
              
              <ResourceCard
                type="need"
                category="supplies"
                title="Baby Supplies Needed"
                description="Need diapers (size 2), formula, and baby wipes urgently."
                location="Westside Heights, Building C"
                contact="555-333-4444"
                urgent={true}
                requestId="resource-6"
              />
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={200}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Active Responses</h2>
              <Link to="/volunteer-tasks" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <span className="mr-1">View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-white/10 rounded-xl bg-black/30">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-white/70" />
                      <h3 className="font-medium">Water Delivery</h3>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Delivering bottled water to Riverside District</p>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">In Progress</span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Assigned 2 hours ago</span>
                  <Link to="/volunteer-tasks/task-1" className="text-xs text-white bg-white/10 hover:bg-white/15 px-2 py-1 rounded transition-colors">
                    View Details
                  </Link>
                </div>
              </div>
              
              <div className="p-4 border border-white/10 rounded-xl bg-black/30">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-white/70" />
                      <h3 className="font-medium">Shelter Support</h3>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Helping at Central High School shelter location</p>
                  </div>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Scheduled</span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Today, 4:00 PM - 8:00 PM</span>
                  <Link to="/volunteer-tasks/task-2" className="text-xs text-white bg-white/10 hover:bg-white/15 px-2 py-1 rounded transition-colors">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        </div>
        
        <div>
          <AnimatedTransition className="mb-6" delay={150}>
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
          </AnimatedTransition>
          
          <AnimatedTransition delay={250}>
            <div className="bg-black/30 border border-white/10 rounded-xl p-5">
              <h2 className="text-xl font-semibold mb-4">Volunteer Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Hours volunteered:</span>
                  <span className="font-medium">12 hours</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>People helped:</span>
                  <span className="font-medium">27</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Tasks completed:</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Active tasks:</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Link to="/volunteer-stats" className="text-sm text-white flex items-center justify-center hover:underline">
                    <span>View detailed statistics</span>
                    <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
