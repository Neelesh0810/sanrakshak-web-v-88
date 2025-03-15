
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReportsSection from '@/components/ReportsSection';

const Reports = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center text-gray-400 hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold">NGO Reports</h1>
          <p className="text-gray-400">Access and download all disaster response reports.</p>
        </div>
        
        <ReportsSection />
      </div>
    </div>
  );
};

export default Reports;
