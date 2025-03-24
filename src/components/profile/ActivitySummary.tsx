
import React from 'react';

interface ActivityStats {
  requestsMade: number;
  requestsHelped: number;
  responseReceived: number;
}

interface ActivitySummaryProps {
  stats: ActivityStats;
  isLight: boolean;
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ stats, isLight }) => {
  return (
    <div className={`mt-6 border-t ${isLight ? "border-gray-200" : "border-white/10"} pt-6`}>
      <h3 className="font-medium mb-3">Activity Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className={isLight ? "text-gray-600" : "text-gray-400"}>Requests Made</span>
          <span>{stats.requestsMade}</span>
        </div>
        <div className="flex justify-between">
          <span className={isLight ? "text-gray-600" : "text-gray-400"}>People Helped</span>
          <span>{stats.requestsHelped}</span>
        </div>
        <div className="flex justify-between">
          <span className={isLight ? "text-gray-600" : "text-gray-400"}>Responses Received</span>
          <span>{stats.responseReceived}</span>
        </div>
      </div>
    </div>
  );
};

export default ActivitySummary;
