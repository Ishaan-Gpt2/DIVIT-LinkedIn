import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { service } = req.query;
    const { apiKey, userId, ...extraParams } = req.query;

    if (!service || !apiKey) {
      return res.status(400).json({
        success: false,
        message: 'Missing service or apiKey parameter'
      });
    }

    console.log(`🧪 Live testing ${service} API for user: ${userId}`);

    let result;
    
    switch (service) {
      case 'gemini':
        result = await testGeminiLive(apiKey as string);
        break;
      case 'undetectable':
        result = await testUndetectableLive(apiKey as string);
        break;
      case 'sapling':
        result = await testSaplingLive(apiKey as string);
        break;
      case 'resend':
        result = await testResendLive(apiKey as string, extraParams.senderEmail as string);
        break;
      case 'phantom':
        result = await testPhantomLive(apiKey as string, extraParams.phantomId as string);
        break;
      case 'apify':
        result = await testApifyLive(apiKey as string);
        break;
      case 'uploadPost':
        result = await testUploadPostLive(apiKey as string);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: `Unsupported service: ${service}`
        });
    }

    return res.status(200).json({
      success: true,
      service,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Live test error for ${req.query.service}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Live test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Live test functions with real API calls

async function testGeminiLive(apiKey: string) {
  const startTime = Date.now();
  
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: "Hello, please respond with a short test message."
              }
            ]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );
    
    const responseTime = Date.now() - startTime;
    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Valid response received";
    
    return {
      success: true,
      statusCode: response.status,
      responseTime: `${responseTime}ms`,
      data: response.data,
      generatedText,
      rawResponse: JSON.stringify(response.data, null, 2)
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      statusCode: error.response?.status || 0,
      responseTime: `${responseTime}ms`,
      error: error.response?.data || error.message,
      suggestion: 'Check API key validity and ensure Generative Language API is enabled'
    };
  }
}

async function testUndetectableLive(apiKey: string) {
  const startTime = Date.now();
  
  try {
    const response = await axios.post(
      'https://api.undetectable.ai/api/rewrite',
      {
        content: "This is a test for API validation.",
        rewrite_mode: "high",
        output_mode: "general"
      },
      {
        headers: { 
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      statusCode: response.status,
      responseTime: `${responseTime}ms`,
      data: response.data,
      rawResponse: JSON.stringify(response.data, null, 2)
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      statusCode: error.response?.status || 0,
      responseTime: `${responseTime}ms`,
      error: error.response?.data || error.message,
      suggestion: 'Ensure you have a paid subscription and sufficient credits'
    };
  }
}

async function testSaplingLive(apiKey: string) {
  const startTime = Date.now();
  
  try {
    const response = await axios.post(
      'https://api.sapling.ai/api/v1/aidetect',
      {
        text: "This is a test for AI detection."
      },
      {
        headers: { 
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      statusCode: response.status,
      responseTime: `${responseTime}ms`,
      data: response.data,
      aiScore: response.data?.score || 0.5,
      humanScore: 1 - (response.data?.score || 0.5),
      rawResponse: JSON.stringify(response.data, null, 2)
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      statusCode: error.response?.status || 0,
      responseTime: `${responseTime}ms`,
      error: error.response?.data || error.message,
      suggestion: 'Verify API key and ensure you have an active subscription'
    };
  }
}

async function testResendLive(apiKey: string, senderEmail?: string) {
  const startTime = Date.now();
  
  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: `Chaitra <${senderEmail || 'noreply@chaitra.ai'}>`,
        to: ["test@chaitra.ai"],
        subject: "API Key Validation",
        html: "<p>This is a test email for API key validation.</p>"
      },
      {
        headers: { 
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      statusCode: response.status,
      responseTime: `${responseTime}ms`,
      data: response.data,
      emailId: response.data?.id,
      rawResponse: JSON.stringify(response.data, null, 2)
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      statusCode: error.response?.status || 0,
      responseTime: `${responseTime}ms`,
      error: error.response?.data || error.message,
      suggestion: 'Verify domain is verified and sender email is authorized'
    };
  }
}

async function testPhantomLive(apiKey: string, phantomId?: string) {
  const startTime = Date.now();
  
  try {
    // If no phantomId is provided, just check if the API key is valid by listing agents
    const endpoint = phantomId 
      ? `https://api.phantombuster.com/api/v2/agents/launch?id=${phantomId}&output=first`
      : 'https://api.phantombuster.com/api/v2/agents/fetch-all';
    
    const response = await axios.get(
      endpoint,
      {
        headers: { 'X-Phantombuster-Key-1': apiKey },
        timeout: 10000
      }
    );
    
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      statusCode: response.status,
      responseTime: `${responseTime}ms`,
      data: response.data,
      phantomInfo: phantomId ? {
        name: response.data?.data?.name || "Test Phantom",
        status: response.data?.data?.status || "ready",
        lastEndStatus: response.data?.data?.lastEndStatus || "success"
      } : {
        count: response.data?.data?.length || 0
      },
      rawResponse: JSON.stringify(response.data, null, 2)
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      statusCode: error.response?.status || 0,
      responseTime: `${responseTime}ms`,
      error: error.response?.data || error.message,
      suggestion: 'Verify API key and Phantom ID are correct'
    };
  }
}

async function testApifyLive(apiKey: string) {
  const startTime = Date.now();
  
  try {
    const response = await axios.get(
      `https://api.apify.com/v2/acts?token=${apiKey}`,
      { timeout: 10000 }
    );
    
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      statusCode: response.status,
      responseTime: `${responseTime}ms`,
      data: response.data,
      actorCount: response.data?.data?.length || 0,
      rawResponse: JSON.stringify(response.data, null, 2)
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      statusCode: error.response?.status || 0,
      responseTime: `${responseTime}ms`,
      error: error.response?.data || error.message,
      suggestion: 'Verify API key and ensure you have credits in your account'
    };
  }
}

async function testUploadPostLive(apiKey: string) {
  const startTime = Date.now();
  
  try {
    const response = await axios.get(
      'https://api.uploadpost.com/v1/user/profile',
      {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        timeout: 10000
      }
    );
    
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      statusCode: response.status,
      responseTime: `${responseTime}ms`,
      data: response.data,
      userProfile: {
        user_id: response.data?.user_id || `user_${Math.random().toString(36).substring(2, 15)}`,
        plan: response.data?.plan || "pro",
        credits: response.data?.credits || 100
      },
      rawResponse: JSON.stringify(response.data, null, 2)
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      statusCode: error.response?.status || 0,
      responseTime: `${responseTime}ms`,
      error: error.response?.data || error.message,
      suggestion: 'Verify API key and ensure account has API access'
    };
  }
}