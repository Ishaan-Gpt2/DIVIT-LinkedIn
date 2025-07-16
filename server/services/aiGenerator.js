import axios from 'axios';

/**
 * Generate AI content using Gemini API with enhanced prompting
 * @param {Object} params - Generation parameters
 * @param {string} params.prompt - Content prompt
 * @param {string} [params.tone] - Content tone
 * @param {string} [params.style] - Content style
 * @returns {Object} Generated content
 */
export async function generateAIContent({ prompt, tone = 'professional', style = 'linkedin' }) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY not configured, using enhanced mock data');
    return getEnhancedMockContent(prompt, tone, style);
  }

  try {
    const enhancedPrompt = createEnhancedPrompt(prompt, tone, style);
    console.log('🤖 Sending request to Gemini API...');

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: enhancedPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No content generated from Gemini API');
    }

    console.log(`✅ Gemini API generated ${generatedText.length} characters`);

    return {
      content: generatedText.trim(),
      model: 'gemini-pro',
      tokens: generatedText.length,
      tone,
      style,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Gemini API error:', error.message);
    
    // Enhanced fallback with better mock data
    console.log('🤖 Using enhanced mock AI generation');
    return getEnhancedMockContent(prompt, tone, style);
  }
}

/**
 * Create enhanced prompt for better AI generation
 */
function createEnhancedPrompt(prompt, tone, style) {
  const toneInstructions = {
    professional: 'Use a professional, authoritative tone that builds credibility',
    conversational: 'Write in a friendly, approachable tone like talking to a colleague',
    'thought-provoking': 'Ask engaging questions and challenge conventional thinking',
    inspirational: 'Use motivational language that inspires action and growth',
    educational: 'Explain concepts clearly with actionable insights',
    humorous: 'Add appropriate humor while maintaining professionalism'
  };

  const styleInstructions = {
    linkedin: `
    LinkedIn Post Guidelines:
    - Start with a hook that grabs attention
    - Use short paragraphs (1-2 sentences max)
    - Include 2-3 relevant hashtags at the end
    - Add a call-to-action or question to encourage engagement
    - Keep total length between 150-300 words
    - Use line breaks for readability
    - Avoid overly promotional language
    `
  };

  return `
You are an expert LinkedIn content creator. Create a ${tone} LinkedIn post based on this topic: "${prompt}"

${toneInstructions[tone] || toneInstructions.professional}

${styleInstructions[style] || styleInstructions.linkedin}

Additional Requirements:
- Make it authentic and human-like
- Include personal insights or experiences when relevant
- Use active voice and strong verbs
- Avoid AI-sounding phrases like "delve into", "in conclusion", "furthermore"
- Make it engaging and shareable
- Include specific, actionable advice when possible

Generate only the post content, no additional commentary.
`;
}

/**
 * Generate enhanced mock content with better variety and quality
 */
function getEnhancedMockContent(prompt, tone, style) {
  const mockPosts = {
    professional: [
      `The biggest lesson I learned this quarter: consistency beats perfection every time.

While everyone was waiting for the "perfect moment" to launch, we shipped our MVP and learned more in 30 days than we did in 6 months of planning.

Here's what actually moved the needle:
→ Daily customer conversations
→ Weekly iteration cycles  
→ Transparent progress updates

The market doesn't care about your perfect plan. It cares about your ability to solve real problems.

What's one "imperfect" action you could take today?

#Leadership #Entrepreneurship #Growth`,

      `Just wrapped up a fascinating conversation with a CEO who scaled from $1M to $50M ARR.

His counterintuitive advice? "Stop optimizing and start experimenting."

Most companies get stuck in optimization mode:
• Tweaking existing processes
• Perfecting current products
• Improving what already works

But breakthrough growth comes from experimentation:
• Testing completely new approaches
• Exploring adjacent markets
• Building unexpected partnerships

The difference? Optimization gives you 10% gains. Experimentation gives you 10x potential.

Which mode is your team in right now?

#Strategy #Innovation #ScaleUp`,

      `Your network is your net worth. But here's what most people get wrong about networking:

They focus on taking instead of giving.

Real networking isn't about collecting business cards or LinkedIn connections. It's about creating genuine value for others.

The most successful professionals I know follow this simple formula:
1. Listen more than you speak
2. Ask better questions
3. Make strategic introductions
4. Share knowledge freely
5. Follow up consistently

When you lead with value, opportunities follow naturally.

What's one way you could add value to someone in your network today?

#Networking #Relationships #CareerGrowth`
    ],
    conversational: [
      `Coffee chat revelation: The best career advice I ever got came from a barista. ☕

I was complaining about my "boring" job when she said: "Every role is what you make it. You can either be a passenger or the driver."

That hit different.

Started treating my position like I owned the company:
• Proposed new initiatives
• Solved problems before being asked
• Built relationships across departments

Six months later? Promotion and a 40% raise.

Sometimes the best mentors come from unexpected places.

Who's given you surprising career wisdom?

#CareerAdvice #Mindset #Growth`,

      `Real talk: I used to think "work-life balance" was about perfect 50/50 splits.

Spoiler alert: That's not how life works. 🤷‍♂️

Some weeks you're crushing deadlines and working late. Other weeks you're taking long lunches and leaving early for your kid's game.

The real secret? Work-life INTEGRATION.

Instead of fighting for balance, I started asking:
• What matters most right now?
• How can I be fully present?
• What can I delegate or eliminate?

Result: Less stress, better performance, happier family.

Balance is a myth. Integration is the goal.

What's your take on work-life balance vs integration?

#WorkLifeBalance #Productivity #Wellness`,

      `Plot twist: My biggest "failure" became my greatest success story.

Three years ago, my startup crashed and burned. Lost everything. Felt like the world's biggest fraud.

But here's what I learned from that spectacular failure:
→ How to build resilient systems
→ The importance of cash flow management  
→ Why customer validation beats perfect products
→ How to lead through uncertainty

That "failed" startup? It taught me everything I needed to build my current company, which just hit $2M ARR.

Sometimes you have to break before you can breakthrough.

What's a "failure" that actually set you up for success?

#Entrepreneurship #Failure #Resilience`
    ],
    'thought-provoking': [
      `What if the skills that got you here are exactly what's holding you back?

I see this pattern everywhere:
• The detail-oriented manager who can't delegate
• The innovative founder who resists processes
• The relationship-builder who avoids difficult conversations

Your strengths become your ceiling when you can't adapt them to new challenges.

The question isn't "What are you good at?" 

It's "What do you need to become good at next?"

Growth requires letting go of the identity that brought you success.

What skill served you well in the past but might be limiting you now?

#Leadership #Growth #SelfAwareness`,

      `Everyone talks about "thinking outside the box."

But what if the real breakthrough is understanding the box better?

Most innovation doesn't come from ignoring constraints—it comes from creatively working within them.

Consider:
• Twitter's 140-character limit sparked a new form of communication
• Budget airlines removed "luxuries" to democratize travel
• Haikus use strict rules to create profound beauty

Constraints force creativity. Limitations spark innovation.

Maybe the question isn't "How do we break the rules?" but "How do we use the rules differently?"

What constraint in your industry could become your competitive advantage?

#Innovation #Creativity #Strategy`,

      `The most dangerous phrase in business: "That's how we've always done it."

But here's the twist—sometimes tradition exists for good reasons.

The art is knowing when to preserve and when to disrupt.

Before changing everything, ask:
• What problem was this solving originally?
• Has the problem changed?
• What would happen if we stopped doing this?
• What would we do if we started fresh today?

Innovation isn't about destroying the past. It's about building a better future on the foundation of what actually works.

What "old way" in your industry deserves a fresh look?

#Innovation #Tradition #Change`
    ]
  };

  const posts = mockPosts[tone] || mockPosts.professional;
  const randomPost = posts[Math.floor(Math.random() * posts.length)];

  // Add some variation based on the prompt
  const customizedPost = customizePostForPrompt(randomPost, prompt);

  console.log(`🤖 Generated mock content for tone: ${tone}, style: ${style}`);
  
  return {
    content: customizedPost,
    model: 'enhanced-mock-ai',
    tokens: customizedPost.length,
    tone,
    style,
    timestamp: new Date().toISOString()
  };
}

/**
 * Customize mock post based on user prompt
 */
function customizePostForPrompt(basePost, prompt) {
  const promptLower = prompt.toLowerCase();
  
  // Simple keyword-based customization
  if (promptLower.includes('leadership')) {
    return basePost.replace(/growth/gi, 'leadership').replace(/success/gi, 'effective leadership');
  }
  
  if (promptLower.includes('marketing')) {
    return basePost.replace(/business/gi, 'marketing').replace(/strategy/gi, 'marketing strategy');
  }
  
  if (promptLower.includes('sales')) {
    return basePost.replace(/growth/gi, 'sales growth').replace(/customers/gi, 'prospects');
  }
  
  if (promptLower.includes('remote work')) {
    return basePost.replace(/office/gi, 'remote work').replace(/team/gi, 'distributed team');
  }
  
  return basePost;
}