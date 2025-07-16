import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApiKeysStore } from '@/store/apiKeysStore';
import { 
  Play, 
  Pause, 
  Settings, 
  Zap, 
  Shield, 
  Database,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface DemoModeToggleProps {
  className?: string;
  showDetails?: boolean;
}

export function DemoModeToggle({ className = '', showDetails = false }: DemoModeToggleProps) {
  const { mockDataFlags, toggleMockData, checkApiKeyStatus } = useApiKeysStore();
  
  const keyStatus = checkApiKeyStatus();
  const totalKeys = Object.keys(keyStatus).length;
  const configuredKeys = Object.values(keyStatus).filter(Boolean).length;
  const isFullyConfigured = configuredKeys === totalKeys;
  
  // Check if we're in demo mode (any mock flags are true)
  const isDemoMode = Object.values(mockDataFlags).some(flag => flag);
  
  const toggleAllMockData = () => {
    const newState = !isDemoMode;
    Object.keys(mockDataFlags).forEach(key => {
      toggleMockData(key as keyof typeof mockDataFlags);
    });
  };

  if (!showDetails) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Badge className={isDemoMode ? 'bg-yellow-600' : 'bg-green-600'}>
          {isDemoMode ? (
            <>
              <Play className="w-3 h-3 mr-1" />
              Demo Mode
            </>
          ) : (
            <>
              <Zap className="w-3 h-3 mr-1" />
              Live Mode
            </>
          )}
        </Badge>
        <Switch
          checked={!isDemoMode}
          onCheckedChange={() => toggleAllMockData()}
          className="data-[state=checked]:bg-green-600"
        />
      </div>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Demo Mode Control
          </div>
          <Badge className={isDemoMode ? 'bg-yellow-600' : 'bg-green-600'}>
            {isDemoMode ? 'Demo Active' : 'Live Services'}
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Toggle between demo data and live API services
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            {isDemoMode ? (
              <Play className="w-5 h-5 text-yellow-400" />
            ) : (
              <Zap className="w-5 h-5 text-green-400" />
            )}
            <div>
              <h4 className="text-white font-medium">
                {isDemoMode ? 'Demo Mode Active' : 'Live Services Active'}
              </h4>
              <p className="text-gray-400 text-sm">
                {isDemoMode 
                  ? 'Using mock data for testing and demonstration'
                  : 'Using real API services with your configured keys'
                }
              </p>
            </div>
          </div>
          <Switch
            checked={!isDemoMode}
            onCheckedChange={() => toggleAllMockData()}
            className="data-[state=checked]:bg-green-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-800/30 rounded-lg">
            <div className="flex items-center mb-2">
              <Shield className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 font-medium text-sm">API Status</span>
            </div>
            <div className="flex items-center space-x-2">
              {isFullyConfigured ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
              )}
              <span className="text-white text-sm">
                {configuredKeys}/{totalKeys} Services
              </span>
            </div>
          </div>

          <div className="p-3 bg-gray-800/30 rounded-lg">
            <div className="flex items-center mb-2">
              <Settings className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-purple-400 font-medium text-sm">Mode</span>
            </div>
            <span className={`text-sm font-medium ${isDemoMode ? 'text-yellow-400' : 'text-green-400'}`}>
              {isDemoMode ? 'Demo Data' : 'Live APIs'}
            </span>
          </div>
        </div>

        <div className="p-3 bg-blue-600/20 border border-blue-500/50 rounded-lg">
          <p className="text-blue-300 text-sm">
            <strong>Demo Mode:</strong> Perfect for testing features without using API credits or making real requests.
            <br />
            <strong>Live Mode:</strong> Uses your configured API keys for real functionality.
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/settings'}
            className="border-purple-700/50 text-gray-300 hover:bg-purple-900/20"
          >
            <Settings className="w-4 h-4 mr-1" />
            Configure APIs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default DemoModeToggle;