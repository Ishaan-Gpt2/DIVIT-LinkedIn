import { useState, useCallback } from 'react';

interface ChatbotState {
  isOpen: boolean;
  hasNewMessage: boolean;
  isInitialized: boolean;
}

export function useChatbot() {
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    hasNewMessage: false,
    isInitialized: false
  });

  const openChatbot = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: true,
      hasNewMessage: false,
      isInitialized: true
    }));
  }, []);

  const closeChatbot = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const toggleChatbot = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
      hasNewMessage: prev.isOpen ? prev.hasNewMessage : false,
      isInitialized: true
    }));
  }, []);

  const markAsRead = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasNewMessage: false
    }));
  }, []);

  const triggerNotification = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasNewMessage: !prev.isOpen
    }));
  }, []);

  return {
    isOpen: state.isOpen,
    hasNewMessage: state.hasNewMessage,
    isInitialized: state.isInitialized,
    openChatbot,
    closeChatbot,
    toggleChatbot,
    markAsRead,
    triggerNotification
  };
}