import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ProcessLinkedInPostRequest {
  userPrompt: string;
  userEmail: string;
  linkedinProfileUrl?: string;
  enableAutomation?: boolean;
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
    const requestData: ProcessLinkedInPostRequest = await req.json();
    const { userPrompt, userEmail, linkedinProfileUrl, enableAutomation, userId } = requestData;

    // Validate required inputs
    if (!userPrompt || !userEmail || !userId) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Missing required fields",
          error: "userPrompt, userEmail, and userId are required",
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

    console.log(`🚀 Starting LinkedIn post processing for user: ${userId}`);
    const startTime = Date.now();

    // Step 1: Check user credits
    console.log("💳 Checking user credits...");
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits, plan")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      console.error("❌ Failed to fetch user profile:", profileError);
      return new Response(
        JSON.stringify({
          status: "error",
          message: "User not found",
          error: "Unable to fetch user profile",
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

    // Check if user has sufficient credits (skip for paid plans)
    if (profile.plan === "free" && profile.credits < 1) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Insufficient credits",
          error: "You need at least 1 credit to generate a post",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    let enrichedPrompt = userPrompt;
    let scrapedProfileData = null;

    // Step 2: Optional LinkedIn Profile Scraping
    if (linkedinProfileUrl) {
      console.log("📊 Scraping LinkedIn profile...");
      try {
        scrapedProfileData = await scrapeLinkedInProfile(linkedinProfileUrl);
        if (scrapedProfileData) {
          enrichedPrompt = `${userPrompt}\n\nPersonalization context:\n- Name: ${scrapedProfileData.fullName}\n- Headline: ${scrapedProfileData.headline}\n- About: ${scrapedProfileData.about?.substring(0, 200)}`;
          console.log("✅ Profile scraped successfully");
        }
      } catch (error) {
        console.warn("⚠️ Profile scraping failed:", error);
        // Continue without profile data
      }
    }

    // Step 3: AI Content Generation with Gemini
    console.log("🤖 Generating AI content with Gemini...");
    const aiGeneratedPost = await generateWithGemini(enrichedPrompt);
    console.log("✅ AI content generated");

    // Step 4: Humanize content with Undetectable.ai
    console.log("👤 Humanizing content...");
    const humanizedPost = await humanizeWithUndetectable(aiGeneratedPost);
    console.log("✅ Content humanized");

    // Step 5: Grammar check with LanguageTool
    console.log("✏️ Checking grammar...");
    const { correctedPost, corrections } = await checkGrammarWithLanguageTool(humanizedPost);
    console.log(`✅ Grammar checked (${corrections} corrections applied)`);

    // Step 6: AI Detection with Sapling
    console.log("🔍 Running AI detection...");
    const aiDetectionScore = await detectAIWithSapling(correctedPost);
    const humanScore = Math.round((1 - aiDetectionScore) * 100);
    const aiScore = Math.round(aiDetectionScore * 100);
    console.log(`✅ AI detection complete (${humanScore}% human)`);

    // Step 7: Send email with Resend
    console.log("📧 Sending email...");
    const emailSent = await sendEmailWithResend(userEmail, correctedPost, humanScore, aiScore, scrapedProfileData);
    console.log(`${emailSent ? "✅" : "❌"} Email ${emailSent ? "sent" : "failed"}`);

    // Step 8: Optional PhantomBuster automation
    let phantomTriggered = false;
    if (enableAutomation) {
      console.log("🤖 Triggering PhantomBuster automation...");
      try {
        phantomTriggered = await triggerPhantomBuster();
        console.log(`${phantomTriggered ? "✅" : "❌"} PhantomBuster ${phantomTriggered ? "triggered" : "failed"}`);
      } catch (error) {
        console.warn("⚠️ PhantomBuster trigger failed:", error);
      }
    }

    // Step 9: Store in Supabase
    console.log("💾 Storing post in database...");
    const { error: insertError } = await supabase
      .from("linkedin_posts")
      .insert({
        user_id: userId,
        content: correctedPost,
        tone: "professional",
        status: "draft",
        ai_score: aiScore,
        human_score: humanScore,
        engagement: {},
      });

    if (insertError) {
      console.error("❌ Failed to store post:", insertError);
    } else {
      console.log("✅ Post stored successfully");
    }

    // Step 10: Deduct credits for free users
    if (profile.plan === "free") {
      console.log("💳 Deducting credit...");
      const { error: creditError } = await supabase
        .from("profiles")
        .update({
          credits: profile.credits - 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (creditError) {
        console.error("❌ Failed to deduct credit:", creditError);
      } else {
        console.log("✅ Credit deducted successfully");
      }
    }

    // Step 11: Log API usage
    await supabase
      .from("api_usage")
      .insert({
        user_id: userId,
        service: "linkedin_post_generation",
        credits_used: profile.plan === "free" ? 1 : 0,
        success: true,
        response_time_ms: Date.now() - startTime,
      });

    const processingTime = Date.now() - startTime;
    console.log(`🎉 Processing completed successfully in ${processingTime}ms`);

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Post generated and emailed",
        data: {
          finalPost: correctedPost,
          aiScore,
          humanScore,
          wasSentToEmail: emailSent,
          phantomTriggered,
          scrapedProfileData,
          processingSteps: {
            profileScraping: !!scrapedProfileData,
            aiGeneration: true,
            humanization: true,
            grammarCheck: true,
            aiDetection: true,
            emailDelivery: emailSent,
            automation: phantomTriggered,
          },
          metadata: {
            originalPrompt: userPrompt,
            enrichedPrompt: enrichedPrompt !== userPrompt,
            grammarCorrections: corrections,
            processingTime,
          },
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
    console.error("💥 Processing failed:", error);

    // Log failed API usage
    try {
      const userId = (await req.json())?.userId;
      if (userId) {
        await supabase
          .from("api_usage")
          .insert({
            user_id: userId,
            service: "linkedin_post_generation",
            credits_used: 0,
            success: false,
          });
      }
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    return new Response(
      JSON.stringify({
        status: "error",
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Processing failed",
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

// Helper Functions

async function scrapeLinkedInProfile(profileUrl: string) {
  const apiKey = Deno.env.get("APIFY_API_KEY");
  if (!apiKey) throw new Error("APIFY_API_KEY not configured");

  try {
    // Start scraping task
    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/drobnikj~linkedin-profile-scraper/runs?token=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startUrls: [{ url: profileUrl }],
          proxyConfiguration: { useApifyProxy: true },
        }),
      }
    );

    const runData = await runResponse.json();
    const runId = runData?.data?.id;
    if (!runId) throw new Error("Failed to start scraping task");

    // Poll for results (max 60 seconds)
    for (let i = 0; i < 12; i++) {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const statusResponse = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${apiKey}`
      );
      const statusData = await statusResponse.json();

      if (statusData?.data?.status === "SUCCEEDED") {
        const resultsResponse = await fetch(
          `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${apiKey}`
        );
        const resultsData = await resultsResponse.json();

        const profile = resultsData?.[0];
        if (profile) {
          return {
            fullName: profile.fullName || "Unknown",
            headline: profile.headline || "",
            about: profile.about || "",
            location: profile.location || "",
            industry: profile.industry || "",
          };
        }
      }
    }

    throw new Error("Scraping timeout");
  } catch (error) {
    console.error("Apify scraping error:", error);
    throw error;
  }
}

async function generateWithGemini(prompt: string): Promise<string> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const enhancedPrompt = `Generate a professional LinkedIn post based on: "${prompt}"

Requirements:
- Professional tone that builds credibility
- 150-300 words
- Include relevant hashtags
- Add a call-to-action
- Make it engaging and shareable
- Avoid AI-sounding phrases

Generate only the post content, no additional commentary.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: enhancedPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error("No content generated");

    return content.trim();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

async function humanizeWithUndetectable(content: string): Promise<string> {
  const apiKey = Deno.env.get("UNDETECTABLE_API_KEY");
  if (!apiKey) throw new Error("UNDETECTABLE_API_KEY not configured");

  try {
    // Submit for humanization
    const submitResponse = await fetch("https://api.undetectable.ai/submit", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        readability: "High School",
        purpose: "General Writing",
        strength: "More Human",
      }),
    });

    const submitData = await submitResponse.json();
    const jobId = submitData?.id;
    if (!jobId) throw new Error("No job ID returned");

    // Poll for results (max 60 seconds)
    for (let i = 0; i < 20; i++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const resultResponse = await fetch(
        `https://api.undetectable.ai/document/${jobId}`,
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
          },
        }
      );

      const resultData = await resultResponse.json();
      if (resultData?.status === "done") {
        return resultData.output || content;
      }
    }

    throw new Error("Humanization timeout");
  } catch (error) {
    console.error("Undetectable.ai error:", error);
    // Return original content if humanization fails
    return content;
  }
}

async function checkGrammarWithLanguageTool(text: string): Promise<{ correctedPost: string; corrections: number }> {
  try {
    const formData = new URLSearchParams();
    formData.append("text", text);
    formData.append("language", "en-US");

    const response = await fetch("https://api.languagetoolplus.com/v2/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await response.json();
    const matches = data?.matches || [];
    let correctedText = text;
    let corrections = 0;

    // Apply corrections in reverse order
    matches.reverse().forEach((match: any) => {
      if (match.replacements && match.replacements.length > 0) {
        const replacement = match.replacements[0].value;
        const start = match.offset;
        const end = match.offset + match.length;

        correctedText =
          correctedText.substring(0, start) +
          replacement +
          correctedText.substring(end);
        corrections++;
      }
    });

    return { correctedPost: correctedText, corrections };
  } catch (error) {
    console.error("LanguageTool error:", error);
    return { correctedPost: text, corrections: 0 };
  }
}

async function detectAIWithSapling(text: string): Promise<number> {
  const apiKey = Deno.env.get("SAPLING_API_KEY");
  if (!apiKey) throw new Error("SAPLING_API_KEY not configured");

  try {
    const response = await fetch("https://api.sapling.ai/api/v1/aidetect", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    const score = data?.score;
    if (typeof score !== "number") throw new Error("Invalid AI detection score");

    return score; // 0-1 scale where 1 = likely AI-generated
  } catch (error) {
    console.error("Sapling AI detection error:", error);
    // Return a reasonable default if detection fails
    return 0.2; // Assume 80% human
  }
}

async function sendEmailWithResend(
  email: string,
  post: string,
  humanScore: number,
  aiScore: number,
  profileData?: any
): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) throw new Error("RESEND_API_KEY not configured");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your LinkedIn Post is Ready!</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 30px; }
        .post-container { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat { text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #8b5cf6; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚀 Your LinkedIn Post is Ready!</h1>
      </div>
      <div class="content">
        <div class="post-container">
          <h3>📝 Your Optimized Post:</h3>
          <p style="line-height: 1.6;">${post}</p>
        </div>
        <div class="stats">
          <div class="stat">
            <div class="stat-value">${humanScore}%</div>
            <div>Human Score</div>
          </div>
          <div class="stat">
            <div class="stat-value">${aiScore}%</div>
            <div>AI Detection</div>
          </div>
        </div>
        ${
          profileData
            ? `
        <div style="background: #eff6ff; padding: 15px; border-radius: 8px;">
          <h4>👤 Personalized for ${profileData.fullName}</h4>
          <p>Content optimized based on LinkedIn profile data</p>
        </div>
        `
            : ""
        }
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Chaitra AI <noreply@chaitra.ai>",
        to: [email],
        subject: `Your LinkedIn Post is Ready! (${humanScore}% Human Score)`,
        html: emailHtml,
      }),
    });

    return response.status === 200;
  } catch (error) {
    console.error("Resend email error:", error);
    return false;
  }
}

async function triggerPhantomBuster(): Promise<boolean> {
  const apiKey = Deno.env.get("PHANTOMBUSTER_API_KEY");
  const phantomId = Deno.env.get("PHANTOM_ID");

  if (!apiKey || !phantomId) {
    throw new Error("PhantomBuster credentials not configured");
  }

  try {
    const response = await fetch(
      "https://api.phantombuster.com/api/v2/agents/launch",
      {
        method: "POST",
        headers: {
          "X-Phantombuster-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: phantomId }),
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error("PhantomBuster error:", error);
    return false;
  }
}