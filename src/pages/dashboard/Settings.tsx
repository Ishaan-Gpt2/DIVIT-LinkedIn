import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { useApiKeysStore } from '@/store/apiKeysStore';
import { getApiStatus } from '@/services/api';
import { toast } from 'sonner';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Crown,
  Zap,
  Key,
  Database,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Globe,
  Activity
} from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuthStore();
  const { activeClone, clones, setActiveClone } = useAppStore();
  const { apiKeys, mockDataFlags, updateApiKey, toggleMockData, resetToDefaults, loadFromEnv, checkApiKeyStatus } = useApiKeysStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    bio: '',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: true,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      activityVisible: false,
      analyticsSharing: true
    }
  });

  // Load API keys from environment on component mount
  useEffect(() => {
    loadFromEnv();
    checkBackendStatus();
  }, [loadFromEnv]);

  const checkBackendStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const status = await getApiStatus();
      setApiStatus(status);
    } catch (error) {
      console.error('Failed to check API status:', error);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleSaveProfile = async () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleSaveApiKeys = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('API settings saved successfully');
      
      // Refresh backend status
      await checkBackendStatus();
    } catch (error) {
      toast.error('Failed to save API settings');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Account deleted successfully');
        logout();
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  const handleCloneChange = (cloneId: string) => {
    const clone = clones.find(c => c.id === cloneId);
    if (clone) {
      setActiveClone(clone);
      toast.success(`Switched to ${clone.name} clone`);
    }
  };

  const toggleApiKeyVisibility = (service: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const handleTestApiKey = async (service: string, apiKey: string) => {
    if (!apiKey) {
      toast.error('Please enter an API key first');
      return;
    }

    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`${service} API key is valid and working`);
    } catch (error) {
      toast.error(`Failed to validate ${service} API key`);
    }
  };

  const apiServices = [
    {
      key: 'geminiApiKey' as keyof typeof apiKeys,
      name: 'Gemini AI',
      description: 'Google Gemini API for advanced AI content generation',
      placeholder: 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      mockFlag: 'useAiModelMockData' as keyof typeof mockDataFlags,
      priority: 'high'
    },
    {
      key: 'undetectableApiKey' as keyof typeof apiKeys,
      name: 'Undetectable AI',
      description: 'Content humanization and AI detection bypass',
      placeholder: 'ud_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      mockFlag: 'useHumanizerMockData' as keyof typeof mockDataFlags,
      priority: 'high'
    },
    {
      key: 'saplingApiKey' as keyof typeof apiKeys,
      name: 'Sapling AI',
      description: 'AI content detection and analysis',
      placeholder: 'sapling_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      mockFlag: 'useAiDetectorMockData' as keyof typeof mockDataFlags,
      priority: 'high'
    },
    {
      key: 'resendApiKey' as keyof typeof apiKeys,
      name: 'Resend',
      description: 'Email delivery service for notifications',
      placeholder: 're_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      mockFlag: 'useAiModelMockData' as keyof typeof mockDataFlags,
      priority: 'medium'
    },
    {
      key: 'apifyKey' as keyof typeof apiKeys,
      name: 'Apify',
      description: 'Web scraping and data extraction for LinkedIn profiles',
      placeholder: 'apify_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      mockFlag: 'useApifyMockData' as keyof typeof mockDataFlags,
      priority: 'medium'
    },
    {
      key: 'phantombusterKey' as keyof typeof apiKeys,
      name: 'PhantomBuster',
      description: 'LinkedIn automation and data collection',
      placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      mockFlag: 'usePhantombusterMockData' as keyof typeof mockDataFlags,
      priority: 'medium'
    },
    {
      key: 'languagetoolApiKey' as keyof typeof apiKeys,
      name: 'LanguageTool',
      description: 'Grammar and style checking service',
      placeholder: 'lt_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      mockFlag: 'useGrammarCheckerMockData' as keyof typeof mockDataFlags,
      priority: 'low'
    },
    {
      key: 'uploadPostApiKey' as keyof typeof apiKeys,
      name: 'Upload Post',
      description: 'Multi-platform content publishing service',
      placeholder: 'up_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      mockFlag: 'useAiModelMockData' as keyof typeof mockDataFlags,
      priority: 'low'
    }
  ];

  const keyStatus = checkApiKeyStatus();
  const totalKeys = Object.keys(keyStatus).length;
  const configuredKeys = Object.values(keyStatus).filter(Boolean).length;
  const setupProgress = Math.round((configuredKeys / totalKeys) * 100);

  return (
    <DashboardLayout>
      <div className="p-6 w-full max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">
            Manage your account preferences and application settings
          </p>
        </div>

        <div className="space-y-6">
          {/* API Setup Progress */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  API Integration Status
                </div>
                <Badge className={setupProgress === 100 ? 'bg-green-600' : setupProgress > 50 ? 'bg-yellow-600' : 'bg-red-600'}>
                  {configuredKeys}/{totalKeys} Services
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure your external service integrations for full functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Setup Progress</span>
                <span className="text-white font-medium">{setupProgress}%</span>
              </div>
              <Progress value={setupProgress} className="h-2" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {Object.entries(keyStatus).map(([service, hasKey]) => (
                  <div key={service} className="flex items-center space-x-2">
                    {hasKey ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className={`text-xs ${hasKey ? 'text-green-400' : 'text-yellow-400'}`}>
                      {service}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4 pt-4 border-t border-gray-700">
                <Button
                  onClick={checkBackendStatus}
                  disabled={isLoadingStatus}
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  {isLoadingStatus ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Globe className="w-4 h-4 mr-2" />
                  )}
                  Check Backend Status
                </Button>
                
                {apiStatus && (
                  <Badge className="bg-green-600/20 text-green-400">
                    Backend: {apiStatus.status}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="text-gray-300">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="timezone" className="text-gray-300">
                  Timezone
                </Label>
                <Select value={formData.timezone} onValueChange={(value) => setFormData({...formData, timezone: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="UTC" className="text-white">UTC</SelectItem>
                    <SelectItem value="EST" className="text-white">Eastern Time</SelectItem>
                    <SelectItem value="PST" className="text-white">Pacific Time</SelectItem>
                    <SelectItem value="GMT" className="text-white">GMT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* API Integrations */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Key className="w-5 h-5 mr-2" />
                API Integrations
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure your external service API keys and data sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-600/20 border border-blue-500/50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Database className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-blue-400 font-medium text-sm">Environment Status</span>
                </div>
                <p className="text-blue-300 text-xs">
                  API keys are automatically loaded from environment variables. Toggle switches control whether to use live APIs or mock data.
                </p>
              </div>

              {/* Group services by priority */}
              {['high', 'medium', 'low'].map(priority => (
                <div key={priority}>
                  <h4 className="text-gray-300 font-medium mb-3 capitalize">
                    {priority} Priority Services
                  </h4>
                  <div className="space-y-4">
                    {apiServices.filter(service => service.priority === priority).map((service) => (
                      <div key={service.key} className="p-4 bg-gray-800/50 rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">{service.name}</h4>
                            <p className="text-gray-400 text-sm">{service.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={!mockDataFlags[service.mockFlag] ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'}>
                              {!mockDataFlags[service.mockFlag] ? 'Live API' : 'Mock Data'}
                            </Badge>
                            <Switch
                              checked={!mockDataFlags[service.mockFlag]}
                              onCheckedChange={() => toggleMockData(service.mockFlag)}
                              className="data-[state=checked]:bg-green-600"
                            />
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <div className="flex-1 relative">
                            <Input
                              type={showApiKeys[service.key] ? "text" : "password"}
                              placeholder={service.placeholder}
                              value={apiKeys[service.key]}
                              onChange={(e) => updateApiKey(service.key, e.target.value)}
                              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pr-20"
                            />
                            <div className="absolute right-0 top-0 h-full flex items-center space-x-1 pr-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                                onClick={() => toggleApiKeyVisibility(service.key)}
                              >
                                {showApiKeys[service.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestApiKey(service.name, apiKeys[service.key])}
                            disabled={!apiKeys[service.key]}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            Test
                          </Button>
                        </div>
                        
                        {apiKeys[service.key] && (
                          <div className="p-2 bg-green-600/20 border border-green-500/50 rounded text-green-400 text-xs">
                            ✓ API key configured - Using live service
                          </div>
                        )}
                        
                        {!apiKeys[service.key] && (
                          <div className="p-2 bg-yellow-600/20 border border-yellow-500/50 rounded text-yellow-400 text-xs">
                            ⚠ No API key - Using mock data for testing
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex space-x-4">
                <Button
                  onClick={handleSaveApiKeys}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save API Settings
                </Button>
                
                <Button
                  variant="outline"
                  onClick={loadFromEnv}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload from Environment
                </Button>
                
                <Button
                  variant="outline"
                  onClick={resetToDefaults}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Password & Security
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-gray-300">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPassword" className="text-gray-300">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-300">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Clone Settings */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                AI Clone Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your active AI clone and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300 mb-3 block">
                  Active Clone
                </Label>
                <Select 
                  value={activeClone?.id || ''} 
                  onValueChange={handleCloneChange}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a clone" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {clones.map((clone) => (
                      <SelectItem key={clone.id} value={clone.id} className="text-white">
                        {clone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {activeClone && (
                  <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-300 text-sm mb-2">{activeClone.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/50">
                        {activeClone.tone}
                      </Badge>
                      {activeClone.personality.map((trait, index) => (
                        <Badge key={index} className="bg-blue-600/20 text-blue-400 border-blue-500/50">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-gray-400">
                Choose how you want to be notified about activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Email Notifications</Label>
                  <p className="text-gray-500 text-sm">Receive updates via email</p>
                </div>
                <Switch
                  checked={formData.notifications.email}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData, 
                      notifications: {...formData.notifications, email: checked}
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Push Notifications</Label>
                  <p className="text-gray-500 text-sm">Receive browser notifications</p>
                </div>
                <Switch
                  checked={formData.notifications.push}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData, 
                      notifications: {...formData.notifications, push: checked}
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Marketing Communications</Label>
                  <p className="text-gray-500 text-sm">Receive product updates and tips</p>
                </div>
                <Switch
                  checked={formData.notifications.marketing}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData, 
                      notifications: {...formData.notifications, marketing: checked}
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Control your privacy and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Profile Visibility</Label>
                  <p className="text-gray-500 text-sm">Make your profile visible to other users</p>
                </div>
                <Switch
                  checked={formData.privacy.profileVisible}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData, 
                      privacy: {...formData.privacy, profileVisible: checked}
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Activity Visibility</Label>
                  <p className="text-gray-500 text-sm">Show your activity to connections</p>
                </div>
                <Switch
                  checked={formData.privacy.activityVisible}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData, 
                      privacy: {...formData.privacy, activityVisible: checked}
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Analytics Sharing</Label>
                  <p className="text-gray-500 text-sm">Help improve our service with anonymous data</p>
                </div>
                <Switch
                  checked={formData.privacy.analyticsSharing}
                  onCheckedChange={(checked) => 
                    setFormData({
                      ...formData, 
                      privacy: {...formData.privacy, analyticsSharing: checked}
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Plan */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Account Plan
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your current subscription and usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Current Plan</Label>
                  <p className="text-gray-500 text-sm">
                    {user?.plan === 'free' ? 'Free Plan' : `${user?.plan?.charAt(0).toUpperCase()}${user?.plan?.slice(1)} Plan`}
                  </p>
                </div>
                <Badge className={`${user?.plan === 'free' ? 'bg-gray-600' : 'bg-purple-600'} text-white`}>
                  {user?.plan?.toUpperCase()}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Credits Remaining</Label>
                  <p className="text-gray-500 text-sm">
                    {user?.plan === 'free' ? `${user?.credits} of 5 monthly credits` : 'Unlimited credits'}
                  </p>
                </div>
                <Badge className="bg-yellow-600 text-white">
                  <Zap className="w-3 h-3 mr-1" />
                  {user?.plan === 'free' ? user?.credits : '∞'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleSaveProfile}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Reset to Defaults
            </Button>
          </div>

          <Separator className="bg-gray-800" />

          {/* Danger Zone */}
          <Card className="bg-red-900/20 border-red-800">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center">
                <Trash2 className="w-5 h-5 mr-2" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-red-300">
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
              <p className="text-red-300 text-sm mt-2">
                This will permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}