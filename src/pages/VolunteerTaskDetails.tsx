
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  User, 
  Phone, 
  MessageSquare,
  CheckCheck,
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTheme } from '../context/ThemeProvider';

const VolunteerTaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    // Simulate fetching task details
    setTimeout(() => {
      // This would be a real API call in production
      const mockTask = {
        id: id || 'task-1',
        title: 'Water Delivery',
        type: 'delivery',
        description: 'Delivering bottled water to Riverside District, Block 3. The family has been without clean water for 48 hours and includes an elderly person and two children.',
        location: 'Riverside District, Block 3',
        locationDetails: 'Blue apartment building, Unit 204. There\'s flood damage to the entrance, use side door.',
        status: 'in-progress',
        priority: 'high',
        createdAt: Date.now() - 7200000, // 2 hours ago
        items: [
          { name: 'Bottled water (1L)', quantity: 12 },
          { name: 'Water purification tablets', quantity: 30 }
        ],
        beneficiary: {
          name: 'Sarah Johnson',
          contact: '555-123-4567',
          notes: 'Elderly mother with mobility issues is present'
        },
        notes: [
          { 
            text: 'Initial request received', 
            timestamp: Date.now() - 86400000,
            user: 'System' 
          },
          { 
            text: 'Assigned to volunteer', 
            timestamp: Date.now() - 7200000,
            user: 'Coordinator' 
          },
          { 
            text: 'Called beneficiary, confirming delivery time for 3pm', 
            timestamp: Date.now() - 3600000,
            user: 'You' 
          }
        ]
      };
      
      setTask(mockTask);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleStatusUpdate = (newStatus: string) => {
    setTask({ ...task, status: newStatus });
    
    toast({
      title: "Status Updated",
      description: `Task marked as ${newStatus}`,
    });
    
    // In a real app, this would also update in the admin dashboard
    // Dispatch an event to simulate real-time updates
    window.dispatchEvent(new Event('resource-updated'));
  };

  const handleAddNoteSubmit = () => {
    if (!noteText.trim()) {
      toast({
        title: "Note Required",
        description: "Please enter a note before submitting",
        variant: "destructive"
      });
      return;
    }
    
    const newNote = {
      text: noteText,
      timestamp: Date.now(),
      user: 'You'
    };
    
    setTask({
      ...task,
      notes: [...task.notes, newNote]
    });
    
    toast({
      title: "Note Added",
      description: "Your note has been added to the task",
    });
    
    setNoteText('');
    setIsNoteDialogOpen(false);
    
    // In a real app, this would also update in the admin dashboard
    // Dispatch an event to simulate real-time updates
    window.dispatchEvent(new Event('resource-updated'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 container mx-auto px-4">
          <div className="animate-pulse max-w-3xl mx-auto">
            <div className="h-8 w-1/2 rounded bg-gray-300 dark:bg-gray-700 mb-4"></div>
            <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700 mb-2"></div>
            <div className="h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-700 mb-4"></div>
            
            <div className="h-32 rounded bg-gray-300 dark:bg-gray-700 mb-4"></div>
            
            <div className="space-y-2">
              <div className="h-4 w-1/3 rounded bg-gray-300 dark:bg-gray-700"></div>
              <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-700"></div>
              <div className="h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 container mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold">Task not found</h2>
          <p className="mt-2 mb-4">The task you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/volunteer-tasks')}>
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center">
                <Link to="/volunteer-tasks" className="mr-2 p-2 rounded-full hover:bg-white/10 transition-colors">
                  <ArrowLeft size={18} />
                </Link>
                <h1 className="text-2xl font-bold">Task Details</h1>
              </div>
            </div>
            
            <AnimatedTransition>
              <div className={`rounded-xl border mb-6 ${
                isLight ? 'bg-white border-gray-200' : 'bg-black/30 border-white/10'
              }`}>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-3">
                        <CheckCircle size={20} className="mr-2 text-primary" />
                        <h2 className="text-xl font-semibold">{task.title}</h2>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          task.priority === 'high' 
                            ? (isLight ? 'bg-red-100 text-red-700' : 'bg-red-900/30 text-red-400')
                            : (isLight ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-900/30 text-yellow-400')
                        }`}>
                          {task.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                        </span>
                        
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          task.status === 'in-progress'
                            ? (isLight ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-400')
                            : (isLight ? 'bg-green-100 text-green-700' : 'bg-green-900/30 text-green-400') 
                        }`}>
                          {task.status === 'in-progress' ? 'In Progress' : 'Completed'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {task.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className={`p-4 rounded-lg ${
                          isLight ? 'bg-gray-50' : 'bg-black/40'
                        }`}>
                          <h3 className="font-medium mb-3">Location Details</h3>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <MapPin size={14} className="mr-2 opacity-70" />
                              <span>{task.location}</span>
                            </div>
                            {task.locationDetails && (
                              <p className="text-sm ml-6">{task.locationDetails}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg ${
                          isLight ? 'bg-gray-50' : 'bg-black/40'
                        }`}>
                          <h3 className="font-medium mb-3">Time Information</h3>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Calendar size={14} className="mr-2 opacity-70" />
                              <span>Assigned: {new Date(task.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock size={14} className="mr-2 opacity-70" />
                              <span>Time: {new Date(task.createdAt).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {task.items && task.items.length > 0 && (
                        <div className="mb-6">
                          <h3 className="font-medium mb-3">Items to Deliver</h3>
                          <div className={`rounded-lg overflow-hidden border ${
                            isLight ? 'border-gray-200' : 'border-white/10'
                          }`}>
                            <table className="w-full">
                              <thead className={isLight ? 'bg-gray-50' : 'bg-black/40'}>
                                <tr>
                                  <th className="px-4 py-2 text-left text-sm font-medium">Item</th>
                                  <th className="px-4 py-2 text-right text-sm font-medium">Quantity</th>
                                </tr>
                              </thead>
                              <tbody>
                                {task.items.map((item: any, index: number) => (
                                  <tr key={index} className={`${
                                    isLight
                                      ? index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                      : index % 2 === 0 ? 'bg-black/20' : 'bg-black/40'
                                  }`}>
                                    <td className="px-4 py-2 text-sm">{item.name}</td>
                                    <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      
                      {task.beneficiary && (
                        <div className="mb-6">
                          <h3 className="font-medium mb-3">Beneficiary Information</h3>
                          <div className={`p-4 rounded-lg ${
                            isLight ? 'bg-gray-50' : 'bg-black/40'
                          }`}>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <User size={14} className="mr-2 opacity-70" />
                                <span>{task.beneficiary.name}</span>
                              </div>
                              
                              {task.beneficiary.contact && (
                                <div className="flex items-center">
                                  <Phone size={14} className="mr-2 opacity-70" />
                                  <span>{task.beneficiary.contact}</span>
                                </div>
                              )}
                              
                              {task.beneficiary.notes && (
                                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-white/10">
                                  <div className="flex items-start">
                                    <AlertTriangle size={14} className="mr-2 mt-0.5 opacity-70" />
                                    <span className="text-sm">{task.beneficiary.notes}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {task.notes && task.notes.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium">Activity Log</h3>
                            <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                >
                                  <MessageSquare size={14} className="mr-1" />
                                  Add Note
                                </Button>
                              </DialogTrigger>
                              <DialogContent className={isLight ? "" : "bg-black border-white/10"}>
                                <DialogHeader>
                                  <DialogTitle>Add Note</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                  <Textarea
                                    placeholder="Enter your note here..."
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setIsNoteDialogOpen(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button onClick={handleAddNoteSubmit}>
                                    Add Note
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          
                          <div className={`rounded-lg border ${
                            isLight ? 'border-gray-200' : 'border-white/10'
                          }`}>
                            <div className="divide-y divide-gray-100 dark:divide-white/10">
                              {task.notes.map((note: any, index: number) => (
                                <div key={index} className="p-3">
                                  <div className="flex justify-between items-start">
                                    <span className="font-medium text-sm">{note.user}</span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(note.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm">{note.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={`px-6 py-4 border-t ${
                  isLight ? 'border-gray-100' : 'border-white/10'
                } flex items-center justify-between`}>
                  <div>
                    <Link 
                      to={`/chat/${task.beneficiary?.name.replace(/\s+/g, '-').toLowerCase()}`}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        isLight 
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' 
                          : 'bg-white/10 hover:bg-white/15'
                      } transition-colors`}
                    >
                      <MessageSquare size={14} className="inline-block mr-1.5" />
                      Message Beneficiary
                    </Link>
                  </div>
                  
                  <div className="flex space-x-2">
                    {task.status === 'in-progress' && (
                      <Button 
                        variant="default"
                        onClick={() => handleStatusUpdate('completed')}
                      >
                        <CheckCheck size={16} className="mr-1.5" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedTransition>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VolunteerTaskDetails;
