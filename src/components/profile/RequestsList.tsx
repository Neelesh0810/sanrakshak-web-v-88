
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Request {
  id: string;
  title: string;
  type: string;
  category: string;
  description: string;
  location: string;
  createdAt: string;
}

interface RequestsListProps {
  requests: Request[];
  isLight: boolean;
}

const RequestsList: React.FC<RequestsListProps> = ({ requests, isLight }) => {
  const navigate = useNavigate();
  
  if (requests.length === 0) {
    return (
      <div className="text-center py-10">
        <p className={isLight ? "text-gray-600" : "text-gray-400"}>You haven't made any requests yet</p>
        <button 
          onClick={() => navigate('/connect')}
          className={`mt-4 px-4 py-2 ${isLight ? "bg-gray-100 hover:bg-gray-200" : "bg-white/10 hover:bg-white/15"} rounded-lg transition-colors`}
        >
          Request or Offer Resources
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div 
          key={request.id}
          className={`p-4 border rounded-lg ${isLight ? "border-gray-200" : "border-white/10"}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  request.type === 'need' 
                    ? isLight ? "bg-blue-500" : "bg-white" 
                    : isLight ? "bg-green-500" : "bg-gray-400"
                }`}></span>
                <h3 className="font-medium">{request.title}</h3>
              </div>
              <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"} mt-1`}>
                {request.type === 'need' ? 'Requested' : 'Offered'}: {request.category}
              </p>
            </div>
            <span className={`text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
              {new Date(request.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <p className="mt-2 text-sm">{request.description}</p>
          
          <div className={`mt-2 flex items-center text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            <span>Location: {request.location}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestsList;
