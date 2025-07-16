import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../lib/supabase/client';
import axios from 'axios';

interface ApiKeyValidationRequest {
  userId: string;
  keys: {
    gemini?: string;
    undetectable?: string;
    sapling?: string;
    resend?: { key: string; senderEmail: string };
    phantom?: { key: string; phantomId: string };
    apify?: string;
    uploadPost?: string;
  };
}

interface ValidationResult {
  service: string;
  valid: boolean;
  error?: string;
  suggestion?: string;
  curlCommand?: string;
  responseData?: any;
  statusCode?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { userId, keys }: ApiKeyValidationRequest = req.body;

    if (!userId || !keys) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId or keys in request body'
      });
    }

    console.log(`🔑 Starting API key validation for user: ${userId}`);
    
    const results: ValidationResult[] = [];
    const verified: string[] = [];
    const failed: Array<{ service: string; error: string; suggestion?: string }> = [];

    // Validate each service
    if (keys.gemini) {
      const geminiResult = await validateGeminiKey(keys.gemini);
      results.push(geminiResult);
      if (geminiResult.valid) {
        verified.push('gemini');
      } else {
        failed.push({ 
          service: 'gemini', 
          error: geminiResult.error || 'Unknown error',
          suggestion: geminiResult.suggestion 
        });
      }
    }

    if (keys.undetectable) {
      const undetectableResult = await validateUndetectableKey(keys.undetectable);
      results.push(undetectableResult);
      if (undetectableResult.valid) {
        verified.push('undetectable');
      } else {
        failed.push({ 
          service: 'undetectable', 
          error: undetectableResult.error || 'Unknown error',
          suggestion: undetectableResult.suggestion 
        });
      }
    }

    if (keys.sapling) {
      const saplingResult = await validateSaplingKey(keys.sapling);
      results.push(saplingResult);
      if (saplingResult.valid) {
        verified.push('sapling');
      } else {
        failed.push({ 
          service: 'sapling', 
          error: saplingResult.error || 'Unknown error',
          suggestion: saplingResult.suggestion 
        });
      }
    }

    if (keys.resend) {
      const resendResult = await validateResendKey(keys.resend.key, keys.resend.senderEmail);
      results.push(resendResult);
      if (resendResult.valid) {
        verified.push('resend');
      } else {
        failed.push({ 
          service: 'resend', 
          error: resendResult.error || 'Unknown error',
          suggestion: resendResult.suggestion 
        });
      }
    }

    if (keys.phantom) {
      const phantomResult = await validatePhantomBusterKey(keys.phantom.key, keys.phantom.phantomId);
      results.push(phantomResult);
      if (phantomResult.valid) {
        verified.push('phantom');
      } else {
        failed.push({ 
          service: 'phantom', 
          error: phantomResult.error || 'Unknown error',
          suggestion: phantomResult.suggestion 
        });
      }
    }

    if (keys.apify) {
      const apifyResult = await validateApifyKey(keys.apify);
      results.push(apifyResult);
      if (apifyResult.valid) {
        verified.push('apify');
      } else {
        failed.push({ 
          service: 'apify', 
          error: apifyResult.error || 'Unknown error',
          suggestion: apifyResult.suggestion 
        });
      }
    }

    if (keys.uploadPost) {
      const uploadPostResult = await validateUploadPostKey(keys.uploadPost);
      results.push(uploadPostResult);
      if (uploadPostResult.valid) {
        verified.push('uploadPost');
      } else {
        failed.push({ 
          service: 'uploadPost', 
          error: uploadPostResult.error || 'Unknown error',
          suggestion: uploadPostResult.suggestion 
        });
      }
    }

    // Store verified keys in Supabase
    let storedInSupabase = false;
    if (verified.length > 0) {
      try {
        await storeVerifiedKeys(userId, keys, verified);
        storedInSupabase = true;
        console.log(`✅ Stored ${verified.length} verified keys for user ${userId}`);
      } catch (error) {
        console.error('❌ Failed to store keys in Supabase:', error);
      }
    }

    console.log(`🎯 Validation complete: ${verified.length} verified, ${failed.length} failed`);

    return res.status(200).json({
      success: true,
      verified,
      failed,
      storedInSupabase,
      results,
      summary: {
        total: results.length,
        verified: verified.length,
        failed: failed.length
      }
    });

  } catch (error) {
    console.error('💥 API key validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during validation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Validation Functions

async function validateGeminiKey(apiKey: string): Promise<ValidationResult> {
  const curlCommand = `curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}" -H 'Content-Type: application/json' -X POST -d '{"contents":[{"parts":[{"text":"Test"}]}]}'`;
  
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: "Test"
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

    return {
      service: 'gemini',
      valid: true,
      responseData: response.data,
      statusCode: response.status,
      curlCommand
    };
  } catch (error: any) {
    return {
      service: 'gemini',
      valid: false,
      error: error.response?.data?.error?.message || error.message,
      suggestion: 'Verify API key is correct and has Generative Language API enabled',
      statusCode: error.response?.status,
      curlCommand
    };
  }
}

async function validateUndetectableKey(apiKey: string): Promise<ValidationResult> {
  const curlCommand = `curl -X POST "https://api.undetectable.ai/api/rewrite" -H "Authorization: Bearer ${apiKey}" -H "Content-Type: application/json" -d '{"content":"Hello","rewrite_mode":"high","output_mode":"general"}'`;
  
  try {
    const response = await axios.post(
      'https://api.undetectable.ai/api/rewrite',
      {
        content: "Hello",
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

    return {
      service: 'undetectable',
      valid: true,
      responseData: response.data,
      statusCode: response.status,
      curlCommand
    };
  } catch (error: any) {
    return {
      service: 'undetectable',
      valid: false,
      error: error.response?.data?.message || error.message,
      suggestion: 'Ensure you have a paid subscription and valid API key',
      statusCode: error.response?.status,
      curlCommand
    };
  }
}

async function validateSaplingKey(apiKey: string): Promise<ValidationResult> {
  const curlCommand = `curl -X POST "https://api.sapling.ai/api/v1/aidetect" -H "Authorization: Bearer ${apiKey}" -H "Content-Type: application/json" -d '{"text":"This is test content for AI detection."}'`;
  
  try {
    const response = await axios.post(
      'https://api.sapling.ai/api/v1/aidetect',
      {
        text: "This is test content for AI detection."
      },
      {
        headers: { 
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    return {
      service: 'sapling',
      valid: true,
      responseData: response.data,
      statusCode: response.status,
      curlCommand
    };
  } catch (error: any) {
    return {
      service: 'sapling',
      valid: false,
      error: error.response?.data?.message || error.message,
      suggestion: 'Verify API key and ensure you have an active subscription',
      statusCode: error.response?.status,
      curlCommand
    };
  }
}

async function validateResendKey(apiKey: string, senderEmail: string): Promise<ValidationResult> {
  const curlCommand = `curl -X POST "https://api.resend.com/emails" -H "Authorization: Bearer ${apiKey}" -H "Content-Type: application/json" -d '{"from":"Chaitra <${senderEmail}>","to":["test@chaitra.ai"],"subject":"Validation","html":"<p>Testing email validation</p>"}'`;
  
  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: `Chaitra <${senderEmail || 'noreply@chaitra.ai'}>`,
        to: ["test@chaitra.ai"],
        subject: "Validation",
        html: "<p>Testing email validation</p>"
      },
      {
        headers: { 
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    return {
      service: 'resend',
      valid: true,
      responseData: response.data,
      statusCode: response.status,
      curlCommand
    };
  } catch (error: any) {
    return {
      service: 'resend',
      valid: false,
      error: error.response?.data?.message || error.message,
      suggestion: 'Verify domain is verified and sender email is authorized',
      statusCode: error.response?.status,
      curlCommand
    };
  }
}

async function validatePhantomBusterKey(apiKey: string, phantomId: string): Promise<ValidationResult> {
  const curlCommand = `curl -X GET "https://api.phantombuster.com/api/v2/agents/launch?id=${phantomId}&output=first" -H "X-Phantombuster-Key-1: ${apiKey}"`;
  
  try {
    const response = await axios.get(
      `https://api.phantombuster.com/api/v2/agents/launch?id=${phantomId}&output=first`,
      {
        headers: { 'X-Phantombuster-Key-1': apiKey },
        timeout: 10000
      }
    );

    return {
      service: 'phantom',
      valid: true,
      responseData: response.data,
      statusCode: response.status,
      curlCommand
    };
  } catch (error: any) {
    return {
      service: 'phantom',
      valid: false,
      error: error.response?.data?.message || error.message,
      suggestion: 'Verify API key and Phantom ID are correct',
      statusCode: error.response?.status,
      curlCommand
    };
  }
}

async function validateApifyKey(apiKey: string): Promise<ValidationResult> {
  const curlCommand = `curl "https://api.apify.com/v2/acts/drobnikj~linkedin-profile-scraper?token=${apiKey}"`;
  
  try {
    const response = await axios.get(
      `https://api.apify.com/v2/acts/drobnikj~linkedin-profile-scraper?token=${apiKey}`,
      { timeout: 10000 }
    );

    return {
      service: 'apify',
      valid: true,
      responseData: response.data,
      statusCode: response.status,
      curlCommand
    };
  } catch (error: any) {
    return {
      service: 'apify',
      valid: false,
      error: error.response?.data?.error?.message || error.message,
      suggestion: 'Verify API key and ensure you have credits in your Apify account',
      statusCode: error.response?.status,
      curlCommand
    };
  }
}

async function validateUploadPostKey(apiKey: string): Promise<ValidationResult> {
  const curlCommand = `curl -X GET "https://api.uploadpost.com/v1/user/profile" -H "Authorization: Bearer ${apiKey}"`;
  
  try {
    const response = await axios.get(
      'https://api.uploadpost.com/v1/user/profile',
      {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        timeout: 10000
      }
    );

    return {
      service: 'uploadPost',
      valid: true,
      responseData: response.data,
      statusCode: response.status,
      curlCommand
    };
  } catch (error: any) {
    return {
      service: 'uploadPost',
      valid: false,
      error: error.response?.data?.message || error.message,
      suggestion: 'Verify API key and ensure account has API access',
      statusCode: error.response?.status,
      curlCommand
    };
  }
}

async function storeVerifiedKeys(userId: string, keys: any, verified: string[]) {
  const timestamp = new Date().toISOString();
  
  for (const service of verified) {
    let apiKey = '';
    let extraParams = {};
    
    switch (service) {
      case 'gemini':
        apiKey = keys.gemini;
        break;
      case 'undetectable':
        apiKey = keys.undetectable;
        break;
      case 'sapling':
        apiKey = keys.sapling;
        break;
      case 'resend':
        apiKey = keys.resend.key;
        extraParams = { senderEmail: keys.resend.senderEmail };
        break;
      case 'phantom':
        apiKey = keys.phantom.key;
        extraParams = { phantomId: keys.phantom.phantomId };
        break;
      case 'apify':
        apiKey = keys.apify;
        break;
      case 'uploadPost':
        apiKey = keys.uploadPost;
        break;
    }
    
    // Store in verified_api_keys table
    await supabase
      .from('verified_api_keys')
      .upsert({
        user_id: userId,
        service,
        api_key: apiKey,
        status: 'verified',
        tested_at: timestamp,
        extra_params: extraParams
      });
  }
}