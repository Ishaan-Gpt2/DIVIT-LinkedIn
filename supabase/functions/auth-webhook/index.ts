import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    // Get the auth payload from the request
    const payload = await req.json();
    const eventType = payload.type;
    const record = payload.record;

    console.log(`📣 Auth webhook received: ${eventType}`);

    if (eventType === "INSERT" && record?.id) {
      // New user created
      console.log(`👤 New user created: ${record.id}`);

      // Create profile for the new user
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: record.id,
          email: record.email,
          name: record.raw_user_meta_data?.name || record.email.split("@")[0],
          plan: "free",
          credits: 5,
        })
        .select()
        .single();

      if (profileError) {
        console.error("❌ Failed to create profile:", profileError);
        return new Response(
          JSON.stringify({
            success: false,
            message: "Failed to create user profile",
            error: profileError.message,
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

      // Create default user settings
      const { error: settingsError } = await supabase
        .from("user_settings")
        .insert({
          user_id: record.id,
        });

      if (settingsError) {
        console.error("❌ Failed to create user settings:", settingsError);
      }

      // Create default AI clone
      const { error: cloneError } = await supabase
        .from("ai_clones")
        .insert({
          user_id: record.id,
          name: "Default Professional",
          description: "Professional, informative, and engaging LinkedIn presence",
          tone: "Professional yet approachable",
          personality: ["Knowledgeable", "Helpful", "Industry-focused"],
          is_active: true,
        });

      if (cloneError) {
        console.error("❌ Failed to create default AI clone:", cloneError);
      }

      console.log(`✅ User onboarding complete for: ${record.id}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: "User created successfully",
          data: { profile },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } else if (eventType === "DELETE" && record?.id) {
      // User deleted
      console.log(`👤 User deleted: ${record.id}`);

      // No need to delete profile or related data as it's handled by cascade delete in the database

      return new Response(
        JSON.stringify({
          success: true,
          message: "User deleted successfully",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // For other event types
    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook received",
        eventType,
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
    console.error("💥 Webhook processing failed:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
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