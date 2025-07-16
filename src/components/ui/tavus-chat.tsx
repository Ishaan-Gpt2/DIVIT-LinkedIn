import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Video, 
  X, 
  Send, 
  Loader2, 
  MessageSquare, 
  Bot, 
  User,
  Maximize2,
  Minimize2
} from 'lucide-react';
import axios from 'axios';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface TavusChatProps {
  isFloating?: boolean;
}

export function TavusChat({ isFloating = false }: TavusChatProps) {
  const [isOpen, setIsOpen] = useState(!isFloating);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your DIVIT.AI support assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // In a real implementation, this would be a server-side API call
      // For demo purposes, we're simulating the API call
      const response = await simulateTavusApiCall(inputValue);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // If the response includes a video URL, set it
      if (response.videoUrl) {
        setVideoUrl(response.videoUrl);
      }
    } catch (error) {
      console.error('Error sending message to Tavus:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting to our servers. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate Tavus API call (in production, this would be a server-side API call)
  const simulateTavusApiCall = async (userMessage: string): Promise<{ message: string, videoUrl?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, return predefined responses based on keywords
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('pricing') || lowerCaseMessage.includes('cost') || lowerCaseMessage.includes('plan')) {
      return {
        message: "We offer several pricing plans to fit your needs. Our Free plan includes 5 credits/month, while our Creator plan at $29/month includes 100 credits and all core features. For unlimited usage, check out our Ghostwriter plan at $79/month or Agency plan at $199/month.",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-business-woman-giving-a-presentation-in-an-office-42918-large.mp4"
      };
    } else if (lowerCaseMessage.includes('demo') || lowerCaseMessage.includes('try') || lowerCaseMessage.includes('test')) {
      return {
        message: "I'd be happy to show you a demo of DIVIT.AI! Our platform offers AI-powered LinkedIn automation with features like post generation, clone building, auto commenting, and connection engine. Would you like me to walk you through a specific feature?",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4"
      };
    } else if (lowerCaseMessage.includes('feature') || lowerCaseMessage.includes('what') || lowerCaseMessage.includes('how')) {
      return {
        message: "DIVIT.AI offers several powerful features: AI Post Generation creates engaging LinkedIn content, Clone Builder replicates your writing style, Auto Commenter engages with relevant posts, and Connection Engine helps you find and connect with ideal prospects. Which feature would you like to learn more about?",
      };
    } else {
      return {
        message: "Thanks for reaching out! I'm here to help with any questions about DIVIT.AI. Our platform helps you automate your LinkedIn presence with AI-powered tools. Is there something specific you'd like to know about our features, pricing, or how to get started?",
      };
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsExpanded(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  return (
    <>
      {isFloating && (
        <motion.div
          className="fixed bottom-6 right-6 z-40"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={toggleChat}
            className={`rounded-full w-14 h-14 shadow-lg ${
              isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`${
              isFloating
                ? 'fixed bottom-24 right-6 z-40 w-96'
                : isExpanded
                ? 'w-full max-w-4xl mx-auto'
                : 'w-full max-w-2xl mx-auto'
            }`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border border-purple-800/30 bg-black/90 backdrop-blur-lg shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-800 to-purple-900 p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3 border-2 border-white">
                    <AvatarImage src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2" />
                    <AvatarFallback className="bg-purple-600">
                      <Bot className="h-5 w-5 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-medium">DIVIT.AI Support</h3>
                    <p className="text-purple-200 text-xs">AI Video Assistant</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!isFloating && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleExpand}
                      className="text-white hover:bg-purple-700/50"
                    >
                      {isExpanded ? (
                        <Minimize2 className="h-5 w-5" />
                      ) : (
                        <Maximize2 className="h-5 w-5" />
                      )}
                    </Button>
                  )}
                  {isFloating && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleChat}
                      className="text-white hover:bg-purple-700/50"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>

              <CardContent className="p-0">
                {/* Video Player */}
                {videoUrl && (
                  <div className="relative w-full bg-black">
                    {!isVideoPlaying ? (
                      <div 
                        className="relative cursor-pointer"
                        onClick={handlePlayVideo}
                      >
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <div className="w-16 h-16 rounded-full bg-purple-600/80 flex items-center justify-center">
                            <Video className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <video 
                          className="w-full h-64 object-cover"
                          src={videoUrl}
                          poster="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        />
                      </div>
                    ) : (
                      <video 
                        className="w-full h-64 object-cover"
                        src={videoUrl}
                        autoPlay
                        controls
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                      onClick={() => {
                        setVideoUrl(null);
                        setIsVideoPlaying(false);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Messages */}
                <div 
                  className={`overflow-y-auto p-4 space-y-4 ${videoUrl ? 'h-48' : 'h-96'}`}
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-white'
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          {message.sender === 'bot' ? (
                            <Bot className="h-4 w-4 mr-2 text-purple-400" />
                          ) : (
                            <User className="h-4 w-4 mr-2 text-purple-200" />
                          )}
                          <span className="text-xs opacity-75">
                            {message.sender === 'user' ? 'You' : 'DIVIT.AI Support'}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="text-right mt-1">
                          <span className="text-xs opacity-50">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 text-white rounded-lg p-3 max-w-[80%]">
                        <div className="flex items-center">
                          <Bot className="h-4 w-4 mr-2 text-purple-400" />
                          <span className="text-xs opacity-75">DIVIT.AI Support</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-purple-800/30 p-4">
                  <div className="flex space-x-2">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message here..."
                      className="flex-1 bg-gray-800/50 border-purple-800/30 text-white placeholder-gray-400 resize-none focus:border-purple-600"
                      rows={1}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs text-gray-400">
                      Powered by DIVIT.AI Video Assistant
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}