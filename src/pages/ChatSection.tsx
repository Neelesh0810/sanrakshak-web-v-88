
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ArrowLeft, Send, Paperclip, Image, MapPin, Mic, Phone, Video } from 'lucide-react';
import { getAllUsers } from '../utils/userService';
import BackButton from '../components/BackButton';
import { toast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'contact';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

const ChatSection = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get contact info based on contactId
    const getContactInfo = () => {
      setLoading(true);
      setError(null);
      
      // Check if contactId is a UUID or one of the predefined contacts
      const predefinedContacts: {[key: string]: any} = {
        'emergency-1': {
          name: 'Emergency Response',
          role: 'Coordination Center',
          phone: '555-911',
          isOnline: true,
        },
        'medical-1': {
          name: 'Dr. Sarah Johnson',
          role: 'Medical Coordinator',
          phone: '555-123-7890',
          isOnline: true,
        },
        'shelter-1': {
          name: 'Robert Chen',
          role: 'Shelter Manager',
          phone: '555-456-7890',
          isOnline: false,
        }
      };
      
      // First check if it's a predefined contact
      if (predefinedContacts[contactId || '']) {
        setContact(predefinedContacts[contactId || '']);
        setLoading(false);
        return;
      }
      
      // Then check if it's a user from userService
      try {
        const allUsers = getAllUsers();
        const userContact = allUsers.find(user => user.id === contactId);
        
        if (userContact) {
          // Safely check if lastActive exists before using includes
          const isOnline = userContact.lastActive ? 
            (userContact.lastActive === 'just now' || userContact.lastActive.includes('minute')) : 
            false;
            
          setContact({
            name: userContact.name,
            role: userContact.role,
            phone: userContact.contactInfo,
            isOnline: isOnline,
          });
        } else {
          // Invalid contact ID
          setError(`Contact not found. The contact ID ${contactId} does not exist.`);
          setContact({ 
            name: "Unknown Contact",
            role: "No information available",
            isOnline: false,
          });
          
          // Show toast notification
          toast({
            title: "Contact not found",
            description: "This chat doesn't exist or has been removed.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error finding contact:", error);
        setError("Error loading contact information");
        setContact({ 
          name: "Error",
          role: "Could not load contact information",
          isOnline: false,
        });
      } finally {
        setLoading(false);
      }
    };
    
    // Get message history or create empty conversation
    const getMessages = () => {
      if (!contactId) {
        setError("No contact ID provided");
        return;
      }
      
      const savedMessages = localStorage.getItem(`chat_${contactId}`);
      
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          // Convert string dates back to Date objects
          const processedMessages = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(processedMessages);
        } catch (error) {
          console.error("Error parsing saved messages:", error);
          setMessages([]);
        }
      } else if (contactId) {
        // Create welcome message for new conversations
        const initialMessage: Message = {
          id: `msg-init-${Date.now()}`,
          text: `Hello, this is a new conversation with ${contactId}. How can I assist you?`,
          sender: 'contact',
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
        
        // Save the initial message
        localStorage.setItem(`chat_${contactId}`, JSON.stringify([initialMessage]));
      }
    };
    
    if (contactId) {
      getContactInfo();
      getMessages();
    } else {
      setError("No contact ID provided");
      setLoading(false);
    }
  }, [contactId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewMessage('');
    
    // Save to localStorage
    localStorage.setItem(`chat_${contactId}`, JSON.stringify(updatedMessages));
    
    // Simulate response from contact
    setTimeout(() => {
      const responseMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        text: "I've received your message and will respond shortly. Please stay safe in the meantime.",
        sender: 'contact',
        timestamp: new Date(),
      };
      
      const messagesWithResponse = [...updatedMessages, responseMessage];
      setMessages(messagesWithResponse);
      
      // Update localStorage with response
      localStorage.setItem(`chat_${contactId}`, JSON.stringify(messagesWithResponse));
    }, 2000);
  };
  
  const handleGoBack = () => {
    // Get current user role from localStorage
    const currentUser = localStorage.getItem('authUser');
    let role = '';
    
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        role = user.role;
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
    
    // Redirect based on user role
    if (role === 'ngo') {
      navigate('/dashboard');
    } else if (role === 'volunteer') {
      navigate('/dashboard');
    } else if (role === 'government') {
      navigate('/dashboard');
    } else {
      // Default fallback
      navigate('/dashboard');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Header emergency={true} />
        <div className="pt-16 text-center">
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header emergency={true} />
        <div className="pt-16 flex flex-col items-center justify-center flex-grow">
          <div className="text-center p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Chat not available</h2>
            <p className="mb-6">{error}</p>
            <button
              onClick={handleGoBack}
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header emergency={true} />
      
      <main className="flex-grow pt-16 flex flex-col">
        <div className="border-b border-white/10 bg-black/50 backdrop-blur-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center py-3">
              <button onClick={handleGoBack} className="mr-4">
                <ArrowLeft size={20} />
              </button>
              
              <div className="flex-grow">
                <h2 className="font-medium">{contact?.name}</h2>
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${contact?.isOnline ? 'bg-white' : 'bg-gray-600'}`}></div>
                  <span className="text-xs text-gray-400">{contact?.role}</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <Phone size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <Video size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto px-4 py-6">
          <div className="container mx-auto max-w-3xl space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user' 
                      ? 'bg-white/10 rounded-tr-none' 
                      : 'bg-white/5 rounded-tl-none'
                  }`}
                >
                  <div className="text-sm mb-1">{message.text}</div>
                  <div className="text-xs text-gray-400 flex justify-end">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {message.sender === 'user' && message.status && (
                      <span className="ml-2">{message.status === 'read' ? '✓✓' : '✓'}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-white/10 bg-black/50 backdrop-blur-md py-4">
          <div className="container mx-auto max-w-3xl px-4">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <button type="button" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <Paperclip size={20} />
              </button>
              
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 focus:outline-none focus:border-white/30"
                />
                
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <button type="button" className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                    <Image size={18} className="text-gray-400" />
                  </button>
                  <button type="button" className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                    <MapPin size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>
              
              <button type="button" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <Mic size={20} />
              </button>
              
              <button 
                type="submit" 
                className="p-2 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatSection;
