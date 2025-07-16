import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface ChatbotTriggerProps {
  onClick: () => void;
  hasNewMessage: boolean;
}

export function ChatbotTrigger({ onClick, hasNewMessage }: ChatbotTriggerProps) {
  return (
    <div className="fixed bottom-4 left-4 z-50 chatbot-trigger">
      <Button
        onClick={onClick}
        className="rounded-full w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg shadow-purple-500/25"
      >
        <MessageSquare className="h-5 w-5" />
        
        <AnimatePresence>
          {hasNewMessage && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
            />
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
}