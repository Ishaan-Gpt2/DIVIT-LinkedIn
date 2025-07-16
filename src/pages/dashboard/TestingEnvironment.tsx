import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useApiKeysStore } from '@/store/apiKeysStore';
import { toast } from 'sonner';
import axios from 'axios';
import {
  Key,
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  HelpCircle,
  ExternalLink,
  Loader2,
  ChevronDown,
  ChevronRight,
  Copy,
  RefreshCw,
  Zap,
  Mail,
  Bot,
  Shield,
  Globe,
  Upload,
  Activity
} from 'lucide-react';

interface TestResult {
  service: string;
  valid: boolean;
  saved: boolean;
  details?: any;
  data?: any;
  error?: string;
  troubleshoot?: string;
  testing?: boolean;
}

interface ApiService {
  id: string;
  name: string;
  icon: any;
  description: string;
  keyPlaceholder: string;
  additionalFields?: Array<{
    id: string;
    label: string;
    placeholder: string;
    type: string;
    required?: boolean;
  }>;
  manual: {
    steps: string[];
    requirements: string[];
    docsUrl: string;
  };
}

const apiServices: ApiService[] = [
  {
    id: 'gemini',
    name: 'Gemini AI',
    icon: Bot,
    description: 'Google Gemini API for advanced AI content generation',
    keyPlaceholder: 'AIzaSyCNInkxSat1peCdml8rEYZVZW-e9ZqOwLo',
    additionalFields: [
      {
        id: 'model',
        label: 'Model (optional)',
        placeholder: 'gemini-1.5-pro',
        type: 'text'
      }
    ],
    manual: {
      steps: [
        'Go to Google AI Studio (https://makersuite.google.com/app/apikey)',
        'Sign in with your Google account',
        'Click "Create API Key"',
        'Select your Google Cloud project or create a new one',
        'Copy the generated API key',
        'Enable the Generative Language API in Google Cloud Console'
      ],
      requirements: [
        'Google account',
        'Google Cloud project with billing enabled',
        'Generative Language API enabled'
      ],
      docsUrl: 'https://ai.google.dev/docs'
    }
  },
  {
    id: 'undetectable',
    name: 'Undetectable AI',
    icon: Shield,
    description: 'Content humanization and AI detection bypass',
    keyPlaceholder: 'e3b98635-6aa5-4a8f-94e6-2c8926ad66b3',
    manual: {
      steps: [
        'Visit Undetectable.ai (https://undetectable.ai)',
        'Create an account and verify your email',
        'Choose a paid subscription plan',
        'Go to API Settings in your dashboard',
        'Generate a new API key',
        'Copy the API key (starts with UUID format)'
      ],
      requirements: [
        'Paid subscription (API not available on free plan)',
        'Verified email address',
        'Sufficient credits in account'
      ],
      docsUrl: 'https://docs.undetectable.ai'
    }
  },
  {
    id: 'sapling',
    name: 'Sapling AI',
    icon: Activity,
    description: 'AI content detection and analysis',
    keyPlaceholder: '9Q8MPNLU9Z2EAJ3IVYNDG3YJ5AD7P9CK',
    manual: {
      steps: [
        'Go to Sapling AI (https://sapling.ai)',
        'Sign up for an account',
        'Navigate to the API section',
        'Subscribe to the AI Detection API',
        'Generate your API key',
        'Copy the key from your dashboard'
      ],
      requirements: [
        'Sapling AI account',
        'API subscription',
        'Valid payment method'
      ],
      docsUrl: 'https://sapling.ai/docs'
    }
  },
  {
    id: 'resend',
    name: 'Resend',
    icon: Mail,
    description: 'Email delivery service for notifications',
    keyPlaceholder: 're_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    additionalFields: [
      {
        id: 'testEmail',
        label: 'Test Email',
        placeholder: 'your-email@example.com',
        type: 'email',
        required: true
      },
      {
        id: 'senderEmail',
        label: 'Sender Email (optional)',
        placeholder: 'noreply@yourdomain.com',
        type: 'email'
      }
    ],
    manual: {
      steps: [
        'Visit Resend (https://resend.com)',
        'Create an account and verify your email',
        'Add and verify your sending domain',
        'Go to API Keys in your dashboard',
        'Create a new API key',
        'Copy the key (starts with "re_")'
      ],
      requirements: [
        'Verified domain for sending emails',
        'DNS records configured correctly',
        'Account in good standing'
      ],
      docsUrl: 'https://resend.com/docs'
    }
  },
  {
    id: 'phantombuster',
    name: 'PhantomBuster',
    icon: Zap,
    description: 'LinkedIn automation and data collection',
    keyPlaceholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    additionalFields: [
      {
        id: 'phantomId',
        label: 'Phantom ID',
        placeholder: '1234567890123456789',
        type: 'text',
        required: true
      }
    ],
    manual: {
      steps: [
        'Go to PhantomBuster (https://phantombuster.com)',
        'Create an account and choose a plan',
        'Create a new Phantom or use existing one',
        'Go to Settings > API',
        'Generate an API key',
        'Copy both the API key and Phantom ID'
      ],
      requirements: [
        'PhantomBuster subscription',
        'Created Phantom automation',
        'Sufficient execution credits'
      ],
      docsUrl: 'https://docs.phantombuster.com'
    }
  },
  {
    id: 'apify',
    name: 'Apify',
    icon: Globe,
    description: 'Web scraping and data extraction for LinkedIn profiles',
    keyPlaceholder: 'apify_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    additionalFields: [
      {
        id: 'testProfileUrl',
        label: 'Test LinkedIn Profile URL (optional)',
        placeholder: 'https://linkedin.com/in/username',
        type: 'url'
      },
      {
        id: 'actorId',
        label: 'Actor ID (optional)',
        placeholder: 'drobnikj~linkedin-profile-scraper',
        type: 'text'
      }
    ],
    manual: {
      steps: [
        'Visit Apify (https://apify.com)',
        'Create an account and verify email',
        'Add credits to your account',
        'Go to Settings > Integrations',
        'Generate a new API token',
        'Copy the token (starts with "apify_api_")'
      ],
      requirements: [
        'Apify account with credits',
        'Access to LinkedIn Profile Scraper actor',
        'Proxy usage enabled'
      ],
      docsUrl: 'https://docs.apify.com'
    }
  },
  {
    id: 'uploadpost',
    name: 'UploadPost',
    icon: Upload,
    description: 'Multi-platform content publishing service',
    keyPlaceholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    additionalFields: [
      {
        id: 'userId',
        label: 'User ID (optional)',
        placeholder: 'your-user-id',
        type: 'text'
      }
    ],
    manual: {
      steps: [
        'Go to UploadPost (https://uploadpost.com)',
        'Create an account and verify email',
        'Complete LinkedIn OAuth connection',
        'Subscribe to a plan with API access',
        'Go to API Settings',
        'Generate JWT token for API access'
      ],
      requirements: [
        'UploadPost account with API access',
        'LinkedIn OAuth completed',
        'Active subscription',
        'Platform connections configured'
      ],
      docsUrl: 'https://docs.uploadpost.com'
    }
  }
];

export default function TestingEnvironment() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [additionalData, setAdditionalData] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [showManuals, setShowManuals] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('gemini');
  const [isValidatingAll, setIsValidatingAll] = useState(false);
  const [manuals, setManuals] = useState<any>(null);
  const [isLoadingManuals, setIsLoadingManuals] = useState(false);

  const { apiKeys: storeApiKeys, updateApiKey } = useApiKeysStore();

  // Initialize API keys from store
  useEffect(() => {
    const initialApiKeys: Record<string, string> = {
      gemini: storeApiKeys.geminiApiKey || storeApiKeys.gemini2FlashKey || '',
      undetectable: storeApiKeys.undetectableApiKey || '',
      sapling: storeApiKeys.saplingApiKey || '',
      resend: storeApiKeys.resendApiKey || '',
      phantombuster: storeApiKeys.phantombusterKey || '',
      apify: storeApiKeys.apifyKey || '',
      uploadpost: storeApiKeys.uploadPostApiKey || ''
    };
    
    setApiKeys(initialApiKeys);
    
    // Load manuals
    loadManuals();
  }, [storeApiKeys]);

  const loadManuals = async () => {
    setIsLoadingManuals(true);
    try {
      // Mock data for manuals to avoid API call errors
      const mockManuals = {
        gemini: {
          name: 'Google Gemini AI',
          description: 'Advanced AI content generation with Gemini 1.5 Pro',
          requirements: [
            'Google account',
            'Google Cloud project with billing enabled',
            'Generative Language API enabled'
          ],
          steps: [
            'Go to Google AI Studio (https://makersuite.google.com/app/apikey)',
            'Sign in with your Google account',
            'Click "Create API Key"',
            'Select your Google Cloud project or create a new one',
            'Copy the generated API key (starts with "AIza")',
            'Enable the Generative Language API in Google Cloud Console'
          ],
          keyFormat: 'AIzaSy...',
          testEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent',
          docsUrl: 'https://ai.google.dev/docs',
          pricing: 'Pay-per-use based on tokens',
          notes: [
            'Free tier available with rate limits',
            'Requires Google Cloud billing for production use',
            'API key should be kept secure and not exposed in frontend'
          ]
        },
        undetectable: {
          name: 'Undetectable AI',
          description: 'Content humanization and AI detection bypass',
          requirements: [
            'Paid subscription (API not available on free plan)',
            'Verified email address',
            'Sufficient credits in account'
          ],
          steps: [
            'Visit Undetectable.ai (https://undetectable.ai)',
            'Create an account and verify your email',
            'Choose a paid subscription plan',
            'Go to API Settings in your dashboard',
            'Generate a new API key',
            'Copy the API key (UUID format)'
          ],
          keyFormat: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          testEndpoint: 'https://api.undetectable.ai/submit',
          docsUrl: 'https://docs.undetectable.ai',
          pricing: 'Subscription-based with credit system',
          notes: [
            'Requires paid subscription for API access',
            'Processing time varies based on content length',
            'Monitor credit usage to avoid service interruption'
          ]
        },
        sapling: {
          name: 'Sapling AI Detection',
          description: 'AI content detection and analysis',
          requirements: [
            'Sapling AI account',
            'API subscription',
            'Valid payment method'
          ],
          steps: [
            'Go to Sapling AI (https://sapling.ai)',
            'Sign up for an account',
            'Navigate to the API section',
            'Subscribe to the AI Detection API',
            'Generate your API key',
            'Copy the key from your dashboard'
          ],
          keyFormat: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          testEndpoint: 'https://api.sapling.ai/api/v1/aidetect',
          docsUrl: 'https://sapling.ai/docs',
          pricing: 'Pay-per-request model',
          notes: [
            'Provides confidence scores for AI detection',
            'Supports multiple languages',
            'Rate limits apply based on subscription tier'
          ]
        },
        resend: {
          name: 'Resend Email Service',
          description: 'Email delivery service for notifications',
          requirements: [
            'Verified domain for sending emails',
            'DNS records configured correctly',
            'Account in good standing'
          ],
          steps: [
            'Visit Resend (https://resend.com)',
            'Create an account and verify your email',
            'Add and verify your sending domain',
            'Configure DNS records (SPF, DKIM, DMARC)',
            'Go to API Keys in your dashboard',
            'Create a new API key',
            'Copy the key (starts with "re_")'
          ],
          keyFormat: 're_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          testEndpoint: 'https://api.resend.com/emails',
          docsUrl: 'https://resend.com/docs',
          pricing: 'Free tier available, pay-per-email for higher volumes',
          notes: [
            'Domain verification is required for production use',
            'Monitor delivery rates and reputation',
            'Use proper email templates for better deliverability'
          ]
        },
        phantom: {
          name: 'PhantomBuster',
          description: 'LinkedIn automation and data collection',
          requirements: [
            'PhantomBuster subscription',
            'Created Phantom automation',
            'Sufficient execution credits'
          ],
          steps: [
            'Go to PhantomBuster (https://phantombuster.com)',
            'Create an account and choose a plan',
            'Create a new Phantom or use existing one',
            'Note down the Phantom ID from the URL',
            'Go to Settings > API',
            'Generate an API key',
            'Copy both the API key and Phantom ID'
          ],
          keyFormat: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          testEndpoint: 'https://api.phantombuster.com/api/v2/agents/fetch',
          docsUrl: 'https://docs.phantombuster.com',
          pricing: 'Subscription-based with execution credits',
          notes: [
            'Respect LinkedIn terms of service',
            'Monitor execution limits and credits',
            'Use appropriate delays to avoid detection'
          ]
        },
        apify: {
          name: 'Apify Web Scraping',
          description: 'Web scraping and data extraction for LinkedIn profiles',
          requirements: [
            'Apify account with credits',
            'Access to LinkedIn Profile Scraper actor',
            'Proxy usage enabled'
          ],
          steps: [
            'Visit Apify (https://apify.com)',
            'Create an account and verify email',
            'Add credits to your account',
            'Go to Settings > Integrations',
            'Generate a new API token',
            'Copy the token (starts with "apify_api_")'
          ],
          keyFormat: 'apify_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          testEndpoint: 'https://api.apify.com/v2/acts',
          docsUrl: 'https://docs.apify.com',
          pricing: 'Credit-based system',
          notes: [
            'Requires credits for scraping operations',
            'Use residential proxies for better success rates',
            'Respect website terms of service and rate limits'
          ]
        },
        uploadPost: {
          name: 'UploadPost Multi-Platform',
          description: 'Multi-platform content publishing service',
          requirements: [
            'UploadPost account with API access',
            'LinkedIn OAuth completed',
            'Active subscription',
            'Platform connections configured'
          ],
          steps: [
            'Go to UploadPost (https://uploadpost.com)',
            'Create an account and verify email',
            'Complete LinkedIn OAuth connection',
            'Subscribe to a plan with API access',
            'Go to API Settings',
            'Generate JWT token for API access'
          ],
          keyFormat: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          testEndpoint: 'https://api.uploadpost.com/v1/user/profile',
          docsUrl: 'https://docs.uploadpost.com',
          pricing: 'Subscription-based with post limits',
          notes: [
            'Requires OAuth connection to social platforms',
            'Monitor post limits and scheduling quotas',
            'Ensure content complies with platform guidelines'
          ]
        }
      };
      
      setManuals(mockManuals);
    } catch (error) {
      console.error('Failed to load API manuals:', error);
    } finally {
      setIsLoadingManuals(false);
    }
  };

  const updateLocalApiKey = (serviceId: string, key: string) => {
    setApiKeys(prev => ({ ...prev, [serviceId]: key }));
    
    // Also update in the global store
    const storeKeyMap: Record<string, keyof typeof storeApiKeys> = {
      gemini: 'geminiApiKey',
      undetectable: 'undetectableApiKey',
      sapling: 'saplingApiKey',
      resend: 'resendApiKey',
      phantombuster: 'phantombusterKey',
      apify: 'apifyKey',
      uploadpost: 'uploadPostApiKey'
    };
    
    const storeKey = storeKeyMap[serviceId];
    if (storeKey) {
      updateApiKey(storeKey, key);
    }
  };

  const updateAdditionalData = (serviceId: string, fieldId: string, value: string) => {
    const key = `${serviceId}_${fieldId}`;
    setAdditionalData(prev => ({ ...prev, [key]: value }));
  };

  const toggleKeyVisibility = (serviceId: string) => {
    setShowKeys(prev => ({ ...prev, [serviceId]: !prev[serviceId] }));
  };

  const toggleManual = (serviceId: string) => {
    setShowManuals(prev => ({ ...prev, [serviceId]: !prev[serviceId] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const testApiKey = async (serviceId: string) => {
    const apiKey = apiKeys[serviceId];
    if (!apiKey) {
      toast.error('Please enter an API key first');
      return;
    }

    // Find the service configuration
    const service = apiServices.find(s => s.id === serviceId);
    if (!service) {
      toast.error('Service configuration not found');
      return;
    }

    // Set testing state
    setTestResults(prev => ({
      ...prev,
      [serviceId]: { service: serviceId, valid: false, saved: false, testing: true }
    }));

    try {
      // Prepare request data
      const requestData = {
        apiKey,
        service: serviceId,
        userId: 'test-user-chaitra'
      };
      
      // Add additional fields if provided
      if (service.additionalFields) {
        service.additionalFields.forEach(field => {
          const value = additionalData[`${serviceId}_${field.id}`];
          if (field.required && !value) {
            throw new Error(`${field.label} is required`);
          }
          if (value) {
            requestData[field.id] = value;
          }
        });
      }

      // Make the API request
      const response = await axios.post('/api/test-api-key', requestData, {
        timeout: 30000 // 30 second timeout
      });

      // Update test results
      setTestResults(prev => ({
        ...prev,
        [serviceId]: { 
          service: serviceId,
          valid: response.data.valid || false,
          saved: response.data.saved || false,
          data: response.data.data || {},
          testing: false
        }
      }));

      toast.success(`${service.name} API key is valid!`);
    } catch (error: any) {
      // Handle errors
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      
      setTestResults(prev => ({
        ...prev,
        [serviceId]: {
          service: serviceId,
          valid: false,
          saved: false,
          error: errorMessage,
          troubleshoot: `Check your API key format and ensure you have the necessary permissions. ${service.manual.docsUrl}`,
          testing: false
        }
      }));

      toast.error(`${service.name} API test failed: ${errorMessage}`);
    }
  };

  const validateAllKeys = async () => {
    setIsValidatingAll(true);
    
    try {
      // Prepare the request payload
      const keysToValidate: any = {};
      
      // Add keys that have values
      if (apiKeys.gemini) keysToValidate.gemini = apiKeys.gemini;
      if (apiKeys.undetectable) keysToValidate.undetectable = apiKeys.undetectable;
      if (apiKeys.sapling) keysToValidate.sapling = apiKeys.sapling;
      
      // Add keys with additional parameters
      if (apiKeys.resend) {
        keysToValidate.resend = {
          key: apiKeys.resend,
          senderEmail: additionalData['resend_senderEmail'] || 'noreply@chaitra.ai'
        };
      }
      
      if (apiKeys.phantombuster) {
        keysToValidate.phantom = {
          key: apiKeys.phantombuster,
          phantomId: additionalData['phantombuster_phantomId'] || ''
        };
      }
      
      if (apiKeys.apify) keysToValidate.apify = apiKeys.apify;
      if (apiKeys.uploadpost) keysToValidate.uploadPost = apiKeys.uploadpost;
      
      // Make the API request
      const response = await axios.post('/api/validate-all-keys', {
        userId: 'test-user-chaitra',
        keys: keysToValidate
      });
      
      // Process results
      const { verified = [], failed = [], results = [] } = response.data;
      
      // Update test results for each service
      results.forEach((result: any) => {
        setTestResults(prev => ({
          ...prev,
          [result.service]: {
            ...result,
            valid: result.valid || false,
            saved: result.valid || false,
            testing: false
          }
        }));
      });
      
      // Show success/failure message
      if (verified.length > 0) {
        toast.success(`Successfully validated ${verified.length} API keys: ${verified.join(', ')}`);
      }
      
      if (failed.length > 0) {
        toast.error(`Failed to validate ${failed.length} API keys: ${failed.map((f: any) => f.service).join(', ')}`);
      }
      
      if (verified.length === 0 && failed.length === 0) {
        toast.info('No API keys to validate. Please enter API keys first.');
      }
    } catch (error: any) {
      console.error('Validation error:', error);
      toast.error(`Failed to validate API keys: ${error.message}`);
    } finally {
      setIsValidatingAll(false);
    }
  };

  const getStatusColor = (result?: TestResult) => {
    if (result?.testing) return 'text-yellow-400';
    if (result?.valid) return 'text-green-400';
    if (result?.error) return 'text-red-400';
    return 'text-gray-400';
  };

  const getStatusIcon = (result?: TestResult) => {
    if (result?.testing) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (result?.valid) return <CheckCircle className="w-4 h-4" />;
    if (result?.error) return <XCircle className="w-4 h-4" />;
    return <TestTube className="w-4 h-4" />;
  };

  const validServices = Object.values(testResults).filter(r => r.valid).length;
  const totalServices = apiServices.length;
  const setupProgress = Math.round((validServices / totalServices) * 100);

  return (
    <DashboardLayout>
      <div className="p-6 w-full max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">API Testing Environment</h1>
          <p className="text-gray-400">
            Validate your API keys and test integrations before using Chaitra features
          </p>
        </div>

        {/* Setup Progress */}
        <Card className="bg-gray-900/50 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                API Integration Status
              </div>
              <Badge className={setupProgress === 100 ? 'bg-green-600' : setupProgress > 50 ? 'bg-yellow-600' : 'bg-red-600'}>
                {validServices}/{totalServices} Services
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Test and validate your external service integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Setup Progress</span>
              <span className="text-white font-medium">{setupProgress}%</span>
            </div>
            <Progress value={setupProgress} className="h-2" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {apiServices.map((service) => {
                const result = testResults[service.id];
                return (
                  <div key={service.id} className="flex items-center space-x-2">
                    <div className={getStatusColor(result)}>
                      {getStatusIcon(result)}
                    </div>
                    <span className={`text-xs ${getStatusColor(result)}`}>
                      {service.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-700">
              <Button
                onClick={validateAllKeys}
                disabled={isValidatingAll}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isValidatingAll ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating All Keys...
                  </>
                ) : (
                  <>
                    <Activity className="mr-2 h-4 w-4" />
                    Validate All Keys
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  // Reset test results
                  setTestResults({});
                }}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Testing Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-gray-900/50 border border-gray-800">
            {apiServices.map((service) => (
              <TabsTrigger
                key={service.id}
                value={service.id}
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400"
              >
                <service.icon className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{service.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {apiServices.map((service) => (
            <TabsContent key={service.id} value={service.id} className="mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* API Key Testing */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <service.icon className="w-5 h-5 mr-2" />
                      {service.name} API Testing
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* API Key Input */}
                    <div>
                      <Label className="text-gray-300 flex items-center justify-between">
                        API Key
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(service.id)}
                          className="h-auto p-1 text-gray-400 hover:text-white"
                        >
                          {showKeys[service.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          type={showKeys[service.id] ? "text" : "password"}
                          placeholder={service.keyPlaceholder}
                          value={apiKeys[service.id] || ''}
                          onChange={(e) => updateLocalApiKey(service.id, e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(apiKeys[service.id] || '')}
                          disabled={!apiKeys[service.id]}
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Additional Fields */}
                    {service.additionalFields?.map((field) => (
                      <div key={field.id}>
                        <Label className="text-gray-300">
                          {field.label} {field.required && <span className="text-red-400">*</span>}
                        </Label>
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={additionalData[`${service.id}_${field.id}`] || ''}
                          onChange={(e) => updateAdditionalData(service.id, field.id, e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 mt-2"
                        />
                      </div>
                    ))}

                    {/* Test Button */}
                    <Button
                      onClick={() => testApiKey(service.id)}
                      disabled={!apiKeys[service.id] || testResults[service.id]?.testing}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {testResults[service.id]?.testing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <TestTube className="mr-2 h-4 w-4" />
                          Test API Key
                        </>
                      )}
                    </Button>

                    {/* Test Results */}
                    {testResults[service.id] && !testResults[service.id]?.testing && (
                      <div className={`p-4 rounded-lg border ${
                        testResults[service.id]?.valid 
                          ? 'bg-green-600/20 border-green-500/50' 
                          : 'bg-red-600/20 border-red-500/50'
                      }`}>
                        <div className="flex items-center mb-2">
                          {testResults[service.id]?.valid ? (
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400 mr-2" />
                          )}
                          <span className={`font-medium text-sm ${
                            testResults[service.id]?.valid ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {testResults[service.id]?.valid ? 'API Key Valid' : 'API Key Invalid'}
                          </span>
                          {testResults[service.id]?.saved && (
                            <Badge className="ml-2 bg-blue-600/20 text-blue-400 text-xs">
                              Saved
                            </Badge>
                          )}
                        </div>
                        
                        {testResults[service.id]?.data && (
                          <div className="text-xs text-gray-300 mb-2 bg-gray-800/50 p-2 rounded">
                            <pre className="whitespace-pre-wrap text-xs">
                              {JSON.stringify(testResults[service.id]?.data, null, 2)}
                            </pre>
                          </div>
                        )}
                        
                        {testResults[service.id]?.error && (
                          <p className="text-red-300 text-sm mb-2">
                            {testResults[service.id]?.error}
                          </p>
                        )}
                        
                        {testResults[service.id]?.troubleshoot && (
                          <div className="bg-yellow-600/20 border border-yellow-500/50 rounded p-3 mt-2">
                            <div className="flex items-center mb-1">
                              <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
                              <span className="text-yellow-400 font-medium text-sm">Troubleshooting</span>
                            </div>
                            <p className="text-yellow-300 text-xs">
                              {testResults[service.id]?.troubleshoot}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Manual & Documentation */}
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <HelpCircle className="w-5 h-5 mr-2" />
                        Setup Guide
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(service.manual.docsUrl, '_blank')}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Docs
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Requirements */}
                    <div>
                      <h4 className="text-white font-medium mb-2">Requirements</h4>
                      <ul className="space-y-1">
                        {service.manual.requirements.map((req, index) => (
                          <li key={index} className="text-gray-400 text-sm flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Setup Steps */}
                    <Collapsible open={showManuals[service.id]} onOpenChange={() => toggleManual(service.id)}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between text-gray-300 hover:bg-gray-800">
                          <span>Setup Steps</span>
                          {showManuals[service.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 mt-2">
                        {service.manual.steps.map((step, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                            <Badge className="bg-purple-600 text-white text-xs min-w-[24px] h-6 flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Quick Actions */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testApiKey(service.id)}
                        disabled={!apiKeys[service.id]}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Retest
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateLocalApiKey(service.id, '')}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        Clear
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}