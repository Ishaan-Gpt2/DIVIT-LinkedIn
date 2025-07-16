import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, X, Send, Bot, User, Video } from 'lucide-react';
import { sendTavusMessage } from '@/services/api';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  videoUrl?: string;
}

interface SmartChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

export function SmartChatbot({ isOpen, onClose, messages = [], isLoading, onSendMessage }: SmartChatbotProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      await onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-24 right-4 sm:right-8 w-full max-w-md z-50 smart-chatbot-container"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-800/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 to-purple-900 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 bg-purple-700">
                  <AvatarImage src="/logo.png" alt="DIVIT.AI" />
                  <AvatarFallback className="bg-purple-700 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-white font-medium text-sm">DIVIT.AI Assistant</h3>
                  <p className="text-purple-200 text-xs">AI-powered support</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-purple-700/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="p-4 h-96 overflow-y-auto bg-gradient-to-b from-gray-900/50 to-black/50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 ${
                        message.sender === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-100'
                      }`}
                    >
                      <div className="flex items-start">
                        {message.sender === 'bot' && (
                          <Avatar className="h-6 w-6 mr-2 mt-0.5 bg-purple-700 flex-shrink-0">
                            <AvatarFallback className="bg-purple-700 text-white">
                              <Bot className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          
                          {/* Video attachment */}
                          {message.videoUrl && (
                            <div className="mt-2">
                              {activeVideo === message.id ? (
                                <div className="relative pt-[56.25%] rounded-lg overflow-hidden bg-black">
                                  <video 
                                    src={message.videoUrl}
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                    controls
                                    autoPlay
                                  />
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-1 bg-purple-900/50 border-purple-700 text-white hover:bg-purple-800/50"
                                  onClick={() => setActiveVideo(message.id)}
                                >
                                  <Video className="h-3 w-3 mr-1" />
                                  Watch Video Response
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        {message.sender === 'user' && (
                          <Avatar className="h-6 w-6 ml-2 mt-0.5 bg-purple-700 flex-shrink-0">
                            <AvatarFallback className="bg-purple-700 text-white">
                              <User className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-gray-100 max-w-[80%] rounded-2xl p-3">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6 bg-purple-700">
                          <AvatarFallback className="bg-purple-700 text-white">
                            <Bot className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                        <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                        <span className="text-sm text-gray-400">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-purple-800/30 bg-black/50">
              <div className="flex items-center space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800/50 border-purple-800/30 text-white placeholder-gray-400 focus:border-purple-600"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500">
                  Powered by DIVIT.AI Assistant
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}