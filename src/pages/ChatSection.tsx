
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { ArrowLeft, Send, Paperclip, Image, MapPin, Mic, Phone, Video } from 'lucide-react';

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
  
  useEffect(() => {
    // Get contact info based on contactId
    const getContactInfo = () => {
      // In a real app, this would be an API call
      const contactMap: {[key: string]: any} = {
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
        },
      };
      
      setContact(contactMap[contactId || ''] || { 
        name: 'Unknown Contact',
        role: 'No information available',
        isOnline: false,
      });
    };
    
    // Get message history
    const getMessages = () => {
      // This would normally be an API call to get messages
      const mockMessages: Message[] = [
        {
          id: '1',
          text: 'Hello, how can I assist you during this emergency?',
          sender: 'contact',
          timestamp: new Date(Date.now() - 3600000),
          status: 'read',
        },
        {
          id: '2',
          text: 'I need information about evacuation routes from the east side.',
          sender: 'user',
          timestamp: new Date(Date.now() - 3500000),
          status: 'read',
        },
        {
          id: '3',
          text: 'The main evacuation routes from the east side are Highway 12 and County Road 45. Both are currently open and operational.',
          sender: 'contact',
          timestamp: new Date(Date.now() - 3400000),
          status: 'read',
        },
        {
          id: '4',
          text: 'Is there public transportation available? I don\'t have a vehicle.',
          sender: 'user',
          timestamp: new Date(Date.now() - 3300000),
          status: 'read',
        },
        {
          id: '5',
          text: 'Yes, evacuation buses are running from the East Side Community Center every 30 minutes. The next one leaves at 2:30 PM.',
          sender: 'contact',
          timestamp: new Date(Date.now() - 3200000),
          status: 'read',
        },
      ];
      
      setMessages(mockMessages);
    };
    
    getContactInfo();
    getMessages();
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
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate response from contact
    setTimeout(() => {
      const responseMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        text: "I've received your message and will respond shortly. Please stay safe in the meantime.",
        sender: 'contact',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header emergency={true} />
      
      <main className="flex-grow pt-16 flex flex-col">
        <div className="border-b border-white/10 bg-black/50 backdrop-blur-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center py-3">
              <Link to="/" className="mr-4">
                <ArrowLeft size={20} />
              </Link>
              
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
