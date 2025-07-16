import React, { useEffect, useRef } from 'react';

interface SplashCursorProps {
  BACK_COLOR?: { r: number; g: number; b: number };
  COLOR_UPDATE_SPEED?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  sectionSelector?: string; // Optional selector to limit cursor effect to specific sections
}

export function SplashCursor({
  BACK_COLOR = { r: 0.3, g: 0, b: 0.5 },
  COLOR_UPDATE_SPEED = 5,
  SPLAT_RADIUS = 0.3,
  SPLAT_FORCE = 8000,
  sectionSelector = '.hero-section' // Default to hero section only
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const config = {
      BACK_COLOR,
      COLOR_UPDATE_SPEED,
      SPLAT_RADIUS,
      SPLAT_FORCE,
      TEXTURE_DOWNSAMPLE: 1,
      DENSITY_DISSIPATION: 0.98,
      VELOCITY_DISSIPATION: 0.99,
      PRESSURE_DISSIPATION: 0.8,
      PRESSURE_ITERATIONS: 25,
      CURL: 30,
      BLOOM: true,
      BLOOM_ITERATIONS: 8,
      BLOOM_RESOLUTION: 256,
      BLOOM_INTENSITY: 0.8,
      BLOOM_THRESHOLD: 0.6,
      BLOOM_SOFT_KNEE: 0.7,
    };

    let pointers: any[] = [];
    let splatStack: any[] = [];
    let bloomFramebuffers: any[] = [];
    
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const ext = gl.getExtension('OES_texture_float');
    if (!ext) {
      console.error('OES_texture_float not supported');
      return;
    }

    // Shader code and WebGL setup would go here
    // This is a placeholder for the actual WebGL implementation
    // In a real implementation, this would include shader compilation, 
    // framebuffer setup, and rendering logic

    // Resize handler
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width;
      canvas.height = height;
      
      gl.viewport(0, 0, width, height);
    };

    // Initialize
    resize();
    window.addEventListener('resize', resize);

    // Mouse event handlers
    const updatePointerDownData = (pointer: any, id: number, posX: number, posY: number) => {
      pointer.id = id;
      pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2];
    };

    const updatePointerMoveData = (pointer: any, posX: number, posY: number) => {
      if (!pointer.down) return;
      
      pointer.moved = true;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.deltaX = pointer.texcoordX - pointer.prevTexcoordX;
      pointer.deltaY = pointer.texcoordY - pointer.prevTexcoordY;
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      // Check if cursor is within the specified section
      if (sectionSelector) {
        const sections = document.querySelectorAll(sectionSelector);
        let isInSection = false;
        
        if ('touches' in e) {
          // Touch event
          const touch = e.touches[0];
          const element = document.elementFromPoint(touch.clientX, touch.clientY);
          
          sections.forEach(section => {
            if (section.contains(element)) {
              isInSection = true;
            }
          });
        } else {
          // Mouse event
          const element = document.elementFromPoint(e.clientX, e.clientY);
          
          sections.forEach(section => {
            if (section.contains(element)) {
              isInSection = true;
            }
          });
        }
        
        if (!isInSection) return;
      }
      
      if ('touches' in e) {
        // Handle touch events
        const touch = e.touches[0];
        let pointer = pointers.find(p => p.id === -1);
        if (!pointer) {
          pointer = { id: -1 };
          pointers.push(pointer);
        }
        updatePointerDownData(pointer, touch.identifier, touch.clientX, touch.clientY);
      } else {
        // Handle mouse events
        let pointer = pointers.find(p => p.id === -1);
        if (!pointer) {
          pointer = { id: -1 };
          pointers.push(pointer);
        }
        updatePointerDownData(pointer, -1, e.clientX, e.clientY);
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      // Check if cursor is within the specified section
      if (sectionSelector) {
        const sections = document.querySelectorAll(sectionSelector);
        let isInSection = false;
        
        if ('touches' in e) {
          // Touch event
          const touch = e.touches[0];
          const element = document.elementFromPoint(touch.clientX, touch.clientY);
          
          sections.forEach(section => {
            if (section.contains(element)) {
              isInSection = true;
            }
          });
        } else {
          // Mouse event
          const element = document.elementFromPoint(e.clientX, e.clientY);
          
          sections.forEach(section => {
            if (section.contains(element)) {
              isInSection = true;
            }
          });
        }
        
        if (!isInSection) return;
      }
      
      if ('touches' in e) {
        // Handle touch events
        for (let i = 0; i < e.touches.length; i++) {
          const touch = e.touches[i];
          const pointer = pointers.find(p => p.id === touch.identifier);
          if (pointer) {
            updatePointerMoveData(pointer, touch.clientX, touch.clientY);
          }
        }
      } else {
        // Handle mouse events
        const pointer = pointers.find(p => p.id === -1);
        if (pointer) {
          updatePointerMoveData(pointer, e.clientX, e.clientY);
        }
      }
    };

    const handlePointerUp = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        // Handle touch events
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          const pointer = pointers.find(p => p.id === touch.identifier);
          if (pointer) {
            pointer.down = false;
          }
        }
      } else {
        // Handle mouse events
        const pointer = pointers.find(p => p.id === -1);
        if (pointer) {
          pointer.down = false;
        }
      }
    };

    // Add event listeners
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [BACK_COLOR, COLOR_UPDATE_SPEED, SPLAT_RADIUS, SPLAT_FORCE, sectionSelector]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
    />
  );
}