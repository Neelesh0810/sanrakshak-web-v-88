
import React, { useState, useEffect } from 'react';
import { Bookmark, X, Info, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogClose, DialogDescription } from '@/components/ui/dialog';

interface SavedStatusUpdate {
  id: string;
  title: string;
  message: string;
  source: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

const SavedStatusUpdates: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [savedUpdates, setSavedUpdates] = useState<SavedStatusUpdate[]>([]);

  useEffect(() => {
    // Load saved updates from localStorage
    const loadSavedUpdates = () => {
      const savedUpdatesData = localStorage.getItem('savedStatusUpdates');
      if (savedUpdatesData) {
        try {
          setSavedUpdates(JSON.parse(savedUpdatesData));
        } catch (error) {
          console.error('Error parsing saved updates:', error);
          setSavedUpdates([]);
        }
      }
    };

    loadSavedUpdates();

    // Listen for storage events to update in real-time across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'savedStatusUpdates') {
        loadSavedUpdates();
      }
    };

    // Listen for custom events for status update saves
    const handleStatusSaved = () => {
      loadSavedUpdates();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('status-saved', handleStatusSaved);
    window.addEventListener('status-unsaved', handleStatusSaved);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('status-saved', handleStatusSaved);
      window.removeEventListener('status-unsaved', handleStatusSaved);
    };
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <>
      <button
        className="flex items-center space-x-2 rounded-full hover:bg-white/5 p-1 transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="Saved Status Updates"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10">
          <Bookmark size={16} />
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[525px] bg-black border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bookmark size={16} className="mr-2" />
              Saved Status Updates
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              View your saved status updates for quick access
            </DialogDescription>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>

          {savedUpdates.length === 0 ? (
            <div className="py-6 text-center">
              <Info className="mx-auto mb-2 h-6 w-6 text-gray-400" />
              <p className="text-gray-400">No saved status updates yet.</p>
              <p className="text-xs text-gray-500 mt-1">
                You can save updates from the status details page.
              </p>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <div className="space-y-4">
                {savedUpdates.map((update) => (
                  <div key={update.id} className="border border-white/10 rounded-lg p-4 bg-black/30">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(update.priority)}`} />
                        <h3 className="font-medium">{update.title}</h3>
                      </div>
                      <span className="text-xs text-gray-400">{update.timestamp}</span>
                    </div>
                    <p className="text-sm mb-3">{update.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Source: {update.source}</span>
                      <Link
                        to={`/alerts/${update.id}`}
                        className="text-xs flex items-center hover:underline"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="mr-1">View Details</span>
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SavedStatusUpdates;
