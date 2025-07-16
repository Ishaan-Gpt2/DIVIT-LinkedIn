import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  copied: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      copied: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Report error to analytics service
    if (import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true') {
      this.reportError(error, errorInfo);
    }
  }

  reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, you'd send this to your error reporting service
    console.log('Reporting error:', {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  };

  getErrorCategory = (error: Error): { category: string; color: string; solutions: string[] } => {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return {
        category: 'Network Error',
        color: 'bg-red-600',
        solutions: [
          'Check your internet connection',
          'Try refreshing the page',
          'Enable demo mode in settings if APIs are unavailable',
          'Contact support if the issue persists'
        ]
      };
    }
    
    if (message.includes('auth') || message.includes('unauthorized') || message.includes('token')) {
      return {
        category: 'Authentication Error',
        color: 'bg-orange-600',
        solutions: [
          'Try logging out and logging back in',
          'Clear your browser cache and cookies',
          'Check if your session has expired',
          'Contact support if you continue having issues'
        ]
      };
    }
    
    if (message.includes('chunk') || message.includes('loading')) {
      return {
        category: 'Loading Error',
        color: 'bg-yellow-600',
        solutions: [
          'Refresh the page to reload resources',
          'Clear your browser cache',
          'Try using an incognito/private window',
          'Check if you have any browser extensions blocking content'
        ]
      };
    }
    
    if (message.includes('api') || message.includes('server')) {
      return {
        category: 'API Error',
        color: 'bg-purple-600',
        solutions: [
          'The server might be temporarily unavailable',
          'Try again in a few minutes',
          'Enable demo mode to continue using the app',
          'Check the status page for any ongoing issues'
        ]
      };
    }
    
    return {
      category: 'Application Error',
      color: 'bg-gray-600',
      solutions: [
        'Try refreshing the page',
        'Clear your browser cache',
        'Try using a different browser',
        'Report this issue to our support team'
      ]
    };
  };

  copyErrorDetails = () => {
    const errorDetails = `
Error ID: ${this.state.errorId}
Error: ${this.state.error?.message}
Stack: ${this.state.error?.stack}
Component Stack: ${this.state.errorInfo?.componentStack}
Timestamp: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}
URL: ${window.location.href}
    `.trim();

    navigator.clipboard.writeText(errorDetails);
    this.setState({ copied: true });
    toast.success('Error details copied to clipboard');
    
    setTimeout(() => {
      this.setState({ copied: false });
    }, 2000);
  };

  render() {
    if (this.state.hasError) {
      const { category, color, solutions } = this.getErrorCategory(this.state.error!);
      
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-gray-900/50 border-red-800/30">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Something went wrong</CardTitle>
                  <CardDescription className="text-gray-400">
                    We encountered an unexpected error. Here's what you can do:
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Badge className={`${color} text-white`}>
                  {category}
                </Badge>
                <Badge className="bg-gray-700 text-gray-300">
                  ID: {this.state.errorId}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error Message */}
              <div className="p-4 bg-red-600/10 border border-red-500/20 rounded-lg">
                <h4 className="text-red-400 font-medium mb-2">Error Details</h4>
                <p className="text-red-300 text-sm font-mono">
                  {this.state.error?.message}
                </p>
              </div>

              {/* Solutions */}
              <div>
                <h4 className="text-white font-medium mb-3">💡 Suggested Solutions</h4>
                <ul className="space-y-2">
                  {solutions.map((solution, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard'}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Go to Dashboard
                </Button>
                
                <Button
                  variant="outline"
                  onClick={this.copyErrorDetails}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  {this.state.copied ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {this.state.copied ? 'Copied!' : 'Copy Error Details'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.open('https://support.chaitra.ai', '_blank')}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Get Help
                </Button>
              </div>

              {/* Development Details */}
              {this.props.showDetails && this.state.error && (
                <details className="mt-6">
                  <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
                    🔧 Technical Details (Development)
                  </summary>
                  <div className="mt-3 p-4 bg-gray-800/50 rounded-lg">
                    <pre className="text-xs text-gray-300 overflow-auto">
                      {this.state.error.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <pre className="text-xs text-gray-400 mt-2 overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;