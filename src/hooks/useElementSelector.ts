import { useState, useCallback, useEffect } from 'react';

interface UseElementSelectorProps {
  onSelect?: (element: HTMLElement) => void;
  onCancel?: () => void;
  selectable?: string[];
  excludeSelectors?: string[];
}

export function useElementSelector({
  onSelect,
  onCancel,
  selectable = ['div', 'button', 'a', 'input', 'textarea', 'select', 'form', 'img', 'section', 'article', 'header', 'footer', 'nav', 'aside', 'main', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th'],
  excludeSelectors = ['.smart-chatbot-container', '.chatbot-trigger']
}: UseElementSelectorProps = {}) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

  const startSelection = useCallback(() => {
    setIsSelecting(true);
    setSelectedElement(null);
  }, []);

  const cancelSelection = useCallback(() => {
    setIsSelecting(false);
    setSelectedElement(null);
    setHoveredElement(null);
    if (onCancel) onCancel();
  }, [onCancel]);

  useEffect(() => {
    if (!isSelecting) return;

    const isExcluded = (element: HTMLElement): boolean => {
      return excludeSelectors.some(selector => 
        element.matches(selector) || element.closest(selector) !== null
      );
    };

    const isValidTarget = (element: HTMLElement): boolean => {
      return selectable.includes(element.tagName.toLowerCase()) && !isExcluded(element);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancelSelection();
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && isValidTarget(target)) {
        if (hoveredElement) {
          hoveredElement.classList.remove('element-highlight');
        }
        target.classList.add('element-highlight');
        setHoveredElement(target);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target) {
        target.classList.remove('element-highlight');
        if (hoveredElement === target) {
          setHoveredElement(null);
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const target = e.target as HTMLElement;
      if (target && isValidTarget(target) && !isExcluded(target)) {
        setSelectedElement(target);
        setIsSelecting(false);
        
        if (onSelect) {
          onSelect(target);
        }
      }
    };

    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'element-selector-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '9998';
    overlay.style.pointerEvents = 'none';
    document.body.appendChild(overlay);

    // Add instruction tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'element-selector-tooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.top = '20px';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.style.backgroundColor = '#a855f7';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px 16px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.zIndex = '9999';
    tooltip.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    tooltip.style.fontSize = '14px';
    tooltip.textContent = 'Click on any element to select it, or press ESC to cancel';
    document.body.appendChild(tooltip);

    // Set cursor and z-index for all valid elements
    document.body.style.cursor = 'crosshair';
    
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.cursor = 'default';
      
      if (hoveredElement) {
        hoveredElement.classList.remove('element-highlight');
      }
      
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      
      document.body.removeChild(overlay);
      document.body.removeChild(tooltip);
    };
  }, [isSelecting, hoveredElement, onSelect, onCancel, selectable, excludeSelectors, cancelSelection]);

  return {
    isSelecting,
    selectedElement,
    startSelection,
    cancelSelection
  };
}