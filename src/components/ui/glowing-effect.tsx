import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlowingEffectProps {
  children: ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function GlowingEffect({ 
  children, 
  intensity = 'medium',
  className
}: GlowingEffectProps) {
  const intensityMap = {
    low: 'after:opacity-20 after:blur-xl',
    medium: 'after:opacity-40 after:blur-2xl',
    high: 'after:opacity-60 after:blur-3xl'
  };

  return (
    <div className={cn(
      'relative group',
      className
    )}>
      <div className={cn(
        'relative z-10',
        'transition-all duration-500'
      )}>
        {children}
      </div>
      <div className={cn(
        'absolute -inset-0.5 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800',
        'opacity-0 group-hover:opacity-100',
        'transition-all duration-500 group-hover:duration-200',
        intensityMap[intensity],
        'z-0'
      )}></div>
    </div>
  );
}