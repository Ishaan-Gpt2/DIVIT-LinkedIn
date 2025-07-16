import React, { Suspense, useState, useEffect } from 'react';
import { Bot, AlertCircle } from 'lucide-react';

interface SplineViewerProps {
  scene: string;
  className?: string;
  fallback?: React.ReactNode;
}

export function SplineViewer({ scene, className = "", fallback }: SplineViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [SplineComponent, setSplineComponent] = useState<any>(null);

  useEffect(() => {
    const loadSpline = async () => {
      try {
        const { default: Spline } = await import('@splinetool/react-spline');
        setSplineComponent(() => Spline);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load Spline:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadSpline();
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = (error: any) => {
    console.error('Spline scene error:', error);
    setHasError(true);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        {fallback || (
          <div className="text-center">
            <Bot className="w-24 h-24 text-purple-400 mx-auto mb-4 animate-pulse" />
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-purple-400 mt-2 text-sm">Loading 3D Bot...</p>
          </div>
        )}
      </div>
    );
  }

  if (hasError || !SplineComponent) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="relative">
            <Bot className="w-32 h-32 text-purple-400 mx-auto mb-4" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-800/20 rounded-full blur-xl"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-white font-semibold">AI Assistant Bot</h3>
            <p className="text-purple-400 text-sm">Your LinkedIn automation companion</p>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
              <AlertCircle className="w-3 h-3" />
              <span>3D model loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Bot className="w-24 h-24 text-purple-400 mx-auto mb-4 animate-pulse" />
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          </div>
        </div>
      }>
        <SplineComponent
          scene={scene}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent'
          }}
        />
      </Suspense>
    </div>
  );
}