
import React from 'react';
import { FileText, ChevronRight, FileBarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportItem {
  id: string;
  title: string;
  date: string;
  type: 'resource' | 'activity' | 'emergency';
  downloadUrl: string;
}

const ReportsSection = () => {
  // Mock data for reports
  const reports: ReportItem[] = [
    {
      id: '1',
      title: 'Monthly Resource Allocation Report',
      date: '2023-06-01',
      type: 'resource',
      downloadUrl: '#'
    },
    {
      id: '2',
      title: 'Emergency Response Activity Summary',
      date: '2023-05-15',
      type: 'activity',
      downloadUrl: '#'
    },
    {
      id: '3',
      title: 'Critical Needs Assessment',
      date: '2023-05-01',
      type: 'emergency',
      downloadUrl: '#'
    },
    {
      id: '4',
      title: 'Resource Distribution Analysis',
      date: '2023-04-20',
      type: 'resource',
      downloadUrl: '#'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReportTypeClass = (type: string) => {
    switch (type) {
      case 'resource':
        return 'bg-blue-500/20 text-blue-300';
      case 'activity':
        return 'bg-green-500/20 text-green-300';
      case 'emergency':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="glass-dark rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileBarChart2 className="mr-2" size={24} />
          <h2 className="text-xl font-semibold">Reports</h2>
        </div>
      </div>
      
      <div className="space-y-4">
        {reports.map(report => (
          <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-white/5 hover:bg-black/60 transition-colors">
            <div className="flex items-center">
              <FileText className="text-gray-400 mr-3" size={20} />
              <div>
                <h3 className="font-medium">{report.title}</h3>
                <p className="text-sm text-gray-400">{formatDate(report.date)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`text-xs px-2.5 py-1 rounded-full ${getReportTypeClass(report.type)}`}>
                {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
              </span>
              
              <Button variant="ghost" size="sm" asChild>
                <a href={report.downloadUrl} download className="flex items-center">
                  <span className="mr-1">View</span>
                  <ChevronRight size={16} />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsSection;
