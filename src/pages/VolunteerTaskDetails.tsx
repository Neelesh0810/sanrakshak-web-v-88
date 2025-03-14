
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
  CheckCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../context/ThemeProvider';

const VolunteerTaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
        assignedAt: '3/14/2025',
        assignedTime: '8:50:54 PM',
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
  };

  const handleAddNote = () => {
    // This would open a dialog to add a note in a real app
    const newNote = {
      text: 'Delivery completed successfully',
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
    <div className="min-h-screen bg-black text-white">
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
              <div className="bg-black rounded-xl mb-6">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle size={20} className="mr-3 text-white" />
                    <h2 className="text-2xl font-bold">{task.title}</h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {task.priority === 'high' && (
                      <span className="text-xs px-3 py-1 rounded-full bg-red-900/30 text-red-400">
                        High Priority
                      </span>
                    )}
                    
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-900/30 text-blue-400">
                      {task.status === 'in-progress' ? 'In Progress' : task.status}
                    </span>
                  </div>
                  
                  <p className="text-blue-400 mb-8">
                    {task.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Location Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <MapPin size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>{task.location}</span>
                        </div>
                        {task.locationDetails && (
                          <div className="ml-6 text-gray-400">
                            {task.locationDetails}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Time Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Calendar size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>Assigned: {task.assignedAt || new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-start">
                          <Clock size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>Time: {task.assignedTime || new Date(task.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {task.items && task.items.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-3">Items to Deliver</h3>
                      <div className="overflow-hidden">
                        <table className="w-full">
                          <thead className="border-b border-white/10 text-left">
                            <tr>
                              <th className="py-2 font-medium">Item</th>
                              <th className="py-2 font-medium text-right">Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {task.items.map((item: any, index: number) => (
                              <tr key={index} className="border-b border-white/5">
                                <td className="py-3">{item.name}</td>
                                <td className="py-3 text-right">{item.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {task.beneficiary && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-3">Beneficiary Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <User size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>{task.beneficiary.name}</span>
                        </div>
                        
                        {task.beneficiary.contact && (
                          <div className="flex items-start">
                            <Phone size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                            <span>{task.beneficiary.contact}</span>
                          </div>
                        )}
                        
                        {task.beneficiary.notes && (
                          <div className="flex items-start">
                            <AlertTriangle size={16} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                            <span>{task.beneficiary.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {task.notes && task.notes.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">Activity Log</h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleAddNote}
                        >
                          <MessageSquare size={14} className="mr-1" />
                          Add Note
                        </Button>
                      </div>
                      
                      <div className="rounded-lg border border-white/10">
                        <div className="divide-y divide-white/10">
                          {task.notes.map((note: any, index: number) => (
                            <div key={index} className="p-3">
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-sm">{note.user}</span>
                                <span className="text-xs text-gray-400">
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
                
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <Link 
                      to={`/chat/${task.beneficiary?.name.replace(/\s+/g, '-').toLowerCase()}`}
                      className="px-4 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/15 transition-colors"
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
