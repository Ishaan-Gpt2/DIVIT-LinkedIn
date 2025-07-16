import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Video, X, MessageSquare } from 'lucide-react';

export function FloatingTavusButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChat = () => {
    // Dispatch custom event to open chatbot
    window.dispatchEvent(new CustomEvent('chatbot:ask', { 
      detail: { message: "I'd like to see a video demo of DIVIT.AI" } 
    }));
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-16 right-0 bg-gradient-to-br from-gray-900 to-black border border-purple-800/30 rounded-lg shadow-2xl p-4 w-64"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-medium">DIVIT.AI Video Agent</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Chat with our AI video agent to get personalized video responses to your questions.
            </p>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
              onClick={handleOpenChat}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Video Chat
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        className={`rounded-full w-12 h-12 ${
          isOpen 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
        } shadow-lg shadow-purple-500/25`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Video className="h-5 w-5" />}
      </Button>
    </div>
  );
}