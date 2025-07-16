import { useState, useCallback } from 'react';

interface ActionResult {
  success: boolean;
  message: string;
  details?: any;
}

export function useWebsiteActions() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<ActionResult | null>(null);

  const fillForm = useCallback(async (selector: string, values: Record<string, string>): Promise<ActionResult> => {
    setIsExecuting(true);
    
    try {
      const form = document.querySelector(selector) as HTMLFormElement;
      if (!form) {
        throw new Error(`Form not found with selector: ${selector}`);
      }
      
      const filledInputs: string[] = [];
      
      // Fill each input
      Object.entries(values).forEach(([name, value]) => {
        const input = form.querySelector(`[name="${name}"], #${name}, .${name}`) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        
        if (input) {
          if (input.tagName === 'SELECT') {
            (input as HTMLSelectElement).value = value;
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);
          } else if (input.type === 'checkbox' || input.type === 'radio') {
            (input as HTMLInputElement).checked = value === 'true';
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);
          } else {
            input.value = value;
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);
          }
          
          filledInputs.push(name);
        }
      });
      
      const result = {
        success: filledInputs.length > 0,
        message: filledInputs.length > 0 
          ? `Successfully filled ${filledInputs.length} form fields: ${filledInputs.join(', ')}` 
          : 'No form fields were filled',
        details: { filledInputs, formSelector: selector }
      };
      
      setLastResult(result);
      return result;
    } catch (error) {
      const result = {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: { error }
      };
      
      setLastResult(result);
      return result;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const clickElement = useCallback(async (selector: string): Promise<ActionResult> => {
    setIsExecuting(true);
    
    try {
      const element = document.querySelector(selector) as HTMLElement;
      if (!element) {
        throw new Error(`Element not found with selector: ${selector}`);
      }
      
      element.click();
      
      const result = {
        success: true,
        message: `Successfully clicked element: ${selector}`,
        details: { 
          element: {
            tagName: element.tagName,
            id: element.id,
            className: element.className,
            text: element.textContent?.trim().substring(0, 100)
          }
        }
      };
      
      setLastResult(result);
      return result;
    } catch (error) {
      const result = {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: { error }
      };
      
      setLastResult(result);
      return result;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const navigateTo = useCallback(async (path: string): Promise<ActionResult> => {
    setIsExecuting(true);
    
    try {
      const currentPath = window.location.pathname;
      
      if (path.startsWith('http')) {
        // External URL
        window.open(path, '_blank');
      } else {
        // Internal path
        window.history.pushState({}, '', path);
        // Dispatch a popstate event to trigger route changes in SPA frameworks
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      
      const result = {
        success: true,
        message: `Successfully navigated from ${currentPath} to ${path}`,
        details: { previousPath: currentPath, newPath: path }
      };
      
      setLastResult(result);
      return result;
    } catch (error) {
      const result = {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: { error }
      };
      
      setLastResult(result);
      return result;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const modifyElement = useCallback(async (selector: string, modifications: Record<string, string>): Promise<ActionResult> => {
    setIsExecuting(true);
    
    try {
      const element = document.querySelector(selector) as HTMLElement;
      if (!element) {
        throw new Error(`Element not found with selector: ${selector}`);
      }
      
      const appliedChanges: string[] = [];
      
      // Apply each modification
      Object.entries(modifications).forEach(([property, value]) => {
        if (property === 'text' || property === 'textContent') {
          element.textContent = value;
          appliedChanges.push('textContent');
        } else if (property === 'html' || property === 'innerHTML') {
          element.innerHTML = value;
          appliedChanges.push('innerHTML');
        } else if (property === 'value' && 'value' in element) {
          (element as HTMLInputElement).value = value;
          appliedChanges.push('value');
        } else if (property.startsWith('style.')) {
          const styleProp = property.substring(6);
          (element.style as any)[styleProp] = value;
          appliedChanges.push(`style.${styleProp}`);
        } else if (property.startsWith('attr.')) {
          const attrName = property.substring(5);
          element.setAttribute(attrName, value);
          appliedChanges.push(`attr.${attrName}`);
        } else if (property.startsWith('data-')) {
          element.setAttribute(property, value);
          appliedChanges.push(property);
        } else if (property === 'class' || property === 'className') {
          element.className = value;
          appliedChanges.push('className');
        } else if (property === 'classList.add') {
          value.split(' ').forEach(cls => element.classList.add(cls));
          appliedChanges.push('classList.add');
        } else if (property === 'classList.remove') {
          value.split(' ').forEach(cls => element.classList.remove(cls));
          appliedChanges.push('classList.remove');
        } else if (property === 'classList.toggle') {
          value.split(' ').forEach(cls => element.classList.toggle(cls));
          appliedChanges.push('classList.toggle');
        }
      });
      
      const result = {
        success: appliedChanges.length > 0,
        message: appliedChanges.length > 0 
          ? `Successfully modified element with changes: ${appliedChanges.join(', ')}` 
          : 'No modifications were applied',
        details: { 
          appliedChanges,
          element: {
            tagName: element.tagName,
            id: element.id,
            className: element.className
          }
        }
      };
      
      setLastResult(result);
      return result;
    } catch (error) {
      const result = {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: { error }
      };
      
      setLastResult(result);
      return result;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  return {
    isExecuting,
    lastResult,
    fillForm,
    clickElement,
    navigateTo,
    modifyElement
  };
}