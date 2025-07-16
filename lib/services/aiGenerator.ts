import axios from 'axios';

export async function generateAIContent({
  prompt,
  tone = 'professional',
  style = 'linkedin'
}: {
  prompt: string;
  tone?: string;
  style?: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  try {
    const enhancedPrompt = `
      Generate a ${tone} LinkedIn post based on: "${prompt}"
      
      Requirements:
      - Professional tone that builds credibility
      - 150-300 words
      - Include relevant hashtags
      - Add a call-to-action
      - Make it engaging and shareable
      - Avoid AI-sounding phrases
    `;

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
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('No content generated from Gemini API');
    }

    return {
      content: content.trim(),
      model: 'gemini-pro',
      tokens: content.length,
      tone,
      style
    };

  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`AI content generation failed: ${error.message}`);
  }
}

export async function analyzeCloneTone(samplePost: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  try {
    const analysisPrompt = `
      Analyze this LinkedIn post and identify the writing tone and personality traits:
      
      "${samplePost}"
      
      Return a JSON response with:
      - tone: brief description of writing tone
      - personality: array of 3-5 personality traits
      
      Format: {"tone": "description", "personality": ["trait1", "trait2", "trait3"]}
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: analysisPrompt }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );

    const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    try {
      return JSON.parse(content);
    } catch {
      // Fallback if JSON parsing fails
      return {
        tone: 'Professional and engaging',
        personality: ['Knowledgeable', 'Helpful', 'Industry-focused']
      };
    }

  } catch (error) {
    console.error('Tone analysis error:', error);
    return {
      tone: 'Professional and engaging',
      personality: ['Knowledgeable', 'Helpful', 'Industry-focused']
    };
  }
}