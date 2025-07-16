import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, Clock, Zap } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'success' | 'warning' | 'error' | 'pending' | 'info';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export default function StatusIndicator({
  status,
  label,
  size = 'md',
  showIcon = true,
  className = ''
}: StatusIndicatorProps) {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: 'bg-green-600/20 text-green-400 border-green-500/50',
      label: label || 'Active'
    },
    warning: {
      icon: AlertTriangle,
      color: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/50',
      label: label || 'Warning'
    },
    error: {
      icon: XCircle,
      color: 'bg-red-600/20 text-red-400 border-red-500/50',
      label: label || 'Error'
    },
    pending: {
      icon: Clock,
      color: 'bg-blue-600/20 text-blue-400 border-blue-500/50',
      label: label || 'Pending'
    },
    info: {
      icon: Zap,
      color: 'bg-purple-600/20 text-purple-400 border-purple-500/50',
      label: label || 'Info'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <Badge className={`${config.color} ${sizeClasses[size]} ${className} flex items-center space-x-1`}>
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </Badge>
  );
}