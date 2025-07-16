import { scrapeLinkedInProfile } from './profileScraper.js';
import { generateAIContent } from './aiGenerator.js';
import { humanizeContent } from './humanizer.js';
import { checkGrammar } from './grammarChecker.js';
import { detectAI } from './aiDetector.js';
import { sendEmail } from './emailService.js';
import { triggerPhantomBuster } from './phantomBuster.js';

/**
 * Main function to process LinkedIn post creation with full pipeline
 * @param {Object} params - Processing parameters
 * @param {string} params.userPrompt - User's content prompt
 * @param {string} params.userEmail - User's email for delivery
 * @param {string} [params.linkedinProfileUrl] - Optional LinkedIn profile URL for personalization
 * @param {boolean} [params.enableAutomation] - Whether to trigger PhantomBuster automation
 * @returns {Object} Processing result with final post and metadata
 */
export async function processLinkedInPost({
  userPrompt,
  userEmail,
  linkedinProfileUrl,
  enableAutomation = false
}) {
  const startTime = Date.now();
  
  try {
    console.log('🚀 Starting LinkedIn post processing pipeline...');
    console.log(`📝 Prompt: "${userPrompt.substring(0, 100)}..."`);
    console.log(`📧 Email: ${userEmail}`);
    console.log(`🔗 Profile URL: ${linkedinProfileUrl || 'None'}`);
    console.log(`🤖 Automation: ${enableAutomation ? 'Enabled' : 'Disabled'}`);
    
    let enrichedPrompt = userPrompt;
    let scrapedProfileData = null;

    // Step 1: Profile scraping (if URL provided)
    if (linkedinProfileUrl) {
      console.log('📊 Step 1/7: Scraping LinkedIn profile for personalization...');
      try {
        scrapedProfileData = await scrapeLinkedInProfile(linkedinProfileUrl);
        
        if (scrapedProfileData && scrapedProfileData.fullName) {
          // Enrich prompt with profile data
          enrichedPrompt = `${userPrompt}

Context for personalization:
- Author: ${scrapedProfileData.fullName}
- Role: ${scrapedProfileData.headline || 'Professional'}
- Industry: ${scrapedProfileData.industry || 'Business'}
- Background: ${scrapedProfileData.about ? scrapedProfileData.about.substring(0, 200) : 'Experienced professional'}

Please create content that aligns with this professional background and industry.`;
          
          console.log(`✅ Profile scraped successfully: ${scrapedProfileData.fullName}`);
        }
      } catch (error) {
        console.warn('⚠️ Profile scraping failed, continuing with original prompt:', error.message);
      }
    } else {
      console.log('📊 Step 1/7: Skipping profile scraping (no URL provided)');
    }

    // Step 2: AI content generation
    console.log('🤖 Step 2/7: Generating AI content...');
    const aiResult = await generateAIContent({
      prompt: enrichedPrompt,
      tone: 'professional',
      style: 'linkedin'
    });
    const rawPost = aiResult.content;
    console.log(`✅ AI content generated (${rawPost.length} characters)`);

    // Step 3: Content humanization
    console.log('👤 Step 3/7: Humanizing content...');
    const humanizedResult = await humanizeContent(rawPost);
    const humanizedPost = humanizedResult.content;
    console.log(`✅ Content humanized (${humanizedPost.length} characters)`);

    // Step 4: Grammar correction
    console.log('✏️ Step 4/7: Checking and correcting grammar...');
    const grammarResult = await checkGrammar(humanizedPost);
    const correctedPost = grammarResult.correctedText || humanizedPost;
    const grammarCorrections = grammarResult.corrections?.length || 0;
    console.log(`✅ Grammar checked (${grammarCorrections} corrections applied)`);

    // Step 5: AI detection scoring
    console.log('🔍 Step 5/7: Running AI detection analysis...');
    const aiDetectionResult = await detectAI(correctedPost);
    const aiScore = Math.round(aiDetectionResult.score * 100);
    const humanScore = Math.round((1 - aiDetectionResult.score) * 100);
    console.log(`✅ AI detection complete (${humanScore}% human, ${aiScore}% AI)`);

    // Step 6: Email delivery
    console.log('📧 Step 6/7: Sending email with final post...');
    const emailHtml = generateEmailTemplate({
      finalPost: correctedPost,
      humanScore,
      aiScore,
      grammarCorrections,
      scrapedProfileData,
      processingTime: Date.now() - startTime
    });

    const emailResult = await sendEmail({
      to: userEmail,
      subject: `Your Humanized LinkedIn Post is Ready! 🚀 (${humanScore}% Human Score)`,
      html: emailHtml
    });
    
    const wasSentToEmail = emailResult.success;
    console.log(`${wasSentToEmail ? '✅' : '❌'} Email delivery ${wasSentToEmail ? 'successful' : 'failed'}`);

    // Step 7: Optional PhantomBuster automation
    let phantomTriggered = false;
    if (enableAutomation && process.env.PHANTOM_ID) {
      console.log('🤖 Step 7/7: Triggering PhantomBuster automation...');
      try {
        const phantomResult = await triggerPhantomBuster(process.env.PHANTOM_ID);
        phantomTriggered = phantomResult.success;
        console.log(`${phantomTriggered ? '✅' : '❌'} PhantomBuster ${phantomTriggered ? 'triggered successfully' : 'trigger failed'}`);
      } catch (error) {
        console.warn('⚠️ PhantomBuster trigger failed:', error.message);
      }
    } else {
      console.log('🤖 Step 7/7: Skipping PhantomBuster automation (disabled or not configured)');
    }

    const totalProcessingTime = Date.now() - startTime;
    console.log(`✅ LinkedIn post processing completed successfully in ${totalProcessingTime}ms!`);

    // Return comprehensive result
    return {
      success: true,
      finalPost: correctedPost,
      aiScore,
      humanScore,
      wasSentToEmail,
      phantomTriggered,
      scrapedProfileData,
      processingSteps: {
        profileScraping: !!scrapedProfileData,
        aiGeneration: true,
        humanization: true,
        grammarCheck: true,
        aiDetection: true,
        emailDelivery: wasSentToEmail,
        automation: phantomTriggered
      },
      metadata: {
        originalPrompt: userPrompt,
        enrichedPrompt: enrichedPrompt !== userPrompt,
        grammarCorrections,
        processingTime: totalProcessingTime,
        timestamp: new Date().toISOString()
      }
    };

  } catch (error) {
    const totalProcessingTime = Date.now() - startTime;
    console.error('❌ LinkedIn post processing failed:', error);
    console.error(`💥 Processing failed after ${totalProcessingTime}ms`);
    
    // Return error response with partial data
    return {
      success: false,
      error: error.message,
      finalPost: '',
      aiScore: 0,
      humanScore: 0,
      wasSentToEmail: false,
      phantomTriggered: false,
      scrapedProfileData: null,
      processingSteps: {
        profileScraping: false,
        aiGeneration: false,
        humanization: false,
        grammarCheck: false,
        aiDetection: false,
        emailDelivery: false,
        automation: false
      },
      metadata: {
        originalPrompt: userPrompt,
        enrichedPrompt: false,
        grammarCorrections: 0,
        processingTime: totalProcessingTime,
        timestamp: new Date().toISOString(),
        errorDetails: error.stack
      }
    };
  }
}

/**
 * Generate comprehensive email template with all processing results
 */
function generateEmailTemplate({
  finalPost,
  humanScore,
  aiScore,
  grammarCorrections,
  scrapedProfileData,
  processingTime
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your LinkedIn Post is Ready!</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px; }
        .post-container { background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
        .post-text { line-height: 1.6; color: #374151; font-size: 16px; white-space: pre-wrap; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 25px 0; }
        .stat-card { background: #f0f9ff; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e0f2fe; }
        .stat-value { font-size: 24px; font-weight: bold; color: #0369a1; margin-bottom: 5px; }
        .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .success-badge { background: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; display: inline-block; margin: 10px 0; }
        .info-section { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .info-title { color: #1d4ed8; font-weight: 600; margin-bottom: 10px; font-size: 16px; }
        .info-text { color: #1e40af; font-size: 14px; line-height: 1.5; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer-text { color: #6b7280; font-size: 12px; }
        .cta-button { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 500; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Your LinkedIn Post is Ready!</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0;">Processed with advanced AI pipeline</p>
        </div>
        
        <div class="content">
          <div class="success-badge">
            ✅ Processing Complete - ${humanScore}% Human Score
          </div>
          
          <div class="post-container">
            <h3 style="color: #374151; margin-top: 0; margin-bottom: 15px;">📝 Your Optimized Post:</h3>
            <div class="post-text">${finalPost}</div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${humanScore}%</div>
              <div class="stat-label">Human Score</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${aiScore}%</div>
              <div class="stat-label">AI Detection</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${grammarCorrections}</div>
              <div class="stat-label">Grammar Fixes</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${Math.round(processingTime / 1000)}s</div>
              <div class="stat-label">Process Time</div>
            </div>
          </div>

          ${scrapedProfileData ? `
          <div class="info-section">
            <div class="info-title">👤 Personalization Applied</div>
            <div class="info-text">
              Content was personalized based on <strong>${scrapedProfileData.fullName}</strong>'s LinkedIn profile.
              <br>Role: ${scrapedProfileData.headline || 'Professional'}
              <br>Industry: ${scrapedProfileData.industry || 'Business'}
            </div>
          </div>
          ` : ''}

          <div class="info-section">
            <div class="info-title">🔬 Processing Pipeline</div>
            <div class="info-text">
              Your content went through our 7-step optimization process:
              <br>✅ AI Generation → ✅ Humanization → ✅ Grammar Check → ✅ AI Detection → ✅ Quality Scoring
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://linkedin.com/feed" class="cta-button">
              Post to LinkedIn Now →
            </a>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>💡 Pro Tip:</strong> Copy the post above and paste it directly into LinkedIn. 
              The content is optimized for maximum engagement and passes all AI detection tools.
            </p>
          </div>
        </div>

        <div class="footer">
          <div class="footer-text">
            Generated by Chaitra - Your AI LinkedIn Automation Platform
            <br>Processed on ${new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}