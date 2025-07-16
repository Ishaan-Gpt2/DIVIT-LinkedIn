import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, HelpCircle, Sparkles, Zap } from 'lucide-react';

interface DemoBannerProps {
  title: string;
  description: string;
  variant?: 'info' | 'success' | 'warning';
  demoAction?: () => void;
  helpAction?: () => void;
  className?: string;
}

export default function DemoBanner({
  title,
  description,
  variant = 'info',
  demoAction,
  helpAction,
  className = ''
}: DemoBannerProps) {
  const variantStyles = {
    info: {
      bg: 'bg-blue-600/20',
      border: 'border-blue-500/50',
      text: 'text-blue-300',
      badge: 'bg-blue-600',
      icon: Sparkles
    },
    success: {
      bg: 'bg-green-600/20',
      border: 'border-green-500/50',
      text: 'text-green-300',
      badge: 'bg-green-600',
      icon: Zap
    },
    warning: {
      bg: 'bg-yellow-600/20',
      border: 'border-yellow-500/50',
      text: 'text-yellow-300',
      badge: 'bg-yellow-600',
      icon: Play
    }
  };

  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <Card className={`${style.bg} border ${style.border} ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="p-2 bg-white/10 rounded-lg">
              <Icon className={`w-5 h-5 ${style.text}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className={`font-medium ${style.text}`}>{title}</h4>
                <Badge className={`${style.badge} text-white text-xs`}>
                  Demo Available
                </Badge>
              </div>
              <p className={`text-sm ${style.text} opacity-90`}>
                {description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {demoAction && (
              <Button
                onClick={demoAction}
                size="sm"
                className={`${style.badge} hover:opacity-90 text-white`}
              >
                <Play className="w-3 h-3 mr-1" />
                Try Demo
              </Button>
            )}
            
            {helpAction && (
              <Button
                onClick={helpAction}
                variant="ghost"
                size="sm"
                className={`${style.text} hover:bg-white/10`}
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}