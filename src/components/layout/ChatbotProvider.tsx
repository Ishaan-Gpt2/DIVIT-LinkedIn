import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { SmartChatbot } from '@/components/ui/smart-chatbot';
import { ChatbotTrigger } from '@/components/ui/chatbot-trigger';
import { ChatbotContextMenu } from '@/components/ui/chatbot-context-menu';
import { useChatbot } from '@/hooks/useChatbot';
import axios from 'axios';

interface ChatbotContextType {
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
  triggerNotification: () => void;
  isOpen: boolean;
  hasNewMessage: boolean;
  sendMessage: (message: string) => Promise<void>;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function useChatbotContext() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbotContext must be used within a ChatbotProvider');
  }
  return context;
}

interface ChatbotProviderProps {
  children: ReactNode;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatbotProvider({ children }: ChatbotProviderProps) {
  const chatbot = useChatbot();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your DIVIT.AI support assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to send message to Tavus API
  const sendMessage = async (message: string) => {
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // In a real implementation, this would be a server-side API call
      // For demo purposes, we're simulating the API call
      const response = await simulateTavusApiCall(message);
      
      // Add bot response to chat
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Trigger notification if chatbot is closed
      if (!chatbot.isOpen) {
        chatbot.triggerNotification();
      }
    } catch (error) {
      console.error('Error sending message to Tavus:', error);
      
      // Add error message
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
  const simulateTavusApiCall = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, return predefined responses based on keywords
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('pricing') || lowerCaseMessage.includes('cost') || lowerCaseMessage.includes('plan')) {
      return "We offer several pricing plans to fit your needs. Our Free plan includes 5 credits/month, while our Creator plan at $29/month includes 100 credits and all core features. For unlimited usage, check out our Ghostwriter plan at $79/month or Agency plan at $199/month.";
    } else if (lowerCaseMessage.includes('demo') || lowerCaseMessage.includes('try') || lowerCaseMessage.includes('test')) {
      return "I'd be happy to show you a demo of DIVIT.AI! Our platform offers AI-powered LinkedIn automation with features like post generation, clone building, auto commenting, and connection engine. Would you like me to walk you through a specific feature?";
    } else if (lowerCaseMessage.includes('feature') || lowerCaseMessage.includes('what') || lowerCaseMessage.includes('how')) {
      return "DIVIT.AI offers several powerful features: AI Post Generation creates engaging LinkedIn content, Clone Builder replicates your writing style, Auto Commenter engages with relevant posts, and Connection Engine helps you find and connect with ideal prospects. Which feature would you like to learn more about?";
    } else {
      return "Thanks for reaching out! I'm here to help with any questions about DIVIT.AI. Our platform helps you automate your LinkedIn presence with AI-powered tools. Is there something specific you'd like to know about our features, pricing, or how to get started?";
    }
  };

  // Listen for custom events
  useEffect(() => {
    const handleAskEvent = (event: CustomEvent) => {
      chatbot.openChatbot();
      if (event.detail?.message) {
        sendMessage(event.detail.message);
      }
    };

    const handleActionEvent = (event: CustomEvent) => {
      chatbot.openChatbot();
      // The chatbot component will handle the actual action
    };

    window.addEventListener('chatbot:ask', handleAskEvent as EventListener);
    window.addEventListener('chatbot:action', handleActionEvent as EventListener);

    return () => {
      window.removeEventListener('chatbot:ask', handleAskEvent as EventListener);
      window.removeEventListener('chatbot:action', handleActionEvent as EventListener);
    };
  }, [chatbot]);

  const contextValue: ChatbotContextType = {
    openChatbot: chatbot.openChatbot,
    closeChatbot: chatbot.closeChatbot,
    toggleChatbot: chatbot.toggleChatbot,
    triggerNotification: chatbot.triggerNotification,
    isOpen: chatbot.isOpen,
    hasNewMessage: chatbot.hasNewMessage,
    sendMessage
  };

  return (
    <ChatbotContext.Provider value={contextValue}>
      <ChatbotContextMenu>
        {children}
      </ChatbotContextMenu>
      
      {/* Chatbot Trigger Button */}
      <ChatbotTrigger
        onClick={chatbot.toggleChatbot}
        hasNewMessage={chatbot.hasNewMessage}
      />
      
      {/* Smart Chatbot */}
      <SmartChatbot
        isOpen={chatbot.isOpen}
        onClose={chatbot.closeChatbot}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={sendMessage}
      />
    </ChatbotContext.Provider>
  );
}