
import React, { useState } from 'react';
import { AlertTriangle, Info, Map, Users, Zap, ArrowRight } from 'lucide-react';
import ResourceCard from './ResourceCard';
import StatusUpdate from './StatusUpdate';
import EmergencyContact from './EmergencyContact';
import LocationFinder from './LocationFinder';
import { cn } from '@/lib/utils';
import AnimatedTransition from './AnimatedTransition';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resources' | 'updates' | 'map'>('resources');
  
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-400 mt-1">Latest updates and resources</p>
        </div>
        
        <div className="hidden sm:flex items-center space-x-2">
          <button 
            className={cn(
              'px-4 py-2 rounded-full text-sm transition-colors',
              activeTab === 'resources' 
                ? 'bg-white text-black' 
                : 'bg-white/10 hover:bg-white/15'
            )}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
          
          <button 
            className={cn(
              'px-4 py-2 rounded-full text-sm transition-colors',
              activeTab === 'updates' 
                ? 'bg-white text-black' 
                : 'bg-white/10 hover:bg-white/15'
            )}
            onClick={() => setActiveTab('updates')}
          >
            Updates
          </button>
          
          <button 
            className={cn(
              'px-4 py-2 rounded-full text-sm transition-colors',
              activeTab === 'map' 
                ? 'bg-white text-black' 
                : 'bg-white/10 hover:bg-white/15'
            )}
            onClick={() => setActiveTab('map')}
          >
            Map
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <AnimatedTransition>
          <div className="relative overflow-hidden glass-dark rounded-xl border border-white/10 p-4 sm:p-6">
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-xs">
                <Zap size={12} className="mr-1" />
                <span>Critical</span>
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-4 sm:mb-0 sm:mr-6">
                <div className="flex items-center mb-2">
                  <AlertTriangle size={18} className="mr-2 text-white" />
                  <h2 className="text-xl font-semibold">Hurricane Warning: Category 3</h2>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Evacuation orders in effect for coastal areas. Shelters are open at Central High School and Community Center.
                </p>
                <div className="flex items-center text-xs text-gray-400">
                  <Info size={12} className="mr-1" />
                  <span>Updated 30 minutes ago from National Weather Service</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link to="/emergency-plan" className="px-4 py-2 rounded-full text-sm bg-white text-black hover:bg-white/90 transition-colors">
                  Emergency Plan
                </Link>
                <Link to="/shelter-map" className="px-4 py-2 rounded-full text-sm bg-white/10 hover:bg-white/15 transition-colors">
                  Shelter Map
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
              <h2 className="text-xl font-semibold">Recent Resources</h2>
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
                type="offer"
                category="shelter"
                title="Temporary Housing Available"
                description="Can accommodate up to 3 people in spare rooms. Has generator and supplies."
                location="Hillcrest Area, 22 Oak Street"
                contact="555-123-4567"
                requestId="resource-2"
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
                type="offer"
                category="food"
                title="Hot Meals Available"
                description="Serving hot meals from 12-2pm daily. Can deliver to elderly or disabled."
                location="Community Center, 100 Main St"
                requestId="resource-4"
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
              
              <EmergencyContact
                name="Robert Chen"
                role="Shelter Manager"
                phone="555-456-7890"
                contactId="shelter-1"
                available={false}
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

export default Dashboard;
