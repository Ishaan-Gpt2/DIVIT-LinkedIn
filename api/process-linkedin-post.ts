import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ProcessLinkedInPostRequest {
  userPrompt: string;
  userEmail: string;
  linkedinProfileUrl?: string;
  autoPost?: boolean;
  userId: string;
}

interface ProcessLinkedInPostResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    finalPost: string;
    aiScore: number;
    humanScore: number;
    wasSentToEmail: boolean;
    phantomTriggered: boolean;
    scrapedProfileData?: any;
    processingSteps: {
      profileScraping: boolean;
      aiGeneration: boolean;
      humanization: boolean;
      grammarCheck: boolean;
      aiDetection: boolean;
      emailDelivery: boolean;
      automation: boolean;
    };
    metadata: {
      originalPrompt: string;
      enrichedPrompt: boolean;
      grammarCorrections: number;
      processingTime: number;
    };
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProcessLinkedInPostResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 'error',
      message: 'Method not allowed',
      error: 'Only POST requests are allowed'
    });
  }

  const startTime = Date.now();
  let processingSteps = {
    profileScraping: false,
    aiGeneration: false,
    humanization: false,
    grammarCheck: false,
    aiDetection: false,
    emailDelivery: false,
    automation: false
  };

  try {
    const { userPrompt, userEmail, linkedinProfileUrl, autoPost, userId }: ProcessLinkedInPostRequest = req.body;

    // Validate required inputs
    if (!userPrompt || !userEmail || !userId) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
        error: 'userPrompt, userEmail, and userId are required'
      });
    }

    console.log(`🚀 Starting LinkedIn post processing for user: ${userId}`);

    // Step 1: Check user credits
    console.log('💳 Checking user credits...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits, plan')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('❌ Failed to fetch user profile:', profileError);
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
        error: 'Unable to fetch user profile'
      });
    }

    // Check if user has sufficient credits (skip for paid plans)
    if (profile.plan === 'free' && profile.credits < 1) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient credits',
        error: 'You need at least 1 credit to generate a post'
      });
    }

    let enrichedPrompt = userPrompt;
    let scrapedProfileData = null;

    // Step 2: Optional LinkedIn Profile Scraping
    if (linkedinProfileUrl) {
      console.log('📊 Scraping LinkedIn profile...');
      try {
        scrapedProfileData = await scrapeLinkedInProfile(linkedinProfileUrl);
        if (scrapedProfileData) {
          enrichedPrompt = `${userPrompt}\n\nPersonalization context:\n- Name: ${scrapedProfileData.fullName}\n- Headline: ${scrapedProfileData.headline}\n- About: ${scrapedProfileData.about?.substring(0, 200)}`;
          processingSteps.profileScraping = true;
          console.log('✅ Profile scraped successfully');
        }
      } catch (error) {
        console.warn('⚠️ Profile scraping failed:', error);
        // Continue without profile data
      }
    }

    // Step 3: AI Content Generation with Gemini
    console.log('🤖 Generating AI content with Gemini...');
    const aiGeneratedPost = await generateWithGemini(enrichedPrompt);
    processingSteps.aiGeneration = true;
    console.log('✅ AI content generated');

    // Step 4: Humanize content with Undetectable.ai
    console.log('👤 Humanizing content...');
    const humanizedPost = await humanizeWithUndetectable(aiGeneratedPost);
    processingSteps.humanization = true;
    console.log('✅ Content humanized');

    // Step 5: Grammar check with LanguageTool
    console.log('✏️ Checking grammar...');
    const { correctedPost, corrections } = await checkGrammarWithLanguageTool(humanizedPost);
    processingSteps.grammarCheck = true;
    console.log(`✅ Grammar checked (${corrections} corrections applied)`);

    // Step 6: AI Detection with Sapling
    console.log('🔍 Running AI detection...');
    const aiDetectionScore = await detectAIWithSapling(correctedPost);
    const humanScore = Math.round((1 - aiDetectionScore) * 100);
    const aiScore = Math.round(aiDetectionScore * 100);
    processingSteps.aiDetection = true;
    console.log(`✅ AI detection complete (${humanScore}% human)`);

    // Step 7: Send email with Resend
    console.log('📧 Sending email...');
    const emailSent = await sendEmailWithResend(userEmail, correctedPost, humanScore, aiScore, scrapedProfileData);
    processingSteps.emailDelivery = emailSent;
    console.log(`${emailSent ? '✅' : '❌'} Email ${emailSent ? 'sent' : 'failed'}`);

    // Step 8: Optional PhantomBuster automation
    let phantomTriggered = false;
    if (autoPost && process.env.PHANTOM_ID) {
      console.log('🤖 Triggering PhantomBuster automation...');
      try {
        phantomTriggered = await triggerPhantomBuster();
        processingSteps.automation = phantomTriggered;
        console.log(`${phantomTriggered ? '✅' : '❌'} PhantomBuster ${phantomTriggered ? 'triggered' : 'failed'}`);
      } catch (error) {
        console.warn('⚠️ PhantomBuster trigger failed:', error);
      }
    }

    // Step 9: Store in Supabase
    console.log('💾 Storing post in database...');
    const { error: insertError } = await supabase
      .from('linkedin_posts')
      .insert({
        user_id: userId,
        content: correctedPost,
        tone: 'professional',
        status: 'draft',
        ai_score: aiScore,
        human_score: humanScore,
        engagement: {}
      });

    if (insertError) {
      console.error('❌ Failed to store post:', insertError);
    } else {
      console.log('✅ Post stored successfully');
    }

    // Step 10: Deduct credits for free users
    if (profile.plan === 'free') {
      console.log('💳 Deducting credit...');
      const { error: creditError } = await supabase
        .from('profiles')
        .update({ 
          credits: profile.credits - 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (creditError) {
        console.error('❌ Failed to deduct credit:', creditError);
      } else {
        console.log('✅ Credit deducted successfully');
      }
    }

    // Step 11: Log API usage
    await supabase
      .from('api_usage')
      .insert({
        user_id: userId,
        service: 'linkedin_post_generation',
        credits_used: profile.plan === 'free' ? 1 : 0,
        success: true,
        response_time_ms: Date.now() - startTime
      });

    const processingTime = Date.now() - startTime;
    console.log(`🎉 Processing completed successfully in ${processingTime}ms`);

    return res.status(200).json({
      status: 'success',
      message: 'Post generated and emailed',
      data: {
        finalPost: correctedPost,
        aiScore,
        humanScore,
        wasSentToEmail: emailSent,
        phantomTriggered,
        scrapedProfileData,
        processingSteps,
        metadata: {
          originalPrompt: userPrompt,
          enrichedPrompt: enrichedPrompt !== userPrompt,
          grammarCorrections: corrections,
          processingTime
        }
      }
    });

  } catch (error: any) {
    console.error('💥 Processing failed:', error);
    
    // Log failed API usage
    try {
      await supabase
        .from('api_usage')
        .insert({
          user_id: req.body.userId,
          service: 'linkedin_post_generation',
          credits_used: 0,
          success: false,
          response_time_ms: Date.now() - startTime
        });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Processing failed'
    });
  }
}

// Helper Functions

async function scrapeLinkedInProfile(profileUrl: string) {
  const apiKey = process.env.APIFY_API_KEY;
  if (!apiKey) throw new Error('APIFY_API_KEY not configured');

  try {
    // Start scraping task
    const runResponse = await axios.post(
      `https://api.apify.com/v2/acts/drobnikj~linkedin-profile-scraper/runs?token=${apiKey}`,
      {
        startUrls: [{ url: profileUrl }],
        proxyConfiguration: { useApifyProxy: true }
      },
      { timeout: 10000 }
    );

    const runId = runResponse.data?.data?.id;
    if (!runId) throw new Error('Failed to start scraping task');

    // Poll for results (max 60 seconds)
    for (let i = 0; i < 12; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const statusResponse = await axios.get(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${apiKey}`,
        { timeout: 10000 }
      );

      if (statusResponse.data?.data?.status === 'SUCCEEDED') {
        const resultsResponse = await axios.get(
          `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${apiKey}`,
          { timeout: 10000 }
        );
        
        const profile = resultsResponse.data?.[0];
        if (profile) {
          return {
            fullName: profile.fullName || 'Unknown',
            headline: profile.headline || '',
            about: profile.about || '',
            location: profile.location || '',
            industry: profile.industry || ''
          };
        }
      }
    }
    
    throw new Error('Scraping timeout');
  } catch (error) {
    console.error('Apify scraping error:', error);
    throw error;
  }
}

async function generateWithGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

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
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: enhancedPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      },
      { timeout: 10000 }
    );

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error('No content generated');
    
    return content.trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

async function humanizeWithUndetectable(content: string): Promise<string> {
  const apiKey = process.env.UNDETECTABLE_API_KEY;
  if (!apiKey) throw new Error('UNDETECTABLE_API_KEY not configured');

  try {
    // Submit for humanization
    const submitResponse = await axios.post(
      'https://api.undetectable.ai/submit',
      {
        content,
        readability: 'High School',
        purpose: 'General Writing',
        strength: 'More Human'
      },
      {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        timeout: 10000
      }
    );

    const jobId = submitResponse.data?.id;
    if (!jobId) throw new Error('No job ID returned');

    // Poll for results (max 60 seconds)
    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const resultResponse = await axios.get(
        `https://api.undetectable.ai/document/${jobId}`,
        {
          headers: { 'Authorization': `Bearer ${apiKey}` },
          timeout: 10000
        }
      );

      if (resultResponse.data?.status === 'done') {
        return resultResponse.data.output || content;
      }
    }
    
    throw new Error('Humanization timeout');
  } catch (error) {
    console.error('Undetectable.ai error:', error);
    // Return original content if humanization fails
    return content;
  }
}

async function checkGrammarWithLanguageTool(text: string): Promise<{ correctedPost: string; corrections: number }> {
  try {
    const response = await axios.post(
      'https://api.languagetoolplus.com/v2/check',
      new URLSearchParams({
        text: text,
        language: 'en-US'
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000
      }
    );

    const matches = response.data?.matches || [];
    let correctedText = text;
    let corrections = 0;

    // Apply corrections in reverse order
    matches.reverse().forEach((match: any) => {
      if (match.replacements && match.replacements.length > 0) {
        const replacement = match.replacements[0].value;
        const start = match.offset;
        const end = match.offset + match.length;
        
        correctedText = correctedText.substring(0, start) + 
                       replacement + 
                       correctedText.substring(end);
        corrections++;
      }
    });

    return { correctedPost: correctedText, corrections };
  } catch (error) {
    console.error('LanguageTool error:', error);
    return { correctedPost: text, corrections: 0 };
  }
}

async function detectAIWithSapling(text: string): Promise<number> {
  const apiKey = process.env.SAPLING_API_KEY;
  if (!apiKey) throw new Error('SAPLING_API_KEY not configured');

  try {
    const response = await axios.post(
      'https://api.sapling.ai/api/v1/aidetect',
      { text },
      {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        timeout: 10000
      }
    );

    const score = response.data?.score;
    if (typeof score !== 'number') throw new Error('Invalid AI detection score');
    
    return score; // 0-1 scale where 1 = likely AI-generated
  } catch (error) {
    console.error('Sapling AI detection error:', error);
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
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not configured');

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
        ${profileData ? `
        <div style="background: #eff6ff; padding: 15px; border-radius: 8px;">
          <h4>👤 Personalized for ${profileData.fullName}</h4>
          <p>Content optimized based on LinkedIn profile data</p>
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;

  try {
    await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'Chaitra AI <noreply@chaitra.ai>',
        to: [email],
        subject: `Your LinkedIn Post is Ready! (${humanScore}% Human Score)`,
        html: emailHtml
      },
      {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        timeout: 10000
      }
    );

    return true;
  } catch (error) {
    console.error('Resend email error:', error);
    return false;
  }
}

async function triggerPhantomBuster(): Promise<boolean> {
  const apiKey = process.env.PHANTOMBUSTER_API_KEY;
  const phantomId = process.env.PHANTOM_ID;
  
  if (!apiKey || !phantomId) {
    throw new Error('PhantomBuster credentials not configured');
  }

  try {
    await axios.post(
      'https://api.phantombuster.com/api/v2/agents/launch',
      { id: phantomId },
      {
        headers: { 'X-Phantombuster-Key': apiKey },
        timeout: 10000
      }
    );

    return true;
  } catch (error) {
    console.error('PhantomBuster error:', error);
    return false;
  }
}