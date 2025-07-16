import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  const manuals = {
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
      extraFields: [
        {
          name: 'senderEmail',
          description: 'Verified sender email address',
          required: true,
          example: 'noreply@yourdomain.com'
        }
      ],
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
      extraFields: [
        {
          name: 'phantomId',
          description: 'ID of the Phantom automation to use',
          required: true,
          example: '1234567890123456789'
        }
      ],
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

  return res.status(200).json({
    success: true,
    manuals,
    totalServices: Object.keys(manuals).length,
    lastUpdated: new Date().toISOString()
  });
}