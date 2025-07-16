import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Tavus API configuration
const TAVUS_API_KEY = "64ea5904de7840989caaf272f6051d6c";
const TAVUS_REPLICA_ID = "rb17cf590e15";
const TAVUS_API_URL = "https://tavusapi.com/v2/conversations";

serve(async (req: Request) => {
  // Set up CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
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
    const { userMessage } = await req.json();

    if (!userMessage) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required field: userMessage",
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

    console.log(`📩 Received message: ${userMessage}`);

    // Prepare request to Tavus API
    const tavusRequestBody = {
      replica_id: TAVUS_REPLICA_ID,
      conversation_name: "DIVIT.AI support agent",
      conversational_context: "You are the support agent of DIVIT.AI, a LinkedIn automation website. Most features are in demo mode right now but will be production level soon.",
      user_message: userMessage,
    };

    // Call Tavus API
    console.log("🔄 Calling Tavus API...");
    const tavusResponse = await fetch(TAVUS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TAVUS_API_KEY,
      },
      body: JSON.stringify(tavusRequestBody),
    });

    // Process Tavus API response
    if (!tavusResponse.ok) {
      const errorData = await tavusResponse.text();
      console.error(`❌ Tavus API error (${tavusResponse.status}): ${errorData}`);
      
      // Fallback response if Tavus API fails
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to get response from Tavus API",
          fallbackResponse: generateFallbackResponse(userMessage),
        }),
        {
          status: 200, // Return 200 even for API failures to handle gracefully on client
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const tavusData = await tavusResponse.json();
    console.log("✅ Tavus API response received");

    return new Response(
      JSON.stringify({
        success: true,
        response: tavusData.response || "I'm sorry, I couldn't process your request at this time.",
        videoUrl: tavusData.video_url,
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
    console.error("💥 Error processing request:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
        fallbackResponse: "I'm sorry, I'm having trouble connecting to our servers. Please try again later or contact our support team for assistance.",
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

// Generate fallback responses for when the Tavus API is unavailable
function generateFallbackResponse(userMessage: string): string {
  const lowerCaseMessage = userMessage.toLowerCase();
  
  if (lowerCaseMessage.includes("pricing") || lowerCaseMessage.includes("cost") || lowerCaseMessage.includes("plan")) {
    return "We offer several pricing plans to fit your needs. Our Free plan includes 5 credits/month, while our Creator plan at $29/month includes 100 credits and all core features. For unlimited usage, check out our Ghostwriter plan at $79/month or Agency plan at $199/month.";
  } else if (lowerCaseMessage.includes("feature") || lowerCaseMessage.includes("what") || lowerCaseMessage.includes("how")) {
    return "DIVIT.AI offers several powerful features: AI Post Generation creates engaging LinkedIn content, Clone Builder replicates your writing style, Auto Commenter engages with relevant posts, and Connection Engine helps you find and connect with ideal prospects. Which feature would you like to learn more about?";
  } else if (lowerCaseMessage.includes("demo") || lowerCaseMessage.includes("try") || lowerCaseMessage.includes("test")) {
    return "I'd be happy to show you a demo of DIVIT.AI! Our platform offers AI-powered LinkedIn automation with features like post generation, clone building, auto commenting, and connection engine. Would you like me to walk you through a specific feature?";
  } else {
    return "Thanks for reaching out! I'm here to help with any questions about DIVIT.AI. Our platform helps you automate your LinkedIn presence with AI-powered tools. Is there something specific you'd like to know about our features, pricing, or how to get started?";
  }
}