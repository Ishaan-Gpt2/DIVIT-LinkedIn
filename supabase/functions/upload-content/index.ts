import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface UploadContentRequest {
  fileUrl: string;
  description: string;
  platforms: string[];
  userId: string;
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
    // Parse request body
    const requestData: UploadContentRequest = await req.json();
    const { fileUrl, description, platforms, userId } = requestData;

    // Validate required inputs
    if (!fileUrl || !description || !platforms || !userId) {
      return new Response(
        JSON.stringify({
          status: "fail",
          message: "Missing required fields: fileUrl, description, platforms, userId",
        }),
        {
          status: 422,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Check user credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits, plan")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({
          status: "fail",
          message: "User not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Check if user has sufficient credits (2 credits for content upload)
    if (profile.plan === "free" && profile.credits < 2) {
      return new Response(
        JSON.stringify({
          status: "fail",
          message: "Insufficient credits",
        }),
        {
          status: 402,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Upload to each platform
    const result = await uploadToMultiplePlatforms({
      fileUrl,
      description,
      platforms,
      userId,
    });

    // Deduct credits for free users
    if (profile.plan === "free") {
      await supabase
        .from("profiles")
        .update({
          credits: profile.credits - 2,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
    }

    // Log API usage
    await supabase.from("api_usage").insert({
      user_id: userId,
      service: "content_upload",
      credits_used: profile.plan === "free" ? 2 : 0,
      success: true,
    });

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Content uploaded successfully",
        data: result,
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
    console.error("Content upload error:", error);
    return new Response(
      JSON.stringify({
        status: "fail",
        message: "Upload failed",
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

async function uploadToMultiplePlatforms({
  fileUrl,
  description,
  platforms,
  userId,
}: {
  fileUrl: string;
  description: string;
  platforms: string[];
  userId: string;
}) {
  const apiKey = Deno.env.get("UPLOAD_POST_API_KEY");
  
  if (!apiKey) {
    throw new Error("UPLOAD_POST_API_KEY not configured");
  }

  try {
    const uploadPromises = platforms.map((platform) =>
      uploadToPlatform(platform, { fileUrl, description, userId }, apiKey)
    );

    const results = await Promise.allSettled(uploadPromises);
    
    const platformResults: Record<string, any> = {};
    let successCount = 0;
    
    results.forEach((result, index) => {
      const platform = platforms[index];
      
      if (result.status === "fulfilled") {
        platformResults[platform] = result.value;
        successCount++;
      } else {
        platformResults[platform] = {
          success: false,
          error: result.reason instanceof Error ? result.reason.message : "Unknown error",
          platform,
        };
      }
    });

    return {
      success: successCount > 0,
      platforms,
      platformResults,
      summary: {
        total: platforms.length,
        successful: successCount,
        failed: platforms.length - successCount,
      },
    };
  } catch (error) {
    console.error("Multi-platform upload error:", error);
    throw new Error(`Content upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

async function uploadToPlatform(
  platform: string,
  { fileUrl, description, userId }: { fileUrl: string; description: string; userId: string },
  apiKey: string
) {
  try {
    const response = await fetch(
      `https://api.uploadpost.com/v1/upload/${platform}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_url: fileUrl,
          caption: description,
          user_id: userId,
          auto_publish: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `${platform} upload failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      platform,
      postId: data.post_id,
      url: data.post_url,
      status: "published",
    };
  } catch (error) {
    throw new Error(`${platform} upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}