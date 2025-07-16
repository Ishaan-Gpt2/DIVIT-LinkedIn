import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useChatbotContext } from '@/components/layout/ChatbotProvider';

interface ChatbotContextMenuContextType {
  openContextMenu: (x: number, y: number, element: HTMLElement) => void;
  closeContextMenu: () => void;
}

const ChatbotContextMenuContext = createContext<ChatbotContextMenuContextType | undefined>(undefined);

export function useChatbotContextMenu() {
  const context = useContext(ChatbotContextMenuContext);
  if (!context) {
    throw new Error('useChatbotContextMenu must be used within a ChatbotContextMenuProvider');
  }
  return context;
}

interface ChatbotContextMenuProps {
  children: ReactNode;
}

export function ChatbotContextMenu({ children }: ChatbotContextMenuProps) {
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const { openChatbot } = useChatbotContext();

  const openContextMenu = (x: number, y: number, element: HTMLElement) => {
    setContextMenuPosition({ x, y });
    setTargetElement(element);
  };

  const closeContextMenu = () => {
    setContextMenuPosition(null);
    setTargetElement(null);
  };

  const handleAskAboutElement = () => {
    if (targetElement) {
      const elementInfo = getElementInfo(targetElement);
      const question = `What is this ${elementInfo.tagName} element about? "${elementInfo.text}"`;
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('chatbot:ask', {
        detail: { question }
      }));
      
      openChatbot();
      closeContextMenu();
    }
  };

  const handleExplainElement = () => {
    if (targetElement) {
      const elementInfo = getElementInfo(targetElement);
      const question = `Explain this ${elementInfo.tagName} element in detail: "${elementInfo.text}"`;
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('chatbot:ask', {
        detail: { question }
      }));
      
      openChatbot();
      closeContextMenu();
    }
  };

  const handleInteractWithElement = () => {
    if (targetElement) {
      const elementInfo = getElementInfo(targetElement);
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('chatbot:action', {
        detail: { 
          action: 'select-element',
          element: targetElement
        }
      }));
      
      openChatbot();
      closeContextMenu();
    }
  };

  const getElementInfo = (element: HTMLElement) => {
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const classes = Array.from(element.classList).map(c => `.${c}`).join('');
    const text = element.textContent?.trim().substring(0, 50) || '';
    
    return {
      tagName,
      id,
      classes,
      text,
      description: `${tagName}${id}${classes} "${text}${text.length > 50 ? '...' : ''}"`
    };
  };

  // Add event listeners for right-click
  React.useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Skip if right-click is on the chatbot itself
      if ((e.target as HTMLElement).closest('.smart-chatbot-container, .chatbot-trigger')) {
        return;
      }
      
      // Only handle right-click with Alt key pressed
      if (e.altKey) {
        e.preventDefault();
        openContextMenu(e.clientX, e.clientY, e.target as HTMLElement);
      }
    };

    const handleClick = () => {
      closeContextMenu();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <ChatbotContextMenuContext.Provider value={{ openContextMenu, closeContextMenu }}>
      {children}
      
      {/* Context Menu */}
      {contextMenuPosition && (
        <div 
          className="fixed z-50 bg-gray-900 border border-purple-800/30 rounded-lg shadow-xl shadow-purple-500/20 overflow-hidden"
          style={{ 
            top: `${contextMenuPosition.y}px`, 
            left: `${contextMenuPosition.x}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-10px'
          }}
        >
          <div className="p-2 space-y-1">
            <button 
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-purple-900/20 rounded"
              onClick={handleAskAboutElement}
            >
              Ask about this element
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-purple-900/20 rounded"
              onClick={handleExplainElement}
            >
              Explain this element
            </button>
            <button 
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-purple-900/20 rounded"
              onClick={handleInteractWithElement}
            >
              Interact with this element
            </button>
          </div>
        </div>
      )}
    </ChatbotContextMenuContext.Provider>
  );
}