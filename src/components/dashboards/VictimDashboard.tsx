import React from 'react';
import { Info, Map, ArrowRight } from 'lucide-react';
import ResourceCard from '../ResourceCard';
import StatusUpdate from '../StatusUpdate';
import EmergencyContact from '../EmergencyContact';
import LocationFinder from '../LocationFinder';
import AnimatedTransition from '../AnimatedTransition';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const VictimDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <AnimatedTransition>
          <div className="relative overflow-hidden glass-dark rounded-xl border border-white/10 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="mb-2">
                  <h2 className="text-xl font-semibold">Need Help?</h2>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Request emergency assistance, find shelter, or access resources. Our priority is keeping you safe.
                </p>
                <div className="flex items-center text-xs text-gray-400">
                  <Info size={12} className="mr-1" />
                  <span>Your safety is our top priority</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link to="/resources" className="px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition-colors">
                  Request Help
                </Link>
                <Link to="/shelter-map" className="px-4 py-2 rounded-full text-sm bg-white/10 hover:bg-white/15 transition-colors">
                  Find Shelter
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
              <h2 className="text-xl font-semibold">Available Resources</h2>
              <Link to="/resources" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <span className="mr-1">View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResourceCard
                type="offer"
                category="water"
                title="Clean Drinking Water"
                description="Distribution of bottled water at community center"
                location="Central Community Center"
                requestId="resource-w1"
              />
              
              <ResourceCard
                type="offer"
                category="shelter"
                title="Temporary Housing Available"
                description="Can accommodate up to 30 people in emergency shelters"
                location="Hillcrest Area, St. Mary School"
                contact="555-123-4567"
                requestId="resource-s1"
              />
              
              <ResourceCard
                type="offer"
                category="medical"
                title="Medical Assistance"
                description="First aid, medication refills, and basic health services"
                location="Downtown Medical Center"
                contact="555-987-6543"
                requestId="resource-m1"
              />
              
              <ResourceCard
                type="offer"
                category="food"
                title="Hot Meals Available"
                description="Serving hot meals from 12-2pm daily. Can deliver to elderly or disabled."
                location="Community Center, 100 Main St"
                requestId="resource-f1"
              />
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={200}>
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
        </div>
        
        <div>
          <AnimatedTransition className="mb-6" delay={150}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Emergency Contacts</h2>
              <button className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                <span className="mr-1">View All</span>
                <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="space-y-4">
              <EmergencyContact
                name="Emergency Response"
                role="Coordination Center"
                phone="555-911"
                contactId="emergency-1"
                available={true}
              />
              
              <EmergencyContact
                name="Dr. Sarah Johnson"
                role="Medical Coordinator"
                phone="555-123-7890"
                contactId="medical-1"
                available={true}
              />
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition delay={250}>
            <LocationFinder />
          </AnimatedTransition>
        </div>
      </div>
    </div>
  );
};

export default VictimDashboard;
