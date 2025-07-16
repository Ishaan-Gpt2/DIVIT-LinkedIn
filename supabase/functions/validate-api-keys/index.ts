import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

serve(async (req: Request) => {
  // Set up CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { userId, keys }: ApiKeyValidationRequest = await req.json();

    if (!userId || !keys) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing userId or keys in request body",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
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
        verified.push("gemini");
      } else {
        failed.push({ 
          service: "gemini", 
          error: geminiResult.error || "Unknown error",
          suggestion: geminiResult.suggestion 
        });
      }
    }

    if (keys.undetectable) {
      const undetectableResult = await validateUndetectableKey(keys.undetectable);
      results.push(undetectableResult);
      if (undetectableResult.valid) {
        verified.push("undetectable");
      } else {
        failed.push({ 
          service: "undetectable", 
          error: undetectableResult.error || "Unknown error",
          suggestion: undetectableResult.suggestion 
        });
      }
    }

    if (keys.sapling) {
      const saplingResult = await validateSaplingKey(keys.sapling);
      results.push(saplingResult);
      if (saplingResult.valid) {
        verified.push("sapling");
      } else {
        failed.push({ 
          service: "sapling", 
          error: saplingResult.error || "Unknown error",
          suggestion: saplingResult.suggestion 
        });
      }
    }

    if (keys.resend) {
      const resendResult = await validateResendKey(keys.resend.key, keys.resend.senderEmail);
      results.push(resendResult);
      if (resendResult.valid) {
        verified.push("resend");
      } else {
        failed.push({ 
          service: "resend", 
          error: resendResult.error || "Unknown error",
          suggestion: resendResult.suggestion 
        });
      }
    }

    if (keys.phantom) {
      const phantomResult = await validatePhantomBusterKey(keys.phantom.key, keys.phantom.phantomId);
      results.push(phantomResult);
      if (phantomResult.valid) {
        verified.push("phantom");
      } else {
        failed.push({ 
          service: "phantom", 
          error: phantomResult.error || "Unknown error",
          suggestion: phantomResult.suggestion 
        });
      }
    }

    if (keys.apify) {
      const apifyResult = await validateApifyKey(keys.apify);
      results.push(apifyResult);
      if (apifyResult.valid) {
        verified.push("apify");
      } else {
        failed.push({ 
          service: "apify", 
          error: apifyResult.error || "Unknown error",
          suggestion: apifyResult.suggestion 
        });
      }
    }

    if (keys.uploadPost) {
      const uploadPostResult = await validateUploadPostKey(keys.uploadPost);
      results.push(uploadPostResult);
      if (uploadPostResult.valid) {
        verified.push("uploadPost");
      } else {
        failed.push({ 
          service: "uploadPost", 
          error: uploadPostResult.error || "Unknown error",
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
        console.error("❌ Failed to store keys in Supabase:", error);
      }
    }

    console.log(`🎯 Validation complete: ${verified.length} verified, ${failed.length} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        verified,
        failed,
        storedInSupabase,
        results,
        summary: {
          total: results.length,
          verified: verified.length,
          failed: failed.length,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("💥 API key validation error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error during validation",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});

// Validation Functions

async function validateGeminiKey(apiKey: string): Promise<ValidationResult> {
  const curlCommand = `curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}" -H 'Content-Type: application/json' -X POST -d '{"contents":[{"parts":[{"text":"Test"}]}]}'`;
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Test",
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    
    return {
      service: "gemini",
      valid: true,
      responseData: data,
      statusCode: response.status,
      curlCommand,
    };
  } catch (error) {
    return {
      service: "gemini",
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error",
      suggestion: "Verify API key is correct and has Generative Language API enabled",
      statusCode: 401,
      curlCommand,
    };
  }
}

async function validateUndetectableKey(apiKey: string): Promise<ValidationResult> {
  const curlCommand = `curl -X POST "https://api.undetectable.ai/api/rewrite" -H "Authorization: Bearer ${apiKey}" -H "Content-Type: application/json" -d '{"content":"Hello","rewrite_mode":"high","output_mode":"general"}'`;
  
  try {
    const response = await fetch(
      "https://api.undetectable.ai/api/rewrite",
      {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "Hello",
          rewrite_mode: "high",
          output_mode: "general",
        }),
      }
    );

    const data = await response.json();
    
    return {
      service: "undetectable",
      valid: true,
      responseData: data,
      statusCode: response.status,
      curlCommand,
    };
  } catch (error) {
    return {
      service: "undetectable",
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error",
      suggestion: "Ensure you have a paid subscription and valid API key",
      statusCode: 401,
      curlCommand,
    };
  }
}

async function validateSaplingKey(apiKey: string): Promise<ValidationResult> {
  const curlCommand = `curl -X POST "https://api.sapling.ai/api/v1/aidetect" -H "Authorization: Bearer ${apiKey}" -H "Content-Type: application/json" -d '{"text":"This is test content for AI detection."}'`;
  
  try {
    const response = await fetch(
      "https://api.sapling.ai/api/v1/aidetect",
      {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: "This is test content for AI detection.",
        }),
      }
    );

    const data = await response.json();
    
    return {
      service: "sapling",
      valid: true,
      responseData: data,
      statusCode: response.status,
      curlCommand,
    };
  } catch (error) {
    return {
      service: "sapling",
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error",
      suggestion: "Verify API key and ensure you have an active subscription",
      statusCode: 401,
      curlCommand,
    };
  }
}

async function validateResendKey(apiKey: string, senderEmail?: string): Promise<ValidationResult> {
  const curlCommand = `curl -X POST "https://api.resend.com/emails" -H "Authorization: Bearer ${apiKey}" -H "Content-Type: application/json" -d '{"from":"Chaitra <${senderEmail || "noreply@chaitra.ai"}>","to":["test@chaitra.ai"],"subject":"Validation","html":"<p>Testing email validation</p>"}'`;
  
  try {
    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Chaitra <${senderEmail || "noreply@chaitra.ai"}>`,
          to: ["test@chaitra.ai"],
          subject: "Validation",
          html: "<p>Testing email validation</p>",
        }),
      }
    );

    const data = await response.json();
    
    return {
      service: "resend",
      valid: true,
      responseData: data,
      statusCode: response.status,
      curlCommand,
    };
  } catch (error) {
    return {
      service: "resend",
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error",
      suggestion: "Verify domain is verified and sender email is authorized",
      statusCode: 401,
      curlCommand,
    };
  }
}

async function validatePhantomBusterKey(apiKey: string, phantomId?: string): Promise<ValidationResult> {
  const endpoint = phantomId 
    ? `https://api.phantombuster.com/api/v2/agents/launch?id=${phantomId}&output=first`
    : "https://api.phantombuster.com/api/v2/agents/fetch-all";
  
  const curlCommand = `curl -X GET "${endpoint}" -H "X-Phantombuster-Key-1: ${apiKey}"`;
  
  try {
    const response = await fetch(
      endpoint,
      {
        headers: { "X-Phantombuster-Key-1": apiKey },
      }
    );

    const data = await response.json();
    
    return {
      service: "phantom",
      valid: true,
      responseData: data,
      statusCode: response.status,
      curlCommand,
    };
  } catch (error) {
    return {
      service: "phantom",
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error",
      suggestion: "Verify API key and Phantom ID are correct",
      statusCode: 401,
      curlCommand,
    };
  }
}

async function validateApifyKey(apiKey: string): Promise<ValidationResult> {
  const curlCommand = `curl "https://api.apify.com/v2/acts/drobnikj~linkedin-profile-scraper?token=${apiKey}"`;
  
  try {
    const response = await fetch(
      `https://api.apify.com/v2/acts/drobnikj~linkedin-profile-scraper?token=${apiKey}`
    );

    const data = await response.json();
    
    return {
      service: "apify",
      valid: true,
      responseData: data,
      statusCode: response.status,
      curlCommand,
    };
  } catch (error) {
    return {
      service: "apify",
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error",
      suggestion: "Verify API key and ensure you have credits in your Apify account",
      statusCode: 401,
      curlCommand,
    };
  }
}

async function validateUploadPostKey(apiKey: string): Promise<ValidationResult> {
  const curlCommand = `curl -X GET "https://api.uploadpost.com/v1/user/profile" -H "Authorization: Bearer ${apiKey}"`;
  
  try {
    const response = await fetch(
      "https://api.uploadpost.com/v1/user/profile",
      {
        headers: { "Authorization": `Bearer ${apiKey}` },
      }
    );

    const data = await response.json();
    
    return {
      service: "uploadPost",
      valid: true,
      responseData: data,
      statusCode: response.status,
      curlCommand,
    };
  } catch (error) {
    return {
      service: "uploadPost",
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error",
      suggestion: "Verify API key and ensure account has API access",
      statusCode: 401,
      curlCommand,
    };
  }
}

async function storeVerifiedKeys(userId: string, keys: any, verified: string[]) {
  const timestamp = new Date().toISOString();
  
  for (const service of verified) {
    let apiKey = "";
    let extraParams = {};
    
    switch (service) {
      case "gemini":
        apiKey = keys.gemini;
        break;
      case "undetectable":
        apiKey = keys.undetectable;
        break;
      case "sapling":
        apiKey = keys.sapling;
        break;
      case "resend":
        apiKey = keys.resend.key;
        extraParams = { senderEmail: keys.resend.senderEmail };
        break;
      case "phantom":
        apiKey = keys.phantom.key;
        extraParams = { phantomId: keys.phantom.phantomId };
        break;
      case "apify":
        apiKey = keys.apify;
        break;
      case "uploadPost":
        apiKey = keys.uploadPost;
        break;
    }
    
    // Store in verified_api_keys table
    await supabase
      .from("verified_api_keys")
      .upsert({
        user_id: userId,
        service,
        api_key: apiKey,
        status: "verified",
        tested_at: timestamp,
        extra_params: extraParams,
      });
  }
}